<!-- SOURCE: source_packs/image_creator_cases_pack_v1/06_Edward_Ruscha.md -->

# Edward Ruscha｜ROAD INDEX BOOK / 公路索引书（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- 方法特征：冷静、平视、把美国道路/招牌/日常物写成“目录与编号”；艺术家书是其重要输出形态（如 Twentysix Gasoline Stations）。
- 输出形式稳定：固定数量、固定版式、最小caption；‘具体数字’与‘重复目录’本身成为概念。
- 本能力转译重点：把照片编译成“编号目录书页”：封面+目录页+条目列表（9/16/26可选）+印刷规格。

### 参考来源（链接归档）
```text
- https://www.moma.org/collection/works/146929
- https://www.moma.org/audio/playlist/297/4433
- https://www.getty.edu/publications/ruscha/archive/13/
```

---

# 案例能力牌：ROAD INDEX BOOK / 公路索引书（Ruscha 向）

## 1) 归属牌组（固定掉落载体）
**牌组：文档系｜艺术家书牌组（Book Cover + Index List + Deadpan Captions）**  
固定掉落（不可漂移）：
- 主视觉：书封+内页双页（目录式）
- 右侧：Index List（9/16/26条）
- 底部：Printing Spec（offset风格）+ 1句冷幽默广告语（虚构）
- 存在场景：桌面摊开的书

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜条目数量：9（默认）/ 16 / 26
- 按钮2｜标题语气：死面（默认）/ 稍诗意
- 默认：9条 + 死面

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“艺术家书的封面与目录双页”：
- 封面只有标题（≤18字）+ 编号（No./Vol.#），字体极简，像平面设计
- 内页是条目目录：9/16/26条，每条一行：条目名（从照片里提取一个可命名对象/地点类型，但地点要withheld）+ 简短说明（≤10字）
- 所有条目都像‘公路目录’，语气平静，不煽情
- 加印刷规格：offset printed（style）/ edition（虚构合理）
- 不出现真实地址、油站名等可定位信息；隐私遮蔽
```

### 3.2 存在场景（Context Shot）提示词
```text
生成存在场景：
- 桌面上摊开一本小开本摄影书：左页封面或主图，右页目录
- 旁边有铅笔、便签、邮票式贴纸（抽象）
- 氛围：冷静的目录制作
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Index List（条目目录）
```text
输出N条（9/16/26）：每条=编号+条目名+一句说明；条目名必须来自照片可见对象/类型（但地点withheld）。
```

### Artifact B｜Title Variants（标题备选3个）
```text
3个标题：都像“把一个普通对象当成目录”的句式；保持死面幽默。
```

### Artifact C｜Printing Spec（印刷规格）
```text
MEDIUM：artist’s book, offset printed (style)
EDITION：范围（如 500–3000）
SIZE：小开本范围
NOTE：1句关于“数字为何重要”（克制）。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“目录化世界”；证据=3个可当条目的对象
2) Load：条目数量/语气推荐
3) Direct：0–2按钮
4) Reveal：先出封面+目录，再补标题备选与印刷规格
5) Collect：默认主展品=Index List

---

## 6) 安全与边界（必须遵守）
- 不输出真实地址/可追踪地点；一律withheld。
- 不复制真实书页与具体条目文本；只致敬方法。
