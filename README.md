# Olé — 从零到母语水平的西班牙语 iOS 应用

界面中文，默认教西班牙本土西语（可在设置里切到拉美西语）。iOS 16 及以上。

## 里面有什么

| | 内容 | 需要联网 |
|---|---|---|
| A1–A2 课程 | 28 节手写课：讲解、对话、词句、练习 | 否 |
| B1–C2 课程 | 64 节课的大纲；每节第一次打开时由 AI 按要点生成，之后存在手机上 | 第一次需要 |
| 练习 | 选择、听辨、配对、拼句、听写、翻译、选词填空、跟读打分 | 否（跟读用系统语音识别） |
| 复习 | 间隔重复卡片；学过的、查过的、对话里改过的句子都会进来 | 否 |
| 对话 | 18 个分级情景 + 自由聊天 + 中文答疑；每句话自动批改，可语音输入 | 是 |
| 动词变位 | 离线变位引擎，全部时态；变位训练 | 否 |
| 查词 · 翻译 · 精读 | AI 词典、中西互译、逐句拆解 | 是 |
| 阅读 | 西语新闻 RSS（点词即查、朗读、AI 精读）；AI 分级读物 + 理解题 | 是 |
| 听力 | AI 生成对话，双声音朗读，可慢速、隐藏原文 | 生成时需要 |
| 写作批改 | 逐条修改 + 改正全文 + 母语者写法 | 是 |
| 发音 | 10 组难点和绕口令，跟读逐词打分 | 否 |
| 语法手册 | A1–C2 共 16 篇速查 | 否 |
| 分级测试 | 24 题，定出起点 | 否 |

所有课程和功能都是开放的，没有解锁顺序、次数或体力限制。

## AI 设置

「我的 → AI 设置」：选服务、填 API 密钥、点「保存并测试」。

- DeepSeek、通义千问：国内直连
- Claude：需要代理
- OpenAI 或任何兼容 `/chat/completions` 的服务、中转地址

模型名各家会改。连接报错时点「获取模型列表」重新选。密钥存在系统钥匙串（自签安装钥匙串不可用时存在应用沙盒里），只发给所选的服务。

## 构建和安装

没有 Mac 也能出包：

1. 把整个文件夹推到一个 GitHub 仓库的 `main` 分支
2. Actions 里的「Build IPA」会自动运行（也可以手动 Run workflow）
3. 运行结束后在页面底部 Artifacts 下载 `Ole-ipa`，解压得到 `Ole.ipa`
4. 用自签工具安装

有 Mac：`brew install xcodegen && xcodegen generate`，打开 `Ole.xcodeproj`。

构建失败时，Artifacts 里的 `build-log` 有完整日志。

## 结构

```
App/        Swift 外壳：一个 WKWebView + 原生桥（网络、朗读、语音识别、存储、提醒）
Support/    Info.plist
Web/        应用本体（HTML / CSS / JS，无第三方依赖）
  data/     课程、大纲、语法手册、情景、测试题
  js/       conj.js 变位引擎 · exercises.js 出题判分 · ai.js AI 客户端 · store.js 数据
            learn / review / chat / tools / me .js 各页面
tests/      变位、课程数据、整套界面的自动测试
project.yml XcodeGen 工程描述
```

界面和逻辑都在 `Web/` 里，用电脑浏览器直接打开 `Web/index.html` 就能预览（语音识别除外）。

改课程：编辑 `Web/data/course-a1.js`、`course-a2.js`；改 B1–C2 大纲：编辑 `Web/data/extra.js` 里的 `SYLLABUS`，每节写清要点，AI 按它生成。

## 测试

```
node tests/conj.test.js      # 146 组变位
node tests/data.test.js      # 课程数据与出题
npm i jsdom && node tests/ui.test.js   # 模拟 AI 服务，把每个页面走一遍
```
