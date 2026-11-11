'use strict';
/* B1–C2 大纲（联网后由 AI 按要点生成课文）、语法手册、对话情景、分级测试、发音练习、母语资源。 */

/* [id, 级别, 单元, 课题, 教学要点] */
const SYLLABUS = [
  ['b1-01', 'B1', '虚拟式入门', '虚拟式现在时：怎么变', '虚拟式现在时的规则变位（-ar→e，-er/-ir→a）、从 yo 形式推导（tenga, haga, conozca）、变音动词、六个完全不规则（sea, esté, vaya, haya, sepa, dé）；先建立“主句态度 + que + 虚拟式”的整体概念'],
  ['b1-02', 'B1', '虚拟式入门', '愿望与请求', 'querer / esperar / pedir / necesitar / preferir + que + 虚拟式；主语相同用原形、主语不同用 que + 虚拟式；ojalá；祝愿语 que te mejores, que aproveche, que tengas buen viaje'],
  ['b1-03', 'B1', '虚拟式入门', '情感与评价', 'me alegra / me molesta / me da miedo / me sorprende que + 虚拟式；es importante / es normal / es una pena / qué bien que + 虚拟式；与 es verdad / está claro que + 陈述式对比'],
  ['b1-04', 'B1', '虚拟式入门', '怀疑与否定的看法', 'creo / pienso que + 陈述式 对 no creo / no pienso que + 虚拟式；dudar que；quizá(s)、tal vez、probablemente 的语气选择；a lo mejor 只跟陈述式'],
  ['b1-05', 'B1', '虚拟式入门', '完整的命令式', '否定命令式（no hables, no vengas）、usted/ustedes/nosotros 命令式、代词在肯定与否定命令中的位置（dímelo / no me lo digas）、日常指令与劝告'],
  ['b1-06', 'B1', '讲述与转述', '过去完成时与叙事', 'había + 分词 表示“过去的过去”；四种过去时在叙事里的分工；ya / todavía no / nunca 与过去完成时；讲一段完整的经历'],
  ['b1-07', 'B1', '讲述与转述', '转述别人的话', '间接引语（主句现在时）：dice que、pregunta si / qué / dónde、pide que + 虚拟式；人称、指示词和 ir/venir、traer/llevar 的转换'],
  ['b1-08', 'B1', '讲述与转述', '时间从句', 'cuando / en cuanto / hasta que / mientras + 虚拟式（指将来）对 + 陈述式（指习惯或过去）；antes de que / después de que；antes de + 原形'],
  ['b1-09', 'B1', '讲述与转述', '原因、目的与结果', 'porque / como / es que / ya que；para + 原形 对 para que + 虚拟式；así que / por eso / entonces；用这些词把句子连成一段话'],
  ['b1-10', 'B1', '工作与社会', '找工作与面试', '简历、求职信、面试常见问题与回答；合同类型、薪资、工作时间的词汇；用条件式和 me gustaría 得体地表达期望；西班牙职场礼仪'],
  ['b1-11', 'B1', '工作与社会', '办公室沟通', '工作邮件的格式与套语（Estimado…, Un saludo）、打电话、开会、请假；tú 与 usted 的切换；正式与非正式语域的对比'],
  ['b1-12', 'B1', '工作与社会', 'por 和 para', 'por：原因、交换、经过、时段、手段、被动施事；para：目的、对象、期限、方向、观点；固定搭配（por cierto, por fin, para siempre）；中国学习者常见混淆'],
  ['b1-13', 'B1', '工作与社会', '关系从句', 'que / quien / donde / lo que；介词 + el que / la que；先行词确定用陈述式，不确定或不存在用虚拟式（Busco a alguien que sepa chino）'],
  ['b1-14', 'B1', '生活与观点', '表达观点与讨论', 'me parece que、desde mi punto de vista、estoy (totalmente) de acuerdo、no estoy de acuerdo、depende、puede ser、tienes razón；礼貌地反驳和让步'],
  ['b1-15', 'B1', '生活与观点', '条件式与假设', '条件式简单时的变位与用法（建议、愿望、委婉、推测过去）；si + 现在时 的真实条件；初识 si + 虚拟式过去未完成时 + 条件式（Si tuviera dinero, viajaría）'],
  ['b1-16', 'B1', '生活与观点', '无人称与被动的 se', 'se + 第三人称表示泛指（Se vive bien aquí）、被动（Se venden pisos）、se dice que；与 uno、la gente、第三人称复数的泛指对比；告示与说明里的用法'],
  ['b1-17', 'B1', '生活与观点', '租房与办手续', '在西班牙生活的实用场景：NIE、empadronamiento、开银行账户、租房合同、押金（fianza）、水电网；与房东和窗口人员沟通'],
  ['b1-18', 'B1', '生活与观点', '把故事讲得自然', '口语叙事的连接和填充：pues、bueno、o sea、es que、resulta que、total que、al final；听话人的反应（¿en serio?、¡no me digas!、¡qué fuerte!）'],

  ['b2-01', 'B2', '虚拟式进阶', '虚拟式过去未完成时', '从简单过去时第三人称复数推导（-ra / -se 两套词尾）；主句为过去或条件式时的使用；quisiera 的礼貌用法；ojalá + 过去未完成时表示不太可能的愿望'],
  ['b2-02', 'B2', '虚拟式进阶', '不可能的假设', '第二类条件句（Si tuviera…, …ía）、第三类条件句（Si hubiera tenido…, habría / hubiera…）、混合条件句；como si + 虚拟式；de haberlo sabido'],
  ['b2-03', 'B2', '虚拟式进阶', '虚拟式的时态对应', '虚拟式现在完成时与过去完成时的构成；主句时态决定从句时态的规则（concordancia temporal）；Me alegro de que hayas venido / Me alegró que vinieras'],
  ['b2-04', 'B2', '虚拟式进阶', '让步句', 'aunque + 陈述式（事实）对 + 虚拟式（假设或不在乎）；a pesar de que、por mucho / más que、por muy … que、digan lo que digan 这类重复结构'],
  ['b2-05', 'B2', '虚拟式进阶', '转述过去说的话', '间接引语（主句过去时）的时态后退：现在时→过去未完成时、将来时→条件式、命令式→虚拟式过去未完成时；时间地点词的转换'],
  ['b2-06', 'B2', '精准表达', 'ser 与 estar 进阶', '随动词变义的形容词全表；ser + 分词（动作被动）对 estar + 分词（结果状态）；estar de、estar para、estar por 的含义；常见的高级错误'],
  ['b2-07', 'B2', '精准表达', '动词短语进阶', 'ponerse a、echarse a、romper a、llegar a、acabar + 副动词、ir + 副动词、andar + 副动词、tener / llevar / dejar + 分词、estar a punto de、soler'],
  ['b2-08', 'B2', '精准表达', '“变成”怎么说', 'ponerse、volverse、hacerse、quedarse、convertirse en、llegar a ser 的区别：变化的性质（暂时/永久、主动/被动、好/坏）和搭配的词类'],
  ['b2-09', 'B2', '精准表达', '动词和它的介词', '固定带介词的动词：depender de、contar con、soñar con、fijarse en、acordarse de、darse cuenta de、insistir en、enamorarse de、confiar en、negarse a 等；与中文和英语的差异'],
  ['b2-10', 'B2', '精准表达', '关系从句进阶', 'el cual、quien、cuyo、介词 + 关系词的完整体系；解释性与限定性从句（逗号的作用）；lo cual 指代整句；书面语里的用法'],
  ['b2-11', 'B2', '精准表达', '连接词与篇章', '转折（sin embargo、no obstante、en cambio）、因果（por lo tanto、por consiguiente、debido a）、补充（además、es más、de hecho）、总结（en resumen、en definitiva）；把一段论述写得有条理'],
  ['b2-12', 'B2', '社会与职场', '读懂新闻', '新闻标题的省略和名词化、被动结构、表示“据称”的条件式（habría dimitido）、según / de acuerdo con；西班牙主要媒体与政治、经济、社会版常用词'],
  ['b2-13', 'B2', '社会与职场', '开会、汇报与谈判', '主持和参加会议的用语、做报告的结构语、表达条件和让步、礼貌地坚持立场、达成协议；制造业和国际贸易场景的词汇'],
  ['b2-14', 'B2', '社会与职场', '正式书信与投诉', '正式信函的格式和套语、投诉信（hoja de reclamaciones）、申请信；条件式和虚拟式的礼貌用法；Le agradecería que…、Me veo obligado a…'],
  ['b2-15', 'B2', '社会与职场', '讨论社会话题', '住房、就业、环境、科技、人口等话题的词汇和常见论点；提出论据、举例、反驳、让步后再坚持的完整论证套路'],
  ['b2-16', 'B2', '口语与文化', '西班牙人的日常口语', '高频口语词：tío / tía、vale、guay、mola、flipar、currar、pasta、quedar、liarse、qué va、ni idea、menos mal、en plan；使用场合和强度'],
  ['b2-17', 'B2', '口语与文化', '常用习语', '身体、食物、动物相关的常用习语：meter la pata、tomar el pelo、estar en las nubes、costar un ojo de la cara、ser pan comido、dar en el clavo、echar una mano 等，各自的语境'],
  ['b2-18', 'B2', '口语与文化', '西语世界一览', '西班牙各自治区的特点与共同官方语言；西班牙与墨西哥、阿根廷、哥伦比亚等地在发音、语法（vosotros / ustedes、voseo）、日常词汇上的主要差异'],

  ['c1-01', 'C1', '语法的细处', '虚拟式的细微之处', 'el hecho de que、no es que … sino que、de ahí que、no porque、sin que；独立句中的虚拟式（Que yo sepa、Que conste、Venga quien venga）；语气选择带来的意思差别'],
  ['c1-02', 'C1', '语法的细处', '推测与估计的体系', '将来时和条件式表推测（Serán las diez / Serían las diez）、将来完成时（Habrá salido）、deber de、tener que、igual / lo mismo / a lo mejor / puede que 的确信程度'],
  ['c1-03', 'C1', '语法的细处', 'se 的全部用法', '反身、相互、无人称、被动、le→se 之外：体貌的 se（comerse、beberse、irse、dormirse）、非故意的 se（Se me ha caído、Se le olvidó）、词义改变的 se（quedar/quedarse、acordar/acordarse）'],
  ['c1-04', 'C1', '语法的细处', '语序与强调', '主题前置与代词复指（El libro lo compré ayer）、强调结构（Fue ayer cuando…、Lo que quiero es…）、lo + 形容词、主语后置的语用效果、sí que 的强调'],
  ['c1-05', 'C1', '语法的细处', '条件的各种说法', 'con tal de que、siempre que、siempre y cuando、a no ser que、salvo que、en caso de que、como + 虚拟式（警告）、de + 原形、副动词表条件'],
  ['c1-06', 'C1', '书面与论证', '名词化与抽象表达', '用名词结构代替从句（la subida de los precios、el hecho de + 原形）、el que + 虚拟式、形容词名词化；学术和报告文体的句式'],
  ['c1-07', 'C1', '书面与论证', '高级连接词与论证', 'ahora bien、con todo、dicho esto、habida cuenta de、en la medida en que、a raíz de、de modo que、si bien；让步—反驳—结论的论证结构'],
  ['c1-08', 'C1', '书面与论证', '报告、综述与评论', '写工作报告、内容综述和评论文章的结构与用语；客观转述他人观点的动词（señalar、sostener、plantear、cuestionar）；避免重复的指代手段'],
  ['c1-09', 'C1', '口语的肌理', '缓和与礼貌策略', '用条件式、过去未完成时、指小词、un poco / algo、no sé si…、igual… 来缓和请求、拒绝、批评和不同意见；西班牙人直接与委婉的界限'],
  ['c1-10', 'C1', '口语的肌理', '话语标记词', 'pues、bueno、vamos、hombre、mujer、anda、venga、a ver、mira、oye、es que、o sea、en plan、¿sabes?、¿no? 在真实对话里各自的功能和语调'],
  ['c1-11', 'C1', '口语的肌理', '俚语与语域切换', '年轻人用语和通俗口语（mazo、rollo、tronco、pillar、rayarse、petarlo、estar hasta las narices）；同一个意思在俗语、口语、中性、正式语域的说法；什么场合该用哪一种'],
  ['c1-12', 'C1', '口语的肌理', '习语与夸张的比喻', '高频成语和固定比较（más listo que el hambre、estar como una cabra、no tener ni pies ni cabeza、a buenas horas、por si las moscas）；来历、语气和使用限制'],
  ['c1-13', 'C1', '词汇的精度', '近义词辨析', 'mirar / ver / observar / contemplar；decir / contar / comentar / afirmar / asegurar；saber / conocer / enterarse；pedir / preguntar / solicitar；cambiar / mudarse / trasladar 等常用近义组'],
  ['c1-14', 'C1', '词汇的精度', '词语搭配', '动名搭配（tomar una decisión、prestar atención、cometer un error、dar un paseo、llevar a cabo、poner en marcha）、形名和副形搭配；中文直译造成的搭配错误'],
  ['c1-15', 'C1', '词汇的精度', '幽默、反讽与双关', '西班牙式幽默的常见手法：反讽（¡Qué bien!、Muy bonito）、夸张、自嘲、文字游戏；识别语调和语境线索；什么时候不能当真'],
  ['c1-16', 'C1', '词汇的精度', '当代西班牙社会', '国家体制与自治区、多语言状况、作息与节庆、家庭与工作观念、饮食文化；客观中立地介绍，并配相关词汇和常见讨论用语'],

  ['c2-01', 'C2', '语感', '言外之意', '同一句话在不同语境下的实际意思；暗示、客套与真实意图的区别（A ver si quedamos、Ya te llamaré）；沉默、打断和重叠说话在西班牙对话中的含义'],
  ['c2-02', 'C2', '语感', '谚语与俗语', '最常用的二三十条 refranes（A quien madruga…、Más vale tarde…、En casa del herrero…）：含义、只说半句的习惯、适用场合和变体'],
  ['c2-03', 'C2', '语感', '语气小品词', '感叹和估量的结构：¡Menudo…!、¡Vaya…!、¡Anda que…!、¡Si será…!、¡Ni que fuera…!、¡Como para…!、Lo + 形容词 + que；语调与褒贬'],
  ['c2-04', 'C2', '语感', '文化典故', '母语者默认共享的引用：《堂吉诃德》和经典文学里的说法、历史与宗教典故、家喻户晓的影视和广告语、足球与斗牛衍生的表达'],
  ['c2-05', 'C2', '变体与文体', '方言与变体', '安达卢西亚、加那利、加利西亚、加泰罗尼亚地区西语的特点；拉普拉塔河的 voseo、墨西哥、加勒比、安第斯西语的语音和词汇；听懂而不必模仿'],
  ['c2-06', 'C2', '变体与文体', '文学与旧式语言', '虚拟式将来时（fuere、hubiere）在法律和成语中的遗留、-ra 作过去完成时、leísmo / laísmo / loísmo、敬语 vos 与 vuestra merced；读经典文本必备'],
  ['c2-07', 'C2', '变体与文体', '行政与法律语言', '公文和合同的套语与长句（en virtud de、a los efectos oportunos、el abajo firmante）；怎么读懂，以及怎么翻成平实的西语'],
  ['c2-08', 'C2', '变体与文体', '文学阅读', '当代西语小说和散文的叙事技巧：自由间接引语、时态的风格用法、节奏与句长；精读一段原创范文并分析'],
  ['c2-09', 'C2', '母语者水平', '高级写作', '评论、论说文、随笔的谋篇与风格：开头和收尾、句子节奏、避免翻译腔、精确用词；同一段话的三次改写示范'],
  ['c2-10', 'C2', '母语者水平', '正式的口头表达', '演讲、答辩、辩论的结构和修辞（排比、设问、对照）；控制节奏和停顿；即兴应对提问和打断'],
  ['c2-11', 'C2', '母语者水平', '中西互译的难点', '中文和西语在主语省略、话题结构、时体、量词、被动、虚实上的系统差异；中国学习者高级阶段仍会犯的错误与改法'],
  ['c2-12', 'C2', '母语者水平', '抹掉“外国人痕迹”', '母语者一听就知道不是本地人的细节：冠词、代词复指、介词、语序、过度使用主语代词、过于完整的句子；自然的省略、应答和节奏']
];

/* 语法手册：[标题, 级别, 正文] */
const GRAMMAR = [
  ['发音与重音规则', 'A1',
`## 读音
西语拼写和读音基本一一对应。五个元音 *a e i o u* 各只有一个音。
- *c*：在 e、i 前读 [θ]（西班牙）或 [s]（拉美），其他情况读 [k]；*z* 同理读 [θ] / [s]
- *g*：在 e、i 前读 [x]，其他情况读 [g]；*gue / gui* 的 u 不发音，*güe / güi* 的 u 要发音
- *h* 不发音；*j* 读 [x]；*ñ* 读 [ɲ]；*ll / y* 读 [ʝ]；*qu* 读 [k]
- *r*：词首、*rr*、以及 l n s 后面是颤音，其余是轻弹
- *b / v* 同音；在元音之间读得很轻，嘴唇不完全闭合
- *d* 在元音之间和词尾读得很弱：*cansado* 口语里近似 “cansao”
## 重音
- 元音、n、s 结尾：倒数第二音节重读（*mesa, comen*）
- 其他辅音结尾：最后一个音节重读（*papel, ciudad*）
- 不合规则的标重音符号（*sofá, árbol, teléfono*）
- 倒数第三音节重读的词一律标（*médico, sábado*）
- 区分同形词：*tú*（你）/ *tu*（你的），*él*（他）/ *el*（定冠词），*sí*（是）/ *si*（如果），*qué*（疑问）/ *que*（连词），*más*（更）/ *mas*（但是）
## 连读
词尾元音和下一词的词首元音连成一个音节：*mi‿amigo*、*va‿a‿hablar*。辅音结尾和元音开头也连起来读：*los‿amigos*。这是听力难的主要原因。`],
  ['名词、冠词与形容词', 'A1',
`## 性
*-o* 多阳性，*-a* 多阴性。*-ción, -sión, -dad, -tad, -tud, -umbre* 阴性；*-aje, -or, -ma*（希腊词源）多阳性。重读 a 开头的阴性名词单数用 *el*：*el agua fría*、*las aguas*。
## 数
元音结尾 +s，辅音结尾 +es，*-z → -ces*；-s 结尾的非重读词单复同形（*el lunes / los lunes*）。
## 定冠词比中文和英语用得多
- 泛指一类事物：*Me gusta el café.*　*Los perros son fieles.*
- 称谓：*El señor García no está.*（直接称呼时不用）
- 星期、钟点：*el lunes*、*a las tres*
- 身体部位和衣物：*Me lavo las manos.*
## 不用冠词
职业、国籍、宗教在 ser 后：*Es médico.*（有修饰语时要加：*Es un médico excelente.*）；*tener, haber, llevar* 后的非特指名词：*No tengo coche.*
## 形容词
与名词性数一致，通常后置。前置时有的会缩短：*bueno → buen día*、*malo → mal día*、*grande → gran ciudad*、*primero → primer piso*。位置能改变意思：*un hombre pobre*（穷）/ *un pobre hombre*（可怜）；*un amigo viejo*（年老）/ *un viejo amigo*（多年的）。
## lo + 形容词
把形容词变成抽象名词：*lo bueno*（好的方面）、*lo importante es…*、*lo de ayer*（昨天那件事）。`],
  ['代词总表', 'A2',
`| 主格 | 直接宾语 | 间接宾语 | 反身 | 介词后 |
| yo | me | me | me | mí |
| tú | te | te | te | ti |
| él / ella / usted | lo / la | le (se) | se | él / ella / usted / sí |
| nosotros | nos | nos | nos | nosotros |
| vosotros | os | os | os | vosotros |
| ellos / ellas / ustedes | los / las | les (se) | se | ellos / ellas / ustedes / sí |
## 位置
- 变位动词之前：*Te lo digo.*
- 原形、副动词、肯定命令式之后连写：*decírtelo*、*diciéndotelo*、*dímelo*
- 动词短语两头都行：*Te lo voy a decir* = *Voy a decírtelo*
- 否定命令放前面：*No me lo digas.*
## 顺序
se → 第二人称 → 第一人称 → 第三人称：*Se me olvidó.*　*Te lo doy.*
*le / les + lo / la / los / las → se lo…*
## 复指
间接宾语名词出现时通常要再加代词：*Le dije a Juan que viniera.*
宾语提到动词前，必须用代词复指：*A María la vi ayer.*　*El coche lo vendí.*
## 与 con 连用
*conmigo*、*contigo*、*consigo*。
## 主语代词
一般省略。说出来是为了对比或强调：*Yo no lo sé, pregúntale a él.*`],
  ['ser、estar 与 haber', 'A1',
`## ser
身份、定义、职业、国籍、材料、归属；固有特征；时间和日期；事件发生的地点和时间（*La boda es en Toledo*）；被动语态（*fue construido*）。
## estar
位置；状态和情绪；变化的结果（*está roto*）；进行时；*estar de*（临时身份：*está de camarero*）、*estar para*（即将/有心情）、*estar por*（有待/倾向于）。
## 换动词就换意思
| 形容词 | ser | estar |
| listo | 聪明 | 准备好 |
| rico | 富有 | 好吃 |
| malo | 坏 | 生病；难吃 |
| bueno | 好（品质） | 好吃；健康；（口语）身材好 |
| aburrido | 无聊的人/事 | 感到无聊 |
| verde | 绿色的 | 没熟；没经验 |
| atento | 体贴 | 专心 |
| vivo | 机灵 | 活着 |
| orgulloso | 傲慢 | 感到自豪 |
| abierto | 开朗 | 开着 |
## haber
*hay* 表示存在，后面的名词不带定冠词，永远单数：*Hay dos sillas.*　*Había muchos problemas.*（不说 ✗ habían）
*hay que + 原形*：泛指的必须。
作助动词构成所有完成时态。`],
  ['陈述式现在时', 'A1',
`## 规则
*hablar*: -o, -as, -a, -amos, -áis, -an　*comer*: -o, -es, -e, -emos, -éis, -en　*vivir*: -o, -es, -e, -imos, -ís, -en
## 变音（nosotros、vosotros 不变）
- e→ie：*pensar, querer, empezar, entender, preferir, sentir, cerrar*
- o→ue：*poder, volver, dormir, encontrar, recordar, costar*；*jugar* u→ue
- e→i：*pedir, servir, repetir, seguir, vestir, decir*
## yo 不规则
*hago, pongo, salgo, traigo, caigo, tengo, vengo, digo, oigo*；*conozco, parezco, traduzco*（-cer/-cir）；*sé, doy, veo, quepo*
## 完全不规则
*ser, estar, ir, haber*
## 拼写变化
*-ger/-gir → -jo*（*cojo, elijo*）、*-guir → -go*（*sigo*）、*-uir → -uyo*（*construyo*）、*-iar/-uar* 部分加重音（*envío, continúo*）
## 用法
现在和习惯；确定的近期将来（*Mañana te llamo*）；历史现在时；口语里的指令（*Tú te callas*）。`],
  ['过去时全景', 'A2',
`## 四个过去时各管什么
| 时态 | 例 | 用在 |
| 现在完成时 | *he comido* | 未结束的时间段（今天、这周）、经历、与现在有关的事；拉美用得少 |
| 简单过去时 | *comí* | 已结束时间段里的完整事件：ayer、el año pasado、hace… |
| 过去未完成时 | *comía* | 习惯、描述、背景、进行中的动作 |
| 过去完成时 | *había comido* | 另一个过去动作之前已经完成的事 |
## 叙事
背景用未完成时，事件用简单过去时，更早的事用过去完成时：
*Cuando llegué, ya se habían ido. La casa estaba vacía y hacía frío.*
## 标志词
- 现在完成时：*hoy, esta semana, ya, todavía no, alguna vez, nunca, últimamente*
- 简单过去时：*ayer, anoche, el otro día, en 2020, hace dos años, de repente*
- 未完成时：*antes, siempre, todos los días, de niño, mientras*
## 时长
有明确的时长或次数，用简单过去时，即使时间很长：*Viví diez años en Pekín.*　*Fui tres veces.*`],
  ['将来时与条件式', 'A2',
`## 将来时
原形 + *-é, -ás, -á, -emos, -éis, -án*。不规则词干：*tendr-, pondr-, saldr-, vendr-, valdr-, podr-, sabr-, habr-, cabr-, querr-, har-, dir-*。
用法：预测、承诺、对现在的推测（*Tendrá unos cuarenta años*）。
将来完成时 *habré hecho*：将来某时已完成；对过去的推测（*Se habrá perdido*，大概是迷路了）。
## 条件式
原形 + *-ía, -ías, -ía, -íamos, -íais, -ían*，不规则词干同将来时。
用法：
- 礼貌：*¿Podrías ayudarme?*　*Querría / Me gustaría…*
- 建议：*Deberías descansar.*　*Yo que tú, no iría.*
- 假设的结果：*Si pudiera, lo haría.*
- 过去的将来：*Dijo que vendría.*
- 对过去的推测：*Serían las tres cuando llegó.*
- 新闻里的“据称”：*El ministro habría dimitido.*
条件式完成时 *habría hecho*：过去没实现的假设结果。`],
  ['虚拟式：形式', 'B1',
`## 现在时
从陈述式 yo 的形式出发，去 -o，换词尾：-ar → *-e, -es, -e, -emos, -éis, -en*；-er/-ir → *-a, -as, -a, -amos, -áis, -an*。
所以 yo 不规则的会一直不规则：*tenga, haga, diga, salga, conozca, vea*。
变音：-ar/-er 同陈述式（*piense, pensemos*）；-ir 动词 nosotros、vosotros 也变（*durmamos, pidamos, sintamos*）。
六个不规则：*ser → sea*、*estar → esté*、*ir → vaya*、*haber → haya*、*saber → sepa*、*dar → dé*。
## 过去未完成时
简单过去时第三人称复数去掉 *-ron*，加 *-ra, -ras, -ra, -ramos, -rais, -ran*（或 *-se* 一套）：*hablaron → hablara*、*tuvieron → tuviera*、*fueron → fuera*、*dijeron → dijera*。nosotros 加重音符号：*habláramos*。
## 完成时
*haya + 分词*（现在完成时）、*hubiera / hubiese + 分词*（过去完成时）。
## 时态对应
| 主句 | 从句 |
| 现在、将来、命令 | 虚拟式现在时 / 现在完成时 |
| 过去、条件式 | 虚拟式过去未完成时 / 过去完成时 |`],
  ['虚拟式：用法', 'B1',
`陈述式是在“告知事实”，虚拟式是在“不把它当事实来断言”：它是愿望、评价的对象、未实现或不确定的事。
## 名词从句（…que…）
- 愿望、命令、请求、建议、允许、禁止：*Quiero que vengas.*　*Te recomiendo que lo leas.*
- 情感和评价：*Me alegra que estés aquí.*　*Es raro que no llame.*
- 怀疑、否定、可能：*Dudo que sea verdad.*　*No creo que venga.*　*Es posible que llueva.*
- 肯定的看法和事实用陈述式：*Creo que viene.*　*Es verdad que está cansado.*
- 主语相同用原形：*Quiero ir.*（不说 ✗ Quiero que yo vaya）
## 时间从句
指将来用虚拟式：*Cuando llegues, llámame.*　*Te espero hasta que termines.*
指习惯或过去用陈述式：*Cuando llego, siempre ceno.*
*antes de que* 永远跟虚拟式。
## 目的、条件、让步
*para que*、*sin que*、*a menos que*、*con tal de que*、*en caso de que* 总是跟虚拟式。
*aunque* + 陈述式（虽然，是事实）/ + 虚拟式（即使，假设或无所谓）。
## 关系从句
先行词不确定或不存在：*Busco un piso que tenga terraza.*　*No hay nadie que lo sepa.*
## 独立句
*Ojalá llueva.*　*Quizás venga.*　*Que te vaya bien.*　*Que aproveche.*
## 条件句
*Si tuviera tiempo, iría.*　*Si hubiera sabido, no habría venido.*　*como si* 后面只能跟虚拟式过去时。`],
  ['命令式', 'A2',
`| | 肯定 | 否定 |
| tú | *habla, come* | *no hables, no comas* |
| usted | *hable, coma* | *no hable, no coma* |
| nosotros | *hablemos* | *no hablemos* |
| vosotros | *hablad, comed* | *no habléis, no comáis* |
| ustedes | *hablen, coman* | *no hablen, no coman* |
只有 tú 和 vosotros 的肯定式有自己的形式，其余全是虚拟式。
tú 的不规则：*di, haz, ve, pon, sal, sé, ten, ven*。
## 代词
肯定式接在后面并加重音符号：*dímelo, siéntate, cómpralo*。否定式放前面：*no me lo digas, no te sientes*。
vosotros 加 os 时去掉 -d：*sentaos, callaos*（*idos* 例外）；nosotros 加 nos 时去掉 -s：*vámonos, sentémonos*。
## 更委婉的说法
*¿Puedes…?*　*¿Te importa…?*　*¿Me pasas la sal?*（现在时问句）　*A ver si…*`],
  ['por 与 para、常用介词', 'B1',
`## para：指向终点
目的（*para aprender*）、对象（*para ti*）、期限（*para el lunes*）、方向（*salgo para Madrid*）、观点（*para mí*）、比较（*para su edad, habla muy bien*）。
## por：指向来路
原因（*por la lluvia*）、交换和价格（*por veinte euros*）、经过（*por el parque*）、大致的时间地点（*por la mañana, por aquí*）、手段（*por correo*）、被动施事（*escrito por Cervantes*）、代替（*hazlo por mí*）、频率（*dos veces por semana*）。
## 固定搭配
*por favor, por fin, por supuesto, por cierto, por lo menos, por si acaso, por eso, por ahora, para siempre, para colmo, para nada*
## a
方向（*voy a casa*）、钟点（*a las tres*）、人作直接宾语时（*Veo a María*，但 *Veo la tele*）、方式（*a mano, a pie*）、间接宾语。
## en
位置（在里面或上面：*en la mesa, en casa*）、交通方式（*en tren*）、月份年份季节（*en mayo*）、花多少时间（*lo hice en una hora*）。
## de
所属、材料、来源、内容（*un vaso de agua*）、话题（*hablar de*）、时间段（*de día, de noche*）。
## 容易错的
*soñar con*（梦见）、*pensar en*（想着）、*casarse con*（和……结婚）、*depender de*、*consistir en*、*entrar en*、*tardar en*。`],
  ['动词短语', 'B1',
`## + 原形
- *ir a*：打算、即将
- *acabar de*：刚刚
- *volver a*：再次
- *empezar a / ponerse a / echarse a*：开始（后两个更突然）
- *dejar de*：停止　*parar de*：停下
- *tener que / deber / haber que*：必须
- *deber de*：大概
- *soler*：通常（只用现在时和未完成时）
- *estar a punto de*：马上就要
- *llegar a*：终于、甚至
- *estar por / para*：有待 / 即将
## + 副动词
- *estar*：正在
- *seguir / continuar*：继续
- *llevar + 时间*：已经……多久
- *ir*：逐渐（*Voy entendiendo*）
- *andar*：到处、老是（带不以为然的口气）
- *acabar / terminar*：最后（*Acabó aceptando*）
## + 过去分词（分词要变性数）
- *tener*：已经做好（*Tengo escritas dos páginas*）
- *llevar*：累计做了（*Llevo leídos tres capítulos*）
- *dejar*：使处于某状态（*Lo dejó terminado*）
- *quedar(se)*：结果处于某状态`],
  ['se 的各种用法', 'B2',
`- **反身**：*Se lava.*
- **相互**：*Se quieren.*　*Nos vemos mañana.*
- **le / les 的替身**：*Se lo dije.*
- **无人称**：*Se vive bien aquí.*　*Se dice que…*（动词永远单数）
- **被动**：*Se venden pisos.*　*Se habla español.*（动词跟着名词变数）
- **非故意**：*Se me cayó el vaso.*　*Se le ha olvidado.*　*Se nos acabó el pan.*（说话人显得不是有意的）
- **体貌 / 强调完成**：*Se comió toda la pizza.*　*Me bebí dos cafés.*　*Se leyó el libro en un día.*
- **改变词义**：
| 不带 se | 带 se |
| *ir* 去 | *irse* 离开 |
| *dormir* 睡 | *dormirse* 睡着 |
| *quedar* 约见；剩下 | *quedarse* 留下 |
| *acordar* 商定 | *acordarse de* 记得 |
| *parecer* 看起来 | *parecerse a* 长得像 |
| *llevar* 带 | *llevarse* 带走；*llevarse bien* 相处得好 |
| *poner* 放 | *ponerse* 穿上；变得；开始 |
| *hacer* 做 | *hacerse* 成为；假装 |`],
  ['连接词速查', 'B2',
`## 补充
*y, además, también, encima*（口语：更过分的是）、*es más, asimismo*（书面）
## 转折
*pero, sin embargo, no obstante*（书面）、*en cambio*（对比）、*sino*（不是……而是：*No es rojo, sino azul*）、*aun así, con todo*
## 原因
*porque, como*（放句首）、*ya que, puesto que, dado que, es que*（口语里解释、找借口）、*debido a, a causa de, gracias a, por culpa de*
## 结果
*así que, por eso, entonces, por (lo) tanto, por consiguiente, de modo que, de ahí que*（+ 虚拟式）
## 让步
*aunque, a pesar de (que), pese a, por mucho que, si bien*
## 条件
*si, como*（+ 虚拟式，警告）、*siempre que, con tal de que, a no ser que, salvo que, en caso de que*
## 目的
*para (que), a fin de (que), con el objetivo de*
## 时间
*cuando, mientras, en cuanto, tan pronto como, hasta que, desde que, antes / después de (que), nada más + 原形*
## 组织话语
*en primer lugar, por un lado… por otro, en cuanto a, respecto a, es decir, o sea, por ejemplo, en resumen, en definitiva, total, que*（口语）`],
  ['间接引语', 'B2',
`主句是现在时，从句时态不变：*Dice que está cansado.*
主句是过去时，从句往后退一步：
| 原话 | 转述 |
| 现在时 *Estoy* | 过去未完成时 *Dijo que estaba* |
| 现在完成时 / 简单过去时 *He ido / Fui* | 过去完成时 *había ido* |
| 未完成时 *Estaba* | 不变 |
| 将来时 *Iré* | 条件式 *iría* |
| 命令式 *Ven* | 虚拟式过去未完成时 *Me dijo que viniera* |
| 虚拟式现在时 | 虚拟式过去未完成时 |
疑问句：*Me preguntó si quería café.*　*Me preguntó (que) dónde vivía.*
时间地点词跟着变：*hoy → ese día*、*mañana → al día siguiente*、*ayer → el día anterior*、*aquí → allí*、*este → ese / aquel*。
方向动词也要换视角：*venir ↔ ir*、*traer ↔ llevar*。
口语里，如果事情现在仍然成立，常不后退：*Me dijo que vive en Madrid.*`],
  ['西班牙与拉美的差异', 'B2',
`## 语法
- 西班牙有 *vosotros*；拉美全用 *ustedes*
- 阿根廷、乌拉圭等地用 *vos*：*vos tenés, vos sos, ¿cómo te llamás?*
- 西班牙多用现在完成时讲“今天”的事，拉美多用简单过去时
- 西班牙常见 *leísmo*（*Le vi* 指男性）
## 发音
- 西班牙区分 [θ]（z, ce, ci）和 [s]；拉美和安达卢西亚、加那利不区分
- 加勒比、安达卢西亚、阿根廷等地音节末的 s 常弱化成气音
- 拉普拉塔河地区 *ll / y* 读成 [ʃ]
## 词汇
| 意思 | 西班牙 | 拉美常见 |
| 电脑 | ordenador | computadora |
| 手机 | móvil | celular |
| 汽车 | coche | carro / auto |
| 公寓 | piso | departamento / apartamento |
| 土豆 | patata | papa |
| 果汁 | zumo | jugo |
| 开车 | conducir | manejar |
| 票 | billete | boleto |
| 好的 | vale | okey / dale / órale / listo |
| 你们 | vosotros | ustedes |
| 酷 | guay / mola | chévere / padre / bacán / copado |
| 钱（口语） | pasta | plata / lana |
| 工作（口语） | curro | chamba / laburo |
| 公交车 | autobús | camión（墨）/ colectivo（阿）/ guagua（加勒比） |
有些词在一边很普通，在另一边是粗话（比如 *coger* 在拉美多地有性含义，那里说 *tomar / agarrar*）。`]
];

/* 对话情景：[id, 级别, 标题, 说明, 给 AI 的角色设定, 开场白] */
const SCENARIOS = [
  ['cafe', 'A1', '在酒吧点东西', '点一杯咖啡和早餐', '你是马德里一家街角酒吧的服务员，热情、语速不快。顾客来吃早餐。', '¡Buenos días! ¿Qué te pongo?'],
  ['intro', 'A1', '认识新朋友', '互相介绍：名字、国籍、工作', '你是在语言交换活动上认识学习者的西班牙人 Marta，28 岁，瓦伦西亚人，做平面设计。你对中国很好奇。', '¡Hola! Soy Marta. ¿Cómo te llamas?'],
  ['direcciones', 'A1', '问路', '你迷路了，向路人问去车站怎么走', '你是塞维利亚街头的一位热心路人。学习者想去火车站 Santa Justa。给出简单清楚的指路。', 'Hola, ¿te puedo ayudar? Pareces un poco perdido.'],
  ['mercado', 'A1', '在市场买水果', '问价、称重、付钱', '你是市场里的水果摊主，爱聊天，会推荐当季水果。', '¡Hola, buenas! ¿Qué te pongo hoy?'],
  ['restaurante', 'A2', '餐厅吃饭', '看菜单、点当日套餐、结账', '你是一家传统西班牙餐厅的服务员。今天的 menú del día 有三个前菜、三个主菜可选，你要向顾客介绍。', 'Buenas tardes. ¿Mesa para uno? Hoy tenemos menú del día.'],
  ['hotel', 'A2', '酒店入住', '办入住，问早餐和 Wi-Fi，房间有点问题', '你是巴塞罗那一家酒店的前台。客人有预订。入住后客人会发现房间空调不好用，你要处理。', 'Buenas tardes, bienvenido. ¿Tiene una reserva?'],
  ['medico', 'A2', '看医生', '描述症状，听懂医嘱', '你是社区卫生中心的家庭医生，耐心、会追问症状细节，最后给出诊断和建议。', 'Buenos días, pase y siéntese. Cuénteme, ¿qué le pasa?'],
  ['finde', 'A2', '聊周末', '讲你周末做了什么，问对方', '你是学习者的西班牙同事 Javi，周一早上在咖啡机旁闲聊。你周末去了山里徒步。', '¡Buenas! ¿Qué tal el finde? ¿Hiciste algo interesante?'],
  ['piso', 'B1', '看房租房', '问房租、押金、水电、室友规矩', '你是马德里 Lavapiés 一套合租公寓的二房东 Lucía，正在带人看房。房租 480 欧，水电另算，押金一个月。你会问对方的工作和生活习惯。', 'Hola, ¿vienes por lo de la habitación? Pasa, pasa, te la enseño.'],
  ['entrevista', 'B1', '工作面试', '介绍经历，回答常见面试问题', '你是一家西班牙工业设备公司的人事经理，正在面试一个需要中文和西语的技术岗位。问题专业但友好，用 usted 开场，可视情况改用 tú。', 'Buenos días, gracias por venir. Para empezar, hábleme un poco de usted.'],
  ['banco', 'B1', '办手续', '在银行开户，被要求提供各种文件', '你是银行柜员。开户需要 NIE、护照、住址证明和工作合同，学习者少带了一样。你按规定办事，但愿意给出解决办法。', 'Buenos días. ¿En qué puedo ayudarle?'],
  ['opinion', 'B1', '说服朋友', '周末去哪儿，你们意见不一样', '你是学习者的朋友 Dani。你想周末去海边，学习者有别的想法。你会坚持自己的理由，但可以被好的论据说服。', 'Oye, este finde hace bueno. Yo digo que vayamos a la playa, ¿no?'],
  ['reunion', 'B2', '工作会议', '汇报项目延期并提出方案', '你是西班牙客户公司的项目负责人 Carmen。供应商（学习者）的交货要延期两周，你不满意，会追问原因、要求补救方案和书面承诺，语气职业而坚定。', 'Bueno, vamos al grano. Me han dicho que hay un problema con los plazos. ¿Qué ha pasado exactamente?'],
  ['reclamacion', 'B2', '投诉', '网购的东西有问题，打客服电话', '你是一家电商的客服。按流程办事，一开始会推脱（过了退货期），如果顾客论据充分、态度坚决，你会让步。', 'Atención al cliente, le atiende Raúl. ¿En qué puedo ayudarle?'],
  ['debate', 'B2', '观点辩论', '远程办公好还是坐班好', '你喜欢辩论，立场是“办公室坐班对团队更好”。你会认真反驳学习者的论点、举例子、偶尔让步，但不轻易认输。', 'A ver, yo lo tengo claro: el teletrabajo está sobrevalorado. ¿Tú qué opinas?'],
  ['bar', 'C1', '酒吧闲聊', '和西班牙朋友用地道口语瞎聊', '你是马德里人 Álex，三十出头，和朋友（学习者）在酒吧喝东西。用非常自然的口语：tío、en plan、qué fuerte、mazo、flipar、es que 等，话题跳跃，会开玩笑、会吐槽工作和房租。', 'Tío, no veas la semanita que llevo… Necesitaba esta caña como el comer. ¿Y tú qué, cómo vas?'],
  ['negociacion', 'C1', '商务谈判', '谈价格、交期和付款条件', '你是西班牙一家分销商的采购总监。你想压价 12%、延长付款期到 90 天。你老练、礼貌、善用委婉语和停顿，让步时必须换取对等条件。', 'Le agradezco que haya venido hasta aquí. Hemos estudiado su oferta con detalle y, si le parece, entramos directamente en materia.'],
  ['tertulia', 'C2', '电台讨论', '参加一档时事讨论节目', '你是西班牙一档电台 tertulia 的主持人，语速快、爱打断、会用反讽和成语，会突然把话题抛给嘉宾（学习者）并追问。话题：年轻人买不起房。保持客观，不偏向任何政党。', 'Muy buenas tardes y bienvenidos. Hoy hablamos de vivienda, que es el tema, ¿eh?, EL tema. Y tenemos con nosotros a un invitado que lo ve desde fuera. A ver, cuéntenos: ¿cómo se ve esto con ojos de extranjero?']
];

/* 分级测试：[级别, 题目, 选项, 正确下标] */
const PLACEMENT = [
  ['A1', '—¿Cómo te llamas? —___ Ana.', ['Me llamo', 'Te llamas', 'Se llama', 'Llamo'], 0],
  ['A1', 'Nosotros ___ en una fábrica.', ['trabajan', 'trabajamos', 'trabajáis', 'trabajo'], 1],
  ['A1', 'Madrid ___ en el centro de España.', ['es', 'hay', 'está', 'tiene'], 2],
  ['A1', 'Me ___ mucho los gatos.', ['gusta', 'gusto', 'gustan', 'gustas'], 2],
  ['A2', 'Esta mañana ___ muy temprano.', ['me he levantado', 'me levantaba', 'me levanto', 'levantado'], 0],
  ['A2', 'Ayer ___ al cine con mis amigos.', ['iba', 'fui', 'he ido', 'voy'], 1],
  ['A2', 'Cuando era niño, ___ en un pueblo.', ['viví', 'he vivido', 'vivía', 'vivo'], 2],
  ['A2', '—¿Le has dado el libro a Juan? —Sí, ya ___ he dado.', ['le lo', 'se lo', 'lo le', 'se le'], 1],
  ['B1', 'Espero que ___ un buen viaje.', ['tienes', 'tendrás', 'tengas', 'tener'], 2],
  ['B1', 'Cuando ___ a casa, te llamo.', ['llego', 'llegaré', 'llegue', 'llegaría'], 2],
  ['B1', 'No creo que ___ razón.', ['tiene', 'tenga', 'tendrá', 'tenía'], 1],
  ['B1', 'Este regalo es ___ ti. Lo compré ___ veinte euros.', ['por / para', 'para / por', 'para / para', 'por / por'], 1],
  ['B2', 'Si ___ más tiempo, aprendería a tocar el piano.', ['tengo', 'tendría', 'tuviera', 'tenga'], 2],
  ['B2', 'Me dijo que ___ al día siguiente.', ['vendrá', 'viene', 'vendría', 'venga'], 2],
  ['B2', 'Aunque ___ mucho mañana, iremos a la playa.', ['llueva', 'lloverá', 'llovía', 'llovería'], 0],
  ['B2', 'Con los años se ___ muy desconfiado.', ['ha puesto', 'ha vuelto', 'ha hecho', 'ha quedado'], 1],
  ['C1', 'Si lo ___ antes, no habría venido.', ['sabría', 'supiera', 'hubiera sabido', 'he sabido'], 2],
  ['C1', 'No es que no ___, es que no puedo.', ['quiero', 'quiera', 'querría', 'quise'], 1],
  ['C1', '—¿Dónde está Luis? —No sé, ___ en un atasco.', ['estará', 'esté', 'estaría', 'estuviera'], 0],
  ['C1', 'Se me ___ las llaves dentro del coche.', ['quedé', 'quedaron', 'quedó', 'he quedado'], 1],
  ['C2', '«A buenas horas, mangas verdes» se dice cuando algo llega…', ['demasiado tarde', 'justo a tiempo', 'muy temprano', 'por sorpresa'], 0],
  ['C2', '¡Ni que ___ millonario! No pienso pagar eso.', ['soy', 'sea', 'fuera', 'sería'], 2],
  ['C2', 'De ___ sabido, te habría avisado.', ['haberlo', 'haber lo', 'habiéndolo', 'lo haber'], 0],
  ['C2', '¿Cuál suena más natural en una conversación entre amigos?', ['Yo opino que esa película no es de mi agrado.', 'A mí esa peli es que no me dice nada.', 'Dicha película me resulta indiferente.', 'Yo no gusto de esa película.'], 1]
];

/* 发音练习：[标题, 讲解, [练习句…]] */
const PRON = [
  ['五个元音', '嘴型固定，短而清楚，不要滑动。e 不要读成“诶”，o 不要读成“欧”。', ['a, e, i, o, u', 'la mesa, el vino, mucho gusto', 'Ana lava la manzana', 'Pepe bebe leche', 'Un oso come mucho']],
  ['咬舌音 θ 与 s', '西班牙：z、ce、ci 舌尖伸到上下齿之间送气；s 舌尖抵上齿龈。', ['cinco cervezas', 'gracias, hasta luego', 'zapatos azules', 'La cocina está sucia', 'Necesito diez céntimos', 'casa — caza, coser — cocer']],
  ['j 与 g', 'j，以及 e、i 前的 g，读喉咙深处的 [x]，比中文的“喝”更靠后、更有摩擦。', ['jamón, jefe, julio', 'la gente de Gijón', 'Juan juega al ajedrez', 'Me gusta el gazpacho', 'un viaje a Japón']],
  ['单击 r', '词中间的单个 r：舌尖在上齿龈轻弹一下，像快速说“特啦”里的那一下。', ['pero, caro, ahora', 'tres, grande, primo', 'Quiero comprar un libro', 'Trabajo en el centro', 'María mira el mar']],
  ['大舌颤音 rr', '词首的 r 和 rr：舌尖放松，用气流让它连续颤动。先练 “tra、dra”，再加长。', ['perro, carro, torre', 'rojo, rico, rápido', 'El perro corre por la calle', 'pero — perro, caro — carro', 'Roma, radio, Enrique']],
  ['b、d、g 的弱化', '在元音之间，b / v、d、g 不完全闭合，读得很轻很软。', ['abogado, cada día', 'Vivo en Bilbao', 'No he podido hablar con nadie', 'la vida, el agua, la boda', '¿Has acabado todo?']],
  ['ñ、ll、y、ch', 'ñ 是一个音，不是 n + i；ll 和 y 在多数地区同音。', ['España, mañana, niño', 'Me llamo Yolanda', 'ocho chicos, mucho chocolate', 'El año que viene voy a Sevilla', 'La lluvia en la calle']],
  ['连读与节奏', '西语每个音节时长差不多，词与词之间连成一串，不要一个词一个词地断开。', ['¿Cómo estás?', 'Voy a hablar con ella', '¿Qué has hecho hoy?', 'Me he olvidado el abrigo en el autobús', 'Mi amigo está en el hospital']],
  ['语调', '陈述句句末下降；一般疑问句句末上升；特殊疑问句从疑问词开始下降。', ['Vienes mañana.', '¿Vienes mañana?', '¿Cuándo vienes?', '¡Qué bien!', '¿Quieres té o café?']],
  ['绕口令', '传统绕口令，先慢后快。', ['Tres tristes tigres tragaban trigo en un trigal', 'El perro de San Roque no tiene rabo porque Ramón Ramírez se lo ha robado', 'Pablito clavó un clavito. ¿Qué clavito clavó Pablito?', 'Erre con erre, guitarra; erre con erre, barril', 'Como poco coco como, poco coco compro', 'El cielo está enladrillado. ¿Quién lo desenladrillará?']]
];

/* 母语资源：[分类, 名称, 说明, 网址] */
const RESOURCES = [
  ['词典与规范', 'Diccionario de la lengua española (RAE)', '西班牙皇家语言学院的权威词典', 'https://dle.rae.es'],
  ['词典与规范', 'Diccionario panhispánico de dudas', '用法疑难解答：这样说对不对', 'https://www.rae.es/dpd/'],
  ['词典与规范', 'FundéuRAE', '每天一条用词建议，跟着新闻学规范西语', 'https://www.fundeu.es'],
  ['词典与规范', 'WordReference', '西英词典和论坛，查习语很好用', 'https://www.wordreference.com/es/'],
  ['词典与规范', 'Linguee', '真实语料里的双语对照例句', 'https://www.linguee.es'],
  ['听', 'RTVE Play', '西班牙国家电视台：电视剧、纪录片、新闻，大多可免费看', 'https://www.rtve.es/play/'],
  ['听', 'RNE Audio', '西班牙国家广播电台的直播和播客', 'https://www.rtve.es/play/radio/'],
  ['听', 'Cadena SER', '西班牙听众最多的电台，新闻和谈话节目', 'https://cadenaser.com'],
  ['听', 'Radio Ambulante', '拉美各国的叙事播客，有文字稿', 'https://radioambulante.org'],
  ['读', 'El País', '西班牙发行量最大的日报', 'https://elpais.com'],
  ['读', 'elDiario.es', '西班牙数字日报', 'https://www.eldiario.es'],
  ['读', '20minutos', '语言简单的免费日报，适合 B1 起步', 'https://www.20minutos.es'],
  ['读', 'Centro Virtual Cervantes', '塞万提斯学院的阅读、文化和教学资料库', 'https://cvc.cervantes.es'],
  ['读', 'Biblioteca Virtual Miguel de Cervantes', '西语经典文学全文', 'https://www.cervantesvirtual.com'],
  ['考试', 'DELE', '塞万提斯学院的西语水平证书，官方样题', 'https://examenes.cervantes.es/es/dele/que-es'],
  ['考试', 'SIELE', '在线西语水平考试', 'https://siele.org']
];

const LEVELS = [
  ['A1', '入门', '能打招呼、介绍自己、应付最基本的日常'],
  ['A2', '初级', '能讲过去和将来，处理旅行和生活场景'],
  ['B1', '中级', '掌握虚拟式，能表达观点、在西语环境里独立生活'],
  ['B2', '中高级', '能流利讨论抽象话题，读新闻、开会、写正式信件'],
  ['C1', '高级', '语法的细处、口语的肌理、词汇的精度'],
  ['C2', '精通', '语感、典故、方言与文体，接近母语者']
];
