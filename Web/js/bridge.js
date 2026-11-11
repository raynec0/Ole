'use strict';
/* 与原生外壳通信；在普通浏览器里自动退回到网页能力，方便调试。 */
const Native = (() => {
  const mh = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.ole;
  const isNative = !!mh;
  let seq = 0;
  const pending = {};
  const listeners = {};

  window.__oleReply = (m) => {
    const p = pending[m.id];
    if (!p) return;
    delete pending[m.id];
    if (m.err) p.rej(new Error(m.err)); else p.res(m.ok);
  };
  window.__oleEvent = (e) => {
    (listeners[e.name] || []).slice().forEach(f => { try { f(e.data || {}); } catch (x) { console.error(x); } });
  };

  function on(name, f) {
    (listeners[name] = listeners[name] || []).push(f);
    return () => { listeners[name] = (listeners[name] || []).filter(x => x !== f); };
  }
  function emit(name, data) { window.__oleEvent({ name, data }); }

  function call(cmd, args) {
    args = args || {};
    if (isNative) {
      return new Promise((res, rej) => {
        const id = ++seq;
        pending[id] = { res, rej };
        mh.postMessage({ id, cmd, args });
      });
    }
    return web(cmd, args);
  }

  /* ---------- 浏览器退路 ---------- */
  const mem = {};
  const ls = {
    get(k) { try { return localStorage.getItem('ole:' + k); } catch (_) { return k in mem ? mem[k] : null; } },
    set(k, v) { try { localStorage.setItem('ole:' + k, v); } catch (_) { mem[k] = v; } }
  };
  const aborts = {};
  async function web(cmd, a) {
    switch (cmd) {
      case 'http': {
        const r = await fetch(a.url, { method: a.method || 'GET', headers: a.headers || {}, body: a.body });
        return { status: r.status, body: await r.text() };
      }
      case 'httpStream': {
        const ac = new AbortController();
        aborts[a.sid] = ac;
        try {
          const r = await fetch(a.url, { method: a.method || 'GET', headers: a.headers || {}, body: a.body, signal: ac.signal });
          if (r.status >= 400) return { status: r.status, body: await r.text() };
          const reader = r.body.getReader();
          const dec = new TextDecoder();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            emit('stream', { sid: a.sid, chunk: dec.decode(value, { stream: true }) });
          }
          return { status: r.status, body: '' };
        } catch (e) {
          throw new Error(ac.signal.aborted ? 'cancelled' : e.message);
        } finally { delete aborts[a.sid]; }
      }
      case 'httpCancel': if (aborts[a.sid]) aborts[a.sid].abort(); return true;
      case 'speak': {
        const ss = window.speechSynthesis;
        if (!ss || !window.SpeechSynthesisUtterance) { setTimeout(() => emit('ttsEnd', { uid: a.uid }), 50); return true; }
        ss.cancel();
        const u = new SpeechSynthesisUtterance(a.text);
        u.lang = a.lang || 'es-ES';
        u.rate = a.rate || 1;
        u.onend = u.onerror = () => emit('ttsEnd', { uid: a.uid });
        ss.speak(u);
        return true;
      }
      case 'stopSpeak': if (window.speechSynthesis) window.speechSynthesis.cancel(); return true;
      case 'voices': return [];
      case 'sttStart': throw new Error('语音识别只在 iPhone 应用里可用');
      case 'sttStop': return true;
      case 'load': return ls.get(a.key);
      case 'save': ls.set(a.key, a.value); return true;
      case 'secretGet': return ls.get('secret-' + a.key) || '';
      case 'secretSet': ls.set('secret-' + a.key, a.value || ''); return true;
      case 'open': window.open(a.url, '_blank'); return true;
      case 'copy': if (navigator.clipboard) await navigator.clipboard.writeText(a.text); return true;
      case 'paste': return navigator.clipboard ? await navigator.clipboard.readText() : '';
      default: return true;
    }
  }

  return { isNative, call, on, emit };
})();

/* ---------- 朗读 ---------- */
const TTS = (() => {
  let n = 0;
  const waits = {};
  Native.on('ttsEnd', d => { const f = waits[d.uid]; if (f) { delete waits[d.uid]; f(); } });
  function clean(t) {
    return String(t).replace(/_{2,}/g, ' ').replace(/[*`#>|]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  /** 朗读一段西语，读完后 resolve。opts: {rate, voice(0/1), lang} */
  function speak(text, opts) {
    opts = opts || {};
    const s = Store.settings();
    const uid = 't' + (++n);
    const t = clean(text);
    if (!t) return Promise.resolve();
    return new Promise(res => {
      waits[uid] = res;
      setTimeout(() => { if (waits[uid]) { delete waits[uid]; res(); } }, 4000 + t.length * 220);
      Native.call('speak', {
        text: t, uid, lang: opts.lang || s.variant, rate: (opts.rate || 1) * s.rate,
        voice: opts.voice || 0, voiceId: s.voiceId || ''
      }).catch(() => { delete waits[uid]; res(); });
    });
  }
  function stop() {
    Object.keys(waits).forEach(k => { const f = waits[k]; delete waits[k]; f(); });
    return Native.call('stopSpeak').catch(() => {});
  }
  return { speak, stop };
})();

/* ---------- 语音识别 ---------- */
const STT = (() => {
  let cur = null;
  Native.on('stt', d => { if (cur && cur.onText) cur.onText(d.text || '', !!d.final); });
  Native.on('sttEnd', () => { const c = cur; cur = null; if (c && c.onEnd) c.onEnd(); });
  async function start(onText, onEnd) {
    if (cur) await stop();
    await TTS.stop();
    cur = { onText, onEnd };
    try { await Native.call('sttStart', { lang: Store.settings().variant }); }
    catch (e) { cur = null; throw e; }
  }
  function stop() { return Native.call('sttStop').catch(() => {}); }
  return { start, stop, get active() { return !!cur; } };
})();

/* ---------- 网络 ---------- */
const Net = {
  async get(url, headers) {
    const r = await Native.call('http', { url, method: 'GET', headers: headers || {}, timeout: 30 });
    if (r.status >= 400 || !r.status) throw new Error('HTTP ' + r.status);
    return r.body;
  }
};
