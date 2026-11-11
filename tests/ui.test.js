// 在 jsdom 里把整个界面跑一遍：NODE_PATH=<jsdom 所在目录>/node_modules node tests/ui.test.js
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e.detail && e.detail.stack || e.stack || e.message)));
vc.on('error', (...a) => errors.push('console.error: ' + a.map(x => (x && x.stack) || x).join(' ')));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fail = 0;
const ok = (cond, msg) => { if (!cond) { fail++; console.log('FAIL', msg); } else console.log('  ok', msg); };

const LESSON = { notes: ['## 虚拟式\n讲解 *quiero que vengas*', '- 一\n- 二'], items: [['el deseo', '愿望'], ['ojalá', '但愿'], ['esperar', '希望'], ['pedir', '请求'], ['necesitar', '需要'], ['preferir', '更喜欢'],
  ['Quiero que vengas a mi casa', '我想让你来我家'], ['Espero que tengas suerte', '希望你好运'], ['Ojalá no llueva mañana', '但愿明天不下雨'], ['Te pido que me escuches', '我请你听我说'], ['Necesito que me ayudes hoy', '我需要你今天帮我'], ['Prefiero que lo hagas tú', '我更希望你来做']],
  drills: [['Quiero que ___ pronto.', 'vengas', ['vienes', 'venir', 'vendrás'], '愿望用虚拟式'], ['Espero que ___ bien.', 'estés', ['estás', 'estar', 'eres'], '']], dialog: [['A', '¿Qué quieres?', '你想要什么？'], ['B', 'Quiero que me ayudes.', '我想让你帮我。']] };
function reply(body) {
  const b = JSON.parse(body); const all = JSON.stringify(b);
  if (all.includes('请为下面这一课写完整内容')) return '```json\n' + JSON.stringify(LESSON) + '\n```';
  if (all.includes('再出一组新练习')) return JSON.stringify({ items: LESSON.items.slice(4), drills: LESSON.drills });
  if (all.includes('查词：')) return JSON.stringify({ lemma: 'tener', pos: '动词', ipa: '[teˈneɾ]', zh: ['有', '拥有'], forms: '', isVerb: true, examples: [['Tengo un perro', '我有一条狗']], colloc: ['tener hambre'], usage: '很常用', level: 'A1' });
  if (all.includes('<fix>')) return '<fix>Quiero un café, por favor｜quiero 要按 yo 变位</fix>\nClaro, ahora mismo. ¿Algo más?';
  if (all.includes('接下来可以说的 3 句')) return JSON.stringify([['Sí, gracias', '好的谢谢'], ['No, nada más', '不用了'], ['La cuenta', '买单']]);
  if (all.includes('西语短文')) return JSON.stringify({ title: 'La siesta', zh_title: '午睡', text: 'Primer párrafo de prueba.\n\nSegundo párrafo de prueba.', glossary: [['la siesta', '午睡']], questions: [{ q: '¿De qué habla?', opts: ['a', 'b', 'c', 'd'], a: 1, why: '因为' }] });
  if (all.includes('两人西语对话')) return JSON.stringify({ title: 'En el bar', zh_title: '在酒吧', lines: [['A', 'Hola', '你好'], ['B', 'Buenas', '你好'], ['A', '¿Qué tal?', '怎么样'], ['B', 'Bien', '好']], questions: [{ q: '¿Dónde están?', opts: ['bar', 'casa', 'cine', 'tren'], a: 0, why: '' }] });
  if (all.includes('写作题')) return JSON.stringify({ prompt: 'Describe tu ciudad', zh: '描述你的城市', words: '80–100' });
  return '## 标题\nHola **mundo**, esto es *una prueba*.\n\n| a | b |\n|---|---|\n| 1 | 2 |';
}

(async () => {
  const dom = await JSDOM.fromFile(path.join(__dirname, '..', 'Web', 'index.html'), { runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.TextDecoder = TextDecoder; w.TextEncoder = TextEncoder;
      w.Element.prototype.scrollIntoView = () => {};
      w.__calls = [];
      w.fetch = async (url, opts) => {
        w.__calls.push(url);
        if (/\/models$/.test(url)) return { status: 200, text: async () => JSON.stringify({ data: [{ id: 'deepseek-chat' }, { id: 'deepseek-v4-flash' }] }) };
        if (!/chat\/completions$/.test(url)) return { status: 404, text: async () => 'nf' };
        if (!/Bearer test-key/.test(opts.headers.Authorization)) return { status: 401, text: async () => '{"error":{"message":"bad key"}}' };
        const text = reply(opts.body);
        const pieces = text.match(/[\s\S]{1,7}/g);
        let sse = pieces.map(p => 'data: ' + JSON.stringify({ choices: [{ delta: { content: p } }] }) + '\n\n').join('') + 'data: [DONE]\n\n';
        const bytes = Buffer.from(sse, 'utf8'); const chunks = [];
        for (let i = 0; i < bytes.length; i += 23) chunks.push(bytes.subarray(i, i + 23));   // 故意把多字节字符和行切开
        let k = 0;
        return { status: 200, body: { getReader: () => ({ read: async () => (k < chunks.length ? { done: false, value: chunks[k++] } : { done: true }) }) } };
      };
    } });
  const w = dom.window, d = w.document;
  for (let i = 0; i < 100 && !w.__oleReady; i++) await sleep(50);
  ok(w.__oleReady, 'app boots');
  const $ = (s, r) => (r || d).querySelector(s), $$ = (s, r) => [...(r || d).querySelectorAll(s)];
  const click = el => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  const byText = (sel, t, r) => $$(sel, r).find(e => e.textContent.includes(t));
  const top = () => { const p = $$('#pages .page'); return p[p.length - 1]; };
  const type = (el, v) => { el.value = v; el.dispatchEvent(new w.Event('input', { bubbles: true })); };
  const back = async () => { click($('.back', top())); await sleep(300); };
  const E = code => w.eval(code);

  ok($$('#tabs button').length === 5, 'five tabs');
  ok($$('#tab .lrow').length === 16, 'A1 shows 16 lessons');
  for (const b of $$('#tabs button')) { click(b); await sleep(30); ok($('#tab').children.length > 1, 'tab renders: ' + b.textContent); }
  click($$('#tabs button')[0]); await sleep(30);

  // 课文 + 完整练一遍
  click($$('#tab .lrow')[2]); await sleep(120);
  ok(top().textContent.includes('自我介绍') && $$('.item', top()).length >= 12 && $('.md table', top()), 'lesson page content');
  click(byText('.btn', '开始练习', top())); await sleep(120);
  let steps = 0, types = new Set();
  while (steps++ < 500) {
    const p = top();
    if ($('.done-screen', p)) break;
    const cont = byText('.exfoot .btn', '继续', p);
    if (cont) { click(cont); await sleep(5); continue; }
    if ($('.cols', p)) { types.add('match'); const [L, Rr] = $$('.cols > div', p); for (const a of $$('.opt', L)) for (const b of $$('.opt', Rr)) { if (a.classList.contains('gone')) break; if (b.classList.contains('gone')) continue; click(a); click(b); } await sleep(5); continue; }
    if ($('.bank', p)) { types.add('build'); const tiles = $$('.bank .tile', p); (steps % 2 ? tiles : tiles.reverse()).forEach(click); click(byText('.exfoot .btn', '检查', p)); await sleep(5); continue; }
    const ta = $('.ex textarea', p);
    if (ta) { types.add('typed'); type(ta, steps % 2 ? 'hola' : 'soy chino'); click(byText('.exfoot .btn', '检查', p)); await sleep(5); continue; }
    const opts = $$('.ex .opt', p);
    if (opts.length) { types.add($('.blank', p) ? 'cloze' : $('.spk.big', p) ? 'listen' : 'mc'); click(opts[steps % opts.length]); await sleep(5); continue; }
    await sleep(20);
  }
  ok($('.done-screen', top()), 'exercise run reaches the end (' + steps + ' steps, types: ' + [...types].join(',') + ')');
  ok(types.size >= 5, 'saw at least 5 exercise types');
  click(byText('.exfoot .btn', '完成', top())); await sleep(300);
  ok(E('Store.state.lessons["a1-03"].done') === true && E('Object.keys(Store.state.cards).length') >= 12 && E('Store.todayXP()') >= 10, 'progress, cards and XP recorded');
  await back();

  // 复习
  click($$('#tabs button')[1]); await sleep(30);
  click(byText('#tab .btn', '开始复习')); await sleep(100);
  let n = 0;
  while (n++ < 200 && !$('.done-screen', top())) { const show = byText('.btn', '看答案', top()); if (show) click(show); const g = $$('.grades button', top()); if (g.length) click(g[n % 5 === 0 ? 0 : 2]); await sleep(3); }
  ok($('.done-screen', top()), 'review session completes');
  ok(E('Store.dueCards().length') === 0, 'no cards due after review');
  await back();
  click(byText('#tab .tool', '听写')); await sleep(100); ok($('.spk.big', top()), 'dictation from cards opens'); await back();

  // 工具
  click($$('#tabs button')[3]); await sleep(30);
  const tool = t => byText('#tab .tool', t);
  click(tool('动词变位')); await sleep(100);
  type($('input', top()), 'tener'); ok(top().textContent.includes('tuvieron') && top().textContent.includes('tuviésemos') && top().textContent.includes('no tengas'), 'conjugator shows tener');
  type($('input', top()), 'zzz'); ok(top().textContent.includes('动词原形'), 'conjugator rejects non-verb');
  type($('input', top()), 'bailar'); ok(top().textContent.includes('不在已核对'), 'conjugator flags unlisted verb'); await back();
  click(tool('变位训练')); await sleep(100); type($('input', top()), 'x'); click(byText('.btn', '检查', top())); ok(top().textContent.includes('不对') && byText('.btn', '下一个', top()), 'drill checks an answer'); click(byText('.btn', '下一个', top())); await back();
  click(tool('语法手册')); await sleep(100); ok($$('.lrow', top()).length === 16, 'grammar list'); click($$('.lrow', top())[3]); await sleep(100); ok($('.md table', top()), 'grammar page renders table'); await back(); await back();
  click(tool('母语资源')); await sleep(100); ok($$('.lrow', top()).length === 16, 'resources'); await back();
  click(tool('发音')); await sleep(100); click($$('.lrow', top())[1]); await sleep(100); ok($$('.card', top()).length >= 6, 'pron set'); await back(); await back();
  click(tool('分级测试')); await sleep(100); click(byText('.btn', '开始', top())); 
  for (let i = 0; i < 24; i++) { const q = E('PLACEMENT')[i]; click($$('.opt', top())[i < 9 ? q[3] : (q[3] + 1) % 4]); }
  ok($('.done-screen .n', top()).textContent === 'B1' && E('Store.settings().level') === 'B1', 'placement puts A1+A2-correct learner at B1'); click(byText('.btn', '开始学习', top())); await sleep(300);
  ok($$('#tab .lrow').length === 18 && $('#tab').textContent.includes('虚拟式入门'), 'B1 list shown');

  // 没有密钥时
  click($$('#tab .lrow')[0]); await sleep(100); ok(top().textContent.includes('去设置 AI'), 'AI lesson asks for setup without key'); await back();

  // AI 设置
  click($$('#tabs button')[4]); await sleep(30); click(byText('#tab .setrow', 'AI 设置')); await sleep(100);
  const ins = $$('input', top()); type(ins[2], 'wrong'); click(byText('.btn', '保存并测试', top())); await sleep(300);
  ok(top().textContent.includes('密钥无效'), 'bad key gives a readable error');
  type(ins[2], 'test-key'); click(byText('.btn', '保存并测试', top())); await sleep(400);
  ok(top().textContent.includes('连接成功'), 'good key connects');
  click(byText('.chip', '获取模型列表', top())); await sleep(300); const mo = byText('#overlay .opt', 'deepseek-v4-flash'); ok(mo, 'model list sheet'); click(mo); await sleep(300); ok(E('Store.settings().ai.model') === 'deepseek-v4-flash', 'model picked');
  await back();

  // AI 课
  click($$('#tabs button')[0]); await sleep(30); click($$('#tab .lrow')[0]); await sleep(100);
  click(byText('.btn', '生成这一课', top())); await sleep(600);
  ok($$('.item', top()).length === 12 && top().textContent.includes('Quiero que vengas'), 'AI lesson generated and shown'); ok(E('!!Store.gen["b1-01"]'), 'AI lesson cached');
  click(byText('.btn', 'AI 再出一组新题', top())); await sleep(600); ok($('.bar', top()) && $('.ex', top()), 'extra AI practice opens runner'); await back(); await back();

  // 对话
  click($$('#tabs button')[2]); await sleep(30);
  click(byText('#tab .lrow', '在酒吧点东西')); await sleep(100);
  ok(top().textContent.includes('¿Qué te pongo?'), 'scenario opener shown');
  type($('.chatbar textarea', top()), 'Yo querer un café'); click($('.cbtn.send', top())); await sleep(700);
  ok($('.fix b', top()) && $('.fix b', top()).textContent === 'Quiero un café, por favor' && top().textContent.includes('Claro, ahora mismo') && !top().textContent.includes('<fix>'), 'chat reply with correction parsed');
  click(byText('.pright button', '提示', top())); await sleep(500); const hint = byText('#overlay .opt', 'La cuenta'); ok(hint, 'hints sheet'); click(hint); await sleep(300); ok($('.chatbar textarea', top()).value === 'La cuenta', 'hint fills input');
  click($$('.msg.assistant .w', top())[0]); await sleep(500); ok($('#overlay .sheet') && $('#overlay .sheet').textContent.includes('拥有'), 'tap a word opens dictionary'); click($('#overlay .shade')); await sleep(300);
  await back();
  click(byText('#tab .lrow', '问老师')); await sleep(100); type($('.chatbar textarea', top()), 'ser 和 estar？'); click($('.cbtn.send', top())); await sleep(600); ok($('.msg.assistant .md table', top()), 'tutor answer renders markdown'); await back();

  // 阅读 / 听力 / 写作 / 查词
  click($$('#tabs button')[3]); await sleep(30);
  click(tool('阅读')); await sleep(300); ok(top().textContent.includes('读不到'), 'unreachable feed shows explanation, no crash');
  click(byText('.chip', 'AI 分级读物', top())); await sleep(50); click(byText('.btn', '生成一篇', top())); await sleep(600);
  ok(top().textContent.includes('Segundo párrafo') && top().textContent.includes('理解题'), 'graded reading opens in reader');
  click($$('.opt', top())[1]); ok($('.opt.right', top()), 'quiz marks answer'); click(byText('.chip', 'AI 精读', top())); await sleep(500); ok($('.card .md', top()), 'AI close reading streams in'); await back(); await back();
  click(tool('听力')); await sleep(100); click(byText('.btn', '生成一段对话', top())); await sleep(600); ok(top().textContent.includes('• • •'), 'listening hides text by default');
  click(byText('.chip', '显示原文', top())); ok(top().textContent.includes('¿Qué tal?'), 'listening reveals text'); click(byText('.btn', '从头播放', top())); await sleep(500); await back(); await back();
  click(tool('写作批改')); await sleep(100); click(byText('.chip', 'AI 出题', top())); await sleep(400); ok($$('textarea', top())[0].value.includes('Describe tu ciudad'), 'writing topic'); type($$('textarea', top())[1], 'Mi ciudad es muy grande y bonita.'); click(byText('.btn', '批改', top())); await sleep(500); ok($('.md table', top()), 'writing feedback'); await back();
  click(tool('查词')); await sleep(100); click(byText('.chip', '译成西语', top())); type($('textarea', top()), '你好'); click(byText('.btn', '开始', top())); await sleep(500); ok($('.md', top()), 'translate streams'); await back();

  // 我的 + 备份
  click($$('#tabs button')[4]); await sleep(50); ok($('#tab .week') && $('#tab').textContent.includes('DeepSeek ✓'), 'me tab');
  const dump = E('Store.exportAll()'); E('Store.resetProgress()'); ok(E('Object.keys(Store.state.cards).length') === 0, 'reset clears'); w.__dump = dump; E('Store.importAll(window.__dump)'); ok(E('Object.keys(Store.state.cards).length') >= 12, 'import restores');
  ok(!dump.includes('test-key'), 'backup does not contain the API key');

  await sleep(600);
  ok(errors.length === 0, 'no runtime errors' + (errors.length ? '\n' + errors.slice(0, 6).join('\n') : ''));
  console.log(fail ? fail + ' FAILED' : 'ALL PASSED');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('TEST CRASH', e); console.log(errors.slice(0, 5).join('\n')); process.exit(1); });
