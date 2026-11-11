'use strict';
/* 工具页：变位、变位训练、查词翻译、阅读、听力、写作、发音、语法手册、分级测试、母语资源。 */

Views.tools = root => {
  const tools = [
    ['Verbos', '动词变位', '任何动词的全部时态，离线可查', () => Views.conjugator()],
    ['Práctica', '变位训练', '随机抽动词、时态、人称，练到脱口而出', () => Views.drill()],
    ['Diccionario', '查词 · 翻译 · 精读', '查词、中西互译、逐句拆解', () => Views.dict()],
    ['Lectura', '阅读', '西语新闻和 AI 分级读物，点词即查', () => Views.reading()],
    ['Escucha', '听力', 'AI 生成的真实对话，双声音朗读', () => Views.listening()],
    ['Escritura', '写作批改', '考官式逐条修改，再给母语者写法', () => Views.writing()],
    ['Pronunciación', '发音', '难点专项和绕口令，跟读打分', () => Views.pron()],
    ['Gramática', '语法手册', 'A1 到 C2 的语法速查，离线可看', () => Views.grammar()],
    ['Nivel', '分级测试', '24 题，找到适合你的级别', () => Views.placement()],
    ['Recursos', '母语资源', '词典、电台、报纸、考试', () => Views.resources()]
  ];
  add(root, [h('div', { class: 'title' }, 'Herramientas'), h('div', { class: 'sub', style: 'margin-bottom:16px' }, '课程之外，把西语用起来'),
    h('div', { class: 'tools' }, tools.map(t => h('button', { class: 'tool', onclick: t[3] }, h('b', null, t[0]), h('span', null, t[1]), h('small', null, t[2]))))]);
};

/* ---------- 动词变位 ---------- */
Views.conjugator = initial => {
  UI.push('动词变位', ctx => {
    const input = h('input', { class: 'inp', placeholder: '输入动词原形，如 tener、levantarse', value: initial || '',
      autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', spellcheck: 'false' });
    const out = h('div', { style: 'margin-top:14px' });
    const rowEl = (label, form, alt) => {
      const tr = h('tr', { class: 'tap' }, h('td', null, label), h('td', { class: 'sel' }, form, alt ? h('small', null, ' / ' + alt) : null));
      tr.addEventListener('click', () => TTS.speak(form.replace(/^no /, 'no ')));
      return tr;
    };
    const show = () => {
      const v = input.value.trim().toLowerCase();
      out.textContent = '';
      if (!v) {
        add(out, [h('div', { class: 'sec', style: 'margin-top:0' }, '常用动词'),
          h('div', { class: 'chips' }, Conj.VERBS.slice(0, 40).map(x => h('button', { class: 'chip es', onclick: () => { input.value = x[0]; show(); } }, x[0])))]);
        return;
      }
      const c = Conj.conjugate(v);
      if (!c) { out.appendChild(h('div', { class: 'empty' }, '请输入以 -ar、-er、-ir 结尾的动词原形')); return; }
      const zh = Conj.meaning(c.inf) || Conj.meaning(c.base);
      add(out, [h('div', { class: 'row', style: 'margin-bottom:10px' },
        h('div', { class: 'grow' }, h('div', { class: 'big-es sel' }, c.inf), zh ? h('div', { class: 'mut' }, zh) : null), spkBtn(c.inf),
        AI.ready() ? h('button', { class: 'btn sm ghost', onclick: () => Lookup.open(c.inf) }, '释义') : null)]);
      if (!c.known) out.appendChild(h('div', { class: 'card small', style: 'border-color:var(--gold)' },
        '这个动词不在已核对的名单里，下面是按规则推出来的。如果它有词干变化或其他不规则，结果可能不准，可以点「RAE」核对。',
        h('div', { style: 'margin-top:8px' }, h('button', { class: 'btn sm ghost', onclick: () => Native.call('open', { url: 'https://dle.rae.es/' + encodeURIComponent(c.base) }) }, 'RAE'))));
      out.appendChild(h('div', { class: 'card' }, h('table', { class: 'ctable' },
        rowEl('副动词 gerundio', c.ger), rowEl('过去分词 participio', c.part))));
      let mood = null;
      c.tenses.forEach(t => {
        if (t.mood !== mood) { mood = t.mood; out.appendChild(h('div', { class: 'unit' }, mood)); }
        out.appendChild(h('div', { class: 'card' },
          h('div', { class: 'row', style: 'margin-bottom:4px' }, h('b', { class: 'grow' }, t.name), h('span', { class: 'small mut' }, t.zh)),
          h('table', { class: 'ctable' }, t.forms.map((f, i) => rowEl(Conj.PERSONS[i], f, t.alt ? t.alt[i] : null)))));
      });
      add(out, [h('div', { class: 'unit' }, 'Imperativo'),
        h('div', { class: 'card' }, h('div', { class: 'row', style: 'margin-bottom:4px' }, h('b', { class: 'grow' }, 'Afirmativo'), h('span', { class: 'small mut' }, '肯定命令')),
          h('table', { class: 'ctable' }, c.imp.aff.map((f, i) => rowEl(c.imp.persons[i], f))),
          c.refl ? h('div', { class: 'small mut' }, '反身动词的肯定命令要把代词接在后面，如 levántate、siéntese、vámonos。') : null),
        h('div', { class: 'card' }, h('div', { class: 'row', style: 'margin-bottom:4px' }, h('b', { class: 'grow' }, 'Negativo'), h('span', { class: 'small mut' }, '否定命令')),
          h('table', { class: 'ctable' }, c.imp.neg.map((f, i) => rowEl(c.imp.persons[i], f))))]);
    };
    input.addEventListener('input', show);
    add(ctx.body, [input, out]);
    show();
  });
};

/* ---------- 变位训练 ---------- */
Views.drill = () => {
  UI.push('变位训练', ctx => {
    const TENSE_OPTS = [['pres', '现在时'], ['perf', '现在完成时'], ['pret', '简单过去时'], ['impf', '未完成时'], ['fut', '将来时'], ['cond', '条件式'], ['subj', '虚拟现在'], ['subjImpf', '虚拟过去']];
    const chosen = new Set(Store.cacheGet('drill:tenses') || ['pres']);
    const chips = h('div', { class: 'chips' });
    const drawChips = () => {
      chips.textContent = '';
      TENSE_OPTS.forEach(([id, zh]) => chips.appendChild(h('button', { class: 'chip' + (chosen.has(id) ? ' on' : ''), onclick: () => {
        if (chosen.has(id)) { if (chosen.size > 1) chosen.delete(id); } else chosen.add(id);
        Store.cacheSet('drill:tenses', [...chosen]); drawChips();
      } }, zh)));
    };
    drawChips();
    const area = h('div', { style: 'margin-top:18px' });
    const score = h('div', { class: 'small mut center', style: 'margin-top:14px' });
    let right = 0, total = 0, streak = 0;
    add(ctx.body, [h('div', { class: 'small mut', style: 'margin-bottom:8px' }, '选要练的时态（可多选）'), chips, area, score]);

    function next() {
      const vos = Store.settings().variant === 'es-ES';
      const verb = Ex.pick(Conj.VERBS, 1)[0];
      const c = Conj.conjugate(verb[0]);
      const tid = Ex.pick([...chosen], 1)[0];
      const t = c.tenses.find(x => x.id === tid);
      const persons = [0, 1, 2, 3, 4, 5].filter(i => vos || i !== 4);
      const pi = Ex.pick(persons, 1)[0];
      const answers = [t.forms[pi]].concat(t.alt ? [t.alt[pi]] : []);
      const input = h('input', { class: 'inp', style: 'font:500 20px var(--es);text-align:center', placeholder: '…',
        autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', spellcheck: 'false' });
      const fb = h('div', { class: 'center', style: 'min-height:54px;margin-top:10px' });
      const btn = h('button', { class: 'btn', onclick: () => (checked ? next() : check()) }, '检查');
      let checked = false;
      function check() {
        const a = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
        if (!a) return;
        checked = true; total++;
        const ok = answers.includes(a);
        const nearly = !ok && answers.some(x => Ex.deacc(x) === Ex.deacc(a));
        if (ok) { right++; streak++; Store.addXP(1); } else streak = 0;
        fb.textContent = '';
        add(fb, [h('div', { style: `font-weight:700;color:var(--${ok ? 'ok' : 'bad'})` }, ok ? '¡Correcto!' : nearly ? '差一个重音符号' : '不对'),
          h('div', { class: 'big-es sel' }, answers.join(' / '))]);
        input.disabled = true; btn.textContent = '下一个';
        Native.call('haptic', { kind: ok ? 'ok' : 'bad' }).catch(() => {});
        if (Store.settings().autoSpeak) TTS.speak(answers[0]);
        score.textContent = `答对 ${right} / ${total} · 连对 ${streak}`;
      }
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); checked ? next() : check(); } });
      area.textContent = '';
      add(area, [h('div', { class: 'card center' },
        h('div', { class: 'big-es', style: 'font-size:30px' }, verb[0]), h('div', { class: 'mut' }, verb[1]),
        h('div', { style: 'margin-top:12px' }, h('span', { class: 'tag acc' }, t.name), ' ', h('span', { class: 'tag' }, t.zh)),
        h('div', { style: 'font-weight:700;font-size:18px;margin-top:10px' }, Conj.PERSONS[pi])),
        input, accentBar(input), fb, btn,
        h('div', { class: 'center', style: 'margin-top:10px' }, h('button', { class: 'chip', onclick: () => Views.conjugator(verb[0]) }, '看完整变位表'))]);
      if (total > 0) setTimeout(() => input.focus(), 50);
    }
    next();
  });
};

/* ---------- 查词 · 翻译 · 精读 ---------- */
Views.dict = () => {
  UI.push('查词 · 翻译 · 精读', ctx => {
    let mode = 'word';
    const input = h('textarea', { class: 'inp', placeholder: '输入西语单词、句子，或者中文', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
    const out = h('div', { style: 'margin-top:14px' });
    const ctl = {};
    const go = () => {
      const t = input.value.trim();
      if (!t) return;
      input.blur();
      if (mode === 'word') return Lookup.open(t);
      if (!AI.ready()) { out.textContent = ''; return needAI(out); }
      if (ctl.cancel) ctl.cancel();
      const req = AI.P.analyze(t, mode);
      req.ctl = ctl;
      streamInto(out, req);
    };
    ctx.onclose = () => { if (ctl.cancel) ctl.cancel(); };
    add(ctx.body, [
      chipRow([['word', '查词'], ['toEs', '译成西语'], ['toZh', '译成中文'], ['parse', '逐句精读']], mode, v => { mode = v; }, true),
      h('div', { class: 'gap' }), input, accentBar(input),
      h('button', { class: 'btn', onclick: go }, '开始'), out]);
  });
};

/* ---------- 小测验组件 ---------- */
function quizEl(questions) {
  const qs = (questions || []).filter(q => q && q.q && Array.isArray(q.opts));
  if (!qs.length) return null;
  return h('div', null, h('div', { class: 'sec' }, '理解题'), qs.map((q, n) => {
    const why = h('div', { class: 'small mut', style: 'margin-top:4px' });
    let answered = false;
    const btns = q.opts.map((o, i) => {
      const b = h('button', { class: 'opt' }, o);
      b.addEventListener('click', () => {
        if (answered) return; answered = true;
        b.classList.add(i === q.a ? 'right' : 'wrong');
        if (i !== q.a && btns[q.a]) btns[q.a].classList.add('right');
        why.textContent = q.why || '';
        if (i === q.a) Store.addXP(2);
      });
      return b;
    });
    return h('div', { class: 'card' }, h('div', { class: 'es', style: 'font-weight:600;margin-bottom:10px;color:var(--ink)' }, (n + 1) + '. ' + q.q), btns, why);
  }));
}

/* ---------- 阅读 ---------- */
function htmlToText(s) {
  if (!/[<&]/.test(s)) return s.trim();
  const d = new DOMParser().parseFromString('<body>' + s + '</body>', 'text/html');
  return (d.body.textContent || '').replace(/\s+/g, ' ').trim();
}
async function loadFeed(url) {
  const xml = await Net.get(url);
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  let nodes = [...doc.getElementsByTagName('item')];
  if (!nodes.length) nodes = [...doc.getElementsByTagName('entry')];
  const out = nodes.slice(0, 30).map(it => {
    const g = n => { const e = it.getElementsByTagName(n)[0]; return e ? (e.textContent || '').trim() : ''; };
    let link = g('link');
    if (!link) { const l = it.getElementsByTagName('link')[0]; if (l) link = l.getAttribute('href') || ''; }
    return { title: htmlToText(g('title')), link, desc: htmlToText(g('description') || g('summary')), body: htmlToText(g('content:encoded') || g('content')), date: g('pubDate') || g('updated') || g('published') };
  }).filter(x => x.title);
  if (!out.length) throw new Error('这个源里没有读到文章');
  return out;
}
async function loadArticle(url) {
  const html = await Net.get(url, { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,nav,header,footer,aside,figure,form,noscript,button').forEach(e => e.remove());
  let ps = [...doc.querySelectorAll('article p')];
  if (ps.length < 3) ps = [...doc.querySelectorAll('main p')];
  if (ps.length < 3) ps = [...doc.querySelectorAll('p')];
  return ps.map(p => (p.textContent || '').replace(/\s+/g, ' ').trim())
    .filter(t => t.length > 60 && !/cookies|suscr[ií]b|newsletter|iniciar sesión|todos los derechos/i.test(t));
}

Views.reading = () => {
  UI.push('阅读', ctx => {
    let tab = 'news';
    const box = h('div', { style: 'margin-top:14px' });
    const draw = () => { box.textContent = ''; (tab === 'news' ? drawNews : drawGraded)(); };

    function drawNews() {
      const feeds = Store.settings().feeds;
      if (!feeds.length) { box.appendChild(h('div', { class: 'empty' }, '还没有新闻源')); }
      let cur = feeds[0];
      const list = h('div', { style: 'margin-top:12px' });
      const load = async () => {
        if (!cur) return;
        list.textContent = '';
        list.appendChild(loadingEl('正在读取 ' + cur.name + '…'));
        try {
          const items = await loadFeed(cur.url);
          list.textContent = '';
          items.forEach(it => list.appendChild(h('button', { class: 'lrow', onclick: () => openNews(it, cur.name) },
            h('div', { class: 'grow' }, h('div', { class: 't es', style: 'white-space:normal;color:var(--ink)' }, it.title),
              it.desc ? h('div', { class: 'd' }, it.desc.slice(0, 80)) : null))));
        } catch (e) {
          list.textContent = '';
          list.appendChild(h('div', { class: 'card small' }, h('b', null, '读不到「' + cur.name + '」'), h('div', { class: 'mut', style: 'margin-top:4px' },
            '可能是这个源的地址变了，或者当前网络访问不了它（' + e.message + '）。可以换一个源，或者在「管理新闻源」里改地址。')));
        }
      };
      add(box, [
        feeds.length ? chipRow(feeds.map(f => [f, f.name]), cur, v => { cur = v; load(); }, true) : null,
        h('div', { style: 'margin-top:10px' }, h('button', { class: 'chip', onclick: () => manageFeeds(draw) }, '⚙ 管理新闻源')),
        list]);
      load();
    }

    async function openNews(it, source) {
      Views.reader({ title: it.title, source, link: it.link, loader: async () => {
        let paras = [];
        try { if (it.link) paras = await loadArticle(it.link); } catch (_) { /* 用摘要顶上 */ }
        if (paras.join(' ').length < 300) {
          const alt = ((it.body || it.desc || '').match(/[^.!?]+[.!?]*\s*/g) || []).map(s => s.trim()).filter(Boolean).reduce((acc, s) => {
            if (!acc.length || acc[acc.length - 1].length > 280) acc.push(s); else acc[acc.length - 1] += ' ' + s; return acc;
          }, []);
          if (alt.join(' ').length > paras.join(' ').length) paras = alt;
          return { paras, partial: true };
        }
        return { paras };
      } });
    }

    function drawGraded() {
      let level = Store.settings().level;
      const topic = h('input', { class: 'inp', placeholder: '主题（可不填），例如：西班牙的午睡、足球、职场' });
      const status = h('div');
      const btn = h('button', { class: 'btn', onclick: async () => {
        if (!AI.ready()) return Views.aiSettings();
        btn.disabled = true; status.textContent = ''; status.appendChild(loadingEl('AI 正在写文章…'));
        try {
          const r = await AI.json(AI.P.reading(level, topic.value.trim()));
          if (!r.text) throw new Error('AI 返回的内容不完整，请再试一次');
          const rec = { id: 'r' + Date.now(), level, title: r.title || 'Lectura', zh_title: r.zh_title || '', text: r.text, glossary: r.glossary || [], questions: r.questions || [], ts: Date.now() };
          const lib = Store.lib.readings; lib.unshift(rec); if (lib.length > 40) lib.length = 40; Store.save('lib');
          draw(); openSaved(rec);
        } catch (e) { status.textContent = ''; status.appendChild(h('div', { class: 'card', style: 'color:var(--bad)' }, e.message)); }
        btn.disabled = false;
      } }, '生成一篇');
      add(box, [chipRow(LEVELS.map(l => l[0]), level, v => { level = v; }, true), h('div', { class: 'gap' }), topic, h('div', { class: 'gap' }), btn, status]);
      if (!AI.ready()) needAI(box, 'AI 读物需要联网的 AI');
      const saved = Store.lib.readings;
      if (saved.length) add(box, [h('div', { class: 'sec' }, '读过的'), saved.map(r => h('button', { class: 'lrow', onclick: () => openSaved(r) },
        h('div', { class: 'lnum' }, r.level), h('div', { class: 'grow' }, h('div', { class: 't es', style: 'color:var(--ink)' }, r.title), h('div', { class: 'd' }, r.zh_title))))]);
    }
    const openSaved = r => Views.reader({ title: r.title, source: r.level + (r.zh_title ? ' · ' + r.zh_title : ''), paras: r.text.split(/\n{2,}|\n/).map(s => s.trim()).filter(Boolean), glossary: r.glossary, questions: r.questions });

    add(ctx.body, [chipRow([['news', '西语新闻'], ['graded', 'AI 分级读物']], tab, v => { tab = v; draw(); }), box]);
    draw();
  });
};

function manageFeeds(after) {
  UI.sheet((el, close) => {
    const feeds = Store.settings().feeds;
    const list = h('div', { class: 'card' });
    const draw = () => {
      list.textContent = '';
      if (!feeds.length) list.appendChild(h('div', { class: 'small mut' }, '空的'));
      feeds.forEach((f, i) => list.appendChild(h('div', { class: 'item' },
        h('div', { class: 'grow' }, h('div', { style: 'font-weight:600' }, f.name), h('div', { class: 'small mut', style: 'word-break:break-all' }, f.url)),
        h('button', { class: 'add', onclick: () => { feeds.splice(i, 1); Store.save(); draw(); } }, '×'))));
    };
    const name = h('input', { class: 'inp', placeholder: '名称' });
    const url = h('input', { class: 'inp', placeholder: 'RSS 地址，https://…', autocapitalize: 'off', autocorrect: 'off' });
    add(el, [h('p', { class: 'sec', style: 'margin-top:0' }, '新闻源（RSS）'), list,
      h('div', { class: 'field' }, name), h('div', { class: 'field' }, url),
      h('button', { class: 'btn', onclick: () => {
        const u = url.value.trim();
        if (!/^https?:\/\//.test(u)) return UI.toast('请填写以 http 开头的 RSS 地址');
        feeds.push({ name: name.value.trim() || u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0], url: u });
        Store.save(); name.value = ''; url.value = ''; draw();
      } }, '添加'), h('div', { class: 'gap' }),
      h('button', { class: 'btn ghost', onclick: () => { close(); if (after) after(); } }, '完成')]);
    draw();
  });
}

/** 通用阅读器。opts: {title, source, link, paras | loader(), glossary, questions} */
Views.reader = opts => {
  UI.push(opts.source || '阅读', async ctx => {
    const b = ctx.body;
    b.appendChild(h('div', { class: 'title', style: 'font-size:24px;margin-bottom:10px' }, esTap(opts.title)));
    let paras = opts.paras, partial = false;
    if (!paras) {
      const wait = loadingEl('正在提取正文…');
      b.appendChild(wait);
      const r = await opts.loader();
      paras = r.paras; partial = !!r.partial;
      wait.remove();
      if (!ctx.alive) return;
    }
    let playing = false;
    const playBtn = h('button', { class: 'chip', onclick: async () => {
      if (playing) { playing = false; TTS.stop(); return; }
      playing = true; playBtn.textContent = '■ 停止';
      for (const p of paras) { if (!playing || !ctx.alive) break; await TTS.speak(p); }
      playing = false; playBtn.textContent = '▶ 朗读';
    } }, '▶ 朗读');
    const aiBox = h('div');
    const ctl = {};
    ctx.onclose = () => { playing = false; if (ctl.cancel) ctl.cancel(); };
    add(b, [h('div', { class: 'chips', style: 'margin-bottom:14px' }, paras.length ? playBtn : null,
      paras.length ? h('button', { class: 'chip', onclick: () => {
        if (!AI.ready()) return Views.aiSettings();
        const req = AI.P.article(opts.title + '\n\n' + paras.join('\n\n')); req.ctl = ctl;
        aiBox.className = 'card'; streamInto(aiBox, req); aiBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } }, '✦ AI 精读') : null,
      opts.link ? h('button', { class: 'chip', onclick: () => Native.call('open', { url: opts.link }) }, '在 Safari 打开') : null)]);
    if (partial) b.appendChild(h('div', { class: 'small mut', style: 'margin-bottom:10px' }, paras.length ? '没能提取到全文，下面是摘要。完整内容可以在 Safari 里看。' : '没能提取到正文，请在 Safari 里打开。'));
    paras.forEach(p => b.appendChild(h('p', { style: 'font:400 18px/1.65 var(--es);margin-bottom:14px' }, esTap(p))));
    b.appendChild(h('div', { class: 'small mut' }, '点任何一个词都可以查。'));
    b.appendChild(aiBox);
    if ((opts.glossary || []).length) add(b, [h('div', { class: 'sec' }, '生词'), h('div', { class: 'card' }, opts.glossary.filter(g => Array.isArray(g) && g[0]).map(g =>
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 'e sel' }, g[0]), h('div', { class: 'z' }, g[1] || '')), spkBtn(g[0]), addBtn(g[0], g[1] || '', '', '阅读'))))]);
    const quiz = quizEl(opts.questions);
    if (quiz) b.appendChild(quiz);
  });
};

/* ---------- 听力 ---------- */
Views.listening = () => {
  UI.push('听力', ctx => {
    const draw = () => {
      ctx.body.textContent = '';
      let level = Store.settings().level;
      const topic = h('input', { class: 'inp', placeholder: '场景（可不填），例如：合租室友吵架、给客户打电话' });
      const status = h('div');
      const btn = h('button', { class: 'btn', onclick: async () => {
        if (!AI.ready()) return Views.aiSettings();
        btn.disabled = true; status.textContent = ''; status.appendChild(loadingEl('AI 正在写对话…'));
        try {
          const r = await AI.json(AI.P.listening(level, topic.value.trim()));
          const lines = (r.lines || []).filter(l => Array.isArray(l) && l[1]);
          if (lines.length < 4) throw new Error('AI 返回的内容不完整，请再试一次');
          const rec = { id: 'a' + Date.now(), level, title: r.title || 'Diálogo', zh_title: r.zh_title || '', lines, questions: r.questions || [], ts: Date.now() };
          const lib = Store.lib.audios; lib.unshift(rec); if (lib.length > 40) lib.length = 40; Store.save('lib');
          draw(); Views.audio(rec);
        } catch (e) { status.textContent = ''; status.appendChild(h('div', { class: 'card', style: 'color:var(--bad)' }, e.message)); }
        btn.disabled = false;
      } }, '生成一段对话');
      add(ctx.body, [h('p', { class: 'small mut', style: 'margin-bottom:10px' }, '先不看原文听两遍，做完理解题再对照文本。'),
        chipRow(LEVELS.map(l => l[0]), level, v => { level = v; }, true), h('div', { class: 'gap' }), topic, h('div', { class: 'gap' }), btn, status]);
      if (!AI.ready()) needAI(ctx.body, '听力材料由 AI 生成');
      const cards = Object.values(Store.state.cards);
      if (cards.length >= 4) add(ctx.body, [h('div', { class: 'gap' }), h('button', { class: 'btn ghost', onclick: () => Views.run('听写', Ex.fromCards(cards, 'dictation', 10)) }, '离线听写：用学过的句子')]);
      const saved = Store.lib.audios;
      if (saved.length) add(ctx.body, [h('div', { class: 'sec' }, '听过的'), saved.map(r => h('button', { class: 'lrow', onclick: () => Views.audio(r) },
        h('div', { class: 'lnum' }, r.level), h('div', { class: 'grow' }, h('div', { class: 't es', style: 'color:var(--ink)' }, r.title), h('div', { class: 'd' }, r.zh_title))))]);
    };
    draw();
  });
};

Views.audio = rec => {
  UI.push(rec.title, ctx => {
    let showEs = false, showZh = false, slow = false, playing = false, at = -1;
    const speakers = [...new Set(rec.lines.map(l => l[0]))];
    const list = h('div', { class: 'card' });
    const voiceOf = l => speakers.indexOf(l[0]) % 2;
    const drawLines = () => {
      list.textContent = '';
      rec.lines.forEach((l, i) => list.appendChild(h('div', { class: 'dlg tap', style: i === at ? 'background:var(--soft);border-radius:8px;padding-left:8px' : '',
        onclick: () => { playing = false; TTS.speak(l[1], { voice: voiceOf(l), rate: slow ? 0.72 : 1 }); } },
        h('div', { class: 'who' }, l[0]),
        h('div', { class: 'e' }, showEs ? esTap(l[1]) : '• • • • •'),
        showZh && l[2] ? h('div', { class: 'z' }, l[2]) : null)));
    };
    const playBtn = h('button', { class: 'btn', onclick: async () => {
      if (playing) { playing = false; TTS.stop(); return; }
      playing = true; playBtn.textContent = '■ 停止';
      for (let i = 0; i < rec.lines.length; i++) {
        if (!playing || !ctx.alive) break;
        at = i; drawLines();
        await TTS.speak(rec.lines[i][1], { voice: voiceOf(rec.lines[i]), rate: slow ? 0.72 : 1 });
      }
      playing = false; at = -1; playBtn.textContent = '▶ 从头播放'; if (ctx.alive) drawLines();
    } }, '▶ 从头播放');
    ctx.onclose = () => { playing = false; };
    const toggle = (label, get, set) => { const c = h('button', { class: 'chip' + (get() ? ' on' : '') }, label); c.addEventListener('click', () => { set(!get()); c.classList.toggle('on', get()); drawLines(); }); return c; };
    add(ctx.body, [rec.zh_title ? h('div', { class: 'sub', style: 'margin-bottom:10px' }, rec.level + ' · ' + rec.zh_title) : null, playBtn,
      h('div', { class: 'chips', style: 'margin:12px 0' },
        toggle('🐢 慢速', () => slow, v => { slow = v; }), toggle('显示原文', () => showEs, v => { showEs = v; }), toggle('显示中文', () => showZh, v => { showZh = v; })),
      list, quizEl(rec.questions)]);
    drawLines();
  });
};

/* ---------- 写作批改 ---------- */
Views.writing = () => {
  UI.push('写作批改', ctx => {
    let level = Store.settings().level;
    const topic = h('textarea', { class: 'inp', style: 'min-height:60px', placeholder: '题目（可以自己写，也可以让 AI 出题）' });
    const text = h('textarea', { class: 'inp', style: 'min-height:200px;font:400 17px/1.6 var(--es)', placeholder: 'Escribe aquí tu texto…', autocorrect: 'off', spellcheck: 'false' });
    const count = h('div', { class: 'small mut', style: 'text-align:right' }, '0 词');
    text.addEventListener('input', () => { count.textContent = Ex.words(text.value).length + ' 词'; });
    const out = h('div', { style: 'margin-top:14px' });
    const ctl = {};
    ctx.onclose = () => { if (ctl.cancel) ctl.cancel(); };
    const topicBtn = h('button', { class: 'chip', onclick: async () => {
      if (!AI.ready()) return Views.aiSettings();
      topicBtn.textContent = '出题中…';
      try { const r = await AI.json(AI.P.writingTopic(level)); topic.value = (r.prompt || '') + (r.words ? `（${r.words} palabras）` : '') + (r.zh ? '\n' + r.zh : ''); }
      catch (e) { UI.toast(e.message, 3500); }
      topicBtn.textContent = '✦ AI 出题';
    } }, '✦ AI 出题');
    add(ctx.body, [chipRow(LEVELS.map(l => l[0]), level, v => { level = v; }, true), h('div', { class: 'gap' }),
      topic, h('div', { style: 'margin:8px 0 12px' }, topicBtn), text, accentBar(text), count,
      h('button', { class: 'btn', onclick: async () => {
        if (Ex.words(text.value).length < 5) return UI.toast('先写几句再批改');
        if (!AI.ready()) return Views.aiSettings();
        text.blur();
        const req = AI.P.writing(level, topic.value.trim(), text.value.trim()); req.ctl = ctl;
        const ok = await streamInto(out, req);
        if (ok) Store.addXP(15);
      } }, '批改'), out]);
    if (!AI.ready()) needAI(ctx.body, '写作批改需要联网的 AI');
  });
};

/* ---------- 发音 ---------- */
Views.pron = () => {
  UI.push('发音', ctx => {
    add(ctx.body, [h('p', { class: 'small mut', style: 'margin-bottom:12px' }, '先听，再跟读。语音识别会标出没读清的词。想让朗读更自然，可以到 iPhone 的 设置 → 辅助功能 → 朗读内容 → 声音 → 西班牙语，下载“增强”音质。'),
      PRON.map((p, i) => h('button', { class: 'lrow', onclick: () => Views.pronSet(p) }, h('div', { class: 'lnum' }, i + 1),
        h('div', { class: 'grow' }, h('div', { class: 't' }, p[0]), h('div', { class: 'd' }, p[1]))))]);
    const cards = Object.values(Store.state.cards).filter(c => Ex.words(c.es).length >= 3);
    if (cards.length >= 5) ctx.body.appendChild(h('button', { class: 'lrow', onclick: () => Views.pronSet(['跟读学过的句子', '从复习卡片里随机抽 8 句。', Ex.pick(cards, 8).map(c => c.es)]) },
      h('div', { class: 'lnum' }, '★'), h('div', { class: 'grow' }, h('div', { class: 't' }, '跟读学过的句子'), h('div', { class: 'd' }, '从你的复习卡片里抽'))));
  });
};

Views.pronSet = set => {
  UI.push(set[0], ctx => {
    ctx.body.appendChild(h('div', { class: 'card' }, set[1]));
    let active = null;
    ctx.onclose = () => { if (active) STT.stop(); };
    set[2].forEach(phrase => {
      const heard = h('div', { class: 'heard', style: 'margin:6px 0 0;font-size:16px;min-height:0' });
      const mic = h('button', { class: 'spk', style: 'background:var(--acc);color:#fff' }, '🎤');
      let last = '';
      mic.addEventListener('click', async () => {
        if (active === mic) { STT.stop(); return; }
        if (!Native.isNative) return UI.toast('跟读打分只在 iPhone 应用里可用');
        last = ''; heard.textContent = '正在听…';
        try {
          await STT.start(t => { last = t; heard.textContent = t; }, () => {
            active = null; mic.classList.remove('on');
            if (!last) { heard.textContent = '没听清，再试一次'; return; }
            const r = Ex.scoreSpeech(phrase, last);
            heard.textContent = '';
            r.words.forEach(x => add(heard, [h('span', { class: x.ok ? 'hit' : 'miss' }, x.w), ' ']));
            heard.appendChild(h('b', { style: 'font:700 14px -apple-system;margin-left:6px' }, Math.round(r.score * 100) + ' 分'));
            if (r.score >= 0.8) Store.addXP(1);
          });
          active = mic; mic.classList.add('on');
        } catch (e) { heard.textContent = e.message; }
      });
      ctx.body.appendChild(h('div', { class: 'card' }, h('div', { class: 'row' }, h('div', { class: 'grow big-es', style: 'font-size:19px' }, esTap(phrase)), spkBtn(phrase),
        h('button', { class: 'spk', onclick: () => TTS.speak(phrase, { rate: 0.65 }) }, '🐢'), mic), heard));
    });
  });
};

/* ---------- 语法手册 ---------- */
Views.grammar = () => {
  UI.push('语法手册', ctx => {
    add(ctx.body, GRAMMAR.map(g => h('button', { class: 'lrow', onclick: () => UI.push(g[0], c2 => {
      c2.body.appendChild(mdEl(g[2]));
      c2.body.appendChild(h('div', { class: 'gap' }));
      c2.body.appendChild(h('button', { class: 'btn ghost', onclick: () => Views.chat({ id: 'tutor', title: '问老师', tutor: true, seed: `关于「${g[0]}」，` }) }, '还有疑问？问老师'));
    }) }, h('div', { class: 'lnum' }, g[1]), h('div', { class: 'grow' }, h('div', { class: 't' }, g[0])))));
  });
};

/* ---------- 母语资源 ---------- */
Views.resources = () => {
  UI.push('母语资源', ctx => {
    ctx.body.appendChild(h('p', { class: 'small mut' }, '到了 B2 以后，进步主要靠大量接触真实的西语。这些是西班牙人自己每天在用的。'));
    let cat = null;
    RESOURCES.forEach(r => {
      if (r[0] !== cat) { cat = r[0]; ctx.body.appendChild(h('div', { class: 'unit' }, cat)); }
      ctx.body.appendChild(h('button', { class: 'lrow', onclick: () => Native.call('open', { url: r[3] }) },
        h('div', { class: 'grow' }, h('div', { class: 't' }, r[1]), h('div', { class: 'd', style: 'white-space:normal' }, r[2])), h('span', { class: 'mut' }, '↗')));
    });
  });
};

/* ---------- 分级测试 ---------- */
Views.placement = () => {
  UI.push('分级测试', ctx => {
    const answers = [];
    let i = 0;
    const draw = () => {
      ctx.body.textContent = '';
      if (i >= PLACEMENT.length) return finish();
      const q = PLACEMENT[i];
      add(ctx.body, [h('div', { class: 'bar', style: 'margin:0 0 18px' }, h('i', { style: `width:${Math.round(i / PLACEMENT.length * 100)}%` })),
        h('div', { class: 'small mut', style: 'margin-bottom:8px' }, `第 ${i + 1} / ${PLACEMENT.length} 题`),
        h('div', { class: 'big-es', style: 'margin-bottom:18px' }, q[1]),
        q[2].map((o, k) => h('button', { class: 'opt', onclick: () => { answers.push(k === q[3]); i++; draw(); } }, o)),
        h('button', { class: 'btn ghost', onclick: () => { answers.push(false); i++; draw(); } }, '不知道')]);
    };
    const finish = () => {
      let level = 'C2';
      for (const l of LEVELS) {
        const idx = PLACEMENT.map((q, k) => (q[0] === l[0] ? k : -1)).filter(k => k >= 0);
        if (idx.filter(k => answers[k]).length < 3) { level = l[0]; break; }
      }
      const st = Store.settings();
      st.level = level; Store.state.placed = true; Store.save();
      const info = LEVELS.find(l => l[0] === level);
      add(ctx.body, [h('div', { class: 'done-screen' }, h('div', { class: 'small mut' }, '建议你从这里开始'), h('div', { class: 'n' }, level),
        h('div', { style: 'font:600 20px var(--es)' }, info[1]), h('div', { class: 'mut', style: 'margin:8px 0 20px' }, info[2]),
        h('div', { class: 'small mut', style: 'margin-bottom:16px' }, `答对 ${answers.filter(Boolean).length} / ${PLACEMENT.length} 题。所有级别的课都是开放的，随时可以往前或往后跳。`),
        h('button', { class: 'btn', onclick: () => { ctx.close(); UI.showTab('learn'); } }, '开始学习'))]);
    };
    add(ctx.body, [h('div', { class: 'title', style: 'font-size:26px' }, '找到你的级别'),
      h('p', { class: 'mut', style: 'margin:8px 0 20px' }, '24 道选择题，从 A1 到 C2，每级 4 题。不会的直接点“不知道”，别猜，这样结果才准。大约 5 分钟。'),
      h('button', { class: 'btn', onclick: draw }, '开始')]);
  });
};
