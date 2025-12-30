# Creator Lens – Dev Guide (可扩展能力卡版本)

这份文档解释本代码包的“模块化点”和“可扩展能力卡”的实现方式，方便你后续用 vibe coding 方式快速迭代。

> UI/UX：本版本尽量保持你提供 Demo 的界面结构与交互不变；变化集中在**数据模块（能力卡）**与**AI 生成/推荐逻辑**。

---

## 1. 项目结构速览

- `App.tsx`
  - 维持原有页面流程与 UI 组件调用。
  - 只做了两类“隐性增强”：
    - Scan 结果新增 `signalTags`（不在 UI 展示，但用于推荐）。
    - Recommend 选卡时，会把 deck 自动切换为**所选卡所属的 suit**（保证后续 stamp/导出信息一致）。

- `ability_cards/`
  - `cards/specs/*.json`：每张卡的机器可读字段（tags / risk_level / sharpness / suit/deck 信息等）
  - `cards/markdown/*.md`：每张卡的人类可读“卡片规范”（强偏见 / 固定掉落载体 / visual_spec / artifacts / director_spec…）
  - `registry/suits.json`：各 suit 的 UI 名称和描述（可选扩展项）

- `library.ts`
  - 能力卡加载与编译（把 spec + markdown 合成运行时 Card）
  - 生成 `LIBRARY_DECKS`（用于 Library 页面）
  - 导出工具函数：`getCardById`, `getDeckBySuitId`, `importCustomCardPack` …

- `services/gemini.ts`
  - AI：Scan / Recommend / Reveal(Text) / Image 生成的统一入口
  - 推荐算法改为：**本地 deterministic scoring**（信号 tag → 卡 tags），必要时可再加模型 fallback

---

## 2. 能力卡如何“模块化 + 可拓展”

### 2.1 Card 的双文件结构

新增/维护一张卡，原则上只需要 2 个文件：

1) `ability_cards/cards/specs/<card_id>.json`
- 机器可读元信息
- 重要字段：
  - `card_id`（必须，与文件名/markdown 对应）
  - `creator`
  - `card_name_en`, `card_name_zh`
  - `suit_id`, `suit_ui`
  - `deck_id`, `deck_ui`
  - `tags`（用于匹配/检索）
  - `risk_level`（用于 safe mode 过滤）
  - `sharpness`（用于排序与 tie-break）

2) `ability_cards/cards/markdown/<card_id>.md`
- 人类可读规范（也是 prompt 的“知识来源”）
- 推荐保持结构：
  - `1) strong_bias`
  - `2) fixed_outputs`
  - `3) visual_spec`
  - `4) artifacts`
  - `5) director_spec`

> 你不需要再手动维护一份总表 registry：本项目用 Vite 的 `import.meta.glob` 自动把 `specs/*.json` + `markdown/*.md` 全量打包进来。

### 2.2 运行时 Card 数据结构

`library.ts` 会把 spec+markdown 编译成运行时 `Card`：
- `id`, `title`, `meta`
- `creator / suitId / suitName / deckId / deckName`
- `tags / riskLevel / sharpness`
- `markdown`（整段卡片规范）
- `directorSpec`（从 markdown 的 director_spec 段提取，驱动 Direct 按钮）

这保证：
- **卡是数据**，不是写死的 UI 逻辑
- 新增卡，不需要改 UI 代码

---

## 3. 推荐逻辑：跨卡组混配（不改 UI）

### 3.1 Scan 会生成 `signal_tags`

`services/gemini.ts -> analyzeImage()` 会输出：
- `verdict`
- `evidence[]`
- `safety_flags[]`
- `signal_tags[]`（新增）

signal_tags 设计为可与 cards.spec.tags 对齐的命名空间，例如：
- `origin:screenshot` / `origin:photo` / `origin:document`
- `ui:social_feed` / `ui:timestamp_overlay`
- `object:map` / `object:handwriting` / `object:signage`
- `scene:public_space` / `scene:private_space` / `scene:night`
- `structure:sequence_potential` / `structure:text_dominant`
- `theme:evidence` / `theme:archive` / `theme:platform`

### 3.2 Recommend：本地 deterministic scoring

`services/gemini.ts -> recommendDecks()` 不再让模型去“直接选卡”，而是：
1) 用 signal_tags 与每张卡的 `tags` 做加权匹配得分
2) safe mode 下会过滤高风险卡（`risk_level`）
3) 选 Top 3，同时做轻量“去重”：尽量来自不同 suit（满足你之前“不要都来自同一个卡组”的目标）

> UI 仍然只显示 1 个“deck 名称 + tagline”，但选卡可以跨 suit。用户点击某张卡后，系统会把 deck 自动切换为该卡所属 suit，用于后续 stamp/export 一致性。

你可以在 `services/gemini.ts` 中 vibe coding 调整：
- `TAG_PREFIX_WEIGHT`
- `scoreCard()`
- `pickDiverseTopN()`
- safe mode 的过滤阈值

---

## 4. 生成逻辑：把卡片规范写进提示词（可控、可改）

### 4.1 Reveal 文本

`services/gemini.ts -> generateOutput()` 的 prompt 会注入：
- 选中的能力卡 spec（markdown 全文）
- director 选择（Direct 的按钮结果）
- Scan 输出（verdict/evidence/safety_flags/signal_tags）

并要求模型输出严格 JSON：
- `title`
- `hook`
- `sections[]`
- `coreCandidates[]`

你可以直接在 `generateOutput()` 里调 prompt 结构（最适合 vibe coding）。

### 4.2 生成图像

`services/gemini.ts -> generateArtisticImage()` 同样把卡片 markdown + director choices 写入提示词。

- 强制“保留原图关键对象，但进行卡片方法论式重写”
- 如果安全标记提示“人脸/隐私风险”，会建议做剪影/遮挡（可继续加严）

---

## 5. 自定义能力卡：给用户/给你自己预留的入口

本版本不改 UI，但提供一个**运行时导入 pack 的入口**（用于你后续做“用户定制卡”功能时无痛衔接）。

### 5.1 浏览器控制台导入

应用启动后，会挂载：

```js
window.__CREATOR_LENS__.importCustomCardPack(pack)
window.__CREATOR_LENS__.clearCustomCardPacks()
```

### 5.2 Pack 数据结构（v1）

```json
{
  "version": "v1",
  "name": "My Pack",
  "cards": [
    {
      "spec": {
        "card_id": "my_card__example",
        "creator": "Me",
        "card_name_en": "Example",
        "card_name_zh": "示例",
        "suit_id": "observatory",
        "suit_ui": "OBSERVATORY",
        "deck_id": "observatory",
        "deck_ui": "OBSERVATORY",
        "tags": ["theme:archive"],
        "risk_level": 0,
        "sharpness": 2
      },
      "markdown": "# Example\n\n1) strong_bias\n- ...\n"
    }
  ]
}
```

导入成功后会写入 localStorage 并提示你刷新页面生效。

你也可以直接参考项目根目录的 `custom_card_pack_example.json`（内含 1 张可导入的示例卡）。

---

## 6. 你后续最常改的 3 个文件

1) `services/gemini.ts`
- Scan / Recommend / Text / Image 的提示词与策略

2) `library.ts`
- 能力卡加载、解析、排序方式（例如 director_spec 的解析规则）

3) `ability_cards/cards/markdown/*.md`
- 直接改卡片规范，生成逻辑会自动受到影响

