'use strict';
/* 学习数据：设置、课程进度、复习卡片、统计，以及 AI 生成内容的缓存。 */
const Store = (() => {
  const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
  const dayKey = n => new Date(n * 86400000).toISOString().slice(0, 10);

  const defaults = () => ({
    v: 1,
    settings: {
      variant: 'es-ES', rate: 0.9, goal: 30, speaking: true, autoSpeak: true,
      level: 'A1', profile: '', voiceId: '',
      reminder: { on: false, h: 20, m: 0 },
      ai: { provider: 'deepseek', base: 'https://api.deepseek.com', model: 'deepseek-chat' },
      feeds: [
        { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' },
        { name: 'El Mundo', url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml' },
        { name: 'RTVE Noticias', url: 'https://www.rtve.es/api/noticias.rss' },
        { name: '20minutos', url: 'https://www.20minutos.es/rss/' },
        { name: 'elDiario.es', url: 'https://www.eldiario.es/rss/' },
        { name: 'BBC Mundo', url: 'https://feeds.bbci.co.uk/mundo/rss.xml' }
      ]
    },
    lessons: {}, cards: {}, days: {}, xp: 0, chats: {}, placed: false
  });

  let S = defaults();
  const blobs = { gen: {}, cache: {}, lib: { readings: [], audios: [] } };
  const timers = {};

  function merge(base, extra) {
    if (!extra || typeof extra !== 'object') return base;
    for (const k in extra) {
      const v = extra[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], v);
      else base[k] = v;
    }
    return base;
  }
  async function readBlob(key) {
    try { const s = await Native.call('load', { key }); return s ? JSON.parse(s) : null; } catch (_) { return null; }
  }
  async function init() {
    const st = await readBlob('state');
    S = merge(defaults(), st);
    for (const k of Object.keys(blobs)) { const v = await readBlob(k); if (v) blobs[k] = merge(blobs[k], v); }
    document.addEventListener('visibilitychange', () => { if (document.hidden) flushAll(); });
  }
  function valueOf(which) { return which === 'state' ? S : blobs[which]; }
  function flush(which) {
    clearTimeout(timers[which]); delete timers[which];
    return Native.call('save', { key: which, value: JSON.stringify(valueOf(which)) }).catch(() => {});
  }
  function save(which) {
    which = which || 'state';
    clearTimeout(timers[which]);
    timers[which] = setTimeout(() => flush(which), 400);
  }
  function flushAll() { Object.keys(timers).forEach(flush); }

  /* ----- 统计 ----- */
  function addXP(n) {
    const k = dayKey(today());
    const d = S.days[k] || (S.days[k] = { xp: 0, n: 0 });
    d.xp += n; d.n += 1; S.xp += n;
    save();
  }
  function todayXP() { const d = S.days[dayKey(today())]; return d ? d.xp : 0; }
  function streak() {
    let t = today(), n = 0;
    if (!(S.days[dayKey(t)] && S.days[dayKey(t)].xp > 0)) t -= 1;
    while (S.days[dayKey(t)] && S.days[dayKey(t)].xp > 0) { n++; t--; }
    return n;
  }
  function week() {
    const t = today(), out = [];
    for (let i = 6; i >= 0; i--) {
      const k = dayKey(t - i);
      out.push({ key: k, label: '日一二三四五六'[new Date((t - i) * 86400000).getUTCDay()], xp: S.days[k] ? S.days[k].xp : 0 });
    }
    return out;
  }

  /* ----- 课程进度 ----- */
  function lessonDone(id, score) {
    const p = S.lessons[id] || (S.lessons[id] = { n: 0, best: 0 });
    p.done = true; p.n += 1; p.best = Math.max(p.best || 0, score); p.ts = Date.now();
    save();
  }

  /* ----- 间隔复习（SM-2 的四档变体） ----- */
  const cardKey = es => String(es).toLowerCase().replace(/[¿?¡!.,;:"«»()…]/g, '').replace(/\s+/g, ' ').trim();
  function addCard(es, zh, note, src) {
    const k = cardKey(es);
    if (!k || S.cards[k]) return false;
    S.cards[k] = { es, zh: zh || '', note: note || '', src: src || '', due: today(), ivl: 0, ease: 2.5, reps: 0, lapses: 0, added: Date.now() };
    save();
    return true;
  }
  function hasCard(es) { return !!S.cards[cardKey(es)]; }
  function removeCard(es) { delete S.cards[cardKey(es)]; save(); }
  function nextIvl(c, g) {
    if (g === 0) return 0;
    if (g === 1) return Math.max(1, Math.round((c.ivl || 1) * 1.2));
    if (g === 2) return c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.max(c.ivl + 1, Math.round(c.ivl * c.ease));
    return c.reps === 0 ? 3 : Math.max(c.ivl + 2, Math.round((c.ivl || 1) * c.ease * 1.3));
  }
  function grade(c, g) {
    const ivl = nextIvl(c, g);
    if (g === 0) { c.reps = 0; c.lapses += 1; c.ease = Math.max(1.3, c.ease - 0.2); }
    else { if (g === 1) c.ease = Math.max(1.3, c.ease - 0.15); if (g === 3) c.ease += 0.15; c.reps += 1; }
    c.ivl = ivl; c.due = today() + ivl; c.last = Date.now();
    save();
  }
  function dueCards() {
    const t = today();
    return Object.values(S.cards).filter(c => c.due <= t).sort((a, b) => a.due - b.due || a.added - b.added);
  }

  /* ----- 缓存 ----- */
  function cacheGet(k) { const e = blobs.cache[k]; if (!e) return null; e.t = Date.now(); return e.v; }
  function cacheSet(k, v) {
    blobs.cache[k] = { t: Date.now(), v };
    const keys = Object.keys(blobs.cache);
    if (keys.length > 800) keys.sort((a, b) => blobs.cache[a].t - blobs.cache[b].t).slice(0, 200).forEach(x => delete blobs.cache[x]);
    save('cache');
  }

  function exportAll() { return JSON.stringify({ app: 'ole', state: S, gen: blobs.gen, lib: blobs.lib }); }
  function importAll(text) {
    const o = JSON.parse(text);
    if (!o || o.app !== 'ole' || !o.state) throw new Error('不是 Olé 的备份数据');
    S = merge(defaults(), o.state);
    if (o.gen) blobs.gen = o.gen;
    if (o.lib) blobs.lib = merge({ readings: [], audios: [] }, o.lib);
    ['state', 'gen', 'lib'].forEach(flush);
  }
  function resetProgress() {
    const keep = S.settings;
    S = defaults(); S.settings = keep;
    flush('state');
  }

  return {
    init, save, flushAll, today, dayKey,
    get state() { return S; },
    settings: () => S.settings,
    get gen() { return blobs.gen; },
    get lib() { return blobs.lib; },
    addXP, todayXP, streak, week, lessonDone,
    cardKey, addCard, hasCard, removeCard, nextIvl, grade, dueCards,
    cacheGet, cacheSet, exportAll, importAll, resetProgress,
    clearGen() { blobs.gen = {}; blobs.cache = {}; flush('gen'); flush('cache'); }
  };
})();
