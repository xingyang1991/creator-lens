<!-- SOURCE: source_packs/creator_cases_pack_v5/02_Mary_Douglas.md -->

# Mary Douglas｜PURITY GRID / 污染-秩序分类器（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- 《Purity and Danger》提出经典定义：dirt 是“matter out of place”，并指出“where there is dirt there is system”——污秽与危险来自分类秩序与边界被侵犯。
- 核心工作方式是把看似卫生/迷信的问题转译为“分类系统与边界政治”：什么被视为纯/污、内/外、可食/不可食、神圣/亵渎，本质是社会秩序的可见化。
- 本能力转译：把一张照片编译成“分类边界图 + 例外清单 + 净化仪式脚本（象征性）”，强调结构而非道德评判。

### 参考来源（链接归档）
```text
- https://web.mit.edu/allanmc/www/douglas.powersdangers.pdf
- https://as.nyu.edu/content/dam/nyu-as/sca/documents/zaloom-20231201-Mary%20Douglas%20Published.pdf
- https://www.tandfonline.com/doi/full/10.1080/13264826.2013.785579
```

---

# 案例能力牌：PURITY GRID / 污染-秩序分类器（Mary Douglas 向）

## 1) 归属牌组（固定掉落载体）
**牌组：文档系｜分类边界牌组（Boundary Map + Taboo List + Ritual Script）**  
固定掉落（不可漂移）：
- 主视觉：分类边界图（Inside/Outside + Clean/Dirty 四象限）
- 右侧：Taboo & Exception List（禁忌/例外清单）
- 底部：Ritual Script（象征性净化/修复仪式，非宗教强加）
- 存在场景：人类学田野笔记页/研究板

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜**分类轴**：洁净/污染（默认） / 神圣/亵渎
- 按钮2｜**边界态度**：维护秩序（默认） / 拥抱例外（把“脏”变成力量）
- 默认路径：洁净/污染 + 维护秩序

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“分类边界笔记页”：
- 主图为四象限：INSIDE/OUTSIDE × CLEAN/DIRTY（或神圣/亵渎）
- 从照片中提取6个要素（物/人/标识/空间边缘），把它们放入象限并标注理由（必须指向可见证据：位置、边缘、遮挡、反光、入口）
- 右侧写 Taboo & Exception List：5条禁忌 + 3条例外（例外必须解释为何被允许）
- 底部写 Ritual Script：3步象征性“修复边界”的动作（例如：遮蔽/重命名/归位/留白），明确这是作品化仪式，不是现实强制规范
- 去识别/去定位默认开启
```

### 3.2 存在场景（Context Shot）提示词
```text
生成“田野笔记/研究板存在场景”：
- 纸页上有四象限图、手写注释、回形针/胶带
- 可见本次主视觉缩略
- 氛围：研究与分类，而非审判
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Boundary Map 6（六要素边界图）
```text
6个要素：元素名 + 归属象限 + 证据（照片细节） + 风险（边界被侵犯的方式）。
```

### Artifact B｜Taboo & Exception List（禁忌/例外）
```text
5条禁忌：什么被视为“越界”；3条例外：为什么被允许越界（制度/仪式/权力）。
禁止道德羞辱口吻。
```

### Artifact C｜Ritual Script（象征性修复仪式）
```text
3步：命名边界→处理例外→留下缺口（承认系统总会产生脏）。
最后一句：这是作品化仪式，不是生活建议。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“哪里有脏，哪里有系统”；证据=3个边界线索
2) Load：分类轴/态度推荐
3) Direct：0–2按钮
4) Reveal：先出边界图，再补禁忌/例外与仪式
5) Collect：默认主展品=Boundary Map 6

---

## 6) 安全与边界（必须遵守）
- 不把特定宗教/族群做刻板化描述。
- 不输出羞辱、歧视、仇恨内容。
- 仪式为象征性作品结构，不提供现实规范或健康建议。
