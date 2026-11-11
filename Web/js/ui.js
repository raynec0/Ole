'use strict';
/* 界面基础：建节点、Markdown、页面栈、浮层、通用小组件、课程查询、查词浮层。 */

function add(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false || k === '') continue;
    el.appendChild(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return el;
}
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) {
    for (const k in props) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (k === 'disabled' || k === 'checked' || k === 'selected') el[k] = !!v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  return add(el, kids);
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 轻量 Markdown ---------- */
function mdInline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*\n]+?)\*/g, '<span class="es">$1</span>')
    .replace(/`([^`\n]+?)`/g, '<code>$1</code>');
}
function md(src) {
  const lines = String(src || '').replace(/\r/g, '').split('\n');
  let out = '', list = null, table = null;
  const closeList = () => { if (list) { out += '</' + list + '>'; list = null; } };
  const closeTable = () => {
    if (!table) return;
    out += '<table>' + table.map((cells, i) => {
      const tagName = i === 0 ? 'th' : 'td';
      if (i === 0 && cells.every(c => !c)) return '';
      return '<tr>' + cells.map(c => `<${tagName}>${mdInline(c)}</${tagName}>`).join('') + '</tr>';
    }).join('') + '</table>';
    table = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (/^\|.*\|$/.test(line)) {
      closeList();
      const cells = line.slice(1, -1).split('|').map(c => c.trim());
      if (cells.every(c => /^:?-{2,}:?$/.test(c))) continue;
      (table = table || []).push(cells);
      continue;
    }
    closeTable();
    if (!line) { closeList(); continue; }
    let m;
    if ((m = /^#{1,4}\s+(.*)$/.exec(line))) { closeList(); out += '<h3>' + mdInline(m[1]) + '</h3>'; }
    else if ((m = /^[-*•]\s+(.*)$/.exec(line))) { if (list !== 'ul') { closeList(); out += '<ul>'; list = 'ul'; } out += '<li>' + mdInline(m[1]) + '</li>'; }
    else if ((m = /^\d+[.)]\s+(.*)$/.exec(line))) { if (list !== 'ol') { closeList(); out += '<ol>'; list = 'ol'; } out += '<li>' + mdInline(m[1]) + '</li>'; }
    else if ((m = /^>\s?(.*)$/.exec(line))) { closeList(); out += '<blockquote>' + mdInline(m[1]) + '</blockquote>'; }
    else { closeList(); out += '<p>' + mdInline(line) + '</p>'; }
  }
  closeList(); closeTable();
  return out;
}
const mdEl = (src, cls) => h('div', { class: 'md sel ' + (cls || ''), html: md(src) });

/* ---------- 页面、浮层、提示 ---------- */
const UI = {
  stack: [],
  tabs: {},
  cur: 'learn',
  defineTabs(defs) {
    const nav = document.getElementById('tabs');
    defs.forEach(d => {
      UI.tabs[d.id] = d;
      d.btn = h('button', { onclick: () => UI.showTab(d.id) }, h('b', null, d.icon), d.name);
      nav.appendChild(d.btn);
    });
  },
  showTab(id) {
    UI.cur = id;
    Object.values(UI.tabs).forEach(d => d.btn.classList.toggle('on', d.id === id));
    const root = document.getElementById('tab');
    root.scrollTop = 0;
    UI.renderTab();
  },
  renderTab() {
    const root = document.getElementById('tab');
    const top = root.scrollTop;
    root.textContent = '';
    try { UI.tabs[UI.cur].render(root); } catch (e) { console.error(e); root.appendChild(h('div', { class: 'empty' }, '出错了：' + e.message)); }
    root.scrollTop = top;
  },
  /** 推入一个整屏页面。build(ctx) 可以是 async。ctx: {page, body, right, close(), onclose} */
  push(title, build) {
    const body = h('div', { class: 'pbody' });
    const right = h('div', { class: 'pright' });
    const titleEl = h('div', { class: 'ptitle' }, title);
    const page = h('div', { class: 'page' },
      h('div', { class: 'phead' }, h('button', { class: 'back', onclick: () => UI.pop(), 'aria-label': '返回' }, '‹'), titleEl, right), body);
    const ctx = { page, body, right, onclose: null, close: () => UI.pop(ctx), setTitle: t => { titleEl.textContent = t; }, alive: true };
    document.getElementById('pages').appendChild(page);
    UI.stack.push(ctx);
    Promise.resolve().then(() => build(ctx)).catch(e => { console.error(e); body.appendChild(h('div', { class: 'empty' }, '出错了：' + e.message)); });
    requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add('in')));
    return ctx;
  },
  pop(target) {
    const ctx = target || UI.stack[UI.stack.length - 1];
    if (!ctx || !ctx.alive) return;
    ctx.alive = false;
    UI.stack = UI.stack.filter(c => c !== ctx);
    try { if (ctx.onclose) ctx.onclose(); } catch (e) { console.error(e); }
    TTS.stop();
    if (STT.active) STT.stop();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    ctx.page.classList.remove('in');
    setTimeout(() => ctx.page.remove(), 240);
    if (!UI.stack.length) UI.renderTab();
    else if (UI.stack[UI.stack.length - 1].onshow) UI.stack[UI.stack.length - 1].onshow();
  },
  /** 底部浮层。build(el, close) */
  sheet(build) {
    const ov = document.getElementById('overlay');
    const el = h('div', { class: 'sheet' }, h('div', { class: 'grab' }));
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      el.classList.remove('in'); shade.classList.remove('in');
      setTimeout(() => { el.remove(); shade.remove(); }, 230);
    };
    const shade = h('div', { class: 'shade', onclick: close });
    add(ov, [shade, el]);
    build(el, close);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('in'); shade.classList.add('in'); }));
    return { el, close };
  },
  confirm(text, okLabel) {
    return new Promise(res => {
      let answered = false;
      UI.sheet((el, close) => {
        add(el, [
          h('p', { style: 'margin:6px 0 16px;font-weight:600' }, text),
          h('button', { class: 'btn', onclick: () => { answered = true; close(); res(true); } }, okLabel || '确定'),
          h('div', { class: 'gap' }),
          h('button', { class: 'btn ghost', onclick: () => { answered = true; close(); res(false); } }, '取消')
        ]);
        const sh = el.previousSibling;
        if (sh) sh.addEventListener('click', () => { if (!answered) res(false); });
      });
    });
  },
  /** 让用户从列表里选一个 */
  choose(title, options) {
    return new Promise(res => {
      UI.sheet((el, close) => {
        add(el, [h('p', { class: 'sec', style: 'margin-top:0' }, title),
          options.map(o => h('button', { class: 'opt', onclick: () => { close(); res(o.value); } }, o.label))]);
      });
    });
  },
  toast(msg, ms) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('in');
    clearTimeout(UI._tt);
    UI._tt = setTimeout(() => t.classList.remove('in'), ms || 2200);
  }
};

/* ---------- 小组件 ---------- */
function spkBtn(text, opts) {
  opts = opts || {};
  const b = h('button', { class: 'spk' + (opts.big ? ' big' : ''), 'aria-label': '朗读' }, '🔊');
  b.addEventListener('click', async e => {
    e.stopPropagation();
    b.classList.add('on');
    await TTS.speak(typeof text === 'function' ? text() : text, opts);
    b.classList.remove('on');
  });
  return b;
}
/** 西语文本，每个词都能点开查词 */
function esTap(text, cls) {
  const el = h('span', { class: 'sel ' + (cls || '') });
  String(text).split(/(\s+)/).forEach(tok => {
    if (!tok.trim()) { el.appendChild(document.createTextNode(tok)); return; }
    const word = tok.replace(/^[¿¡"«“(]+|[.,;:!?"»”)…]+$/g, '');
    if (!word || /^\d+$/.test(word)) { el.appendChild(document.createTextNode(tok)); return; }
    el.appendChild(h('span', { class: 'w tap', onclick: e => { e.stopPropagation(); Lookup.open(word, text); } }, tok));
  });
  return el;
}
function addBtn(es, zh, note, src) {
  const b = h('button', { class: 'add' + (Store.hasCard(es) ? ' on' : ''), 'aria-label': '加入复习' }, Store.hasCard(es) ? '✓' : '+');
  b.addEventListener('click', e => {
    e.stopPropagation();
    if (Store.hasCard(es)) { Store.removeCard(es); b.classList.remove('on'); b.textContent = '+'; UI.toast('已移出复习'); }
    else { Store.addCard(es, zh, note, src); b.classList.add('on'); b.textContent = '✓'; UI.toast('已加入复习'); }
  });
  return b;
}
function chipRow(options, value, onPick, scroll) {
  const row = h('div', { class: 'chips' + (scroll ? ' scroll' : '') });
  const draw = v => {
    row.textContent = '';
    options.forEach(o => {
      const val = Array.isArray(o) ? o[0] : o, label = Array.isArray(o) ? o[1] : o;
      row.appendChild(h('button', { class: 'chip' + (val === v ? ' on' : ''), onclick: () => { draw(val); onPick(val); } }, label));
    });
  };
  draw(value);
  return row;
}
function accentBar(input) {
  return h('div', { class: 'accbar' }, ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'].map(c =>
    h('button', { type: 'button', onclick: e => {
      e.preventDefault();
      const a = input.selectionStart == null ? input.value.length : input.selectionStart;
      const b = input.selectionEnd == null ? a : input.selectionEnd;
      input.value = input.value.slice(0, a) + c + input.value.slice(b);
      input.focus();
      try { input.setSelectionRange(a + 1, a + 1); } catch (_) { /* ignore */ }
      input.dispatchEvent(new Event('input'));
    } }, c)));
}
const loadingEl = text => h('div', { class: 'loading' }, h('span', { class: 'spin' }), h('div', { style: 'margin-top:10px' }, text || '加载中…'));
function needAI(el, what) {
  add(el, [h('div', { class: 'card center' },
    h('p', { style: 'font-weight:600;margin-bottom:6px' }, what || '这个功能需要联网的 AI'),
    h('p', { class: 'small mut', style: 'margin-bottom:12px' }, '填一次 API 密钥就能用：AI 课程、对话陪练、查词、批改都靠它。'),
    h('button', { class: 'btn sm', onclick: () => Views.aiSettings() }, '去设置 AI'))]);
}
/** 把流式的 Markdown 输出到一个容器里 */
async function streamInto(el, req) {
  el.textContent = '';
  const box = h('div', { class: 'md sel' });
  const wait = loadingEl('AI 正在写…');
  add(el, [wait, box]);
  let last = 0;
  try {
    const full = await AI.chat(Object.assign({}, req, { onDelta: t => {
      if (wait.parentNode) wait.remove();
      const now = Date.now();
      if (now - last > 120) { last = now; box.innerHTML = md(t); }
    } }));
    if (wait.parentNode) wait.remove();
    box.innerHTML = md(full);
    return full;
  } catch (e) {
    if (wait.parentNode) wait.remove();
    if (!e.cancelled) add(el, [h('div', { class: 'card', style: 'color:var(--bad)' }, e.message)]);
    return null;
  }
}

/* ---------- 课程查询 ---------- */
const Course = {
  _list: null,
  list() {
    if (!Course._list) {
      Course._list = COURSE.concat(SYLLABUS.map(s => ({ id: s[0], lv: s[1], unit: s[2], title: s[3], spec: s[4], ai: true })));
    }
    return Course._list;
  },
  byLevel(lv) { return Course.list().filter(l => l.lv === lv); },
  /** 取一课；AI 课会并上已生成的内容 */
  get(id) {
    const base = Course.list().find(l => l.id === id);
    if (!base) return null;
    if (!base.ai) return base;
    const g = Store.gen[id];
    return Object.assign({}, base, g || {}, { ready: !!g });
  },
  ready(l) { return !l.ai || !!Store.gen[l.id]; },
  pool() {
    let items = [];
    COURSE.forEach(l => { items = items.concat(l.items); });
    Object.values(Store.gen).forEach(g => { if (g && Array.isArray(g.items)) items = items.concat(g.items); });
    return items;
  },
  /** 在已有课文里找这个词 */
  find(word) {
    const k = Ex.deacc(Ex.norm(word));
    if (!k) return [];
    const out = [];
    for (const it of Course.pool()) {
      const ws = Ex.words(it[0]).map(Ex.deacc);
      if (ws.includes(k)) out.push(it);
      if (out.length >= 4) break;
    }
    return out.sort((a, b) => a[0].length - b[0].length);
  },
  next(lv) {
    const done = Store.state.lessons;
    return Course.byLevel(lv).find(l => !(done[l.id] && done[l.id].done)) || null;
  }
};

const isKnownVerb = w => { const c = Conj.conjugate(w); return !!(c && c.known); };

/* ---------- 查词浮层 ---------- */
const Lookup = {
  open(word, context) {
    word = String(word).trim();
    UI.sheet(async (el, close) => {
      const head = h('div', { class: 'row', style: 'margin-bottom:8px' },
        h('div', { class: 'grow big-es sel' }, word), spkBtn(word), addBtn(word, '', '', '查词'));
      const local = h('div');
      const body = h('div');
      const links = h('div', { class: 'chips', style: 'margin-top:14px' },
        isKnownVerb(word) ? h('button', { class: 'chip', onclick: () => { close(); Views.conjugator(word); } }, '变位表') : null,
        h('button', { class: 'chip', onclick: () => Native.call('open', { url: 'https://dle.rae.es/' + encodeURIComponent(word) }) }, 'RAE 词典'),
        h('button', { class: 'chip', onclick: () => Native.call('open', { url: 'https://www.wordreference.com/es/en/translation.asp?spen=' + encodeURIComponent(word) }) }, 'WordReference'));
      add(el, [head, local, body, links]);

      const hits = Course.find(word);
      if (hits.length) add(local, [h('div', { class: 'card' }, h('div', { class: 'small mut' }, '学过的课文里'),
        hits.map(it => h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 'e' }, it[0]), h('div', { class: 'z' }, it[1])))))]);

      if (!AI.ready()) { if (!hits.length) needAI(body, '联网查词需要 AI'); return; }
      const key = 'd:' + Store.settings().variant + ':' + word.toLowerCase();
      let d = Store.cacheGet(key);
      if (!d) {
        const wait = loadingEl('查询中…');
        body.appendChild(wait);
        try { d = await AI.json(AI.P.dict(word, context && context !== word ? context : '')); Store.cacheSet(key, d); }
        catch (e) { wait.remove(); body.appendChild(h('div', { class: 'card', style: 'color:var(--bad)' }, e.message)); return; }
        wait.remove();
      }
      const zh = (d.zh || []).join('；');
      const oldAdd = head.lastChild;
      head.replaceChild(addBtn(d.lemma || word, zh, d.pos || '', '查词'), oldAdd);
      add(body, [
        h('div', { class: 'card' },
          h('div', { class: 'row' }, h('span', { class: 'big-es sel', style: 'font-size:19px' }, d.lemma || word),
            d.level ? h('span', { class: 'tag' }, d.level) : null, h('span', { class: 'small mut' }, [d.pos, d.ipa].filter(Boolean).join(' · '))),
          h('div', { style: 'font-weight:600;margin-top:4px' }, zh),
          d.forms ? h('div', { class: 'small mut', style: 'margin-top:4px' }, d.forms) : null,
          d.usage ? h('div', { class: 'small', style: 'margin-top:8px' }, d.usage) : null),
        (d.examples || []).length ? h('div', { class: 'card' }, (d.examples || []).map(x =>
          h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 'e sel' }, x[0]), h('div', { class: 'z' }, x[1])), spkBtn(x[0]), addBtn(x[0], x[1], '', '查词')))) : null,
        (d.colloc || []).length ? h('div', { class: 'chips' }, d.colloc.map(c => h('span', { class: 'chip es' }, c))) : null
      ]);
      if (d.isVerb && d.lemma && Conj.conjugate(d.lemma) && !isKnownVerb(word)) {
        links.insertBefore(h('button', { class: 'chip', onclick: () => { close(); Views.conjugator(d.lemma); } }, d.lemma + ' 的变位'), links.firstChild);
      }
    });
  }
};

const Views = {};
