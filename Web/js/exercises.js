'use strict';
/* 练习题的生成与判分（纯逻辑，不碰界面）。 */
const Ex = (() => {
  const deacc = s => s.replace(/[áéíóúü]/g, c => 'aeiouu'['áéíóúü'.indexOf(c)]);
  const norm = s => String(s).toLowerCase().replace(/[¿?¡!.,;:"“”«»()…—–-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = s => norm(s).split(' ').filter(Boolean);
  const isSentence = es => words(es).length >= 3;

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const pick = (a, n) => shuffle(a).slice(0, n);

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }

  /** 判断输入：exact 完全正确 / accent 只差重音 / typo 小笔误 / wrong 错误 */
  function check(input, answer) {
    const a = norm(input), b = norm(answer);
    if (!a) return { ok: false, kind: 'wrong' };
    if (a === b) return { ok: true, kind: 'exact' };
    if (deacc(a) === deacc(b)) return { ok: true, kind: 'accent' };
    if (b.length >= 6 && lev(deacc(a), deacc(b)) <= (b.length >= 20 ? 2 : 1)) return { ok: true, kind: 'typo' };
    return { ok: false, kind: 'wrong' };
  }

  /** 口语打分：识别结果与目标句逐词对齐（最长公共子序列） */
  function scoreSpeech(target, heard) {
    const t = words(target), hw = words(heard).map(deacc);
    const tn = t.map(deacc);
    const m = tn.length, n = hw.length;
    const same = (x, y) => x === y || (x.length >= 5 && lev(x, y) <= 1);
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--)
      dp[i][j] = same(tn[i], hw[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const marks = new Array(m).fill(false);
    let i = 0, j = 0;
    while (i < m && j < n) {
      if (same(tn[i], hw[j])) { marks[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
    }
    const hit = marks.filter(Boolean).length;
    return { score: m ? hit / m : 0, words: t.map((w, k) => ({ w, ok: marks[k] })) };
  }

  function distractors(correct, candidates, n) {
    const seen = new Set([norm(correct)]);
    const out = [];
    for (const c of shuffle(candidates)) {
      const k = norm(c);
      if (!k || seen.has(k)) continue;
      seen.add(k); out.push(c);
      if (out.length >= n) break;
    }
    return out;
  }

  /**
   * 为一课生成一组练习。
   * lesson: {items:[[es,zh,note]], drills:[[sentence, answer, [opts], why]]}
   * pool: 其他课的 items，用来凑干扰项
   */
  function make(lesson, pool, opts) {
    opts = opts || {};
    const items = (lesson.items || []).filter(i => i && i[0] && i[1]).map(i => ({ es: i[0], zh: i[1] }));
    const poolItems = (pool || []).map(i => ({ es: i[0], zh: i[1] }));
    const ws = items.filter(i => !isSentence(i.es)), ss = items.filter(i => isSentence(i.es));
    const poolW = poolItems.filter(i => !isSentence(i.es)), poolS = poolItems.filter(i => isSentence(i.es));
    const out = [];
    const optsFor = (it, field, sentence) => {
      const own = (sentence ? ss : ws).filter(x => x !== it).map(x => x[field]);
      let d = distractors(it[field], own, 3);
      if (d.length < 3) d = d.concat(distractors(it[field], (sentence ? poolS : poolW).map(x => x[field]).filter(x => !d.includes(x)), 3 - d.length));
      if (d.length < 3) d = d.concat(distractors(it[field], poolItems.concat(items).map(x => x[field]).filter(x => !d.includes(x)), 3 - d.length));
      return shuffle([it[field]].concat(d));
    };

    pick(ws, 7).forEach((it, k) => {
      const t = k % 3;
      if (t === 0) out.push({ type: 'mc', dir: 'es2zh', prompt: it.es, answer: it.zh, options: optsFor(it, 'zh', false), item: it });
      else if (t === 1) out.push({ type: 'mc', dir: 'zh2es', prompt: it.zh, answer: it.es, options: optsFor(it, 'es', false), item: it });
      else out.push({ type: 'listen', audio: it.es, answer: it.es, options: optsFor(it, 'es', false), item: it });
    });
    if (ws.length >= 4) out.push({ type: 'match', pairs: pick(ws, Math.min(5, ws.length)) });

    pick(ss, 6).forEach((it, k) => {
      const t = k % 4;
      if (t === 0 || t === 2) {
        const toks = it.es.split(/\s+/);
        const extra = distractors('', shuffle(ss.filter(x => x !== it).concat(poolS)).slice(0, 6).flatMap(x => x.es.split(/\s+/)).filter(w => !toks.some(tk => norm(tk) === norm(w))), 2);
        out.push({ type: 'build', prompt: it.zh, answer: it.es, tiles: shuffle(toks.concat(extra)), item: it });
      } else if (t === 1) out.push({ type: 'dictation', audio: it.es, answer: it.es, item: it });
      else if (opts.speaking) out.push({ type: 'speak', prompt: it.es, zh: it.zh, answer: it.es, item: it });
      else out.push({ type: 'type', prompt: it.zh, answer: it.es, item: it });
    });
    if (ws.length) { const it = pick(ws, 1)[0]; out.push({ type: 'type', prompt: it.zh, answer: it.es, item: it }); }

    pick((lesson.drills || []).filter(d => d && d[0] && d[1] && /_{2,}/.test(d[0])), 8).forEach(d => {
      const wrong = distractors(d[1], (d[2] || []).filter(x => norm(x) !== norm(d[1])), 3);
      out.push({ type: 'cloze', prompt: d[0], answer: d[1], options: shuffle([d[1]].concat(wrong)), why: d[3] || '' });
    });

    // 先易后难：选择题在前，句子和填空穿插在后
    const easy = out.filter(e => e.type === 'mc' || e.type === 'listen' || e.type === 'match');
    const hard = shuffle(out.filter(e => !easy.includes(e)));
    return shuffle(easy).concat(hard);
  }

  /** 从复习卡片里出听写/翻译题 */
  function fromCards(cards, type, n) {
    const src = type === 'dictation' ? cards.filter(c => words(c.es).length >= 2) : cards;
    return pick(src, n).map(c => type === 'dictation'
      ? { type: 'dictation', audio: c.es, answer: c.es, item: c }
      : { type: 'type', prompt: c.zh, answer: c.es, item: c });
  }

  return { norm, deacc, words, isSentence, shuffle, pick, lev, check, scoreSpeech, make, fromCards };
})();
if (typeof module !== 'undefined') module.exports = Ex;
