'use strict';
/* 对话页：情景陪练（每句自动批改）、自由聊天、中文答疑。 */

Views.chatTab = root => {
  add(root, [h('div', { class: 'title' }, 'Conversación'), h('div', { class: 'sub', style: 'margin-bottom:16px' }, '开口说。说错了当场改，卡住了给提示。')]);
  if (!AI.ready()) needAI(root, '对话陪练需要联网的 AI');
  const lv = Store.settings().level;
  add(root, [
    h('button', { class: 'lrow', onclick: () => Views.chat({ id: 'libre', title: '自由聊天', role: '' }) },
      h('div', { class: 'lnum' }, '💬'), h('div', { class: 'grow' }, h('div', { class: 't' }, '自由聊天'), h('div', { class: 'd' }, '想聊什么聊什么，难度跟着你的水平走'))),
    h('button', { class: 'lrow', onclick: () => Views.chat({ id: 'tutor', title: '问老师', tutor: true }) },
      h('div', { class: 'lnum' }, '🎓'), h('div', { class: 'grow' }, h('div', { class: 't' }, '问老师'), h('div', { class: 'd' }, '语法、用词、文化，用中文问，用中文答')))
  ]);
  let cur = null;
  SCENARIOS.slice().sort((a, b) => (a[1] === lv ? -1 : 0) - (b[1] === lv ? -1 : 0)).forEach(s => {
    if (s[1] !== cur) { cur = s[1]; root.appendChild(h('div', { class: 'unit' }, cur + ' 情景' + (cur === lv ? ' · 你的级别' : ''))); }
    const has = (Store.state.chats[s[0]] || []).length > 1;
    root.appendChild(h('button', { class: 'lrow', onclick: () => Views.chat({ id: s[0], title: s[2], role: s[4], opener: s[5] }) },
      h('div', { class: 'grow' }, h('div', { class: 't' }, s[2]), h('div', { class: 'd' }, s[3])), has ? h('span', { class: 'tag' }, '继续') : null));
  });
};

/** sc: {id, title, role, opener, tutor, seed} */
Views.chat = sc => {
  UI.push(sc.title, ctx => {
    ctx.body.classList.add('flexcol');
    const chats = Store.state.chats;
    let msgs = chats[sc.id] || (chats[sc.id] = []);
    if (!msgs.length && sc.opener) msgs.push({ role: 'assistant', raw: sc.opener });
    const list = h('div', { class: 'chatlist' });
    const input = h('textarea', { rows: 1, placeholder: sc.tutor ? '用中文问任何西语问题…' : 'Escribe o habla en español…',
      autocapitalize: 'sentences', autocorrect: 'off', spellcheck: 'false' });
    if (sc.seed) input.value = sc.seed;
    const micBtn = h('button', { class: 'cbtn', 'aria-label': '语音输入' }, '🎤');
    const sendBtn = h('button', { class: 'cbtn send', 'aria-label': '发送' }, '↑');
    add(ctx.body, [list, h('div', { class: 'chatbar' }, sc.tutor || !Native.isNative ? null : micBtn, input, sendBtn)]);

    let busy = false, ctl = {}, listening = false;
    const persist = () => { if (msgs.length > 80) msgs.splice(0, msgs.length - 80); Store.save(); };
    const bottom = () => { list.scrollTop = list.scrollHeight; };
    const grow = () => { input.style.height = 'auto'; input.style.height = Math.min(120, input.scrollHeight) + 'px'; };
    input.addEventListener('input', grow);

    /* 把模型的原始回复拆成「批改」和「正文」 */
    function parse(raw) {
      const t = String(raw || '').trimStart();
      if (sc.tutor || !t.startsWith('<fix>')) return { fix: null, text: t.replace(/<\/?fix>/g, ''), pending: false };
      const end = t.indexOf('</fix>');
      if (end < 0) return { fix: null, text: '', pending: true };
      const inner = t.slice(5, end).trim();
      const text = t.slice(end + 6).trim();
      if (/^ok[.!。]?$/i.test(inner)) return { fix: { ok: true }, text };
      const cut = inner.search(/[｜|]/);
      return { fix: { ok: false, es: (cut < 0 ? inner : inner.slice(0, cut)).trim(), why: cut < 0 ? '' : inner.slice(cut + 1).trim() }, text };
    }

    function fixEl(fix) {
      if (!fix) return null;
      if (fix.ok) return h('div', { class: 'fix good' }, '✓ 这句很地道');
      return h('div', { class: 'fix' }, h('b', { class: 'sel' }, fix.es), fix.why,
        h('div', { class: 'acts', style: 'margin:4px 0 0' }, h('button', { onclick: () => TTS.speak(fix.es) }, '🔊 听'),
          h('button', { onclick: e => { Store.addCard(fix.es, fix.why, '对话里的改正', '对话'); e.target.textContent = '✓ 已加入复习'; } }, '+ 复习')));
    }

    function render() {
      list.textContent = '';
      if (!msgs.length) list.appendChild(h('div', { class: 'empty' }, sc.tutor ? '有什么想不通的，直接问。比如：ser 和 estar 到底怎么选？' : '用西语说点什么开始吧。不会说的可以先用中文，我会告诉你怎么说。'));
      msgs.forEach((m, i) => {
        if (m.role === 'user') {
          const nextMsg = msgs[i + 1];
          const fix = nextMsg && nextMsg.role === 'assistant' ? parse(nextMsg.raw).fix : null;
          list.appendChild(h('div', { class: 'msg user' }, h('div', { class: 'bubble sel' }, m.raw), fixEl(fix)));
        } else list.appendChild(assistantEl(m));
      });
      bottom();
    }

    function assistantEl(m) {
      const p = parse(m.raw);
      const bubble = h('div', { class: 'bubble' });
      const wrap = h('div', { class: 'msg assistant' + (sc.tutor ? ' tutor' : '') }, bubble);
      if (sc.tutor) bubble.appendChild(mdEl(p.text));
      else {
        bubble.appendChild(esTap(p.text || '…'));
        if (m.tr) bubble.appendChild(h('div', { class: 'tr' }, m.tr));
        if (p.text) wrap.appendChild(h('div', { class: 'acts' },
          h('button', { onclick: () => TTS.speak(p.text) }, '🔊 听'),
          h('button', { onclick: () => TTS.speak(p.text, { rate: 0.7 }) }, '🐢 慢'),
          m.tr ? null : h('button', { onclick: async e => {
            e.target.textContent = '翻译中…';
            try { m.tr = (await AI.chat(AI.P.translate(p.text))).trim(); persist(); render(); } catch (err) { UI.toast(err.message); e.target.textContent = '译'; }
          } }, '译'),
          h('button', { onclick: e => { Store.addCard(p.text, m.tr || '', '', '对话'); e.target.textContent = '✓'; } }, '+ 复习')));
      }
      return wrap;
    }

    async function send() {
      const text = input.value.trim();
      if (!text || busy) return;
      if (!AI.ready()) { Views.aiSettings(); return; }
      if (listening) STT.stop();
      TTS.stop();
      busy = true; sendBtn.disabled = true;
      input.value = ''; grow();
      msgs.push({ role: 'user', raw: text });
      const reply = { role: 'assistant', raw: '' };
      msgs.push(reply);
      render();
      const history = msgs.slice(0, -1).slice(-24).map(m => ({ role: m.role, content: m.raw }));
      if (history[0].role !== 'user') history.unshift({ role: 'user', content: '（对话开始）' });
      ctl = {};
      let last = 0;
      try {
        const full = await AI.chat({ system: AI.P.chatSystem(sc), messages: history, ctl, max: sc.tutor ? 3000 : 1200, onDelta: t => {
          reply.raw = t;
          const now = Date.now();
          if (now - last > 150) { last = now; render(); }
        } });
        reply.raw = full;
        persist(); render();
        Store.addXP(2);
        const p = parse(full);
        if (!sc.tutor && p.text && Store.settings().autoSpeak && ctx.alive) TTS.speak(p.text);
      } catch (e) {
        if (reply.raw) { persist(); render(); }
        else {
          msgs.splice(msgs.indexOf(reply), 1);
          render();
          if (!e.cancelled) list.appendChild(h('div', { class: 'card', style: 'color:var(--bad)' }, e.message));
          bottom();
        }
      }
      busy = false; sendBtn.disabled = false;
    }
    sendBtn.addEventListener('click', send);

    micBtn.addEventListener('click', async () => {
      if (listening) { STT.stop(); return; }
      const before = input.value ? input.value.trim() + ' ' : '';
      try {
        await STT.start(t => { input.value = before + t; grow(); }, () => { listening = false; micBtn.classList.remove('on'); });
        listening = true; micBtn.classList.add('on');
      } catch (e) { UI.toast(e.message, 3500); }
    });

    if (!sc.tutor) ctx.right.appendChild(h('button', { onclick: async () => {
      if (!AI.ready()) return Views.aiSettings();
      if (busy) return;
      UI.toast('正在想提示…');
      try {
        const hist = msgs.slice(-8).map(m => (m.role === 'user' ? 'Yo: ' + m.raw : 'Interlocutor: ' + parse(m.raw).text)).join('\n') || '（对话还没开始，情景：' + sc.title + '）';
        const opts = await AI.json(AI.P.hints(hist));
        UI.sheet((el, close) => add(el, [h('p', { class: 'sec', style: 'margin-top:0' }, '你可以这样说（点一下填进输入框）'),
          (Array.isArray(opts) ? opts : []).filter(o => Array.isArray(o) && o[0]).map(o => h('button', { class: 'opt', onclick: () => { input.value = o[0]; grow(); close(); } },
            h('div', { class: 'es', style: 'font-size:17px' }, o[0]), h('div', { class: 'small mut' }, o[1] || '')))]));
      } catch (e) { UI.toast(e.message, 3500); }
    } }, '提示'));
    ctx.right.appendChild(h('button', { onclick: async () => {
      if (await UI.confirm('清空这段对话，重新开始？', '清空')) {
        if (ctl.cancel) ctl.cancel();
        msgs.length = 0;
        if (sc.opener) msgs.push({ role: 'assistant', raw: sc.opener });
        persist(); render();
      }
    } }, '重来'));

    ctx.onclose = () => { if (ctl.cancel) ctl.cancel(); if (listening) STT.stop(); persist(); };
    render();
    if (sc.seed) setTimeout(() => { input.focus(); grow(); }, 300);
  });
};
