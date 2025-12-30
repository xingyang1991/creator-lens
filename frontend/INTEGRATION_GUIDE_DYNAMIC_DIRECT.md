# Dynamic Direct（director_spec）接入指南

这份 Demo 已完成两件事：

1. **载入 49 张能力卡（Ability Cards）**：卡库位于 `./ability_cards/`，运行时由 `library.ts` 统一组装成 `LIBRARY_DECKS`。
2. **把 Direct 阶段从固定 4 个按钮，改成“每张卡的 director_spec 动态按钮”**，并把用户选择写回到生成 Prompt（图像 / 文本都写回）。

> 目标：让每张卡的“导演位（0–2 个按钮…也兼容更多按钮）”真正驱动生成结果，而不是全局固定视角。

---

## 你会用到的核心文件

### 1) 能力卡库（49 张）

- `ability_cards/registry/cards.json`：卡的基础元数据（id / 名称 / deck / 标签等）
- `ability_cards/registry/suits.json`：卡组（deck）定义
- `ability_cards/cards/markdown/*.md`：每张卡的完整内容（包含 director_spec / visual_spec / artifacts 等）

### 2) 卡库组装与解析

- `library.ts`
  - 用 `import.meta.glob(...?raw)` 一次性加载全部卡的 markdown
  - 解析 `关键气质`（bias）
  - **解析 director_spec**（两种常见写法都兼容）：
    - 形式 A：
      - `- 语气：\`冷静研判 / 法庭式克制 / ...\``
    - 形式 B：
      - `**按钮1｜XXX（YYY）**` + `- A \`...\`` / `- B \`...\``

### 3) UI：Direct 阶段动态渲染

- `App.tsx`
  - `renderDirect()`：根据 `selectedCard.directorSpec` 生成按钮组
  - `useEffect`：进入 DIRECT 时自动填充默认值（defaultIndex），保证用户不点也能走默认路径

### 4) Prompt 注入

- `services/gemini.ts`
  - `buildDirectorSelections(context, selectedCard)`：把 director_spec + 用户选择格式化成 `summary + block`
  - 在 `generateArtisticImage()` 与 `generateRevealText()` 中写入 Prompt

---

## director_spec 数据结构（标准化后的运行时格式）

`types.ts`

```ts
export interface DirectorSpecItem {
  key: string;              // e.g. "叙事姿态" / "流通轨迹" / "介质"
  options: string[];        // e.g. ["冷幽默", "愤怒宣言（Danger）"]
  defaultIndex: number;     // 默认项在 options 里的 index
  dangerIndexes: number[];  // 哪些选项属于“危险档位”
}

export interface Card {
  id: string;
  title: string;
  bias: string;
  meta?: string;
  isJoker?: boolean;
  directorSpec?: DirectorSpecItem[]; // <= 新增
}
```

---

## 在你现有代码包里如何改（最小改动清单）

下面按“如果你从原 Demo（固定 4 个 Direct 选项）”开始改的路径写。

### Step 1：把能力卡库放进项目

把本包中的 `ability_cards/` 目录拷贝到你的项目根目录（与 `App.tsx` 同级）。

### Step 2：引入 `library.ts` 并暴露 `LIBRARY_DECKS`

- 把本包的 `library.ts` 拷贝到你的项目根目录。
- 在 `constants.ts` 里确保：

```ts
import { LIBRARY_DECKS } from './library';
```

并让 `LIBRARY_DECKS` 参与推荐逻辑（你原来如果是写死的 deck/card 列表，就替换掉）。

### Step 3：扩展 Card 类型

在 `types.ts`：

- 新增 `DirectorSpecItem`
- 给 `Card` 增加 `directorSpec?: DirectorSpecItem[]`

（见上面的类型定义）

### Step 4：Direct 阶段改成动态按钮

在 `App.tsx`：

1) **进入 DIRECT 时填默认值**（关键，不然会出现空 selections）：

```ts
useEffect(() => {
  if (currentStep !== Step.DIRECT) return;
  const selectedCard = ctx.pick.isJoker
    ? ctx.reco.joker
    : ctx.reco.cards.find((c) => c.id === ctx.pick.cardId);
  const spec = selectedCard?.directorSpec || [];
  if (!spec.length) return;

  setCtx((p) => {
    if (p.direct.answers.length === spec.length) return p;
    const defaults = spec.map((q) => q.options[q.defaultIndex] ?? q.options[0] ?? '');
    return { ...p, direct: { answers: defaults.filter(Boolean) } };
  });
}, [currentStep, ctx.pick.cardId, ctx.pick.isJoker]);
```

2) **渲染按钮组**：

- 用 `selectedCard.directorSpec.map(...)`
- 每组按钮写回 `ctx.direct.answers[index]`

（本包 `App.tsx` 的 `renderDirect()` 已实现。）

### Step 5：把 selections 写回 Prompt

在 `services/gemini.ts`：

- 新增 `buildDirectorSelections(context, card)`
- 在 prompt 中加入：

```
Director Spec:
- 语气: 冷幽默
- 流通轨迹: 转发链
...
```

本包已完成这一步（同时写进 image prompt 和 text prompt）。

---

## 关于“危险档位（Danger）”的处理

- `library.ts` 会基于关键词把选项标为 danger（`dangerIndexes`）
- `App.tsx` 在 `ctx.safety.mode === 'softened'` 时，会禁用这些按钮（仍显示但不可点）

你可以按你们产品策略进一步加强：

- Danger 选项点击时二次确认（类似 JokerGate）
- Danger 选项启用更强 `redaction_applied` / `no-identification` 提示

---

## 常见问题

### Q1：有些卡的 director_spec 超过 2 个按钮怎么办？

本实现 **支持 0..N 组**，都会渲染出来。

如果你希望保持“0–2 个按钮”的产品纪律，可以在 `library.ts` 的 `extractDirectorSpec()` 最后增加裁剪：

```ts
return items.slice(0, 2);
```

或按你们的优先级规则挑选最关键的 2 组。

### Q2：为什么要从 markdown 解析 director_spec？

因为当前卡库的“完整内容”以 markdown 为单一源头（编辑更方便）。

如果你们后续希望更稳定：

- 可在构建阶段把 markdown 解析成结构化 JSON（含 director_spec / visual_spec / artifacts），前端直接读取 JSON。

---

## 变更摘要（方便开发团队 code review）

- `types.ts`
  - 新增 `DirectorSpecItem`
  - `Card` 增加 `directorSpec?: ...`

- `library.ts`
  - 新增 `extractDirectorSpec()`：从 markdown 解析 director_spec 并写入 Card
  - Joker 也带一个最小 directorSpec（用于 UI 不空）

- `App.tsx`
  - Direct 页面：固定 4 按钮 → 动态 director_spec 渲染
  - 进入 DIRECT 时自动填默认 selections

- `services/gemini.ts`
  - prompt 增加 `Director Spec` block（图像/文本都写回）

