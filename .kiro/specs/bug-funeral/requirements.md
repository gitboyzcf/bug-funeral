# Bug 殡仪馆 · 需求规格

## 背景

KIRO 鬼点子计划线上赛参赛作品。程序员每天杀死无数 bug，却从未好好告别。让每个 bug 死得体面。

## 用户故事

1. 作为程序员，我可以粘贴报错堆栈，获得一份幽默的《验尸报告》（生平、死因、墓志铭、危害等级）
2. 作为程序员，我可以为 bug 选择土葬 / 火葬 / 海葬，观看全屏像素特效仪式
3. 作为程序员，我可以在公共墓园祭拜任意 bug（上香 / 献花 / 烧纸），计数持久化
4. 作为程序员，我可以查看《殉职年报》：累计安葬数、香火数、头号死因、语种分布、今日死亡榜

## 接口契约（RESTful）

- POST /api/v1/autopsies — 提交堆栈验尸，返回 AutopsyReport
- POST /api/v1/bugs — 下葬，创建墓碑
- GET /api/v1/bugs — 墓园列表（分页）
- GET /api/v1/bugs/{id} — 墓碑详情
- POST /api/v1/bugs/{id}/tributes — 祭拜（incense / flower / paper）
- GET /api/v1/stats/annual — 殉职年报

API 字段使用 PascalCase（Stack、ErrorType、Epitaph、IncenseCount 等）。

## 非功能需求

- 零配置可运行：未配置 LLM 时使用本地验尸官规则引擎
- 同一堆栈验尸结果稳定（内容哈希播种随机数）
- 前端浅色配色、直角风格、无外部 CDN 依赖
- Docker Compose 一键部署