'use strict';
/* 复习页：间隔重复的卡片、听写与默写。 */

Views.review = root => {
  const cards = Object.values(Store.state.cards);
  const due = Store.dueCards();
  add(root, [h('div', { class: 'title' }, 'Repaso'), h('div', { class: 'sub', style: 'margin-bottom:16px' }, '间隔复习：快忘的时候再见一面，记得最牢')]);

  if (!cards.length) {
    root.appendChild(h('div', { class: 'card empty' }, '还没有卡片。', h('br'), '学完一课，里面的词句会自动进到这里；', h('br'), '查词、阅读、对话时点 + 也会加进来。'));
    return;
  }
  const learned = cards.filter(c => c.ivl >= 21).length;
  add(root, [
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', null, due.length), h('span', null, '今天要复习')),
      h('div', { class: 'stat' }, h('b', null, cards.length), h('span', null, '全部卡片')),
      h('div', { class: 'stat' }, h('b', null, learned), h('span', null, '已掌握'))),
    h('div', { class: 'gap' }),
    h('button', { class: 'btn', disabled: !due.length, onclick: () => Views.reviewSession() }, due.length ? `开始复习（${Math.min(due.length, 30)} 张）` : '今天的都复习完了 ✓'),
    h('div', { class: 'sec' }, '换个方式练'),
    h('div', { class: 'tools' },
      h('button', { class: 'tool', onclick: () => Views.run('听写', Ex.fromCards(cards, 'dictation', 10)) }, h('b', null, 'Dictado'), h('span', null, '听写'), h('small', null, '听句子，写下来')),
      h('button', { class: 'tool', onclick: () => Views.run('默写', Ex.fromCards(cards, 'type', 10)) }, h('b', null, 'Traducir'), h('span', null, '默写'), h('small', null, '看中文，写西语'))),
    h('div', { class: 'sec' }, '全部卡片')
  ]);

  const search = h('input', { class: 'inp', placeholder: '搜索西语或中文', autocapitalize: 'off', autocorrect: 'off' });
  const list = h('div', { class: 'card' });
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    list.textContent = '';
    const shown = cards.filter(c => !q || c.es.toLowerCase().includes(q) || (c.zh || '').includes(q))
      .sort((a, b) => b.added - a.added).slice(0, 60);
    if (!shown.length) list.appendChild(h('div', { class: 'small mut center' }, '没有匹配的卡片'));
    shown.forEach(c => {
      const d = c.due - Store.today();
      const row = h('div', { class: 'item' },
        h('div', { class: 'grow' }, h('div', { class: 'e sel' }, c.es), h('div', { class: 'z' }, c.zh || '（未填释义）'),
          h('div', { class: 'n' }, d <= 0 ? '今天复习' : d + ' 天后复习')),
        spkBtn(c.es),
        h('button', { class: 'add', 'aria-label': '删除', onclick: async () => { if (await UI.confirm('删除这张卡片？', '删除')) { Store.removeCard(c.es); UI.renderTab(); } } }, '×'));
      list.appendChild(row);
    });
  };
  search.addEventListener('input', draw);
  add(root, [search, h('div', { class: 'gap' }), list]);
  draw();
};

Views.reviewSession = () => {
  const queue = Store.dueCards().slice(0, 30);
  if (!queue.length) { UI.toast('现在没有要复习的卡片'); return; }
  UI.push('复习', ctx => {
    const total = queue.length;
    let done = 0, again = 0;
    const bar = h('div', { class: 'bar', style: 'margin:0 0 16px' }, h('i'));
    const area = h('div');
    add(ctx.body, [bar, area]);
    const fmt = n => (n === 0 ? '马上' : n < 30 ? n + ' 天' : Math.round(n / 30) + ' 个月');

    function show() {
      bar.firstChild.style.width = Math.round(done / total * 100) + '%';
      area.textContent = '';
      TTS.stop();
      const c = queue.shift();
      if (!c) {
        Store.addXP(5 + done);
        add(area, [h('div', { class: 'done-screen' }, h('div', { class: 'n' }, done), h('div', { style: 'font:600 22px var(--es)' }, '¡Hecho!'),
          h('div', { class: 'mut' }, `复习了 ${done} 张` + (again ? `，其中 ${again} 张要再巩固` : '')), h('div', { class: 'gap' }),
          h('button', { class: 'btn', onclick: () => ctx.close() }, '完成'))]);
        return;
      }
      // 没有中文释义的卡片只能从西语出发；其余的轮流换方向，偏重“看中文想西语”
      const recall = c.zh && (c.reps % 3 !== 2);
      const front = h('div', { class: recall ? '' : 'big-es', style: recall ? 'font-size:20px;font-weight:600' : '' }, recall ? c.zh : c.es);
      const backBox = h('div');
      const card = h('div', { class: 'flash' }, h('div', { class: 'small mut' }, recall ? '用西语怎么说？' : '什么意思？'), front, backBox);
      const foot = h('div', { style: 'margin-top:14px' });
      const reveal = () => {
        backBox.textContent = '';
        add(backBox, [h('hr', { style: 'border:0;border-top:1px solid var(--line);width:60px;margin:8px auto' }),
          h('div', { class: recall ? 'big-es sel' : '', style: recall ? '' : 'font-size:19px;font-weight:600' }, recall ? esTap(c.es) : (c.zh || '（未填释义，点词可查）')),
          c.note ? h('div', { class: 'small', style: 'color:var(--gold)' }, c.note) : null,
          h('div', { style: 'margin-top:8px' }, spkBtn(c.es))]);
        if (Store.settings().autoSpeak) TTS.speak(c.es);
        foot.textContent = '';
        foot.appendChild(h('div', { class: 'grades' }, [['忘了', 0], ['有点难', 1], ['记得', 2], ['很熟', 3]].map(([label, g]) =>
          h('button', { class: 'g' + g, onclick: () => {
            Store.grade(c, g);
            if (g === 0) { again++; queue.push(c); } else done++;
            show();
          } }, label, h('small', null, fmt(Store.nextIvl(c, g)))))));
      };
      if (!recall && Store.settings().autoSpeak) TTS.speak(c.es);
      foot.appendChild(h('button', { class: 'btn', onclick: reveal }, '看答案'));
      add(area, [card, foot]);
    }
    show();
  });
};
