'use strict';
/* AI 客户端：兼容 OpenAI 格式（DeepSeek、通义千问、OpenAI、各种中转）和 Anthropic 格式（Claude）。 */
const AI = (() => {
  const PRESETS = {
    deepseek: { name: 'DeepSeek', kind: 'openai', base: 'https://api.deepseek.com', model: 'deepseek-chat', note: '国内可直连，价格低' },
    qwen: { name: '通义千问', kind: 'openai', base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', note: '国内可直连' },
    claude: { name: 'Claude', kind: 'anthropic', base: 'https://api.anthropic.com', model: 'claude-sonnet-5-5', note: '西语质量很好；国内需要代理' },
    openai: { name: 'OpenAI', kind: 'openai', base: 'https://api.openai.com/v1', model: '', note: '填好密钥后点「获取模型列表」选一个' },
    custom: { name: '自定义（OpenAI 兼容）', kind: 'openai', base: '', model: '', note: '任何兼容 /chat/completions 的服务或中转地址' }
  };
  let key = '';
  let seq = 0;

  const cfg = () => Store.settings().ai;
  const kind = () => (PRESETS[cfg().provider] || PRESETS.custom).kind;
  const base = () => String(cfg().base || '').trim().replace(/\/+$/, '');

  async function init() { try { key = (await Native.call('secretGet', { key: 'ai' })) || ''; } catch (_) { key = ''; } }
  async function setKey(k) { key = String(k || '').trim(); await Native.call('secretSet', { key: 'ai', value: key }); }
  const ready = () => !!(key && base() && cfg().model);

  function headers() {
    if (kind() === 'anthropic') return { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' };
    return { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };
  }
  function friendly(status, body) {
    let msg = '';
    try { const j = JSON.parse(body); msg = (j.error && (j.error.message || j.error.type)) || j.message || ''; } catch (_) { msg = String(body || '').slice(0, 160); }
    const head = status === 401 || status === 403 ? 'API 密钥无效或没有权限'
      : status === 402 ? '账户余额不足'
      : status === 404 ? '接口地址或模型名不对'
      : status === 429 ? '请求太频繁或额度用完，稍后再试'
      : status >= 500 ? 'AI 服务暂时出错' : '请求失败';
    return head + '（' + status + '）' + (msg ? '：' + msg : '');
  }

  /**
   * 发起一次对话，流式返回。
   * opts: {system, messages:[{role,content}], onDelta(textSoFar), max, ctl}
   * ctl 是一个空对象，调用后会得到 ctl.cancel()
   */
  async function chat(opts) {
    if (!ready()) throw new Error('还没有设置 AI：到「我的 → AI 设置」填写密钥');
    const anth = kind() === 'anthropic';
    const url = base() + (anth ? '/v1/messages' : '/chat/completions');
    const body = anth
      ? { model: cfg().model, max_tokens: opts.max || 4096, system: opts.system || '', messages: opts.messages, stream: true }
      : { model: cfg().model, messages: [{ role: 'system', content: opts.system || '' }].concat(opts.messages), stream: true };
    const sid = 's' + (++seq) + '-' + Date.now();
    let full = '', buf = '', raw = '', streamErr = null;

    const off = Native.on('stream', d => {
      if (d.sid !== sid) return;
      raw += d.chunk; buf += d.chunk;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        let j;
        try { j = JSON.parse(data); } catch (_) { continue; }
        if (j.error) { streamErr = j.error.message || JSON.stringify(j.error); continue; }
        let piece = '';
        if (anth) { if (j.type === 'content_block_delta' && j.delta && j.delta.type === 'text_delta') piece = j.delta.text || ''; }
        else if (j.choices && j.choices[0] && j.choices[0].delta) piece = j.choices[0].delta.content || '';
        if (piece) { full += piece; if (opts.onDelta) opts.onDelta(full); }
      }
    });
    if (opts.ctl) opts.ctl.cancel = () => Native.call('httpCancel', { sid }).catch(() => {});

    let r;
    try {
      r = await Native.call('httpStream', { sid, url, method: 'POST', headers: headers(), body: JSON.stringify(body), timeout: 180 });
    } catch (e) {
      off();
      if (e.message === 'cancelled') { const x = new Error('cancelled'); x.cancelled = true; x.partial = full; throw x; }
      throw new Error('连不上 AI 服务：' + e.message);
    }
    off();
    if (r.status >= 400 || !r.status) throw new Error(friendly(r.status, r.body));
    if (!full && raw) {
      // 有些服务不支持流式，直接回了完整 JSON
      try {
        const j = JSON.parse(raw);
        if (j.choices && j.choices[0] && j.choices[0].message) full = j.choices[0].message.content || '';
        else if (Array.isArray(j.content)) full = j.content.map(c => c.text || '').join('');
        else if (j.error) streamErr = j.error.message || 'error';
      } catch (_) { /* ignore */ }
      if (full && opts.onDelta) opts.onDelta(full);
    }
    if (!full) throw new Error(streamErr ? 'AI 返回错误：' + streamErr : 'AI 没有返回内容，请重试');
    return full;
  }

  /** 从模型输出里取出 JSON（容忍代码块、前后说明文字） */
  function extractJSON(text) {
    let t = String(text).replace(/```(?:json)?/gi, '').trim();
    const a = t.search(/[\[{]/);
    if (a < 0) throw new Error('no json');
    const open = t[a], close = open === '{' ? '}' : ']';
    const b = t.lastIndexOf(close);
    if (b <= a) throw new Error('no json');
    t = t.slice(a, b + 1);
    try { return JSON.parse(t); }
    catch (_) { return JSON.parse(t.replace(/,\s*([}\]])/g, '$1').replace(/[\u0000-\u001f]+/g, ' ')); }
  }
  async function json(opts) {
    const sys = (opts.system || '') + '\n\n只输出一个合法的 JSON，不要有任何解释、前后缀或代码块标记。字符串里不要出现未转义的英文双引号和换行。';
    let lastErr;
    for (let attempt = 0; attempt < 2; attempt++) {
      const text = await chat(Object.assign({}, opts, { system: sys }));
      try { return extractJSON(text); } catch (e) { lastErr = e; }
    }
    throw new Error('AI 返回的内容格式不对，请再试一次');
  }

  async function models() {
    if (!key || !base()) throw new Error('先填写接口地址和密钥');
    const url = base() + (kind() === 'anthropic' ? '/v1/models' : '/models');
    const r = await Native.call('http', { url, method: 'GET', headers: headers(), timeout: 30 });
    if (r.status >= 400 || !r.status) throw new Error(friendly(r.status, r.body));
    const j = JSON.parse(r.body);
    const list = (j.data || j.models || []).map(m => m.id || m.name).filter(Boolean);
    if (!list.length) throw new Error('没有拿到模型列表');
    return list;
  }

  /* ---------- 提示词 ---------- */
  function persona() {
    const s = Store.settings();
    const v = s.variant === 'es-ES'
      ? '西班牙本土西语（castellano peninsular：用 vosotros，用西班牙的词汇和口语，比如 ordenador、móvil、coche、vale）'
      : '拉丁美洲通用西语（用 ustedes 代替 vosotros，用拉美通用词汇，比如 computadora、celular、carro）';
    return `学习者母语是中文，正在学${v}，目前水平大约 ${s.level}。` + (s.profile ? `学习者的个人背景：${s.profile}。举例时可以适当贴近。` : '');
  }

  const P = {
    lesson(entry) {
      return {
        system: `你是经验丰富的西班牙语教师，按塞万提斯学院课程大纲（PCIC）和 CEFR 备课。${persona()}\n讲解用简体中文，所有西语必须地道、自然、完全正确，重音符号和 ¿¡ 不能缺。`,
        messages: [{ role: 'user', content:
`请为下面这一课写完整内容。
级别：${entry.lv}　单元：${entry.unit}　课题：${entry.title}
教学要点：${entry.spec}

输出 JSON，结构如下：
{
 "notes": ["## 小标题\\n中文讲解，西语例子用 *星号* 包起来；可以用以 - 开头的列表行，或 | 列 | 列 | 的表格行", "…共 3–5 段，循序渐进，讲清规则、用法区别和中国学习者常见错误"],
 "items": [["西语词或句子", "中文意思", "可选的用法备注"], "…共 14 条：先 6 个本课核心词/短语，再 8 个完整例句，难度符合 ${entry.lv}"],
 "drills": [["带 ___ 的西语句子（只留一个空）", "正确答案", ["干扰项1", "干扰项2", "干扰项3"], "一句中文解释为什么"], "…共 8 题，紧扣本课语法点"],
 "dialog": [["A", "西语台词", "中文翻译"], ["B", "…", "…"], "…共 6–8 句，自然的生活或工作场景，用到本课内容"]
}` }],
        max: 6000
      };
    },
    extra(lesson) {
      return {
        system: `你是西班牙语教师。${persona()}`,
        messages: [{ role: 'user', content:
`针对「${lesson.title}」（${lesson.lv}）这一课再出一组新练习，不要和这些已有句子重复：${(lesson.items || []).slice(0, 8).map(i => i[0]).join(' / ')}
输出 JSON：{"items":[["西语句子","中文"], …8 条新例句],"drills":[["带 ___ 的句子","答案",["干扰1","干扰2","干扰3"],"中文解释"], …8 题]}` }],
        max: 4000
      };
    },
    dict(word, context) {
      return {
        system: `你是面向中文母语者的西班牙语词典。${persona()}`,
        messages: [{ role: 'user', content:
`查词：「${word}」${context ? '\n它出现在这句话里：' + context : ''}
输出 JSON：
{"lemma":"词典原形","pos":"词性（中文，名词要标阴阳性）","ipa":"音标","zh":["中文释义1","释义2"],"forms":"如果查的是变位或变形，说明是哪个原形的什么形式；否则留空","isVerb":true或false,"examples":[["西语例句","中文"],["…","…"],["…","…"]],"colloc":["常见搭配1","搭配2","搭配3"],"usage":"用法提示：语域、西班牙与拉美差异、易混词，1–3 句中文","level":"CEFR 级别"}` }],
        max: 1500
      };
    },
    reading(level, topic) {
      return {
        system: `你是西班牙语分级读物作者。${persona()}`,
        messages: [{ role: 'user', content:
`写一篇 ${level} 水平的西语短文，主题：${topic || '自选一个有意思的、与西班牙语国家生活或文化有关的主题'}。
长度：${{ A1: '80–120', A2: '130–180', B1: '200–280', B2: '300–400', C1: '400–520', C2: '500–650' }[level] || '250'} 个词。语言自然地道，词汇和语法严格控制在该级别。
输出 JSON：{"title":"西语标题","zh_title":"中文标题","text":"正文，段落之间用 \\n\\n 分隔","glossary":[["生词或短语","中文"], …8–12 条],"questions":[{"q":"西语理解题","opts":["选项A","选项B","选项C","选项D"],"a":正确选项下标0-3,"why":"中文解释"}, …4 题]}` }],
        max: 5000
      };
    },
    listening(level, topic) {
      return {
        system: `你是西班牙语听力材料编写者。${persona()}`,
        messages: [{ role: 'user', content:
`写一段 ${level} 水平的两人西语对话（说话人 A 和 B），场景：${topic || '自选一个真实的日常场景'}。口语要真实自然，有语气词和日常说法，共 12–16 句。
输出 JSON：{"title":"西语标题","zh_title":"中文标题","lines":[["A","西语台词","中文翻译"],["B","…","…"]],"questions":[{"q":"西语听力理解题","opts":["A","B","C","D"],"a":0,"why":"中文解释"}, …4 题]}` }],
        max: 5000
      };
    },
    article(text) {
      return {
        system: `你是西班牙语精读老师。${persona()}用简体中文讲解，用 Markdown 输出。`,
        messages: [{ role: 'user', content:
`精读下面这篇西语文章，输出：
## 内容概要（3–4 句中文）
## 重点词汇和表达（10–15 个：西语 — 中文 — 一句用法说明）
## 值得学的句子（3 句，分析结构和语法）
## 文化背景（如有）

文章：
${text.slice(0, 6000)}` }],
        max: 4000
      };
    },
    analyze(text, mode) {
      const task = mode === 'toEs'
        ? `把下面的内容翻译成地道的西语。先给最自然的译法，再给 1–2 个不同语域的说法（正式/口语），最后用中文简短说明用词和语法要点。\n\n${text}`
        : mode === 'toZh'
          ? `把下面的西语翻译成自然的中文，然后列出其中值得学的词汇和表达（西语 — 中文 — 说明）。\n\n${text}`
          : `逐句精读下面的西语：给出中文翻译，拆解句子结构，说明每个动词的时态语气和为什么这样用，指出固定搭配和习惯表达。\n\n${text}`;
      return { system: `你是西班牙语老师。${persona()}用简体中文讲解，用 Markdown 输出，西语例子用 *星号* 包起来。`, messages: [{ role: 'user', content: task }], max: 4000 };
    },
    writingTopic(level) {
      return {
        system: `你是 DELE 考官。${persona()}`,
        messages: [{ role: 'user', content: `出一道 ${level} 水平的西语写作题。输出 JSON：{"prompt":"西语题目要求","zh":"中文说明","words":"建议词数，例如 80–100"}` }],
        max: 600
      };
    },
    writing(level, topic, text) {
      return {
        system: `你是严格而友善的 DELE 写作考官。${persona()}用简体中文点评，用 Markdown 输出。`,
        messages: [{ role: 'user', content:
`批改这篇西语作文（学习者目标级别 ${level}）。${topic ? '题目：' + topic : ''}

作文：
${text}

按这个结构输出：
## 总评
实际水平（CEFR）和 10 分制分数，2–3 句总体评价。
## 逐条修改
用表格：| 原文 | 改正 | 原因 |（语法、拼写、重音、用词、搭配都要查）
## 改正后的全文
## 母语者会怎么写
同样的内容，用更地道的方式重写一遍。
## 下一步练什么
2–3 条具体建议。` }],
        max: 5000
      };
    },
    chatSystem(sc) {
      const s = Store.settings();
      if (sc.tutor) {
        return `你是耐心的西班牙语老师，用简体中文回答学习者关于西语语法、词汇、用法、文化的任何问题。${persona()}回答要准确、有例句（西语例子用 *星号* 包起来并附中文），讲清楚规则背后的逻辑，指出西班牙与拉美的差异。可以用 Markdown。`;
      }
      return `你在和一位西班牙语学习者做口语对话练习。${persona()}
${sc.role ? '情景设定：' + sc.role : '自由聊天：像朋友一样聊天，主动提问，把对话推进下去。'}

规则：
1. 始终用西语回复，用词和句子长度贴合学习者的水平（${s.level}），每次 1–3 句，像真人说话，结尾尽量带一个问题或推动情节。
2. 每次回复都必须以一行 <fix>…</fix> 开头，用来批改学习者上一句话：
   - 如果那句话有语法、拼写、用词或不地道的地方：<fix>改正后的完整西语句子｜一句简短的中文解释</fix>
   - 如果那句话完全正确自然：<fix>OK</fix>
   - 如果学习者说的是中文或英文：<fix>这句话地道的西语说法｜（中文提示：试着用西语说）</fix>
3. <fix> 之后换行，再写你的西语回复。除了 <fix> 里的解释，不要出现中文。
4. 不要跳出角色，不要解释规则。`;
    },
    hints(history) {
      return {
        system: `你帮助西班牙语学习者想出下一句该说什么。${persona()}`,
        messages: [{ role: 'user', content: `下面是一段对话，请给出学习者接下来可以说的 3 句不同的西语回答（由易到难）。\n\n${history}\n\n输出 JSON：[["西语","中文"],["西语","中文"],["西语","中文"]]` }],
        max: 800
      };
    },
    translate(text) {
      return { system: '你是翻译。把用户给的西语准确翻译成自然的简体中文，只输出译文。', messages: [{ role: 'user', content: text }], max: 1000 };
    }
  };

  return { PRESETS, init, setKey, ready, chat, json, models, extractJSON, P, get hasKey() { return !!key; }, kind };
})();
