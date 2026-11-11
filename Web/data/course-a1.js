'use strict';
/* A1 入门：16 节手写课，离线可学。items: [西语, 中文, 备注]；drills: [句子, 答案, [干扰项], 解释] */
const COURSE = [];

COURSE.push({ id: 'a1-01', lv: 'A1', unit: '起步', title: '字母与发音', goal: '看到任何西语单词都能读出来',
  notes: [
`## 五个元音
西语只有 5 个元音，每个永远只有一个读音：*a* [a]、*e* [e]、*i* [i]、*o* [o]、*u* [u]。怎么写就怎么读，不像英语那样变来变去。`,
`## 要留心的辅音
- *h* 不发音：*hola* 读 [ola]
- *j*，以及 *ge / gi* 里的 g，读喉咙里的 [x]，像用力的“赫”：*jamón*、*gente*
- *ñ* 像“尼”的声母：*España*
- *ll* 和 *y* 接近“耶”的声母：*calle*、*yo*
- *r* 在词首、以及 *rr*，是大舌颤音：*perro*；词中间单个 *r* 只轻弹一下：*pero*
- *qu* 只出现在 *que / qui*，u 不发音：*queso*
- *v* 和 *b* 发音完全相同：*vino*、*bien*`,
`## 西班牙的 z 和 c
在西班牙，*z*，以及 *ce / ci* 里的 c，读咬舌音 [θ]（像英语 think 的 th）：*gracias*、*cerveza*、*zapato*。拉美一律读 [s]。`,
`## 重音落在哪
- 以元音、n、s 结尾：重音在倒数第二个音节 — *casa*、*hablan*
- 以其他辅音结尾：重音在最后一个音节 — *hotel*、*Madrid*
- 不符合这两条的，用重音符号标出来 — *café*、*música*、*fácil*
- 问句和感叹句前后都有标点：*¿Cómo?*　*¡Hola!*`],
  items: [
    ['hola', '你好'], ['gracias', '谢谢', '西班牙读 [ˈɡraθjas]'], ['por favor', '请'], ['sí', '是的'], ['no', '不'],
    ['el café', '咖啡'], ['el agua', '水'], ['la cerveza', '啤酒'], ['el jamón', '火腿'], ['la calle', '街道'], ['el perro', '狗'],
    ['Un café, por favor', '请来一杯咖啡'], ['¿Cómo se dice esto?', '这个怎么说？'], ['No hablo español todavía', '我还不会说西语'],
    ['Muchas gracias por todo', '非常感谢这一切']],
  drills: [
    ['En «hola», la letra ___ no se pronuncia.', 'h', ['o', 'l', 'a'], 'h 在西语里永远不发音'],
    ['La palabra «___» lleva tilde.', 'café', ['casa', 'hotel', 'perro'], 'café 以元音结尾却重读最后一个音节，所以要标重音'],
    ['«Perro» tiene una ___ fuerte.', 'rr', ['ll', 'ñ', 'h'], 'rr 是大舌颤音'],
    ['«España» se escribe con la letra ___.', 'ñ', ['n', 'll', 'ny'], 'ñ 是一个独立的字母，读“尼”的声母']],
  dialog: [['A', '¡Hola!', '你好！'], ['B', '¡Hola! ¿Qué tal?', '你好！怎么样？'], ['A', 'Bien, gracias. ¿Y tú?', '挺好，谢谢。你呢？'], ['B', 'Muy bien. Un café, por favor.', '很好。请来一杯咖啡。']]
});

COURSE.push({ id: 'a1-02', lv: 'A1', unit: '起步', title: '问候与告别', goal: '会打招呼、问好、道别',
  notes: [
`## 一天里的问候
- *Buenos días* — 早上好（到午饭前，西班牙的午饭在下午两点左右）
- *Buenas tardes* — 下午好（午饭后到天黑）
- *Buenas noches* — 晚上好 / 晚安
- 任何时候都可以说 *¡Hola!*，口语里还常只说 *¡Buenas!*`,
`## tú 还是 usted
*tú* 是“你”，*usted* 是“您”。西班牙人用 *tú* 的场合比中国人用“你”还多：同事、店员、朋友的父母都常直接用 *tú*。对年长的陌生人、正式场合用 *usted*，动词要用第三人称：
- *¿Cómo estás?* — 你好吗？
- *¿Cómo está usted?* — 您好吗？`,
`## 初次见面
男的说 *Encantado*，女的说 *Encantada*（跟着说话人自己的性别变）。也可以说 *Mucho gusto*，男女通用。西班牙人见面常互亲脸颊两下（先右后左），男士之间一般握手。`],
  items: [
    ['buenos días', '早上好'], ['buenas tardes', '下午好'], ['buenas noches', '晚上好；晚安'], ['adiós', '再见'],
    ['hasta luego', '回头见', '西班牙最常用的道别'], ['hasta mañana', '明天见'], ['encantado', '幸会（男性说）'], ['mucho gusto', '很高兴认识你'],
    ['¿Qué tal?', '怎么样？'], ['¿Cómo estás?', '你好吗？'], ['¿Cómo está usted?', '您好吗？'],
    ['Estoy muy bien, gracias', '我很好，谢谢'], ['Nos vemos el lunes', '我们周一见'], ['Buenas noches y hasta mañana', '晚安，明天见']],
  drills: [
    ['Son las nueve de la mañana: «¡___ días!»', 'Buenos', ['Buenas', 'Bueno', 'Buena'], 'día 是阳性名词，所以是 buenos días'],
    ['—¿Cómo ___ usted? —Bien, gracias.', 'está', ['estás', 'estoy', 'eres'], 'usted 用第三人称变位'],
    ['Ana dice: «___, soy Ana».', 'Encantada', ['Encantado', 'Encantados', 'Encanta'], '女性说 encantada'],
    ['—Adiós. —___ luego.', 'Hasta', ['Hola', 'Hacia', 'Desde'], 'hasta luego = 回头见']],
  dialog: [['A', 'Buenos días. ¿Cómo está usted?', '早上好。您好吗？'], ['B', 'Muy bien, gracias. ¿Y tú?', '很好，谢谢。你呢？'], ['A', 'Bien también. Soy Lucía, la nueva compañera.', '我也好。我是露西亚，新来的同事。'], ['B', 'Encantado, Lucía. Yo soy Pedro.', '幸会，露西亚。我是佩德罗。'], ['A', 'Mucho gusto. ¡Hasta luego!', '很高兴认识你。回头见！']]
});

COURSE.push({ id: 'a1-03', lv: 'A1', unit: '起步', title: '自我介绍', goal: '说出名字、国籍、职业和住处',
  notes: [
`## 动词 ser（是）
| | |
| yo | *soy* |
| tú | *eres* |
| él / ella / usted | *es* |
| nosotros | *somos* |
| vosotros | *sois* |
| ellos / ustedes | *son* |
西语的动词变位已经说明了主语是谁，所以主语代词通常省略：*Soy Li.* 就是“我是李”。`,
`## 名字：llamarse
*Me llamo Li*（我叫李）、*¿Cómo te llamas?*（你叫什么？）、*Se llama Ana*（她叫安娜）。字面意思是“我把自己叫作……”。`,
`## 国籍和职业
国籍和职业跟着人的性别变：*chino / china*、*español / española*、*profesor / profesora*。以 -e 或 -ista 结尾的男女同形：*estudiante*、*periodista*。
说职业不加冠词：*Soy ingeniero*，不说 ✗ *Soy un ingeniero*。
“来自哪里”用 *ser de*：*Soy de China*。`],
  items: [
    ['me llamo…', '我叫……'], ['soy chino', '我是中国人（男）'], ['soy china', '我是中国人（女）'], ['el estudiante', '学生'], ['el ingeniero', '工程师'], ['la profesora', '女老师'],
    ['¿Cómo te llamas?', '你叫什么名字？'], ['¿De dónde eres?', '你是哪里人？'], ['Soy de China, de Shanghái', '我来自中国上海'],
    ['¿A qué te dedicas?', '你是做什么工作的？'], ['Soy ingeniero y trabajo en una fábrica', '我是工程师，在一家工厂工作'],
    ['Vivo en Madrid desde enero', '我从一月起住在马德里'], ['Hablo chino, inglés y un poco de español', '我会说中文、英语和一点西语'], ['Ella es mi compañera de trabajo', '她是我的同事']],
  drills: [
    ['Yo ___ de China.', 'soy', ['eres', 'es', 'son'], 'yo → soy'],
    ['¿De dónde ___ tú?', 'eres', ['soy', 'es', 'sois'], 'tú → eres'],
    ['María ___ profesora.', 'es', ['soy', 'eres', 'un'], '职业前不加冠词；ella → es'],
    ['—¿Cómo te ___? —Me llamo Li.', 'llamas', ['llamo', 'llama', 'llaman'], 'tú → te llamas'],
    ['Nosotros ___ estudiantes de español.', 'somos', ['son', 'sois', 'soy'], 'nosotros → somos']],
  dialog: [['A', 'Hola, ¿cómo te llamas?', '你好，你叫什么名字？'], ['B', 'Me llamo Wei. ¿Y tú?', '我叫伟。你呢？'], ['A', 'Yo soy Carmen. ¿De dónde eres, Wei?', '我是卡门。伟，你是哪里人？'], ['B', 'Soy chino, de Guangzhou. ¿Eres española?', '我是中国人，广州的。你是西班牙人吗？'], ['A', 'Sí, soy de Sevilla. ¿A qué te dedicas?', '是的，我是塞维利亚人。你做什么工作？'], ['B', 'Soy ingeniero. Y estudio español por las tardes.', '我是工程师。下午学西语。']]
});

COURSE.push({ id: 'a1-04', lv: 'A1', unit: '人与物', title: '名词的阴阳性与冠词', goal: '给名词配上正确的 el / la / un / una',
  notes: [
`## 每个名词都有性别
- 以 *-o* 结尾多为阳性：*el libro*、*el vino*
- 以 *-a* 结尾多为阴性：*la casa*、*la mesa*
- *-ción、-sión、-dad、-tad* 结尾是阴性：*la estación*、*la ciudad*
- 例外要单独记：*el día*、*el problema*、*el mapa*、*la mano*、*la foto*
背单词时连冠词一起背，是最省事的办法。`,
`## 四个定冠词、四个不定冠词
| | 阳性 | 阴性 |
| 单数（那个） | *el* | *la* |
| 复数 | *los* | *las* |
| 单数（一个） | *un* | *una* |
| 复数（一些） | *unos* | *unas* |`,
`## 复数
- 元音结尾加 *-s*：*libro → libros*
- 辅音结尾加 *-es*：*ciudad → ciudades*
- *-z* 结尾变 *-ces*：*lápiz → lápices*
形容词要和名词保持性、数一致：*la casa blanca*、*los coches blancos*。形容词一般放在名词后面。`],
  items: [
    ['el libro', '书'], ['la casa', '房子；家'], ['la mesa', '桌子'], ['la ciudad', '城市'], ['el problema', '问题', '-ma 结尾，阳性'], ['la mano', '手', '-o 结尾却是阴性'], ['el coche', '汽车', '拉美多说 carro'], ['el móvil', '手机', '拉美说 celular'],
    ['Tengo un coche blanco', '我有一辆白色的车'], ['La casa es muy grande', '房子很大'], ['Los libros están en la mesa', '书在桌子上'],
    ['Es una ciudad muy bonita', '这是一座很美的城市'], ['No hay ningún problema', '没有任何问题'], ['Las chicas son muy simpáticas', '那些女孩很友善']],
  drills: [
    ['___ problema es muy difícil.', 'El', ['La', 'Los', 'Una'], 'problema 虽以 -a 结尾，但是阳性'],
    ['Tengo ___ casa en Valencia.', 'una', ['un', 'el', 'unos'], 'casa 阴性，“一个” → una'],
    ['___ ciudades son grandes.', 'Las', ['Los', 'La', 'El'], 'ciudad 阴性，复数 → las'],
    ['Dos lápiz → dos ___.', 'lápices', ['lápizs', 'lápizes', 'lápiz'], '-z 结尾变 -ces'],
    ['La mesa es ___.', 'blanca', ['blanco', 'blancos', 'blancas'], '形容词和名词性数一致']],
  dialog: [['A', '¿Qué es esto?', '这是什么？'], ['B', 'Es un mapa de la ciudad.', '是一张城市地图。'], ['A', '¿Y dónde está la estación?', '车站在哪儿？'], ['B', 'Aquí, cerca del hotel.', '这儿，酒店附近。'], ['A', 'Perfecto, no hay ningún problema.', '太好了，没问题。']]
});

COURSE.push({ id: 'a1-05', lv: 'A1', unit: '人与物', title: '数字与年龄', goal: '会数到 100，会说年龄和“我饿了”',
  notes: [
`## 0–20
*cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce, trece, catorce, quince, dieciséis, diecisiete, dieciocho, diecinueve, veinte*`,
`## 21–100
21–29 写成一个词：*veintiuno, veintidós, veintitrés…*
30 以后用 *y* 连接：*treinta y uno*、*cuarenta y cinco*。
整十：*treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa, cien*。
*uno* 在阳性名词前变 *un*：*veintiún años*、*un euro*；阴性用 *una*。`,
`## 动词 tener（有）
| | |
| yo | *tengo* |
| tú | *tienes* |
| él / ella / usted | *tiene* |
| nosotros | *tenemos* |
| vosotros | *tenéis* |
| ellos / ustedes | *tienen* |
年龄用“有……岁”：*Tengo treinta años*。很多中文用“是/觉得”的状态，西语用 *tener*：*tener hambre*（饿）、*tener sed*（渴）、*tener frío / calor*（冷/热）、*tener sueño*（困）、*tener prisa*（赶时间）。`],
  items: [
    ['veinte', '二十'], ['treinta y cinco', '三十五'], ['cien', '一百'], ['el año', '年；岁'], ['tener hambre', '饿'], ['tener sed', '渴'], ['tener sueño', '困'], ['tener prisa', '赶时间'],
    ['¿Cuántos años tienes?', '你多大了？'], ['Tengo veintiocho años', '我二十八岁'], ['Mi número de teléfono es el seis, cero, cinco…', '我的电话号码是 6、0、5……'],
    ['Tenemos mucha hambre', '我们很饿'], ['¿Tienes frío? Yo tengo calor', '你冷吗？我觉得热'], ['Son quince euros con cincuenta', '一共十五欧五十分']],
  drills: [
    ['Yo ___ treinta años.', 'tengo', ['soy', 'tiene', 'estoy'], '年龄用 tener'],
    ['¿Cuántos años ___ tu hermano?', 'tiene', ['tienes', 'es', 'tengo'], 'él → tiene'],
    ['30 + 15 = ___', 'cuarenta y cinco', ['cuarenta cinco', 'cuarentaicinco', 'cincuenta y cuatro'], '30 以后用 y 连接'],
    ['Los niños ___ sueño.', 'tienen', ['son', 'están', 'tenemos'], '困 = tener sueño'],
    ['Tengo veinti___ años. (21)', 'ún', ['uno', 'una', 'un'], '阳性名词前 veintiuno → veintiún']],
  dialog: [['A', '¿Cuántos años tienes, Laura?', '劳拉，你多大了？'], ['B', 'Tengo veintisiete. ¿Y tú?', '二十七。你呢？'], ['A', 'Treinta y dos. Oye, ¿tienes hambre?', '三十二。哎，你饿吗？'], ['B', 'Sí, mucha. Y también tengo sed.', '饿，很饿。也渴了。'], ['A', 'Pues vamos al bar. Un bocadillo son cuatro euros.', '那去酒吧吧。一个三明治四欧。']]
});

COURSE.push({ id: 'a1-06', lv: 'A1', unit: '人与物', title: '家庭与物主形容词', goal: '介绍家人，说“我的、你的、他的”',
  notes: [
`## 家庭成员
很多亲属词阳性加 *-a* 就是阴性：*hermano / hermana*、*hijo / hija*、*abuelo / abuela*、*tío / tía*、*primo / prima*。阳性复数可以包括男女：*mis padres* 是“我父母”，*mis hermanos* 可以是“我的兄弟姐妹”。
在西班牙，“丈夫/妻子”日常说 *mi marido / mi mujer*。`,
`## 物主形容词
| 所有者 | 单数 | 复数 |
| 我的 | *mi* | *mis* |
| 你的 | *tu* | *tus* |
| 他/她/您的 | *su* | *sus* |
| 我们的 | *nuestro, -a* | *nuestros, -as* |
| 你们的 | *vuestro, -a* | *vuestros, -as* |
| 他们/您们的 | *su* | *sus* |
注意：单复数看的是“被拥有的东西”，不是所有者。*su casa* 可以是“他的、她的、您的、他们的家”；*mis hijos* 是“我的孩子们”。`,
`## 描述人
*Mi hermana es alta y morena.*　常用词：*alto / bajo*（高/矮）、*joven / mayor*（年轻/年长）、*simpático*（友善）、*guapo*（好看）、*moreno / rubio*（深色/金色头发）。`],
  items: [
    ['el padre', '父亲'], ['la madre', '母亲'], ['el hermano', '兄弟'], ['la hija', '女儿'], ['los abuelos', '祖父母'], ['el marido', '丈夫'], ['la mujer', '妻子；女人'], ['la novia', '女朋友'],
    ['Esta es mi familia', '这是我的家人'], ['Tengo dos hermanos mayores', '我有两个哥哥'], ['Mis padres viven en un pueblo pequeño', '我父母住在一个小镇上'],
    ['¿Cómo se llama tu novia?', '你女朋友叫什么？'], ['Nuestra casa está cerca del parque', '我们家在公园附近'], ['Su hermana es muy simpática', '他的妹妹人很好']],
  drills: [
    ['Estos son ___ padres. (我的)', 'mis', ['mi', 'mío', 'mías'], 'padres 是复数 → mis'],
    ['¿Dónde vive ___ familia? (你的)', 'tu', ['tú', 'tus', 'su'], '物主形容词 tu 不带重音；带重音的 tú 是“你”'],
    ['___ casa es muy grande. (我们的)', 'Nuestra', ['Nuestro', 'Nuestros', 'Nos'], 'casa 阴性单数 → nuestra'],
    ['Ana y ___ marido son de Bilbao.', 'su', ['sus', 'tu', 'suya'], 'marido 单数 → su'],
    ['La hija de mi tío es mi ___.', 'prima', ['hermana', 'abuela', 'sobrina'], '叔叔的女儿是堂姐妹 prima']],
  dialog: [['A', '¿Tienes hermanos?', '你有兄弟姐妹吗？'], ['B', 'Sí, una hermana. Se llama Mei y tiene veinte años.', '有，一个妹妹。她叫梅，二十岁。'], ['A', '¿Y tus padres viven en China?', '你父母住在中国吗？'], ['B', 'Sí, en nuestra ciudad, cerca de Shanghái.', '是的，在我们的城市，离上海不远。'], ['A', 'Mi familia es grande: somos cinco hermanos.', '我家人多：我们兄弟姐妹五个。']]
});

COURSE.push({ id: 'a1-07', lv: 'A1', unit: '日常', title: '-ar 动词现在时', goal: '用最大的一类动词说日常的事',
  notes: [
`## 规则变位
去掉 *-ar*，加上词尾。以 *hablar*（说）为例：
| | |
| yo | *hablo* |
| tú | *hablas* |
| él / ella / usted | *habla* |
| nosotros | *hablamos* |
| vosotros | *habláis* |
| ellos / ustedes | *hablan* |
同样变位的还有 *trabajar, estudiar, comprar, escuchar, cocinar, viajar, tomar, cenar, desayunar, llegar, necesitar*。`,
`## 现在时能表达什么
- 现在或习惯：*Trabajo en una oficina.*
- 马上要做的事：*Mañana trabajo.*（我明天上班）
- 所以它比中文的“正在”范围大得多。`,
`## 否定和提问
否定在动词前加 *no*：*No hablo francés.*
提问不用改词序，语调上扬、加问号就行：*¿Hablas inglés?*
常用疑问词：*qué*（什么）、*dónde*（哪里）、*cuándo*（何时）、*cómo*（怎么）、*quién*（谁）、*por qué*（为什么）、*cuánto*（多少）。疑问词都带重音符号。`],
  items: [
    ['hablar', '说'], ['trabajar', '工作'], ['estudiar', '学习'], ['comprar', '买'], ['escuchar', '听'], ['cocinar', '做饭'], ['desayunar', '吃早饭'], ['cenar', '吃晚饭'],
    ['Trabajo en una empresa china', '我在一家中国公司工作'], ['¿Hablas inglés?', '你会说英语吗？'], ['Mi novia estudia español conmigo', '我女朋友和我一起学西语'],
    ['No cocinamos mucho en casa', '我们在家不常做饭'], ['¿Dónde compráis la fruta?', '你们在哪儿买水果？'], ['Ellos cenan muy tarde, a las diez', '他们晚饭吃得很晚，十点才吃']],
  drills: [
    ['Yo ___ en un banco. (trabajar)', 'trabajo', ['trabaja', 'trabajas', 'trabajan'], 'yo → -o'],
    ['¿Tú ___ español? (hablar)', 'hablas', ['hablo', 'habla', 'habláis'], 'tú → -as'],
    ['Nosotros ___ música. (escuchar)', 'escuchamos', ['escuchan', 'escucháis', 'escucho'], 'nosotros → -amos'],
    ['Vosotros ___ mucho. (viajar)', 'viajáis', ['viajamos', 'viajan', 'viajas'], 'vosotros → -áis'],
    ['Mis padres no ___ carne. (comprar)', 'compran', ['compra', 'compramos', 'compras'], 'ellos → -an']],
  dialog: [['A', '¿Dónde trabajas?', '你在哪儿工作？'], ['B', 'Trabajo en una fábrica. ¿Y tú?', '我在一家工厂上班。你呢？'], ['A', 'Yo no trabajo, estudio en la universidad.', '我不上班，在大学读书。'], ['B', '¿Qué estudias?', '你学什么？'], ['A', 'Estudio diseño. Y por la noche cocino para mis compañeros.', '学设计。晚上给室友们做饭。']]
});

COURSE.push({ id: 'a1-08', lv: 'A1', unit: '日常', title: '-er 和 -ir 动词', goal: '掌握另外两类规则动词和几个常用的不规则 yo',
  notes: [
`## 规则变位
| | comer（吃） | vivir（住） |
| yo | *como* | *vivo* |
| tú | *comes* | *vives* |
| él / ella / usted | *come* | *vive* |
| nosotros | *comemos* | *vivimos* |
| vosotros | *coméis* | *vivís* |
| ellos / ustedes | *comen* | *viven* |
两类只在 nosotros 和 vosotros 上不同。同类动词：*beber, leer, aprender, comprender, vender, correr*；*escribir, abrir, recibir, subir*。`,
`## 只有 yo 不规则的常用动词
- *hacer*（做）→ *hago*
- *salir*（出去）→ *salgo*
- *poner*（放）→ *pongo*
- *ver*（看）→ *veo*
- *saber*（知道）→ *sé*
- *conocer*（认识）→ *conozco*
其他人称照常：*haces, hace, hacemos…*`,
`## saber 和 conocer
两个都是“知道”。*saber* 是知道事实、会做某事：*Sé cocinar.*　*conocer* 是认识人、熟悉地方：*Conozco Madrid.*`],
  items: [
    ['comer', '吃；吃午饭'], ['beber', '喝'], ['leer', '读'], ['aprender', '学会'], ['vivir', '住；生活'], ['escribir', '写'], ['abrir', '打开'], ['hacer', '做'],
    ['Vivo en un piso pequeño', '我住在一套小公寓里', '西班牙说 piso，拉美多说 departamento'], ['¿Qué haces los fines de semana?', '你周末做什么？'],
    ['Comemos a las dos y media', '我们两点半吃午饭'], ['No bebo alcohol, gracias', '我不喝酒，谢谢'],
    ['Leo las noticias en el móvil', '我在手机上看新闻'], ['Los sábados salgo con mis amigos', '周六我和朋友出去']],
  drills: [
    ['Nosotros ___ en Barcelona. (vivir)', 'vivimos', ['vivemos', 'viven', 'vivís'], '-ir 动词 nosotros → -imos'],
    ['¿Qué ___ tú? (beber)', 'bebes', ['bebas', 'bebe', 'bebo'], '-er 动词 tú → -es'],
    ['Yo ___ deporte los lunes. (hacer)', 'hago', ['haco', 'hace', 'hazo'], 'hacer 的 yo 不规则：hago'],
    ['Yo no ___ a tu hermano. (conocer)', 'conozco', ['conoco', 'sé', 'conoce'], '认识人用 conocer，yo → conozco'],
    ['Vosotros ___ muchos correos. (escribir)', 'escribís', ['escribéis', 'escriben', 'escribimos'], '-ir 动词 vosotros → -ís']],
  dialog: [['A', '¿Dónde vives?', '你住哪儿？'], ['B', 'Vivo en el centro, en un piso compartido.', '住市中心，合租的公寓。'], ['A', '¿Y qué haces por las tardes?', '下午你都做什么？'], ['B', 'Leo, escribo a mi familia y aprendo español.', '看书，给家人写信，学西语。'], ['A', '¿Sales por la noche?', '晚上出去吗？'], ['B', 'Solo los viernes. Salgo con los compañeros.', '只有周五。和同事出去。']]
});

COURSE.push({ id: 'a1-09', lv: 'A1', unit: '日常', title: 'ser 和 estar', goal: '分清两个“是”',
  notes: [
`## 两个“是”
中文的“是”和“在”，西语分给两个动词。
*estar*：*estoy, estás, está, estamos, estáis, están*`,
`## ser：它是什么
说的是本质、身份、定义，不随时间变的特征。
- 身份、职业、国籍：*Soy ingeniero.*
- 性格和固有特征：*Es alta y simpática.*
- 时间、日期：*Son las tres.*　*Hoy es lunes.*
- 材料、归属、来源：*Es de madera.*　*Es de Juan.*
- 活动在哪里举行：*La reunión es en la sala 2.*`,
`## estar：它怎么样、在哪里
说的是状态、位置、结果。
- 位置：*Madrid está en el centro de España.*
- 身体和情绪状态：*Estoy cansado.*　*Está contenta.*
- 临时的状况：*La sopa está fría.*
- 进行中：*Estoy trabajando.*`,
`## 同一个形容词，意思不同
- *ser aburrido* 人很无聊　/　*estar aburrido* 觉得无聊
- *ser listo* 聪明　/　*estar listo* 准备好了
- *ser bueno* 人好、质量好　/　*estar bueno* 好吃
- *ser malo* 坏　/　*estar malo* 生病了`],
  items: [
    ['cansado', '累的'], ['contento', '高兴的'], ['enfermo', '生病的'], ['ocupado', '忙的'], ['aburrido', '无聊的'], ['listo', '聪明的；准备好的'],
    ['Estoy muy cansado hoy', '我今天很累'], ['La oficina está en el segundo piso', '办公室在三楼', '西班牙的 segundo piso 是中国的三楼'],
    ['Mi jefe es muy exigente', '我老板要求很高'], ['¿Estás listo? Ya es tarde', '你准备好了吗？已经晚了'],
    ['El café está frío', '咖啡凉了'], ['Hoy es martes y estamos en casa', '今天是周二，我们在家'],
    ['La fiesta es en casa de Marta', '聚会在玛尔塔家办'], ['Esta paella está muy buena', '这份海鲜饭真好吃']],
  drills: [
    ['Yo ___ de China.', 'soy', ['estoy', 'está', 'es'], '来源用 ser'],
    ['¿Dónde ___ el baño?', 'está', ['es', 'hay', 'son'], '位置用 estar'],
    ['Hoy ___ muy cansada.', 'estoy', ['soy', 'es', 'tengo'], '身体状态用 estar'],
    ['La reunión ___ a las diez.', 'es', ['está', 'hay', 'están'], '事件发生的时间地点用 ser'],
    ['Esta sopa ___ fría.', 'está', ['es', 'tiene', 'hay'], '临时状态用 estar'],
    ['Mi hermano ___ médico.', 'es', ['está', 'hay', 'tiene'], '职业用 ser']],
  dialog: [['A', '¿Qué tal? ¿Estás bien?', '怎么样？你还好吗？'], ['B', 'Estoy un poco cansada. La jefa es muy exigente.', '有点累。老板要求很高。'], ['A', '¿Dónde está tu oficina?', '你办公室在哪儿？'], ['B', 'Está cerca de aquí, pero el edificio es muy viejo.', '离这儿很近，不过楼很旧。'], ['A', 'Mira, el café ya está listo.', '看，咖啡好了。']]
});

COURSE.push({ id: 'a1-10', lv: 'A1', unit: '日常', title: '时间、星期与日期', goal: '会问时间、约时间、说日期',
  notes: [
`## 几点了
*¿Qué hora es?*
- 一点用单数：*Es la una.*
- 其他用复数：*Son las dos.*　*Son las siete.*
- 过几分用 *y*：*las tres y diez*、*las tres y cuarto*（一刻）、*las tres y media*（半）
- 差几分用 *menos*：*las cuatro menos cuarto*（三点四十五）
- 要分上下午：*de la mañana / de la tarde / de la noche*
“在几点”用 *a*：*La clase es a las nueve.*`,
`## 星期和月份
*lunes, martes, miércoles, jueves, viernes, sábado, domingo* — 都是阳性、都小写。
*el lunes* 是“这个周一”，*los lunes* 是“每周一”。
月份：*enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre*，也小写。`,
`## 日期
*Hoy es doce de octubre.*　*Mi cumpleaños es el tres de mayo.*
西班牙的作息比中国晚：午饭两点到三点，晚饭九点到十点，商店下午常关门到五点。`],
  items: [
    ['hoy', '今天'], ['mañana', '明天；早上'], ['ayer', '昨天'], ['la semana', '星期；周'], ['el fin de semana', '周末'], ['el cumpleaños', '生日'], ['y media', '……点半'], ['menos cuarto', '差一刻'],
    ['¿Qué hora es?', '几点了？'], ['Son las ocho y media de la mañana', '现在是早上八点半'], ['La reunión es a las cuatro menos cuarto', '会议三点四十五开'],
    ['Los lunes trabajo desde casa', '我每周一在家办公'], ['Mi cumpleaños es el nueve de julio', '我的生日是七月九日'], ['¿A qué hora abre el supermercado?', '超市几点开门？']],
  drills: [
    ['___ la una y cuarto.', 'Es', ['Son', 'Está', 'Hay'], '一点用单数 es'],
    ['___ las seis de la tarde.', 'Son', ['Es', 'Están', 'Hay'], '其他钟点用 son'],
    ['La clase empieza ___ las nueve.', 'a', ['en', 'de', 'por'], '“在几点”用 a'],
    ['2:45 → las tres ___ cuarto', 'menos', ['y', 'con', 'sin'], '差一刻用 menos cuarto'],
    ['___ sábados no trabajo.', 'Los', ['El', 'En', 'A'], '“每周六”用 los sábados']],
  dialog: [['A', 'Perdona, ¿qué hora es?', '不好意思，几点了？'], ['B', 'Son las cinco menos diez.', '四点五十。'], ['A', '¡Qué tarde! Mi tren sale a las cinco y cuarto.', '这么晚了！我的火车五点一刻开。'], ['B', '¿Quedamos el viernes entonces?', '那我们周五见面？'], ['A', 'Vale, el viernes a las siete en la plaza.', '好，周五七点在广场。']]
});

COURSE.push({ id: 'a1-11', lv: 'A1', unit: '生活', title: '喜欢：gustar', goal: '说自己喜欢和不喜欢什么',
  notes: [
`## gustar 的逻辑是反过来的
*Me gusta el café* 字面是“咖啡让我喜欢”。喜欢的东西才是主语，所以动词跟着它变：
- 单数名词或动词原形 → *gusta*：*Me gusta el vino.*　*Me gusta viajar.*
- 复数名词 → *gustan*：*Me gustan los gatos.*`,
`## 谁喜欢
| | |
| 我 | *me gusta(n)* |
| 你 | *te gusta(n)* |
| 他/她/您 | *le gusta(n)* |
| 我们 | *nos gusta(n)* |
| 你们 | *os gusta(n)* |
| 他们 | *les gusta(n)* |
要强调或说清是谁，前面加 *a*：*A mí me gusta.*　*A Juan le gustan las motos.*　喜欢的东西要带定冠词。`,
`## 程度和附和
*Me encanta*（超喜欢）、*me gusta mucho*、*me gusta bastante*、*no me gusta nada*。
附和别人：
- —*Me gusta el fútbol.* —*A mí también.*（我也是）/ *A mí no.*（我不）
- —*No me gusta el pescado.* —*A mí tampoco.*（我也不）/ *A mí sí.*（我喜欢）
同类动词：*encantar, interesar, molestar, doler, parecer*。`],
  items: [
    ['me gusta', '我喜欢'], ['me encanta', '我超喜欢'], ['también', '也'], ['tampoco', '也不'], ['la música', '音乐'], ['el fútbol', '足球'], ['bailar', '跳舞'], ['el pescado', '鱼（食物）'],
    ['Me gusta mucho la comida española', '我很喜欢西班牙菜'], ['No me gustan nada los lunes', '我一点都不喜欢周一'],
    ['¿Te gusta bailar?', '你喜欢跳舞吗？'], ['A mi novia le encantan los gatos', '我女朋友超喜欢猫'],
    ['Nos gusta pasear por el centro', '我们喜欢在市中心散步'], ['A mí tampoco me gusta el frío', '我也不喜欢冷']],
  drills: [
    ['Me ___ los perros.', 'gustan', ['gusta', 'gusto', 'gustas'], 'los perros 是复数 → gustan'],
    ['¿Te ___ cocinar?', 'gusta', ['gustan', 'gustas', 'gustar'], '动词原形当主语 → gusta'],
    ['A Pedro ___ gusta el café.', 'le', ['se', 'lo', 'él'], 'a él → le gusta'],
    ['—No me gusta el pescado. —A mí ___.', 'tampoco', ['también', 'no', 'sí también'], '附和否定用 tampoco'],
    ['A nosotros ___ encanta viajar.', 'nos', ['nosotros', 'les', 'os'], 'a nosotros → nos']],
  dialog: [['A', '¿Qué te gusta hacer los fines de semana?', '你周末喜欢做什么？'], ['B', 'Me gusta salir a comer. Me encantan las tapas.', '喜欢出去吃饭。我超爱 tapas。'], ['A', 'A mí también. ¿Y te gusta el fútbol?', '我也是。那你喜欢足球吗？'], ['B', 'No mucho, la verdad.', '说实话，不太喜欢。'], ['A', 'A mí tampoco. Prefiero el cine.', '我也不喜欢。我更喜欢看电影。']]
});

COURSE.push({ id: 'a1-12', lv: 'A1', unit: '生活', title: '吃喝与点餐', goal: '在酒吧和餐厅点东西、结账',
  notes: [
`## 词干会变的动词
有些动词在重读音节里词干元音会变，nosotros 和 vosotros 不变：
| | querer（想要）e→ie | poder（能）o→ue |
| yo | *quiero* | *puedo* |
| tú | *quieres* | *puedes* |
| él / ella / usted | *quiere* | *puede* |
| nosotros | *queremos* | *podemos* |
| vosotros | *queréis* | *podéis* |
| ellos / ustedes | *quieren* | *pueden* |
同类：*preferir (prefiero)*、*empezar (empiezo)*、*pensar (pienso)*、*volver (vuelvo)*、*dormir (duermo)*；*pedir (pido)* 是 e→i。`,
`## 点餐的句子
- 西班牙的酒吧里点东西很直接：*Me pones una caña, por favor.*（给我来杯生啤）
- 更客气：*Quería un café con leche.*　*¿Me trae la carta, por favor?*
- *Para mí, la sopa. Y de segundo, el pescado.*（我要汤，主菜要鱼）
- *¿Qué me recomienda?*（您推荐什么？）
- *La cuenta, por favor.*（买单）`,
`## 西班牙吃饭的规矩
工作日中午很多餐厅有 *menú del día*：前菜（*primero*）、主菜（*segundo*）、甜点或咖啡，含面包和饮料，一个固定价。小费不是必须的，留点零钱就行。*una caña* 是小杯生啤，*una tapa* 是一小份下酒菜。`],
  items: [
    ['la carta', '菜单'], ['la cuenta', '账单'], ['una caña', '一小杯生啤'], ['el vino tinto', '红葡萄酒'], ['el menú del día', '当日套餐'], ['el postre', '甜点'], ['querer', '想要'], ['pedir', '点（菜）；请求'],
    ['¿Me pones un café con leche?', '给我来杯牛奶咖啡好吗？'], ['Quiero una tortilla de patatas', '我要一份土豆饼'],
    ['¿Qué me recomienda de segundo?', '主菜您推荐什么？'], ['¿Podemos pagar con tarjeta?', '我们能刷卡吗？'],
    ['Para mí, agua sin gas', '我要不带气的水'], ['La cuenta, por favor', '请结账']],
  drills: [
    ['Yo ___ un café solo. (querer)', 'quiero', ['quero', 'quiere', 'queremos'], 'e→ie：quiero'],
    ['¿___ pagar con tarjeta? (poder, nosotros)', 'Podemos', ['Puedemos', 'Pueden', 'Puedo'], 'nosotros 不变音：podemos'],
    ['Ella siempre ___ pescado. (pedir)', 'pide', ['pede', 'piede', 'pido'], 'pedir 是 e→i：pide'],
    ['¿Qué ___ tomar vosotros? (querer)', 'queréis', ['quieréis', 'quieren', 'queremos'], 'vosotros 不变音：queréis'],
    ['La ___, por favor. Queremos pagar.', 'cuenta', ['carta', 'caña', 'cuchara'], '结账要 la cuenta']],
  dialog: [['A', 'Buenas. ¿Qué os pongo?', '你们好。给你们来点什么？'], ['B', 'Para mí una caña y para ella un vino tinto.', '我要一杯生啤，她要一杯红酒。'], ['A', '¿Queréis algo de comer?', '想吃点什么吗？'], ['B', '¿Qué nos recomiendas?', '你推荐什么？'], ['A', 'La tortilla está muy buena hoy.', '今天的土豆饼很好吃。'], ['B', 'Pues una tortilla y unas croquetas. ¿Podemos pagar con tarjeta?', '那来一份土豆饼和一份炸丸子。能刷卡吗？']]
});

COURSE.push({ id: 'a1-13', lv: 'A1', unit: '生活', title: '城市与问路', goal: '问路、指路，说“有”和“在”',
  notes: [
`## hay 和 estar
- *hay*（有）用来说“存在”，后面跟不定冠词、数字或不带冠词的名词：*Hay un banco en esta calle.*　*¿Hay farmacias por aquí?*
- *estar* 用来说“已知的东西在哪”，后面跟定冠词或专有名词：*El banco está en la plaza.*
一句话区分：第一次提到用 *hay*，知道是哪一个用 *está*。`,
`## 动词 ir（去）
*voy, vas, va, vamos, vais, van*
“去某地”用 *ir a*：*Voy a la oficina.*
*a + el = al*，*de + el = del*：*Voy al banco.*　*Vengo del trabajo.*
交通方式用 *en*：*en metro, en autobús, en coche*；走路是 *a pie* 或 *andando*。`,
`## 指路
- *todo recto* 一直走
- *a la derecha / a la izquierda* 向右 / 向左
- *la primera / la segunda calle* 第一 / 第二条街
- *al lado de* 在……旁边、*enfrente de* 在……对面、*cerca / lejos de* 离……近 / 远
- *Perdona, ¿para ir a…?*（请问去……怎么走？）`],
  items: [
    ['la calle', '街道'], ['la plaza', '广场'], ['la estación', '车站'], ['la farmacia', '药店'], ['todo recto', '一直走'], ['a la derecha', '向右'], ['a la izquierda', '向左'], ['cerca', '近'],
    ['¿Hay un cajero por aquí?', '这附近有取款机吗？'], ['El metro está al lado del supermercado', '地铁在超市旁边'],
    ['Perdona, ¿para ir a la catedral?', '请问去大教堂怎么走？'], ['Sigues todo recto y giras a la derecha', '你一直走然后右转'],
    ['Voy al trabajo en metro', '我坐地铁上班'], ['Está a diez minutos andando', '走路十分钟就到']],
  drills: [
    ['¿___ una farmacia cerca?', 'Hay', ['Está', 'Es', 'Están'], '问有没有用 hay'],
    ['La farmacia ___ en la plaza.', 'está', ['hay', 'es', 'son'], '已知的东西在哪用 estar'],
    ['Voy ___ banco.', 'al', ['a el', 'a la', 'del'], 'a + el = al'],
    ['Nosotros ___ a la playa en coche.', 'vamos', ['van', 'voy', 'vais'], 'nosotros → vamos'],
    ['El hotel está ___ lado de la estación.', 'al', ['a', 'del', 'en el'], 'al lado de = 在……旁边']],
  dialog: [['A', 'Perdona, ¿hay una estación de metro por aquí?', '请问，这附近有地铁站吗？'], ['B', 'Sí, hay una muy cerca. Está en la plaza.', '有，很近。就在广场上。'], ['A', '¿Y cómo voy?', '怎么走呢？'], ['B', 'Sigues todo recto y coges la segunda a la izquierda.', '一直走，第二个路口左转。'], ['A', '¿Está lejos?', '远吗？'], ['B', 'No, a cinco minutos andando.', '不远，走路五分钟。']]
});

COURSE.push({ id: 'a1-14', lv: 'A1', unit: '生活', title: '一天的作息', goal: '用反身动词讲自己的一天',
  notes: [
`## 反身动词
动作落在自己身上时，动词带一个反身代词。以 *levantarse*（起床）为例：
| | |
| yo | *me levanto* |
| tú | *te levantas* |
| él / ella / usted | *se levanta* |
| nosotros | *nos levantamos* |
| vosotros | *os levantáis* |
| ellos / ustedes | *se levantan* |
代词放在变位动词前面；如果有原形动词，也可以接在原形后面：*Voy a ducharme* = *Me voy a duchar*。`,
`## 常用的反身动词
*despertarse (me despierto)* 醒来、*levantarse* 起床、*ducharse* 淋浴、*vestirse (me visto)* 穿衣、*lavarse los dientes* 刷牙、*acostarse (me acuesto)* 上床、*dormirse (me duermo)* 睡着、*quedarse* 留下、*llamarse* 名叫。`,
`## 多久一次
*siempre*（总是）、*casi siempre*、*normalmente*、*a menudo*（经常）、*a veces*（有时）、*casi nunca*、*nunca*（从不）。
*nunca* 放动词前不用再加 no：*Nunca desayuno.* = *No desayuno nunca.*
*antes de / después de* + 动词原形：*Después de cenar, veo una serie.*`],
  items: [
    ['levantarse', '起床'], ['ducharse', '淋浴'], ['acostarse', '上床睡觉'], ['despertarse', '醒来'], ['siempre', '总是'], ['a veces', '有时'], ['nunca', '从不'], ['temprano', '早'],
    ['Me levanto a las siete', '我七点起床'], ['¿A qué hora te acuestas?', '你几点睡觉？'],
    ['Nunca desayuno en casa', '我从不在家吃早饭'], ['Después de trabajar, voy al gimnasio', '下班后我去健身房'],
    ['Los domingos nos despertamos tarde', '周日我们醒得晚'], ['Mi novia se ducha por la noche', '我女朋友晚上洗澡']],
  drills: [
    ['Yo ___ levanto temprano.', 'me', ['se', 'te', 'mi'], 'yo → me'],
    ['¿A qué hora ___ acuestas?', 'te', ['se', 'me', 'tu'], 'tú → te'],
    ['Mis padres ___ a las once. (acostarse)', 'se acuestan', ['se acostan', 'acuestan', 'os acostáis'], 'o→ue，ellos → se acuestan'],
    ['___ desayuno, solo tomo café.', 'Nunca', ['Siempre', 'Nada', 'Ninguno'], '从不 = nunca'],
    ['Antes de ___, leo un poco. (dormir)', 'dormir', ['duermo', 'dormido', 'durmiendo'], 'antes de 后面跟动词原形']],
  dialog: [['A', '¿A qué hora te levantas normalmente?', '你平时几点起床？'], ['B', 'Me levanto a las siete, me ducho y desayuno.', '七点起床，洗澡，吃早饭。'], ['A', '¡Qué temprano! Yo me despierto a las nueve.', '好早！我九点才醒。'], ['B', '¿Y a qué hora te acuestas?', '那你几点睡？'], ['A', 'Tarde, a la una. A veces me quedo viendo series.', '很晚，一点。有时候熬夜追剧。']]
});

COURSE.push({ id: 'a1-15', lv: 'A1', unit: '出行与购物', title: '购物、颜色与衣服', goal: '买东西、问价、比较',
  notes: [
`## 这个、那个
| | 近（这） | 中（那） | 远（那边那） |
| 阳性单数 | *este* | *ese* | *aquel* |
| 阴性单数 | *esta* | *esa* | *aquella* |
| 阳性复数 | *estos* | *esos* | *aquellos* |
| 阴性复数 | *estas* | *esas* | *aquellas* |
不知道是什么东西时用中性的 *esto / eso*：*¿Qué es esto?*`,
`## 颜色
*blanco, negro, rojo, amarillo, verde, azul, gris, marrón, rosa, naranja*
放在名词后，并和名词一致：*una camisa blanca*、*unos zapatos negros*。*azul, verde, gris* 没有阴阳之分；*rosa, naranja* 通常不变。`,
`## 比较
- *más … que*：*Esta camisa es más barata que esa.*
- *menos … que*：*Es menos caro que el otro.*
- *tan … como*：*Es tan bonito como el rojo.*
- 不规则：*mejor*（更好）、*peor*（更差）、*mayor*（年长）、*menor*（年幼）`,
`## 在店里
*¿Cuánto cuesta?*　*¿Tiene una talla más grande?*　*¿Puedo probármelo?*　*Me lo llevo.*（我要了）　*Solo estoy mirando, gracias.*（我只是看看）`],
  items: [
    ['la camisa', '衬衫'], ['los zapatos', '鞋'], ['los pantalones', '裤子'], ['la talla', '尺码'], ['barato', '便宜的'], ['caro', '贵的'], ['rojo', '红色的'], ['azul', '蓝色的'],
    ['¿Cuánto cuesta esta camisa?', '这件衬衫多少钱？'], ['Estos zapatos son más caros que esos', '这双鞋比那双贵'],
    ['¿Tiene una talla más pequeña?', '有小一号的吗？'], ['¿Puedo probarme estos pantalones?', '我可以试试这条裤子吗？'],
    ['Me gusta más la azul', '我更喜欢蓝色那件'], ['Solo estoy mirando, gracias', '我只是看看，谢谢']],
  drills: [
    ['___ zapatos son muy cómodos. (这些)', 'Estos', ['Estas', 'Este', 'Esto'], 'zapatos 阳性复数 → estos'],
    ['Quiero ___ camisa de allí. (那边那件)', 'aquella', ['aquel', 'esto', 'ese'], '远处的阴性单数 → aquella'],
    ['Este móvil es ___ caro que el otro.', 'más', ['muy', 'tan', 'mucho'], 'más … que'],
    ['Tengo dos faldas ___.', 'rojas', ['rojos', 'roja', 'rojo'], 'faldas 阴性复数 → rojas'],
    ['Este vino es ___ que aquel. (更好)', 'mejor', ['más bueno', 'más bien', 'bueno'], 'bueno 的比较级是 mejor']],
  dialog: [['A', 'Hola, ¿te puedo ayudar?', '你好，需要帮忙吗？'], ['B', 'Sí, ¿cuánto cuesta esa chaqueta azul?', '是的，那件蓝色外套多少钱？'], ['A', 'Sesenta euros. Y esta negra es más barata, cuarenta.', '六十欧。这件黑色的便宜些，四十。'], ['B', '¿Puedo probarme la azul? Uso la talla M.', '我能试试蓝色的吗？我穿 M 码。'], ['A', 'Claro, los probadores están al fondo.', '当然，试衣间在里面。'], ['B', 'Me queda bien. Me la llevo.', '挺合身。我要了。']]
});

COURSE.push({ id: 'a1-16', lv: 'A1', unit: '出行与购物', title: '计划与天气', goal: '说打算做什么，聊天气',
  notes: [
`## ir a + 动词原形
说计划和马上要发生的事，最常用的就是这个结构：
*Voy a estudiar.*（我要去学习了）　*¿Qué vas a hacer mañana?*　*Vamos a cenar fuera.*
时间词：*esta tarde*、*esta noche*、*mañana*、*pasado mañana*（后天）、*el fin de semana*、*la semana que viene*（下周）、*el año que viene*（明年）。`,
`## 其他说打算的办法
- *querer + 原形*：*Quiero aprender a conducir.*
- *pensar + 原形*：*Pienso quedarme en casa.*（我打算待在家）
- *tener que + 原形*（必须）：*Tengo que trabajar el sábado.*
- *tener ganas de + 原形*（想、有兴致）：*Tengo ganas de viajar.*`,
`## 天气
多数说法用 *hace*：*hace sol*（晴）、*hace calor / frío*（热/冷）、*hace viento*（刮风）、*hace buen / mal tiempo*（天气好/差）。
*llueve*（下雨）、*nieva*（下雪）、*está nublado*（多云）、*hay niebla*（有雾）。
四季：*la primavera, el verano, el otoño, el invierno*。`],
  items: [
    ['hace sol', '出太阳'], ['hace frío', '天冷'], ['hace calor', '天热'], ['llueve', '下雨'], ['el verano', '夏天'], ['el invierno', '冬天'], ['las vacaciones', '假期'], ['el paraguas', '雨伞'],
    ['¿Qué vas a hacer este fin de semana?', '这个周末你打算做什么？'], ['Voy a quedarme en casa porque llueve', '因为下雨，我打算待在家'],
    ['En verano hace mucho calor en Sevilla', '夏天塞维利亚很热'], ['Vamos a viajar a España en agosto', '我们八月要去西班牙旅行'],
    ['Tengo que trabajar mañana', '我明天得上班'], ['Tengo ganas de ir a la playa', '我想去海边']],
  drills: [
    ['Mañana ___ a visitar a mis padres. (yo)', 'voy', ['va', 'vamos', 'ir'], 'ir a + 原形，yo → voy'],
    ['¿Qué vais a ___ esta noche?', 'hacer', ['hacéis', 'haciendo', 'hecho'], 'ir a 后面跟动词原形'],
    ['Hoy ___ mucho frío.', 'hace', ['es', 'está', 'hay'], '天气冷热用 hace'],
    ['Coge el paraguas, que ___.', 'llueve', ['hace lluvia', 'es lluvia', 'está lluvia'], '下雨就是 llueve'],
    ['Tengo ___ estudiar para el examen.', 'que', ['de', 'a', 'por'], 'tener que + 原形 = 必须']],
  dialog: [['A', '¿Qué vas a hacer en vacaciones?', '假期你打算做什么？'], ['B', 'Voy a ir a Galicia con mi novia.', '我要和女朋友去加利西亚。'], ['A', '¿En agosto? Allí llueve mucho.', '八月？那儿雨很多。'], ['B', 'Ya, pero no hace tanto calor como en Madrid.', '是啊，但没有马德里那么热。'], ['A', 'Eso es verdad. Yo tengo que trabajar todo el verano.', '那倒是。我整个夏天都得上班。']]
});
