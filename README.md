# ⚰️ Bug 殡仪馆

> 每个程序员都是连环 bug 杀手，却从没给它们办过一场葬礼。

「Bug 殡仪馆」是一个赛博殡葬系统：粘贴报错堆栈，AI 验尸官自动撰写 bug 的生平与死因；可选土葬（注释封印）、火葬（diff 焚烧特效）、海葬（push 永不回收）三种葬法；生成墓志铭墓碑，支持电子上香、献花、烧纸；公共墓园可祭拜全球程序员的阵亡 bug；年终生成《Bug 殉职年报》。

**KIRO 鬼点子计划 · 线上赛参赛作品**（赛道：无趣之趣）

## 功能

- **验尸房**：解析堆栈（Python / Java / JS / Go / C++），识别异常类型、案发现场、危害等级，生成黑幽默《验尸报告》
- **三种葬法**：土葬 / 火葬 / 海葬，全屏像素风特效动画
- **墓志铭墓碑**：AI 生成碑文，同一 bug 验尸结果稳定（按内容哈希播种）
- **祭拜系统**：上香 🕯️ / 献花 🌸 / 烧纸 💸，粒子特效 + 计数
- **公共墓园**：全球 bug 墓碑墙，可祭拜任意墓碑
- **殉职年报**：累计安葬数、香火数、头号死因、语种分布、今日死亡榜

## 技术栈

- 前端：React 18 + TypeScript + Vite（浅色直角像素风，无外部 CDN 依赖）
- 后端：Python FastAPI + SQLite，RESTful API（`/api/v1/autopsies`、`/api/v1/bugs/{id}/tributes` 等）
- 验尸官引擎：本地规则引擎兜底（零配置可运行）；配置 LLM 后自动升级为 LLM 验尸官

## 本地运行

后端（端口 8000）：

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

前端（端口 5173，已代理 /api 到 8000）：

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:5173

## Docker 一键运行

```bash
docker compose up --build
```

打开 http://localhost:8088

## 可选：接入 LLM 验尸官

```bash
export LLM_BASE_URL=https://api.openai.com/v1   # 任意 OpenAI 兼容接口
export LLM_API_KEY=sk-xxx
export LLM_MODEL=gpt-4o-mini
```

未配置时使用本地验尸官引擎，功能完整可演示。

## Kiro 开发说明（评审项：Kiro 用得有多深）

本项目全程使用 Kiro 开发：

- **Spec 驱动**：`.kiro/specs/bug-funeral/` 存有需求、设计与任务拆解文档
- **Agent Hooks**：`.kiro/hooks/fix-funeral-hook.kirohook` 配置了 git commit 触发钩子——commit message 含 `fix` 时，Agent 自动为修复的 bug 生成墓志铭并调用殡仪馆 API 下葬
- **四种形态**：开发过程使用 Kiro IDE + Kiro CLI，可迁移至 Kiro Web / Kiro Crew

## 报名表说明（200 字内）

见 README 顶部简介，可直接使用。

## 录屏脚本建议（3 分钟）

1. 0:00–0:20 首页：贴一段真实报错堆栈（用「试试示例逝者」按钮）
2. 0:20–1:00 验尸报告：生平、死因、墓志铭、危害等级逐条讲解
3. 1:00–1:40 选火葬 → 全屏焚烧特效 → 墓碑生成
4. 1:40–2:20 墓园：给别人的 bug 上香、献花、烧纸
5. 2:20–3:00 殉职年报 + Kiro Hooks 演示（commit 一个 fix，钩子自动下葬）