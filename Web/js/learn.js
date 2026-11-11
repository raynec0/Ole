'use strict';
/* 学习页、课文页、练习流程。 */

Views.learn = root => {
  const S = Store.state, st = S.settings;
  const goal = st.goal, xp = Store.todayXP();
  const due = Store.dueCards().length;
  const hello = (() => { const hr = new Date().getHours(); return hr < 13 ? '¡Buenos días!' : hr < 21 ? '¡Buenas tardes!' : '¡Buenas noches!'; })();

  add(root, [
    h('div', { class: 'hero' },
      h('div', { class: 'ring', style: `--p:${Math.min(100, Math.round(xp / goal * 100))}` }, h('div', null, xp)),
      h('div', { class: 'grow' }, h('div', { class: 'title' }, hello),
        h('div', { class: 'sub' }, `今日 ${xp} / ${goal} 经验 · 连续 ${Store.streak()} 天`)))
  ]);

  const nxt = Course.next(st.level);
  if (nxt) {
    root.appendChild(h('button', { class: 'card tap', style: 'width:100%;text-align:left;border-color:var(--acc)', onclick: () => Views.lesson(nxt.id) },
      h('div', { class: 'small', style: 'color:var(--acc);font-weight:700' }, '继续学习 · ' + nxt.lv),
      h('div', { style: 'font:600 19px var(--es);margin-top:2px' }, nxt.title),
      h('div', { class: 'small mut' }, nxt.goal || nxt.unit)));
  }
  if (due) {
    root.appendChild(h('button', { class: 'card tap row', style: 'width:100%;text-align:left', onclick: () => Views.reviewSession() },
      h('div', { class: 'grow' }, h('b', null, `${due} 张卡片该复习了`), h('div', { class: 'small mut' }, '趁还没忘，花两分钟过一遍')), h('span', { class: 'tag acc' }, '复习')));
  }
  if (!S.placed && !Object.keys(S.lessons).length) {
    root.appendChild(h('button', { class: 'card tap', style: 'width:100%;text-align:left', onclick: () => Views.placement() },
      h('b', null, '以前学过西语？'), h('div', { class: 'small mut' }, '做一个 24 题的分级测试，直接从合适的级别开始')));
  }

  root.appendChild(h('div', { class: 'sec' }, '课程'));
  const done = S.lessons;
  root.appendChild(chipRow(LEVELS.map(l => {
    const ls = Course.byLevel(l[0]);
    const n = ls.filter(x => done[x.id] && done[x.id].done).length;
    return [l[0], `${l[0]} ${l[1]} ${n}/${ls.length}`];
  }), st.level, v => { st.level = v; Store.save(); UI.renderTab(); }, true));

  const info = LEVELS.find(l => l[0] === st.level);
  root.appendChild(h('div', { class: 'small mut', style: 'margin-top:10px' }, info[2] +
    (['A1', 'A2'].includes(st.level) ? '。这一级的课文已内置，不联网也能学。' : '。这一级的课文在第一次打开时由 AI 按大纲生成，之后保存在手机上。')));

  let unit = null, n = 0;
  Course.byLevel(st.level).forEach(l => {
    if (l.unit !== unit) { unit = l.unit; root.appendChild(h('div', { class: 'unit' }, unit)); }
    n++;
    const p = done[l.id];
    const isDone = p && p.done;
    root.appendChild(h('button', { class: 'lrow' + (isDone ? ' done' : ''), onclick: () => Views.lesson(l.id) },
      h('div', { class: 'lnum' }, isDone ? '✓' : n),
      h('div', { class: 'grow' }, h('div', { class: 't' }, l.title),
        h('div', { class: 'd' }, l.goal || (Course.ready(l) ? '已生成，可离线学习' : l.spec))),
      isDone ? h('span', { class: 'small mut' }, Math.round(p.best * 100) + '%') : (l.ai && !Course.ready(l) ? h('span', { class: 'tag' }, 'AI') : null)));
  });
};

/* 检查 AI 生成的课文结构，丢掉不合格的条目 */
function cleanLesson(raw) {
  const arr = x => (Array.isArray(x) ? x : []);
  const str = x => typeof x === 'string' && x.trim();
  const out = {
    notes: arr(raw.notes).filter(str),
    items: arr(raw.items).filter(i => Array.isArray(i) && str(i[0]) && str(i[1])).map(i => [i[0].trim(), i[1].trim(), str(i[2]) ? i[2].trim() : '']),
    drills: arr(raw.drills).filter(d => Array.isArray(d) && str(d[0]) && /_{2,}/.test(d[0]) && str(d[1]) && Array.isArray(d[2]))
      .map(d => [d[0].trim(), d[1].trim(), d[2].filter(str).map(x => x.trim()), str(d[3]) ? d[3].trim() : '']),
    dialog: arr(raw.dialog).filter(d => Array.isArray(d) && str(d[1])).map(d => [String(d[0] || 'A'), d[1].trim(), str(d[2]) ? d[2].trim() : ''])
  };
  if (out.items.length < 4) throw new Error('AI 生成的内容不完整，请再试一次');
  return out;
}

Views.lesson = id => {
  UI.push('', ctx => {
    const draw = () => {
      const L = Course.get(id);
      ctx.setTitle(L.lv + ' · ' + L.title);
      ctx.body.textContent = '';
      ctx.right.textContent = '';
      if (L.ai && !L.ready) return drawGenerate(L);
      drawContent(L);
    };

    const drawGenerate = L => {
      add(ctx.body, [
        h('div', { class: 'title', style: 'font-size:26px' }, L.title),
        h('div', { class: 'sub', style: 'margin:4px 0 14px' }, L.lv + ' · ' + L.unit),
        h('div', { class: 'card' }, h('div', { class: 'small mut' }, '本课要点'), h('div', { style: 'margin-top:4px' }, L.spec))
      ]);
      if (!AI.ready()) return needAI(ctx.body, 'B1 及以上的课文由 AI 按大纲生成');
      const status = h('div');
      const btn = h('button', { class: 'btn', onclick: go }, '生成这一课');
      add(ctx.body, [h('p', { class: 'small mut', style: 'margin:10px 0' }, '生成一次大约半分钟，之后存在手机上，离线也能学。'), btn, status]);
      const ctl = {};
      ctx.onclose = () => { if (ctl.cancel) ctl.cancel(); };
      async function go() {
        btn.disabled = true;
        status.textContent = '';
        const wait = loadingEl('AI 正在备课…');
        status.appendChild(wait);
        try {
          const req = AI.P.lesson(L);
          req.ctl = ctl;
          req.onDelta = t => { wait.lastChild.textContent = `AI 正在备课… 已写 ${t.length} 字`; };
          const data = cleanLesson(await AI.json(req));
          data.ts = Date.now();
          Store.gen[id] = data;
          Store.save('gen');
          if (ctx.alive) draw();
        } catch (e) {
          status.textContent = '';
          if (!e.cancelled) status.appendChild(h('div', { class: 'card', style: 'color:var(--bad);margin-top:10px' }, e.message));
          btn.disabled = false;
        }
      }
    };

    const drawContent = L => {
      const b = ctx.body;
      if (L.ai) ctx.right.appendChild(h('button', { onclick: async () => {
        if (await UI.confirm('重新生成这一课？现在的内容会被替换。', '重新生成')) { delete Store.gen[id]; Store.save('gen'); draw(); }
      } }, '重写'));
      add(b, [h('div', { class: 'title', style: 'font-size:26px' }, L.title),
        h('div', { class: 'sub', style: 'margin:4px 0 14px' }, L.goal || L.unit)]);

      (L.notes || []).forEach(n => b.appendChild(h('div', { class: 'card' }, mdEl(n))));

      if ((L.dialog || []).length) {
        let playing = false;
        const playBtn = h('button', { class: 'btn sm ghost', onclick: async () => {
          if (playing) { playing = false; TTS.stop(); return; }
          playing = true; playBtn.textContent = '■ 停止';
          const speakers = [...new Set(L.dialog.map(d => d[0]))];
          for (const d of L.dialog) { if (!playing || !ctx.alive) break; await TTS.speak(d[1], { voice: speakers.indexOf(d[0]) % 2 }); }
          playing = false; playBtn.textContent = '▶ 听对话';
        } }, '▶ 听对话');
        add(b, [h('div', { class: 'row sec' }, h('span', { class: 'grow' }, '对话'), playBtn),
          h('div', { class: 'card' }, L.dialog.map(d => h('div', { class: 'dlg tap', onclick: () => TTS.speak(d[1]) },
            h('div', { class: 'who' }, d[0]), h('div', { class: 'e' }, esTap(d[1])), d[2] ? h('div', { class: 'z' }, d[2]) : null)))]);
      }

      add(b, [h('div', { class: 'sec' }, '词与句'),
        h('div', { class: 'card' }, (L.items || []).map(it => h('div', { class: 'item' },
          h('div', { class: 'grow' }, h('div', { class: 'e' }, esTap(it[0])), h('div', { class: 'z' }, it[1]), it[2] ? h('div', { class: 'n' }, it[2]) : null),
          spkBtn(it[0]), addBtn(it[0], it[1], it[2], L.title))))]);

      const start = (lesson) => {
        const exs = Ex.make(lesson, Course.pool(), { speaking: Store.settings().speaking && Native.isNative });
        Views.run(L.title, exs, score => {
          Store.lessonDone(id, score);
          (lesson.items || []).forEach(it => Store.addCard(it[0], it[1], it[2], L.title));
        });
      };
      const extraBtn = AI.ready() ? h('button', { class: 'btn ghost', onclick: async () => {
        extraBtn.disabled = true; extraBtn.textContent = 'AI 正在出题…';
        try {
          const d = cleanLesson(Object.assign({ notes: [], dialog: [] }, await AI.json(AI.P.extra(L))));
          start({ items: d.items, drills: d.drills });
        } catch (e) { UI.toast(e.message, 3500); }
        extraBtn.disabled = false; extraBtn.textContent = 'AI 再出一组新题';
      } }, 'AI 再出一组新题') : null;

      add(b, [h('div', { class: 'gap' }),
        extraBtn, extraBtn ? h('div', { class: 'gap' }) : null,
        h('button', { class: 'btn ghost', onclick: () => Views.chat({ id: 'tutor', title: '问老师', tutor: true,
          seed: `我正在学「${L.title}」（${L.lv}）这一课，` }) }, '这一课有疑问？问老师'),
        h('div', { class: 'sticky' }, h('button', { class: 'btn', onclick: () => start(L) }, '开始练习'))]);
    };

    draw();
  });
};

/* ---------- 练习流程 ---------- */
Views.run = (title, exs, onDone) => {
  if (!exs.length) { UI.toast('没有可练的内容'); return; }
  UI.push(title, ctx => {
    ctx.body.classList.add('flexcol');
    const bar = h('div', { class: 'bar' }, h('i'));
    const area = h('div', { class: 'ex' });
    const foot = h('div', { class: 'exfoot' });
    add(ctx.body, [bar, area, foot]);

    const total = exs.length;
    let queue = exs.slice(), solved = 0, first = 0;
    const retried = new Set();
    let cur = null, answered = false, cleanup = null;

    const setFoot = (...kids) => { foot.className = 'exfoot'; foot.textContent = ''; add(foot, kids); };

    function next() {
      if (cleanup) { cleanup(); cleanup = null; }
      TTS.stop();
      bar.firstChild.style.width = Math.round(solved / total * 100) + '%';
      if (!queue.length) return finish();
      cur = queue.shift(); answered = false;
      area.textContent = ''; area.scrollTop = 0;
      setFoot();
      RENDER[cur.type](cur);
    }

    /** ok: 是否答对；info: {answer, why, note, say} */
    function result(ok, info) {
      if (answered) return;
      answered = true;
      info = info || {};
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      Native.call('haptic', { kind: ok ? 'ok' : 'bad' }).catch(() => {});
      if (ok) { solved++; if (!retried.has(cur)) first++; }
      else if (!retried.has(cur)) { retried.add(cur); queue.push(cur); }
      else solved++;
      foot.className = 'exfoot ' + (ok ? 'ok' : 'bad');
      foot.textContent = '';
      add(foot, [
        h('div', { class: 'msg' }, ok ? (info.note || ['¡Muy bien!', '¡Perfecto!', '¡Eso es!', '¡Genial!'][Math.floor(Math.random() * 4)]) : '正确答案'),
        (!ok || info.showAnswer) && info.answer ? h('div', { class: 'ans sel' }, info.answer) : null,
        info.why ? h('div', { class: 'why' }, info.why) : null,
        h('button', { class: 'btn', onclick: next }, '继续')
      ]);
      if (info.say && Store.settings().autoSpeak) TTS.speak(info.say);
    }

    function finish() {
      const score = first / total;
      const xp = 10 + first;
      Store.addXP(xp);
      if (onDone) onDone(score);
      area.textContent = '';
      add(area, [h('div', { class: 'done-screen' },
        h('div', { class: 'n' }, Math.round(score * 100) + '%'),
        h('div', { style: 'font:600 22px var(--es);margin:6px 0' }, score >= 0.9 ? '¡Excelente!' : score >= 0.7 ? '¡Muy bien!' : '¡Ánimo!'),
        h('div', { class: 'mut' }, `一次答对 ${first} / ${total} 题 · 获得 ${xp} 经验`))]);
      setFoot(h('button', { class: 'btn', onclick: () => ctx.close() }, '完成'));
    }

    const optionButtons = (e, onPick) => e.options.map(o => {
      const b = h('button', { class: 'opt' }, o);
      b.addEventListener('click', () => {
        if (answered) return;
        const ok = Ex.norm(o) === Ex.norm(e.answer);
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) [...b.parentNode.children].forEach(x => { if (Ex.norm(x.textContent) === Ex.norm(e.answer)) x.classList.add('right'); });
        onPick(ok, o);
      });
      return b;
    });

    const RENDER = {
      mc(e) {
        const es = e.dir === 'es2zh';
        add(area, [h('div', { class: 'q' }, es ? '这是什么意思？' : '用西语怎么说？'),
          h('div', { class: 'row', style: 'margin-bottom:18px' }, h('div', { class: 'prompt grow' + (es ? ' es' : ''), style: 'margin:0' }, e.prompt), es ? spkBtn(e.prompt) : null),
          h('div', null, optionButtons(e, ok => result(ok, { answer: e.answer, say: es ? null : e.answer })))]);
        if (es && Store.settings().autoSpeak) TTS.speak(e.prompt);
      },
      listen(e) {
        add(area, [h('div', { class: 'q' }, '听一听，选出你听到的'), spkBtn(e.audio, { big: true }),
          h('div', { class: 'center small mut', style: 'margin-bottom:16px' }, h('button', { class: 'chip', onclick: () => TTS.speak(e.audio, { rate: 0.7 }) }, '🐢 慢速')),
          h('div', null, optionButtons(e, ok => result(ok, { answer: e.answer + (e.item ? '　' + e.item.zh : ''), showAnswer: true })))]);
        TTS.speak(e.audio);
      },
      cloze(e) {
        const parts = e.prompt.split(/_{2,}/);
        const blank = h('span', { class: 'blank' }, ' ');
        add(area, [h('div', { class: 'q' }, '选词填空'),
          h('div', { class: 'prompt es' }, parts[0], blank, parts.slice(1).join(' ')),
          h('div', null, optionButtons(e, ok => { blank.textContent = e.answer; result(ok, { answer: e.prompt.replace(/_{2,}/, e.answer), why: e.why, showAnswer: !ok, say: e.prompt.replace(/_{2,}/, e.answer) }); }))]);
      },
      build(e) {
        const slots = h('div', { class: 'slots' }), bank = h('div', { class: 'bank' });
        const picked = [];
        const check = h('button', { class: 'btn', disabled: true, onclick: () => {
          const ok = Ex.norm(picked.map(p => p.word).join(' ')) === Ex.norm(e.answer);
          result(ok, { answer: e.answer, say: e.answer });
        } }, '检查');
        e.tiles.forEach(wd => {
          const t = h('button', { class: 'tile' }, wd);
          t.addEventListener('click', () => {
            if (answered || t.classList.contains('used')) return;
            t.classList.add('used');
            const s = h('button', { class: 'tile' }, wd);
            const rec = { word: wd, el: s };
            s.addEventListener('click', () => {
              if (answered) return;
              picked.splice(picked.indexOf(rec), 1); s.remove(); t.classList.remove('used'); check.disabled = !picked.length;
            });
            picked.push(rec); slots.appendChild(s); check.disabled = false;
          });
          bank.appendChild(t);
        });
        add(area, [h('div', { class: 'q' }, '把这句话拼成西语'), h('div', { class: 'prompt' }, e.prompt), slots, bank]);
        setFoot(check);
      },
      type(e) { typed(e, '翻译成西语', h('div', { class: 'prompt' }, e.prompt)); },
      dictation(e) {
        typed(e, '听写：写下你听到的', h('div', null, spkBtn(e.audio, { big: true }),
          h('div', { class: 'center', style: 'margin-bottom:12px' }, h('button', { class: 'chip', onclick: () => TTS.speak(e.audio, { rate: 0.7 }) }, '🐢 慢速'))));
        TTS.speak(e.audio);
      },
      speak(e) {
        const heard = h('div', { class: 'heard center' });
        const tip = h('div', { class: 'center small mut' }, '点麦克风，读完再点一次');
        let on = false, last = '';
        const mic = h('button', { class: 'mic' }, '🎤');
        const judge = () => {
          on = false; mic.classList.remove('on');
          if (answered) return;
          if (!last) { tip.textContent = '没听清，再试一次'; return; }
          const r = Ex.scoreSpeech(e.answer, last);
          heard.textContent = '';
          r.words.forEach(x => add(heard, [h('span', { class: x.ok ? 'hit' : 'miss' }, x.w), ' ']));
          const pct = Math.round(r.score * 100);
          if (r.score >= 0.75) result(true, { note: `发音 ${pct} 分`, say: null });
          else tip.textContent = `${pct} 分，红色的词没读清。再试一次，或者跳过。`;
        };
        mic.addEventListener('click', async () => {
          if (answered) return;
          if (on) { STT.stop(); return; }
          last = ''; heard.textContent = ''; tip.textContent = '正在听…';
          try { await STT.start(t => { last = t; heard.textContent = t; }, judge); on = true; mic.classList.add('on'); }
          catch (err) { tip.textContent = err.message; }
        });
        cleanup = () => { if (on) STT.stop(); };
        add(area, [h('div', { class: 'q' }, '大声读出来'),
          h('div', { class: 'row', style: 'margin-bottom:6px' }, h('div', { class: 'prompt es grow', style: 'margin:0' }, e.prompt), spkBtn(e.prompt)),
          h('div', { class: 'mut', style: 'margin-bottom:14px' }, e.zh), mic, heard, tip]);
        setFoot(h('button', { class: 'btn ghost', onclick: () => { retried.add(cur); result(true, { note: '已跳过' }); } }, '现在不方便说，跳过'));
      },
      match(e) {
        const left = e.pairs.map(p => ({ k: p.es, text: p.es, side: 'l' }));
        const right = Ex.shuffle(e.pairs.map(p => ({ k: p.es, text: p.zh, side: 'r' })));
        let sel = null, remaining = e.pairs.length, mistakes = 0;
        const mk = o => {
          const b = h('button', { class: 'opt', style: o.side === 'l' ? 'font-family:var(--es)' : '' }, o.text);
          b.addEventListener('click', () => {
            if (b.classList.contains('gone')) return;
            if (o.side === 'l') TTS.speak(o.text);
            if (!sel || sel.o.side === o.side) { if (sel) sel.b.classList.remove('sel'); sel = { o, b }; b.classList.add('sel'); return; }
            const a = sel; sel = null; a.b.classList.remove('sel');
            if (a.o.k === o.k) {
              [a.b, b].forEach(x => x.classList.add('gone', 'right'));
              if (--remaining === 0) { if (mistakes > 1) retried.add(cur); result(true, { note: mistakes ? '配对完成' : null }); }
            } else {
              mistakes++;
              [a.b, b].forEach(x => { x.classList.add('shake'); setTimeout(() => x.classList.remove('shake'), 320); });
            }
          });
          return b;
        };
        add(area, [h('div', { class: 'q' }, '把西语和中文配对'), h('div', { class: 'cols' }, h('div', null, left.map(mk)), h('div', null, right.map(mk)))]);
      }
    };

    function typed(e, label, promptEl) {
      const input = h('textarea', { class: 'inp', rows: 2, style: 'min-height:64px;font:500 18px var(--es)', placeholder: 'Escribe en español…',
        autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', spellcheck: 'false' });
      const check = h('button', { class: 'btn', disabled: true, onclick: submit }, '检查');
      input.addEventListener('input', () => { check.disabled = !input.value.trim(); });
      input.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); if (input.value.trim()) submit(); } });
      function submit() {
        const r = Ex.check(input.value, e.answer);
        input.disabled = true;
        const note = r.kind === 'accent' ? '对了，但要注意重音符号' : r.kind === 'typo' ? '基本正确，有个小笔误' : null;
        result(r.ok, { answer: e.answer + (e.type === 'dictation' && e.item && e.item.zh ? '　' + e.item.zh : ''), note, showAnswer: r.kind !== 'exact', say: e.type === 'type' ? e.answer : null });
      }
      add(area, [h('div', { class: 'q' }, label), promptEl, input, accentBar(input)]);
      setFoot(check);
    }

    ctx.onclose = () => { if (cleanup) cleanup(); };
    next();
  });
};
