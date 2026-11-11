// 课程数据与练习生成的检查：node tests/data.test.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = { console, module: undefined };
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'Web', f), 'utf8') , ctx, { filename: f });
['data/course-a1.js', 'data/course-a2.js', 'data/extra.js', 'js/exercises.js'].forEach(load);
const g = n => vm.runInContext(n, ctx);
const COURSE = g('COURSE'), SYLLABUS = g('SYLLABUS'), Ex = g('Ex'), PLACEMENT = g('PLACEMENT'), SCENARIOS = g('SCENARIOS'), GRAMMAR = g('GRAMMAR'), PRON = g('PRON'), LEVELS = g('LEVELS');
let fail = 0; const bad = m => { fail++; console.log('FAIL', m); };
const ids = new Set();
for (const l of COURSE) {
  if (ids.has(l.id)) bad('dup id ' + l.id); ids.add(l.id);
  if (!l.title || !l.unit || !l.lv || !l.goal) bad(l.id + ' meta');
  if (!(l.notes || []).length) bad(l.id + ' notes');
  if ((l.items || []).length < 12) bad(l.id + ' items ' + (l.items || []).length);
  const seen = new Set();
  for (const it of l.items) { if (!it[0] || !it[1]) bad(l.id + ' item ' + it); const k = Ex.norm(it[0]); if (seen.has(k)) bad(l.id + ' dup item ' + it[0]); seen.add(k); }
  if (l.items.filter(i => Ex.isSentence(i[0])).length < 4) bad(l.id + ' too few sentences');
  if (l.items.filter(i => !Ex.isSentence(i[0])).length < 4) bad(l.id + ' too few words');
  if ((l.drills || []).length < 4) bad(l.id + ' drills');
  for (const d of l.drills) {
    if ((d[0].match(/_{2,}/g) || []).length !== 1) bad(l.id + ' blank count: ' + d[0]);
    if (d[2].length !== 3) bad(l.id + ' distractors: ' + d[0]);
    if (d[2].some(x => Ex.norm(x) === Ex.norm(d[1]))) bad(l.id + ' answer among distractors: ' + d[0]);
    if (new Set(d[2].map(Ex.norm)).size !== 3) bad(l.id + ' dup distractor: ' + d[0]);
  }
  if ((l.dialog || []).length < 4) bad(l.id + ' dialog');
  for (let r = 0; r < 20; r++) {
    const exs = Ex.make(l, COURSE.flatMap(x => x.items), { speaking: r % 2 === 0 });
    if (exs.length < 12) bad(l.id + ' few exercises ' + exs.length);
    for (const e of exs) {
      if (e.options) {
        if (e.options.length !== 4) bad(l.id + ' options!=4 ' + e.type + ' ' + e.answer + ' -> ' + e.options);
        if (new Set(e.options.map(Ex.norm)).size !== e.options.length) bad(l.id + ' dup options ' + e.options);
        if (e.options.filter(o => Ex.norm(o) === Ex.norm(e.answer)).length !== 1) bad(l.id + ' answer not unique ' + e.answer);
      }
      if (e.type === 'build') { const need = e.answer.split(/\s+/); for (const w of need) if (!e.tiles.includes(w)) bad(l.id + ' tile missing'); }
    }
  }
}
for (const s of SYLLABUS) { if (ids.has(s[0])) bad('dup ' + s[0]); ids.add(s[0]); if (s.length !== 5 || s.some(x => !x)) bad('syllabus ' + s[0]); }
for (const lv of LEVELS) { const n = COURSE.filter(l => l.lv === lv[0]).length + SYLLABUS.filter(s => s[1] === lv[0]).length; if (!n) bad('no lessons ' + lv[0]); console.log(lv[0], n, 'lessons'); }
for (const lv of LEVELS) if (PLACEMENT.filter(q => q[0] === lv[0]).length !== 4) bad('placement ' + lv[0]);
for (const q of PLACEMENT) if (q[2].length !== 4 || q[3] < 0 || q[3] > 3) bad('placement q ' + q[1]);
for (const s of SCENARIOS) if (s.length !== 6 || s.some(x => !x)) bad('scenario ' + s[0]);
for (const x of GRAMMAR) if (x.length !== 3) bad('grammar ' + x[0]);
for (const x of PRON) if (x.length !== 3 || !x[2].length) bad('pron ' + x[0]);
// 判分
const c = (a, b) => Ex.check(a, b).kind;
if (c('¿Cómo estás?', '¿Cómo estás?') !== 'exact') bad('check exact');
if (c('como estas', '¿Cómo estás?') !== 'accent') bad('check accent');
if (c('Tengo vientiocho años', 'Tengo veintiocho años') !== 'typo') bad('check typo');
if (c('Tengo treinta años', 'Tengo veintiocho años') !== 'wrong') bad('check wrong');
if (c('si', 'no') !== 'wrong') bad('short wrong');
const sp = Ex.scoreSpeech('El perro de San Roque no tiene rabo', 'el pero de san roque tiene rabo');
if (Math.abs(sp.score - 7 / 8) > 0.01) bad('speech score ' + sp.score);
console.log(COURSE.length, 'built-in lessons,', SYLLABUS.length, 'AI lessons,', fail, 'failures');
process.exit(fail ? 1 : 0);
