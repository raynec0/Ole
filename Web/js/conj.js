'use strict';
/* 西班牙语动词变位引擎：规则变位 + 词干变化 + 正字法变化 + 不规则动词。全部离线计算。 */
const Conj = (() => {
  const PERSONS = ['yo', 'tú', 'él / ella / usted', 'nosotros', 'vosotros', 'ellos / ustedes'];
  const R = [0, 1, 2, 3, 4, 5];
  const E = {
    pres: { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] },
    pret: { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] },
    impf: { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
    fut: ['é', 'ás', 'á', 'emos', 'éis', 'án'],
    cond: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
    subj: { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'] }
  };
  E.pret.ir = E.pret.er; E.impf.ir = E.impf.er; E.subj.ir = E.subj.er;
  const STRONG = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
  const ACC = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
  const deacc = s => s.replace(/[áéíóú]/g, c => 'aeiou'['áéíóú'.indexOf(c)]);
  const accentLast = s => {
    for (let i = s.length - 1; i >= 0; i--) {
      if ('áéíóú'.includes(s[i])) return s;
      if (ACC[s[i]]) return s.slice(0, i) + ACC[s[i]] + s.slice(i + 1);
    }
    return s;
  };
  const repLast = (s, a, b) => { const i = s.lastIndexOf(a); return i < 0 ? s : s.slice(0, i) + b + s.slice(i + a.length); };
  const set = str => new Set(str.split(/\s+/).filter(Boolean));

  /* 词干变化动词 */
  const SC = {};
  const scList = (type, str) => str.split(/\s+/).filter(Boolean).forEach(v => { SC[v] = type; });
  scList('ie', `pensar empezar comenzar cerrar despertar sentar recomendar calentar negar regar fregar nevar helar temblar
    atravesar confesar gobernar apretar encerrar enterrar merendar tropezar manifestar acertar sembrar quebrar reventar
    entender perder defender encender atender tender extender descender ascender verter
    sentir preferir mentir divertir convertir advertir sugerir herir hervir referir requerir arrepentir consentir
    invertir digerir transferir conferir inferir ingerir interferir presentir desmentir errar`);
  scList('ue', `contar encontrar recordar costar mostrar demostrar probar aprobar comprobar soñar sonar volar acostar
    almorzar colgar rogar forzar esforzar reforzar renovar soltar tostar apostar acordar consolar rodar
    volver devolver envolver revolver mover promover conmover remover llover doler soler morder resolver disolver
    absolver torcer retorcer cocer oler dormir morir`);
  scList('i', `pedir servir repetir seguir conseguir perseguir proseguir vestir desvestir medir despedir impedir elegir
    corregir competir reñir teñir rendir gemir derretir concebir regir expedir`);
  SC.jugar = 'u-ue'; SC.adquirir = 'i-ie'; SC.inquirir = 'i-ie';

  const ZVERBS = set('cocer mecer escocer recocer');
  const IUAR = set(`enviar confiar esquiar guiar variar vaciar criar fiar liar ampliar enfriar espiar desviar
    continuar actuar graduar situar evaluar efectuar acentuar habituar insinuar`);
  const MONO = set('criar guiar fiar liar');
  const ACCSTEM = { reunir: 'reún', prohibir: 'prohíb', aislar: 'aísl', rehusar: 'rehús' };

  /* 不规则动词 */
  const IRR = {
    ser: { pres: ['soy', 'eres', 'es', 'somos', 'sois', 'son'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      impf: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'], subj: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'], imp: 'sé' },
    ir: { pres: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      impf: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'], subj: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'],
      imp: 've', impNos: 'vamos', ger: 'yendo' },
    estar: { pres: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'], pretStem: 'estuv',
      subj: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'], imp: 'está' },
    haber: { pres: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'], pretStem: 'hub', futStem: 'habr',
      subj: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'], imp: 'he' },
    dar: { pres: ['doy', 'das', 'da', 'damos', 'dais', 'dan'], pret: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'],
      subj: ['dé', 'des', 'dé', 'demos', 'deis', 'den'] },
    ver: { pres: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'], yo: 'veo', pret: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
      impf: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'] },
    oír: { pres: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'], yo: 'oigo' },
    tener: { yo: 'tengo', sc: 'ie', pretStem: 'tuv', futStem: 'tendr', imp: 'ten' },
    venir: { yo: 'vengo', sc: 'ie', pretStem: 'vin', futStem: 'vendr', imp: 'ven' },
    poner: { yo: 'pongo', pretStem: 'pus', futStem: 'pondr', imp: 'pon' },
    salir: { yo: 'salgo', futStem: 'saldr', imp: 'sal' },
    valer: { yo: 'valgo', futStem: 'valdr' },
    hacer: { yo: 'hago', pretStem: 'hic', futStem: 'har', imp: 'haz' },
    decir: { yo: 'digo', sc: 'i', pretStem: 'dij', futStem: 'dir', imp: 'di' },
    traer: { yo: 'traigo', pretStem: 'traj' },
    caer: { yo: 'caigo' },
    poder: { sc: 'ue', pretStem: 'pud', futStem: 'podr', ger: 'pudiendo' },
    querer: { sc: 'ie', pretStem: 'quis', futStem: 'querr' },
    saber: { yo: 'sé', pretStem: 'sup', futStem: 'sabr', subjStem: 'sep' },
    caber: { yo: 'quepo', pretStem: 'cup', futStem: 'cabr' },
    andar: { pretStem: 'anduv' }
  };

  /* 由不规则动词派生的复合动词 */
  const COMP = {};
  const comp = (base, str) => str.split(/\s+/).filter(Boolean).forEach(v => { COMP[v] = { base, prefix: v.slice(0, v.length - base.length) }; });
  comp('tener', 'mantener obtener contener detener retener sostener entretener abstener');
  comp('poner', 'proponer suponer componer disponer exponer imponer oponer posponer reponer presuponer descomponer anteponer');
  comp('venir', 'convenir intervenir prevenir provenir');
  comp('hacer', 'deshacer rehacer');
  comp('decir', 'predecir contradecir desdecir bendecir maldecir');
  comp('traer', 'atraer distraer contraer extraer sustraer');
  comp('salir', 'sobresalir');
  comp('valer', 'equivaler');
  comp('ver', 'prever entrever');
  comp('caer', 'recaer decaer');
  COMP.satisfacer = { base: 'hacer', prefix: 'satis', f: x => 'satisf' + x.slice(1) };

  const PART = { hacer: 'hecho', decir: 'dicho', ver: 'visto', poner: 'puesto', romper: 'roto', morir: 'muerto',
    imprimir: 'impreso', proveer: 'provisto' };
  const PART_SUFFIX = [['scribir', 'scrito'], ['abrir', 'abierto'], ['cubrir', 'cubierto'], ['volver', 'vuelto'], ['solver', 'suelto']];

  /* 常用动词（用于变位训练，也是“已核对规则”的名单） */
  const VERBS = [
    ['ser', '是'], ['estar', '在；处于'], ['tener', '有'], ['hacer', '做'], ['ir', '去'], ['poder', '能'], ['decir', '说；告诉'],
    ['ver', '看见'], ['dar', '给'], ['saber', '知道；会'], ['querer', '想要；爱'], ['haber', '有（助动词）'], ['hablar', '说话'],
    ['comer', '吃'], ['vivir', '住；生活'], ['llegar', '到达'], ['pasar', '经过；发生'], ['deber', '应该'], ['poner', '放'],
    ['parecer', '看起来'], ['quedar', '留下；约见'], ['creer', '相信'], ['llevar', '带；穿'], ['dejar', '留下；让'],
    ['seguir', '继续；跟随'], ['encontrar', '找到'], ['llamar', '叫；打电话'], ['venir', '来'], ['pensar', '想'], ['salir', '出去'],
    ['volver', '回来'], ['tomar', '拿；喝'], ['conocer', '认识'], ['sentir', '感觉'], ['mirar', '看'], ['contar', '数；讲述'],
    ['empezar', '开始'], ['esperar', '等；希望'], ['buscar', '找'], ['entrar', '进入'], ['trabajar', '工作'], ['escribir', '写'],
    ['perder', '丢失；输'], ['entender', '理解'], ['pedir', '请求；点（菜）'], ['recibir', '收到'], ['recordar', '记得'],
    ['terminar', '结束'], ['permitir', '允许'], ['aparecer', '出现'], ['conseguir', '得到'], ['comenzar', '开始'],
    ['servir', '服务；有用'], ['sacar', '取出'], ['necesitar', '需要'], ['mantener', '保持'], ['leer', '读'], ['caer', '掉落'],
    ['cambiar', '改变'], ['abrir', '打开'], ['ganar', '赢；挣'], ['traer', '带来'], ['morir', '死'], ['aceptar', '接受'],
    ['comprar', '买'], ['pagar', '付款'], ['jugar', '玩'], ['estudiar', '学习'], ['aprender', '学会'], ['dormir', '睡'],
    ['oír', '听见'], ['escuchar', '听'], ['cerrar', '关'], ['preferir', '更喜欢'], ['viajar', '旅行'], ['beber', '喝'],
    ['cocinar', '做饭'], ['levantar', '举起；(se) 起床'], ['elegir', '选择'], ['conducir', '开车'], ['construir', '建造'],
    ['enviar', '寄；发送'], ['repetir', '重复'], ['vender', '卖'], ['correr', '跑'], ['subir', '上去'], ['bajar', '下去'],
    ['ayudar', '帮助'], ['preguntar', '问'], ['responder', '回答'], ['olvidar', '忘记'], ['explicar', '解释'], ['andar', '走'],
    ['caber', '容得下'], ['reír', '笑'], ['almorzar', '吃午饭'], ['cenar', '吃晚饭'], ['desayunar', '吃早饭'], ['descansar', '休息'],
    ['llover', '下雨'], ['costar', '花费'], ['mostrar', '展示'], ['mover', '移动'], ['vestir', '穿衣'], ['despertar', '叫醒'],
    ['acostar', '使躺下；(se) 上床'], ['sentar', '使坐下；(se) 坐下'], ['divertir', '使开心；(se) 玩得开心'], ['proponer', '提议'],
    ['suponer', '假设'], ['traducir', '翻译'], ['producir', '生产'], ['ofrecer', '提供'], ['nacer', '出生'], ['crecer', '成长'],
    ['agradecer', '感谢'], ['merecer', '值得'], ['reconocer', '认出；承认'], ['obtener', '获得'], ['convertir', '转变'],
    ['valer', '值'], ['continuar', '继续'], ['coger', '拿；乘'], ['dirigir', '领导；指向'], ['exigir', '要求'],
    ['proteger', '保护'], ['distinguir', '区分'], ['vencer', '战胜'], ['convencer', '说服'], ['huir', '逃'], ['incluir', '包括'],
    ['destruir', '破坏'], ['sustituir', '替换'], ['averiguar', '查明'], ['sonreír', '微笑'], ['freír', '炸'], ['prever', '预见'],
    ['deshacer', '拆；解开'], ['contradecir', '反驳'], ['atraer', '吸引'], ['romper', '打破'], ['resolver', '解决'],
    ['devolver', '归还'], ['descubrir', '发现'], ['describir', '描述'], ['lavar', '洗'], ['duchar', '(se) 淋浴'],
    ['quedarse', '留下；待着'], ['llamarse', '名叫'], ['levantarse', '起床'], ['acostarse', '上床睡觉'], ['sentirse', '感觉（自己）'],
    ['irse', '离开'], ['vestirse', '穿衣服'], ['despertarse', '醒来'], ['ducharse', '淋浴'], ['divertirse', '玩得开心']
  ];
  const KNOWN = new Set(VERBS.map(v => v[0].replace(/se$/, '')));

  function applySC(s, sc) {
    let r = s;
    if (sc === 'ie') r = repLast(s, 'e', 'ie');
    else if (sc === 'ue') r = repLast(s, 'o', 'ue');
    else if (sc === 'i') r = repLast(s, 'e', 'i');
    else if (sc === 'u-ue') r = repLast(s, 'u', 'ue');
    else if (sc === 'i-ie') r = repLast(s, 'i', 'ie');
    if (/^ie/.test(r)) r = 'ye' + r.slice(2);   // errar → yerro
    if (/^ue/.test(r)) r = 'h' + r;             // oler → huelo
    return r;
  }

  function participle(inf, kind, stem) {
    if (PART[inf]) return PART[inf];
    for (const [suf, rep] of PART_SUFFIX) if (inf.endsWith(suf)) return inf.slice(0, inf.length - suf.length) + rep;
    if (kind === 'ar') return stem + 'ado';
    return stem + (/[aeo]$/.test(stem) ? 'ído' : 'ido');
  }

  /* 一般动词的简单时态 */
  function core(inf) {
    const spec = IRR[inf] || {};
    let kind = inf.slice(-2);
    if (kind === 'ír') kind = 'ir';
    const stem = inf.slice(0, -2);
    const sc = spec.sc || SC[inf] || null;
    const uir = /uir$/.test(inf) && !/[gq]uir$/.test(inf);
    const vowelStem = kind !== 'ar' && /[aeo]$/.test(stem);
    const accStem = ACCSTEM[inf] || (IUAR.has(inf) ? accentLast(stem) : null);
    const mono = MONO.has(inf);
    const soft = s => /(ñ|ll)$/.test(s);
    const ch = s => (sc ? applySC(s, sc) : s);
    const chIr = s => {
      if (kind !== 'ir' || !sc) return s;
      if (sc === 'ue') return repLast(s, 'o', 'u');
      if (sc === 'ie' || sc === 'i') return repLast(s, 'e', 'i');
      return s;
    };
    const orthoAO = s => {
      if (kind === 'ar') return s;
      if (/guir$/.test(inf)) return s.replace(/gu$/, 'g');
      if (/quir$/.test(inf)) return s.replace(/qu$/, 'c');
      if (/g[ei]r$/.test(inf)) return s.replace(/g$/, 'j');
      if (/c[ei]r$/.test(inf) && /c$/.test(s)) {
        const prev = s[s.length - 2] || '';
        if (ZVERBS.has(inf) || !/[aeiouáéíóú]/.test(prev)) return s.replace(/c$/, 'z');
        return s.replace(/c$/, 'zc');
      }
      return s;
    };
    const orthoE = s => {
      if (kind !== 'ar') return s;
      if (/gu$/.test(s)) return s.replace(/gu$/, 'gü');
      if (/c$/.test(s)) return s.replace(/c$/, 'qu');
      if (/g$/.test(s)) return s + 'u';
      if (/z$/.test(s)) return s.replace(/z$/, 'c');
      return s;
    };

    const pres = spec.pres ? spec.pres.slice() : R.map(i => {
      const stressed = i < 3 || i === 5;
      if (i === 0 && spec.yo) return spec.yo;
      let s = stem;
      if (stressed) s = accStem || ch(s);
      if (i === 0) return orthoAO(s) + (uir ? 'y' : '') + 'o';
      if (uir && stressed) return s + 'y' + E.pres[kind][i];
      return s + E.pres[kind][i];
    });
    if (mono) pres[4] = deacc(pres[4]);

    let subj;
    if (spec.subj) subj = spec.subj.slice();
    else {
      const en = E.subj[kind];
      const yoStem = spec.subjStem || (spec.yo && /o$/.test(spec.yo) ? spec.yo.slice(0, -1) : null);
      subj = R.map(i => {
        if (yoStem) return yoStem + en[i];
        const stressed = i < 3 || i === 5;
        let s = stem;
        s = stressed ? (accStem || ch(s)) : chIr(s);
        s = kind === 'ar' ? orthoE(s) : orthoAO(s);
        if (uir) s += 'y';
        return s + en[i];
      });
      if (mono) subj[4] = deacc(subj[4]);
    }

    let pret;
    if (spec.pret) pret = spec.pret.slice();
    else {
      const ps = spec.pretStem || (/ducir$/.test(inf) ? stem.slice(0, -1) + 'j' : null);
      if (ps) {
        pret = STRONG.map((e, i) => (i === 5 && /j$/.test(ps)) ? ps + 'eron' : (i === 2 && /c$/.test(ps)) ? ps.slice(0, -1) + 'zo' : ps + e);
      } else {
        pret = R.map(i => {
          if (kind === 'ar') return (i === 0 ? orthoE(stem) : stem) + E.pret.ar[i];
          let s = stem;
          if (i === 2 || i === 5) s = chIr(s);
          if (vowelStem) return s + ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'][i];
          if (uir) return s + ['í', 'iste', 'yó', 'imos', 'isteis', 'yeron'][i];
          if (soft(s) && (i === 2 || i === 5)) return s + (i === 2 ? 'ó' : 'eron');
          return s + E.pret.er[i];
        });
        if (mono) { pret[0] = deacc(pret[0]); pret[2] = deacc(pret[2]); }
      }
    }

    const impf = spec.impf ? spec.impf.slice() : E.impf[kind].map(e => stem + e);
    const fs = spec.futStem || deacc(inf);
    const fut = E.fut.map(e => fs + e);
    const cond = E.cond.map(e => fs + e);

    let ger = spec.ger;
    if (!ger) {
      if (kind === 'ar') ger = stem + 'ando';
      else { const s = chIr(stem); ger = (vowelStem || uir) ? s + 'yendo' : soft(s) ? s + 'endo' : s + 'iendo'; }
    }
    const part = inf === 'ser' ? 'sido' : inf === 'ir' ? 'ido' : participle(inf, kind, stem);
    const impA = [spec.imp || pres[2], subj[2], spec.impNos || subj[3], inf.slice(0, -1) + 'd', subj[5]];
    return { pres, pret, impf, fut, cond, subj, ger, part, impA };
  }

  /* reír / sonreír / freír */
  function eir(inf) {
    const X = inf.slice(0, -3);
    const mono = X === 'r' || X === 'fr';
    const fs = X + 'eir';
    const subj = [X + 'ía', X + 'ías', X + 'ía', X + 'iamos', X + (mono ? 'iais' : 'iáis'), X + 'ían'];
    const pres = [X + 'ío', X + 'íes', X + 'íe', X + 'eímos', X + 'eís', X + 'íen'];
    return {
      pres, subj,
      pret: [X + 'eí', X + 'eíste', X + (mono ? 'io' : 'ió'), X + 'eímos', X + 'eísteis', X + 'ieron'],
      impf: E.impf.er.map(e => X + 'e' + e),
      fut: E.fut.map(e => fs + e), cond: E.cond.map(e => fs + e),
      ger: X + 'iendo', part: inf === 'freír' ? 'frito' : X + 'eído',
      impA: [X + 'íe', subj[2], subj[3], X + 'eíd', subj[5]]
    };
  }

  function compound(inf) {
    const { base, prefix } = COMP[inf];
    const f = COMP[inf].f || (x => prefix + x);
    const b = core(base);
    const m = a => a.map(f);
    const c = { pres: m(b.pres), pret: m(b.pret), impf: m(b.impf), fut: m(b.fut), cond: m(b.cond), subj: m(b.subj),
      ger: f(b.ger), part: f(b.part), impA: m(b.impA) };
    if (base === 'tener') c.impA[0] = prefix + 'tén';
    if (base === 'poner') c.impA[0] = prefix + 'pón';
    if (base === 'venir') c.impA[0] = prefix + 'vén';
    if (base === 'valer') c.impA[0] = c.pres[2];
    if (base === 'decir') {
      c.impA[0] = prefix + 'dice';
      if (/^(pre|ben|mal)decir$/.test(inf)) { c.fut = E.fut.map(e => inf + e); c.cond = E.cond.map(e => inf + e); }
      if (/^(ben|mal)decir$/.test(inf)) c.part = prefix + 'decido';
    }
    if (base === 'ver') {
      c.pres[1] = prefix + 'vés'; c.pres[2] = prefix + 'vé'; c.pres[4] = prefix + 'véis'; c.pres[5] = prefix + 'vén';
      c.pret[0] = prefix + 'ví'; c.pret[2] = prefix + 'vió'; c.impA[0] = prefix + 'vé';
    }
    return c;
  }

  const HABER = {
    perf: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
    plus: ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
    futPerf: ['habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán'],
    condPerf: ['habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían'],
    subjPerf: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'],
    subjPlus: ['hubiera', 'hubieras', 'hubiera', 'hubiéramos', 'hubierais', 'hubieran']
  };
  const TENSES = [
    ['pres', 'Presente', '现在时', 'Indicativo'],
    ['perf', 'Pretérito perfecto', '现在完成时', 'Indicativo'],
    ['pret', 'Pretérito indefinido', '简单过去时', 'Indicativo'],
    ['impf', 'Pretérito imperfecto', '过去未完成时', 'Indicativo'],
    ['plus', 'Pluscuamperfecto', '过去完成时', 'Indicativo'],
    ['fut', 'Futuro simple', '将来时', 'Indicativo'],
    ['futPerf', 'Futuro perfecto', '将来完成时', 'Indicativo'],
    ['cond', 'Condicional simple', '条件式', 'Condicional'],
    ['condPerf', 'Condicional compuesto', '条件式完成时', 'Condicional'],
    ['subj', 'Presente de subjuntivo', '虚拟式现在时', 'Subjuntivo'],
    ['subjImpf', 'Imperfecto de subjuntivo', '虚拟式过去未完成时', 'Subjuntivo'],
    ['subjPerf', 'Perfecto de subjuntivo', '虚拟式现在完成时', 'Subjuntivo'],
    ['subjPlus', 'Pluscuamperfecto de subjuntivo', '虚拟式过去完成时', 'Subjuntivo']
  ];
  const PRON = ['me', 'te', 'se', 'nos', 'os', 'se'];

  /** 返回完整变位表；不是动词原形时返回 null */
  function conjugate(raw) {
    let inf = String(raw || '').toLowerCase().trim();
    let refl = false;
    if (/(ar|er|ir|ír)se$/.test(inf)) { refl = true; inf = inf.slice(0, -2); }
    if (inf.length < 2 || !/(ar|er|ir|ír)$/.test(inf) || /\s/.test(inf)) return null;
    let c, known;
    if (/eír$/.test(inf)) { c = eir(inf); known = true; }
    else if (COMP[inf]) { c = compound(inf); known = true; }
    else {
      c = core(inf);
      known = !!(IRR[inf] || SC[inf] || IUAR.has(inf) || ACCSTEM[inf] || KNOWN.has(inf));
    }
    const base = c.pret[5].slice(0, -3);
    const baseAcc = accentLast(base);
    const ra = [base + 'ra', base + 'ras', base + 'ra', baseAcc + 'ramos', base + 'rais', base + 'ran'];
    const se = [base + 'se', base + 'ses', base + 'se', baseAcc + 'semos', base + 'seis', base + 'sen'];
    const forms = { pres: c.pres, pret: c.pret, impf: c.impf, fut: c.fut, cond: c.cond, subj: c.subj, subjImpf: ra };
    Object.keys(HABER).forEach(k => { forms[k] = HABER[k].map(h => h + ' ' + c.part); });
    const pro = (f, i) => (refl ? PRON[i] + ' ' + f : f);
    const tenses = TENSES.map(([id, name, zh, mood]) => ({ id, name, zh, mood, forms: forms[id].map(pro), alt: id === 'subjImpf' ? se.map(pro) : null }));
    const negPron = ['te', 'se', 'nos', 'os', 'se'];
    return {
      inf: inf + (refl ? 'se' : ''), base: inf, refl, known,
      ger: c.ger, part: c.part, tenses,
      imp: {
        persons: ['tú', 'usted', 'nosotros', 'vosotros', 'ustedes'],
        aff: c.impA,
        neg: [c.subj[1], c.subj[2], c.subj[3], c.subj[4], c.subj[5]].map((f, i) => 'no ' + (refl ? negPron[i] + ' ' : '') + f)
      }
    };
  }

  function meaning(inf) { const v = VERBS.find(x => x[0] === inf); return v ? v[1] : ''; }

  return { conjugate, PERSONS, TENSES, VERBS, meaning, deacc };
})();
if (typeof module !== 'undefined') module.exports = Conj;
