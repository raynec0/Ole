'use strict';
/* A2 初级：12 节手写课，离线可学。 */

COURSE.push({ id: 'a2-01', lv: 'A2', unit: '讲过去的事', title: '现在完成时', goal: '说“今天、这周、到现在为止”做过的事',
  notes: [
`## 构成：haber + 过去分词
*he, has, ha, hemos, habéis, han* + 分词。
分词：*-ar → -ado*（*hablado*），*-er / -ir → -ido*（*comido, vivido*）。分词在这里不变性数，两部分之间不能插任何词：*No lo he visto.*`,
`## 不规则分词（必须背）
*hacer → hecho*、*decir → dicho*、*ver → visto*、*poner → puesto*、*escribir → escrito*、*abrir → abierto*、*volver → vuelto*、*romper → roto*、*morir → muerto*`,
`## 什么时候用
在西班牙，只要事情发生在“还没结束的时间段”里，或和现在有关，就用它：
- *hoy, esta mañana, esta semana, este año*：*Hoy he trabajado mucho.*
- 经历：*¿Has estado alguna vez en México?*　*Nunca he probado el pulpo.*
- *ya*（已经）和 *todavía no*（还没）：*Ya he comido.*　*Todavía no he terminado.*
拉美很多地方在这些场合直接用简单过去时（*Hoy trabajé mucho*）。`],
  items: [
    ['ya', '已经'], ['todavía no', '还没'], ['alguna vez', '曾经'], ['esta semana', '这周'], ['hecho', '做了（hacer 的分词）'], ['visto', '看了（ver 的分词）'], ['dicho', '说了（decir 的分词）'], ['vuelto', '回来了（volver 的分词）'],
    ['Hoy he trabajado diez horas', '我今天工作了十个小时'], ['¿Has estado alguna vez en España?', '你去过西班牙吗？'],
    ['Todavía no he hecho la maleta', '我还没收拾行李'], ['Esta mañana hemos visto a tu hermano', '今天早上我们看见你哥哥了'],
    ['Nunca he probado el gazpacho', '我从没尝过西班牙冷汤'], ['¿Ya habéis comido?', '你们吃过饭了吗？']],
  drills: [
    ['Hoy ___ muy tarde. (levantarse, yo)', 'me he levantado', ['he me levantado', 'me levantado', 'he levantádome'], '反身代词放在 haber 前面'],
    ['¿___ visto la última película de Almodóvar? (tú)', 'Has', ['Ha', 'Habéis', 'Eres'], 'tú → has'],
    ['Todavía no hemos ___ los deberes. (hacer)', 'hecho', ['hacido', 'hacho', 'hecha'], 'hacer 的分词不规则：hecho'],
    ['Mis padres ya han ___ de vacaciones. (volver)', 'vuelto', ['volvido', 'vueltos', 'volver'], 'volver → vuelto，和 haber 连用时不变'],
    ['Nunca ___ en Japón. (estar, nosotros)', 'hemos estado', ['hemos sido', 'habemos estado', 'somos estado'], '“去过”用 estar；nosotros → hemos']],
  dialog: [['A', '¿Qué has hecho hoy?', '你今天做了什么？'], ['B', 'He ido al médico y luego he comido con Ana.', '去看了医生，然后和安娜吃了午饭。'], ['A', '¿Has probado ya el restaurante nuevo?', '那家新餐厅你去过了吗？'], ['B', 'No, todavía no. ¿Y tú?', '还没有。你呢？'], ['A', 'Yo he estado dos veces esta semana. ¡Me ha encantado!', '我这周去了两次。太喜欢了！']]
});

COURSE.push({ id: 'a2-02', lv: 'A2', unit: '讲过去的事', title: '简单过去时：规则动词', goal: '讲昨天、上周、去年发生的事',
  notes: [
`## 规则变位
| | hablar | comer / vivir |
| yo | *hablé* | *comí* |
| tú | *hablaste* | *comiste* |
| él / ella / usted | *habló* | *comió* |
| nosotros | *hablamos* | *comimos* |
| vosotros | *hablasteis* | *comisteis* |
| ellos / ustedes | *hablaron* | *comieron* |
重音符号决定意思：*hablo*（我说）/ *habló*（他说了）。`,
`## 拼写要保住发音
yo 的形式里：*-car → -qué*（*busqué*）、*-gar → -gué*（*llegué*、*pagué*）、*-zar → -cé*（*empecé*）。
*leer, creer, oír* 的第三人称：*leyó, leyeron*。`,
`## 什么时候用
事情发生在已经结束的时间段里，是一个完整、有头有尾的动作：
*ayer*、*anoche*、*anteayer*、*la semana pasada*、*el año pasado*、*en 2019*、*hace dos días*（两天前）。
*Ayer cené con mis compañeros.*　*Llegué a Madrid hace tres meses.*`],
  items: [
    ['ayer', '昨天'], ['anoche', '昨晚'], ['la semana pasada', '上周'], ['el año pasado', '去年'], ['hace dos días', '两天前'], ['llegar', '到达'], ['empezar', '开始'], ['conocer', '认识'],
    ['Ayer trabajé hasta las nueve', '我昨天工作到九点'], ['Llegué a España hace seis meses', '我六个月前到的西班牙'],
    ['Anoche cenamos en un restaurante peruano', '昨晚我们在一家秘鲁餐厅吃的晚饭'], ['¿A qué hora volviste a casa?', '你几点回的家？'],
    ['Conocí a mi novia en la universidad', '我在大学认识了我女朋友'], ['El año pasado viajaron a Argentina', '去年他们去了阿根廷']],
  drills: [
    ['Ayer ___ con mi madre por teléfono. (hablar, yo)', 'hablé', ['hablo', 'habló', 'hablaba'], 'yo → -é'],
    ['¿Dónde ___ anoche? (cenar, vosotros)', 'cenasteis', ['cenáis', 'cenaron', 'cenastes'], 'vosotros → -asteis'],
    ['Yo ___ tarde a la reunión. (llegar)', 'llegué', ['llegé', 'llegó', 'llego'], '-gar → -gué'],
    ['Ella ___ el libro en dos días. (leer)', 'leyó', ['leió', 'leó', 'leí'], 'leer 第三人称：leyó'],
    ['Nosotros ___ en Lima tres años. (vivir)', 'vivimos', ['vivemos', 'vivieron', 'vivíamos'], '有明确时长的完整过去 → vivimos']],
  dialog: [['A', '¿Qué hiciste el fin de semana?', '你周末做了什么？'], ['B', 'El sábado salí con unos amigos y volví tardísimo.', '周六和几个朋友出去了，很晚才回来。'], ['A', '¿Y el domingo?', '周日呢？'], ['B', 'Me levanté a las doce, comí en casa y vi una película.', '十二点起床，在家吃饭，看了部电影。'], ['A', 'Yo trabajé los dos días. Empecé a las ocho.', '我两天都在上班。八点就开始了。']]
});

COURSE.push({ id: 'a2-03', lv: 'A2', unit: '讲过去的事', title: '简单过去时：不规则动词', goal: '掌握最常用的十几个不规则过去时',
  notes: [
`## ser 和 ir 完全一样
*fui, fuiste, fue, fuimos, fuisteis, fueron*
靠上下文区分：*Fui a Toledo.*（我去了）/ *Fue muy divertido.*（那很有趣）`,
`## 强变化动词：换词干，词尾统一
词尾是 *-e, -iste, -o, -imos, -isteis, -ieron*，都不带重音符号。
- *tener → tuv-*：*tuve, tuviste, tuvo…*
- *estar → estuv-*
- *poder → pud-*
- *poner → pus-*
- *saber → sup-*
- *hacer → hic-*（*hizo*）
- *querer → quis-*
- *venir → vin-*
- *decir → dij-*、*traer → traj-*（复数第三人称 *dijeron, trajeron*）`,
`## dar、ver 和 -ir 变音动词
*dar*：*di, diste, dio, dimos, disteis, dieron*　*ver*：*vi, viste, vio…*
现在时变音的 -ir 动词，只在第三人称变：*pedir → pidió, pidieron*；*dormir → durmió, durmieron*；*sentir → sintió*。`],
  items: [
    ['fui', '我去了；我是（过去）'], ['tuve', '我有过；我不得不'], ['hice', '我做了'], ['dijo', '他说了'], ['pude', '我能够（做到了）'], ['vino', '他来了'], ['estuvimos', '我们待过'], ['pusieron', '他们放了'],
    ['Ayer fui al médico', '我昨天去看了医生'], ['No pude dormir en toda la noche', '我一整夜都没睡着'],
    ['¿Qué te dijo el jefe?', '老板跟你说了什么？'], ['Estuvimos tres días en Granada', '我们在格拉纳达待了三天'],
    ['Tuve que trabajar el domingo', '我周日不得不上班'], ['Mis amigos vinieron a casa y trajeron vino', '朋友们来我家，还带了酒']],
  drills: [
    ['El sábado ___ al cine. (ir, nosotros)', 'fuimos', ['íbamos', 'fueron', 'vamos'], 'ir → fuimos'],
    ['Ayer no ___ tiempo. (tener, yo)', 'tuve', ['tení', 'tuvo', 'tenía'], 'tener → tuv-，yo → tuve'],
    ['¿Qué ___ ayer? (hacer, tú)', 'hiciste', ['haciste', 'hizo', 'hacías'], 'hacer → hic-，tú → hiciste'],
    ['Ella ___ que no. (decir)', 'dijo', ['dició', 'dijió', 'decía'], 'decir → dij-，él → dijo'],
    ['El niño ___ diez horas. (dormir)', 'durmió', ['dormió', 'duermió', 'dormí'], '-ir 变音动词第三人称 o→u'],
    ['Ellos ___ el coche en el garaje. (poner)', 'pusieron', ['ponieron', 'pusaron', 'pusimos'], 'poner → pus-']],
  dialog: [['A', '¿Dónde estuviste ayer? Te llamé tres veces.', '你昨天去哪儿了？我给你打了三次电话。'], ['B', 'Fui al hospital. Mi padre tuvo un accidente.', '我去医院了。我爸出了点事故。'], ['A', '¿En serio? ¿Qué le pasó?', '真的？他怎么了？'], ['B', 'Se cayó en la calle, pero no fue nada grave.', '在街上摔了一跤，不过不严重。'], ['A', 'Menos mal. ¿Y qué dijo el médico?', '还好。医生怎么说？'], ['B', 'Que tiene que descansar unos días.', '说他得休息几天。']]
});

COURSE.push({ id: 'a2-04', lv: 'A2', unit: '讲过去的事', title: '过去未完成时', goal: '描述过去的习惯、背景和样子',
  notes: [
`## 变位（几乎全规则）
| | hablar | comer / vivir |
| yo | *hablaba* | *comía* |
| tú | *hablabas* | *comías* |
| él / ella / usted | *hablaba* | *comía* |
| nosotros | *hablábamos* | *comíamos* |
| vosotros | *hablabais* | *comíais* |
| ellos / ustedes | *hablaban* | *comían* |
只有三个不规则：*ser → era*、*ir → iba*、*ver → veía*。`,
`## 用来做什么
- 过去的习惯：*De niño jugaba al fútbol todos los días.*
- 描述过去的人、地方、情况：*La casa era pequeña y tenía un jardín.*
- 过去的年龄和时间：*Tenía veinte años.*　*Eran las ocho.*
- 当时正在进行的事（背景）：*Llovía mucho.*
标志词：*antes*、*de niño / de pequeño*、*cuando era joven*、*siempre*、*todos los días*、*normalmente*。`,
`## 礼貌的请求
*Quería un café.*　*Venía a preguntar una cosa.*　用过去未完成时提要求，比现在时委婉。`],
  items: [
    ['antes', '以前'], ['de niño', '小时候'], ['todos los días', '每天'], ['era', '我/他 曾是'], ['tenía', '我/他 曾有'], ['iba', '我/他 曾常去'], ['había', '曾有（hay 的过去）'], ['el pueblo', '村庄；小镇'],
    ['Antes vivía con mis padres', '以前我和父母一起住'], ['De niño no me gustaba la verdura', '小时候我不喜欢吃蔬菜'],
    ['Cuando era joven, salía todas las noches', '我年轻的时候每晚都出去'], ['En mi pueblo no había cine', '我们镇上以前没有电影院'],
    ['Íbamos a la playa todos los veranos', '我们每年夏天都去海边'], ['Mi abuela cocinaba muy bien', '我奶奶做饭很好吃']],
  drills: [
    ['Antes ___ en Pekín. (vivir, yo)', 'vivía', ['viví', 'vivo', 'vivaba'], '过去的长期状态 → vivía'],
    ['De pequeños, ___ al parque cada tarde. (ir, nosotros)', 'íbamos', ['fuimos', 'vamos', 'ibamos'], 'ir → íbamos，带重音符号'],
    ['Mi abuelo ___ muy alto. (ser)', 'era', ['fue', 'estaba', 'eraba'], '描述过去的特征用 era'],
    ['En esa época no ___ internet. (haber)', 'había', ['hubo', 'habían', 'hay'], '描述背景用 había，永远是单数'],
    ['Cuando ___ diez años, tocaba el piano. (tener, yo)', 'tenía', ['tuve', 'tengo', 'era'], '过去的年龄用 tenía']],
  dialog: [['A', '¿Cómo era tu vida en China?', '你在中国的生活是什么样的？'], ['B', 'Vivía en un piso pequeño y trabajaba muchísimo.', '住在一套小公寓里，工作特别多。'], ['A', '¿Y qué hacías los fines de semana?', '那周末做什么？'], ['B', 'Normalmente iba a casa de mis padres. Mi madre siempre cocinaba algo rico.', '一般回父母家。我妈总会做点好吃的。'], ['A', 'Yo de niño vivía en un pueblo. No había nada, pero éramos felices.', '我小时候住在村里。什么都没有，但我们很开心。']]
});

COURSE.push({ id: 'a2-05', lv: 'A2', unit: '讲过去的事', title: '两种过去时的配合', goal: '讲一个有背景、有事件的故事',
  notes: [
`## 一个讲事件，一个讲背景
- 简单过去时（*indefinido*）：发生了什么。一个个完整的动作，推动故事前进。
- 过去未完成时（*imperfecto*）：当时是什么样。背景、状态、正在进行的事。
*Eran las once y llovía. De repente, sonó el teléfono.*
（当时十一点，下着雨。突然，电话响了。）`,
`## 正在……的时候，发生了……
*Cuando / mientras* + 未完成时（进行中的背景），主句用简单过去时（打断它的事件）：
*Mientras cocinaba, llegó mi hermano.*
两个动作同时进行，都用未完成时：*Mientras yo cocinaba, él ponía la mesa.*
一连串先后的动作，都用简单过去时：*Llegué, me duché y me acosté.*`,
`## 同一个动词，意思会变
- *conocía*（早就认识）/ *conocí*（认识了、初次见面）
- *sabía*（早就知道）/ *supe*（得知了）
- *quería*（想）/ *quise*（试图）、*no quise*（拒绝了）
- *podía*（有能力）/ *pude*（做到了）
- *tenía que*（本该）/ *tuve que*（不得不，而且做了）`],
  items: [
    ['mientras', '当……的时候'], ['de repente', '突然'], ['entonces', '于是；那时'], ['una vez', '有一次'], ['al final', '最后'], ['sonar', '响'], ['el ruido', '噪音'], ['darse cuenta', '意识到'],
    ['Cuando llegué, no había nadie', '我到的时候，一个人都没有'], ['Mientras cenábamos, sonó el teléfono', '我们吃晚饭的时候，电话响了'],
    ['Estaba muy cansado y me acosté temprano', '我很累，就早早睡了'], ['Llovía mucho, así que cogimos un taxi', '雨下得很大，所以我们打了车'],
    ['Cuando era estudiante, viví un año en Londres', '我读书的时候在伦敦住过一年'], ['No sabía que estabas enfermo', '我不知道你病了']],
  drills: [
    ['Mientras yo ___, llamaron a la puerta. (ducharse)', 'me duchaba', ['me duché', 'me ducho', 'duchaba'], '被打断的进行中动作 → 未完成时'],
    ['Ayer ___ a Laura en el metro. (ver, yo)', 'vi', ['veía', 'vio', 'veo'], '一次性的完整事件 → 简单过去时'],
    ['___ las diez cuando salimos. (ser)', 'Eran', ['Fueron', 'Era', 'Son'], '过去的钟点用未完成时，复数'],
    ['No fui a la fiesta porque ___ cansado. (estar)', 'estaba', ['estuve', 'era', 'fui'], '原因是当时的状态 → 未完成时'],
    ['Llegué a casa, ___ y me acosté. (cenar)', 'cené', ['cenaba', 'ceno', 'cenando'], '一连串先后动作 → 简单过去时'],
    ['Ayer ___ que Marta se casa. (saber, yo)', 'supe', ['sabía', 'sabí', 'sé'], 'supe = 得知了']],
  dialog: [['A', '¿Sabes qué me pasó ayer?', '你知道我昨天出了什么事吗？'], ['B', 'No, cuenta.', '不知道，说说。'], ['A', 'Iba por la calle, miraba el móvil y, de repente, me choqué con una farola.', '我走在街上，看着手机，突然撞上了路灯。'], ['B', '¡No me digas! ¿Te hiciste daño?', '不会吧！你受伤了吗？'], ['A', 'Un poco. Pero lo peor es que había mucha gente y todos se rieron.', '有一点。最糟的是当时人很多，大家都笑了。']]
});

COURSE.push({ id: 'a2-06', lv: 'A2', unit: '说得更准', title: '宾语代词', goal: '用 lo、la、le 代替说过的人和物',
  notes: [
`## 直接宾语：lo, la, los, las
代替“动作直接作用的人或物”，跟着被代替的名词变性数：
—*¿Tienes las llaves?* —*Sí, las tengo.*
—*¿Conoces a Pedro?* —*No, no lo conozco.*
完整一套：*me, te, lo / la, nos, os, los / las*。
在西班牙，指男性的人时常用 *le* 代替 *lo*（*Le conozco*），两种都正确。`,
`## 间接宾语：le, les
代替“给谁、对谁”：*me, te, le, nos, os, les*。
*Le he escrito un correo.*（我给他写了封邮件）
西语里常常代词和名词一起出现：*Le he dado el libro a Ana.*`,
`## 位置和连用
- 放在变位动词前：*Lo compro.*　*No lo he visto.*
- 接在原形、副动词、肯定命令式后面：*Voy a comprarlo.* = *Lo voy a comprar.*
- 两个一起用时，间接在前、直接在后：*Me lo ha dicho.*
- *le / les* 遇到 *lo / la / los / las* 要变成 *se*：*Se lo doy.*（我把它给他），不说 ✗ *Le lo doy*`],
  items: [
    ['lo', '它；他（直接宾语）'], ['la', '它；她（直接宾语）'], ['le', '给他/她/您'], ['las llaves', '钥匙'], ['el regalo', '礼物'], ['prestar', '借给'], ['dar', '给'], ['enviar', '寄；发送'],
    ['¿Las llaves? No las encuentro', '钥匙？我找不到'], ['Te llamo esta noche', '我今晚给你打电话'],
    ['Le he comprado un regalo a mi madre', '我给我妈买了个礼物'], ['¿Me puedes ayudar un momento?', '你能帮我一下吗？'],
    ['El informe ya se lo he enviado', '报告我已经发给他了'], ['No lo sé, voy a preguntarlo', '我不知道，我去问问']],
  drills: [
    ['—¿Has visto mi móvil? —No, no ___ he visto.', 'lo', ['le', 'la', 'se'], 'móvil 阳性单数，直接宾语 → lo'],
    ['A mis padres ___ escribo cada semana.', 'les', ['los', 'le', 'se'], '给他们写 → 间接宾语复数 les'],
    ['—¿Compras las entradas? —Sí, ___ compro yo.', 'las', ['les', 'los', 'la'], 'entradas 阴性复数 → las'],
    ['¿El libro? ___ lo doy mañana (a ella).', 'Se', ['Le', 'La', 'Lo'], 'le + lo → se lo'],
    ['No puedo ___ ahora. (llamarte)', 'llamarte', ['te llamar', 'llamar te', 'llamaste'], '代词接在原形后面写成一个词']],
  dialog: [['A', '¿Tienes el cargador? No lo encuentro.', '充电器在你那儿吗？我找不到。'], ['B', 'Se lo he prestado a Lucía.', '我借给露西亚了。'], ['A', '¿Y cuándo te lo devuelve?', '她什么时候还你？'], ['B', 'No sé, ahora le escribo y se lo pregunto.', '不知道，我现在给她发消息问问。'], ['A', 'Vale. Si no, te dejo el mío.', '好。不行的话我把我的借你。']]
});

COURSE.push({ id: 'a2-07', lv: 'A2', unit: '说得更准', title: '正在做、刚做完、又做', goal: '用几个高频动词短语把时间说细',
  notes: [
`## estar + 副动词：正在
副动词：*-ar → -ando*，*-er / -ir → -iendo*。
*Estoy trabajando.*　*¿Qué estás haciendo?*
不规则：*leyendo, durmiendo, pidiendo, diciendo, yendo*。
注意：西语只在强调“此刻正在进行”时才用它，说习惯仍用现在时。`,
`## 一组常用短语
- *acabar de + 原形*：刚刚做完 — *Acabo de llegar.*
- *empezar a + 原形*：开始 — *Empezó a llover.*
- *dejar de + 原形*：不再、戒掉 — *He dejado de fumar.*
- *volver a + 原形*：又、再 — *Vuelve a llamar más tarde.*
- *seguir + 副动词*：还在、继续 — *Sigo viviendo en el mismo piso.*
- *llevar + 时间 + 副动词*：已经……了多久 — *Llevo dos años estudiando español.*`,
`## llevar 和 hace
问“多久了”有两种说法，意思一样：
*¿Cuánto tiempo llevas aquí?* — *Llevo tres meses.*
*¿Cuánto tiempo hace que vives aquí?* — *Hace tres meses que vivo aquí.*`],
  items: [
    ['ahora mismo', '现在；马上'], ['acabar de', '刚刚（做完）'], ['dejar de', '停止；戒掉'], ['volver a', '再次（做）'], ['seguir', '继续'], ['todavía', '还；仍然'], ['fumar', '抽烟'], ['esperar', '等'],
    ['¿Qué estás haciendo?', '你在干什么？'], ['Estoy esperando el autobús', '我在等公交车'],
    ['Acabo de salir del trabajo', '我刚下班'], ['Llevo un año estudiando español', '我学西语已经一年了'],
    ['Mi padre ha dejado de fumar', '我爸戒烟了'], ['¿Sigues trabajando en la misma empresa?', '你还在原来那家公司上班吗？']],
  drills: [
    ['Ahora no puedo, estoy ___. (comer)', 'comiendo', ['comido', 'comer', 'como'], 'estar + 副动词'],
    ['___ de llegar a casa. (acabar, yo)', 'Acabo', ['Acabé', 'Acabando', 'Acaba'], 'acabo de + 原形 = 我刚刚'],
    ['Llevo dos horas ___. (esperar)', 'esperando', ['esperar', 'esperado', 'espero'], 'llevar + 时间 + 副动词'],
    ['El niño está ___. (dormir)', 'durmiendo', ['dormiendo', 'duermiendo', 'dormido'], 'dormir 的副动词：durmiendo'],
    ['He dejado ___ tomar café.', 'de', ['a', 'que', 'en'], 'dejar de + 原形'],
    ['No contesta. Voy a volver ___ llamar.', 'a', ['de', 'que', 'por'], 'volver a + 原形 = 再做一次']],
  dialog: [['A', '¿Dónde estás? Llevo media hora esperando.', '你在哪儿？我等了半小时了。'], ['B', 'Perdona, acabo de salir de la oficina.', '对不起，我刚出办公室。'], ['A', '¿Sigues trabajando hasta tan tarde?', '你还是加班到这么晚？'], ['B', 'Sí, pero la semana que viene empiezo a salir a las seis.', '是啊，不过下周开始六点下班。'], ['A', 'Vale, te espero. Estoy tomando algo en el bar de la esquina.', '好，我等你。我在街角的酒吧喝东西。']]
});

COURSE.push({ id: 'a2-08', lv: 'A2', unit: '说得更准', title: '比较级与最高级', goal: '比较人和物，说“最……”',
  notes: [
`## 比较
- 形容词、副词：*más / menos … que*、*tan … como*
- 名词：*más / menos + 名词 + que*、*tanto, -a, -os, -as + 名词 + como*：*Tengo tantos libros como tú.*
- 动词：*más que*、*menos que*、*tanto como*：*Trabaja tanto como yo.*
- 和数字比用 *de*：*Cuesta más de cien euros.*`,
`## 不规则
*bueno / bien → mejor*、*malo / mal → peor*、*grande（年龄）→ mayor*、*pequeño（年龄）→ menor*
*Mi hermano mayor*（我哥）、*mi hermana menor*（我妹）。`,
`## 最高级
- *el / la / los / las + más … de*：*Es la ciudad más bonita de España.*（范围用 *de*，不用 en）
- *el mejor / el peor*：*Es el mejor restaurante del barrio.*
- 绝对最高级 *-ísimo*：*carísimo*（贵极了）、*buenísimo*、*muchísimo*、*riquísimo*。口语里西班牙人还爱用 *súper*、*mogollón de*。`],
  items: [
    ['mejor', '更好'], ['peor', '更差'], ['mayor', '更年长；更大'], ['menor', '更年幼；更小'], ['tan … como', '和……一样'], ['carísimo', '非常贵'], ['el barrio', '街区'], ['rápido', '快'],
    ['Madrid es más grande que Valencia', '马德里比瓦伦西亚大'], ['Este piso es tan caro como el otro', '这套房和那套一样贵'],
    ['Mi hermana mayor vive en Alemania', '我姐姐住在德国'], ['Es el mejor restaurante del barrio', '这是这片街区最好的餐厅'],
    ['El tren es más rápido que el autobús', '火车比大巴快'], ['Hoy hace muchísimo calor', '今天热极了']],
  drills: [
    ['El metro es ___ rápido que el autobús.', 'más', ['muy', 'tan', 'mucho'], 'más … que'],
    ['No tengo ___ dinero como tú.', 'tanto', ['tan', 'más', 'tanta'], '名词前用 tanto，dinero 阳性单数'],
    ['Es la montaña más alta ___ España.', 'de', ['en', 'que', 'por'], '最高级的范围用 de'],
    ['Esta película es ___ que la primera. (malo)', 'peor', ['más mala', 'más mal', 'malísima que'], 'malo 的比较级是 peor'],
    ['El billete cuesta más ___ doscientos euros.', 'de', ['que', 'como', 'a'], '和数字比较用 de']],
  dialog: [['A', '¿Qué piso te gusta más?', '你更喜欢哪套房？'], ['B', 'El primero es más grande, pero está más lejos del centro.', '第一套大一些，但离市中心远。'], ['A', 'Y el segundo es carísimo.', '第二套又特别贵。'], ['B', 'Sí, pero tiene la mejor cocina de los tres.', '是，但它的厨房是三套里最好的。'], ['A', 'Para mí, lo más importante es la luz.', '对我来说，最重要的是采光。']]
});

COURSE.push({ id: 'a2-09', lv: 'A2', unit: '说得更准', title: '命令式', goal: '给指示、提建议、请人做事',
  notes: [
`## 对 tú 的肯定命令
和现在时第三人称单数一样：*habla, come, escribe, cierra, vuelve*。
八个不规则：*di*（decir）、*haz*（hacer）、*ve*（ir）、*pon*（poner）、*sal*（salir）、*sé*（ser）、*ten*（tener）、*ven*（venir）。`,
`## 对 vosotros 和 usted
- vosotros：原形的 -r 换成 -d：*hablad, comed, venid*（只在西班牙用）
- usted / ustedes 用虚拟式的形式：*hable, coma, venga, pase, siga, perdone*。常见的固定说法：*Pase, pase.*（请进）、*Perdone.*（对不起/劳驾）、*Dígame.*（请讲）`,
`## 代词接在后面
肯定命令式的代词接在动词后，写成一个词，注意加重音符号：
*Dime.*（告诉我）　*Siéntate.*（坐下）　*Dámelo.*（把它给我）　*Espérame.*（等我）
西班牙人日常用命令式很多，不算粗鲁：*Oye, pásame la sal.* 加上 *por favor* 或 *anda* 就很自然。`,
`## 否定命令（先认识）
否定要换成虚拟式：*No hables.*　*No comas eso.*　*No te preocupes.*（别担心）　到 B1 会系统学。`],
  items: [
    ['mira', '你看'], ['oye', '喂；听我说'], ['dime', '告诉我；（接电话）请讲'], ['pasa', '进来'], ['espera', '等一下'], ['ven', '过来'], ['siéntate', '坐下'], ['perdone', '对不起；劳驾（对您）'],
    ['Ven aquí un momento', '过来一下'], ['Pon la mesa, por favor', '请摆一下餐具'],
    ['Sigue todo recto y gira a la izquierda', '一直走然后左转'], ['Dime la verdad', '跟我说实话'],
    ['Haz los deberes antes de cenar', '晚饭前把作业做了'], ['No te preocupes, yo lo hago', '别担心，我来做']],
  drills: [
    ['___ la puerta, por favor. (cerrar, tú)', 'Cierra', ['Cierre', 'Cerra', 'Cierras'], 'tú 的命令式 = 现在时第三人称单数，cerrar 变音'],
    ['___ aquí. (venir, tú)', 'Ven', ['Viene', 'Vene', 'Venga'], 'venir 不规则：ven'],
    ['___ me la verdad. (decir, tú)', 'Di', ['Dice', 'Diga', 'Dices'], 'decir 不规则：di → dime'],
    ['Chicos, ___ los libros. (abrir, vosotros)', 'abrid', ['abrís', 'abran', 'abre'], 'vosotros：-r 换成 -d'],
    ['___ usted, por favor. (pasar)', 'Pase', ['Pasa', 'Pasad', 'Pasas'], 'usted 用虚拟式形式：pase'],
    ['___ la compra en la cocina. (poner, tú)', 'Pon', ['Pone', 'Ponga', 'Pones'], 'poner 不规则：pon']],
  dialog: [['A', 'Oye, ven un momento, por favor.', '喂，过来一下好吗。'], ['B', 'Dime, ¿qué pasa?', '说吧，怎么了？'], ['A', 'Mira este correo y dime qué te parece.', '看看这封邮件，告诉我你觉得怎么样。'], ['B', 'Espera… Está bien, pero cambia el final.', '等等……挺好，不过把结尾改一下。'], ['A', 'Vale. Siéntate y ayúdame, anda.', '好。坐下帮帮我吧。']]
});

COURSE.push({ id: 'a2-10', lv: 'A2', unit: '生活场景', title: '身体与看病', goal: '说哪里不舒服，听懂医生的建议',
  notes: [
`## doler：和 gustar 一个逻辑
*Me duele la cabeza.*（我头疼）　*Me duelen los pies.*（我脚疼）
身体部位用定冠词，不用物主词：说 *me duele la espalda*，不说 ✗ *mi espalda*。
也可以用 *tener dolor de*：*Tengo dolor de estómago.*`,
`## 常见症状
*tener fiebre*（发烧）、*tener tos*（咳嗽）、*estar resfriado*（感冒了）、*estar mareado*（头晕）、*tener alergia a*（对……过敏）、*encontrarse mal*（不舒服）：*Me encuentro fatal.*`,
`## 建议和义务
- *tener que + 原形*：必须 — *Tienes que descansar.*
- *deber + 原形*：应该 — *Debes beber más agua.*
- *hay que + 原形*：（任何人都）得 — *Hay que pedir cita.*
- *es mejor / es importante + 原形*：*Es mejor ir al médico.*
- *¿Por qué no…?*：*¿Por qué no te tomas un día libre?*`,
`## 在西班牙看病
先去 *centro de salud* 找家庭医生（*médico de cabecera*），要预约（*pedir cita*）。急事去 *urgencias*。药店（*farmacia*）有绿色十字标志，很多小毛病药剂师就能给建议。`],
  items: [
    ['la cabeza', '头'], ['la espalda', '背'], ['el estómago', '胃'], ['la garganta', '喉咙'], ['la fiebre', '发烧'], ['la receta', '处方；食谱'], ['la cita', '预约'], ['la pastilla', '药片'],
    ['Me duele mucho la cabeza', '我头很疼'], ['Tengo fiebre y me encuentro fatal', '我发烧了，很难受'],
    ['Tienes que ir al médico', '你得去看医生'], ['Quería pedir cita para mañana', '我想预约明天'],
    ['Tome una pastilla cada ocho horas', '每八小时吃一片'], ['Soy alérgico a la penicilina', '我对青霉素过敏']],
  drills: [
    ['Me ___ los ojos.', 'duelen', ['duele', 'dolen', 'duelo'], 'los ojos 是复数 → duelen'],
    ['Me duele ___ garganta.', 'la', ['mi', 'una', 'mí'], '身体部位用定冠词'],
    ['___ que beber mucha agua. (任何人)', 'Hay', ['Tiene', 'Es', 'Debe'], 'hay que + 原形：泛指的义务'],
    ['Tienes que ___ en casa. (quedarse)', 'quedarte', ['te quedas', 'quedarse', 'quedas'], '原形后的反身代词要跟主语一致：quedarte'],
    ['___ resfriado desde el lunes. (yo)', 'Estoy', ['Soy', 'Tengo', 'Hago'], '感冒了 = estar resfriado']],
  dialog: [['A', 'Buenos días. ¿Qué le pasa?', '早上好。您哪里不舒服？'], ['B', 'Me duele la garganta y tengo fiebre desde ayer.', '我喉咙疼，从昨天开始发烧。'], ['A', '¿Tiene tos?', '咳嗽吗？'], ['B', 'Sí, sobre todo por la noche.', '咳，尤其是晚上。'], ['A', 'Es una infección. Tiene que tomar este antibiótico y descansar.', '是感染。您得吃这个抗生素，然后休息。'], ['B', 'De acuerdo. ¿Me puede dar un justificante para el trabajo?', '好的。能给我开一张病假证明吗？']]
});

COURSE.push({ id: 'a2-11', lv: 'A2', unit: '生活场景', title: '将来时', goal: '预测、承诺、猜测',
  notes: [
`## 变位：原形 + 词尾
三类动词词尾相同：*-é, -ás, -á, -emos, -éis, -án*
*hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán*`,
`## 十二个不规则词干
词尾不变，只是词干变了：
*tener → tendr-*、*poner → pondr-*、*salir → saldr-*、*venir → vendr-*、*valer → valdr-*、*poder → podr-*、*saber → sabr-*、*haber → habr-*、*caber → cabr-*、*querer → querr-*、*hacer → har-*、*decir → dir-*
*Mañana hará sol.*　*Te lo diré luego.*`,
`## 怎么用
- 预测：*El año que viene habrá elecciones.*
- 承诺：*Te llamaré esta noche.*
- 对现在的猜测（很常用）：—*¿Dónde está Juan?* —*Estará en casa.*（大概在家吧）　*¿Qué hora será?*（现在几点了呢？）
- 条件句：*Si + 现在时, 将来时*：*Si llueve, nos quedaremos en casa.*（si 后面不能用将来时）
日常说计划，*ir a + 原形* 比将来时更常用。`],
  items: [
    ['el futuro', '未来'], ['pronto', '很快'], ['dentro de', '……之后'], ['seguro', '肯定；安全的'], ['a lo mejor', '也许'], ['si', '如果'], ['tendré', '我将有'], ['hará', '他将做；天气将'],
    ['Mañana lloverá en el norte', '明天北部有雨'], ['Te llamaré cuando llegue', '我到了给你打电话'],
    ['Si tengo tiempo, iré a verte', '如果有时间，我会去看你'], ['Dentro de un año hablaré mejor', '一年后我会说得更好'],
    ['¿Dónde estará mi móvil?', '我的手机会在哪儿呢？'], ['No te preocupes, todo saldrá bien', '别担心，一切都会顺利的']],
  drills: [
    ['Mañana ___ contigo. (hablar, yo)', 'hablaré', ['hablé', 'hablaría', 'hablo'], '原形 + é'],
    ['¿___ venir a la fiesta? (poder, vosotros)', 'Podréis', ['Poderéis', 'Podéis', 'Podrás'], 'poder → podr-'],
    ['El sábado ___ buen tiempo. (hacer)', 'hará', ['hacerá', 'haré', 'hace'], 'hacer → har-'],
    ['Si ___ dinero, compraré un coche. (tener, yo)', 'tengo', ['tendré', 'tenga', 'tenía'], 'si 后面用现在时，不用将来时'],
    ['—¿Quién llama? —___ mi madre. (ser)', 'Será', ['Es', 'Fue', 'Sea'], '将来时表示对现在的猜测'],
    ['Te lo ___ mañana. (decir, yo)', 'diré', ['deciré', 'digo', 'dijé'], 'decir → dir-']],
  dialog: [['A', '¿Qué harás cuando termines el curso?', '课程结束后你打算做什么？'], ['B', 'Buscaré trabajo aquí. Si no encuentro nada, volveré a China.', '在这儿找工作。找不到的话就回中国。'], ['A', 'Seguro que encontrarás algo. Hablas muy bien.', '你肯定能找到。你说得很好。'], ['B', 'Gracias. ¿Y tú? ¿Vendrás a verme?', '谢谢。你呢？会来看我吗？'], ['A', 'Claro, iré en verano. ¡Te lo prometo!', '当然，我夏天去。我保证！']]
});

COURSE.push({ id: 'a2-12', lv: 'A2', unit: '生活场景', title: '旅行与住宿', goal: '订房、买票、礼貌地提要求',
  notes: [
`## 条件式：礼貌的万能钥匙
变位是原形 + *-ía, -ías, -ía, -íamos, -íais, -ían*，不规则词干和将来时一样（*tendría, podría, haría*）。
- *Me gustaría reservar una habitación.*（我想订一间房）
- *¿Podría decirme dónde está la estación?*（您能告诉我车站在哪儿吗？）
- *¿Le importaría hablar más despacio?*（您介意说慢一点吗？）
- 建议：*Yo que tú, iría en tren.*（我要是你，就坐火车去）`,
`## 订房和入住
*una habitación individual / doble*（单人/双人间）、*con baño*、*con desayuno incluido*、*para dos noches*、*a nombre de…*（用……的名字）、*la reserva*（预订）、*¿A qué hora hay que dejar la habitación?*（几点退房？）`,
`## 买票和交通
*un billete de ida / de ida y vuelta*（单程/往返票；拉美说 *boleto*）、*el andén*（站台）、*el retraso*（晚点）、*hacer transbordo*（换乘）、*la tarjeta de embarque*（登机牌）、*facturar la maleta*（托运行李）。
西班牙的高铁叫 AVE，长途大巴便宜，城市之间也很方便。`],
  items: [
    ['la habitación', '房间'], ['la reserva', '预订'], ['el billete', '票', '拉美说 boleto'], ['ida y vuelta', '往返'], ['el andén', '站台'], ['la maleta', '行李箱'], ['el retraso', '晚点'], ['me gustaría', '我想要（委婉）'],
    ['Me gustaría reservar una habitación doble', '我想订一间双人房'], ['Tengo una reserva a nombre de Li', '我有预订，名字是李'],
    ['¿El desayuno está incluido?', '含早餐吗？'], ['Quería un billete de ida y vuelta a Sevilla', '我要一张去塞维利亚的往返票'],
    ['¿Podría decirme de qué andén sale?', '您能告诉我从哪个站台发车吗？'], ['El vuelo tiene una hora de retraso', '航班晚点一小时']],
  drills: [
    ['Me ___ reservar una mesa para dos. (gustar)', 'gustaría', ['gusta', 'gustará', 'gustaba'], '委婉表达愿望用条件式'],
    ['¿___ ayudarme con la maleta? (poder, usted)', 'Podría', ['Podrá', 'Podía', 'Podré'], 'poder → podr- + ía'],
    ['Un billete de ida y ___, por favor.', 'vuelta', ['vuelto', 'volver', 'regresa'], '往返 = ida y vuelta'],
    ['Tengo una reserva ___ nombre de Wang.', 'a', ['en', 'con', 'por'], 'a nombre de = 以……的名字'],
    ['Yo que tú, ___ antes. (salir)', 'saldría', ['saliría', 'saldré', 'salía'], 'salir → saldr- + ía']],
  dialog: [['A', 'Buenas tardes. Tengo una reserva a nombre de Chen.', '下午好。我有预订，名字是陈。'], ['B', 'Sí, una habitación doble para tres noches. ¿Me deja su pasaporte?', '是的，一间双人房，三晚。能给我您的护照吗？'], ['A', 'Aquí tiene. ¿El desayuno está incluido?', '给您。含早餐吗？'], ['B', 'Sí, se sirve de siete a diez y media.', '含，七点到十点半供应。'], ['A', 'Perfecto. ¿Y podría recomendarme un restaurante por aquí?', '太好了。您能给我推荐附近的餐厅吗？'], ['B', 'Claro. Hay uno muy bueno a dos calles. Yo que usted, reservaría.', '当然。隔两条街有一家很好。我要是您，就先订位。']]
});
