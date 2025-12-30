<!-- SOURCE: source_packs/creator_cases_pack_v5/03_Ferran_Adria.md -->

# Ferran Adrià（El Bulli）｜ELBULLI TALLER / 菜品研发工坊（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- elBullitaller（工作坊）把探索与餐厅服务分离：在餐厅闭店期集中研发，并形成可持续的创意模型与“创意审计”（creative audit）。
- Ferran Adrià 的创作输出形式高度文档化：草图、图解、概念笔记、菜品原型迭代与分类体系（Bullipedia 把知识体系化）。
- 本能力转译：把照片编译成“菜品研发包”：概念草图→解构图谱→原型迭代→菜单落地→上菜脚本（不需要用户真做菜，强调‘像作品的菜品卡’）。

### 参考来源（链接归档）
```text
- https://elbullifoundation.com/en/ferran-adria-biography/
- https://elbullifoundation.com/bullipedia/en/como-se-ha-hecho/
- https://www.theworlds50best.com/stories/News/ferran-adria-el-bulli-never-wanted-to-cook.html
- https://nelson-atkins.org/ferran-adria/
```

---

# 案例能力牌：ELBULLI TALLER / 菜品研发工坊（Ferran Adrià 向）

## 1) 归属牌组（固定掉落载体）
**牌组：文档系×展陈系｜研发说明书牌组（Concept Sketch + Deconstruction Map + Prototype Log + Menu Card）**  
固定掉落（不可漂移）：
- 主视觉：菜品“作品卡”（盘面主视图 + 标题 + 编号）
- 右侧：Deconstruction Map（解构图谱：元素→口感→温度→顺序）
- 底部：Prototype Log（3轮迭代记录）+ Service Script（上菜一句话）
- 存在场景：工作台（草图/便签/小盘原型）

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜**方法**：解构（默认） / 重新命名（把熟悉物变新）
- 按钮2｜**口感轴**：脆/软（默认） / 冷/热
- 默认路径：解构 + 脆/软

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“菜品研发包”的主视觉与图谱（作品化模拟，不是教程）：
- 主视觉：一个盘面“成品照”（从照片提取颜色/纹理/形状作为食材隐喻，不使用真实品牌）
- 标题：≤12字，像菜名又像概念（例如‘把X拆成Y’的结构）
- 右侧 Deconstruction Map：列6个元素（来自照片的纹理/形状隐喻）并标注：形态/口感/温度/香气（用概念词，不给危险食品操作）
- 底部 Prototype Log：3轮迭代（每轮：改变了什么→为何→留下的规则）
- 加 Service Script：上菜一句话（像侍者台词，克制）
- 隐私遮蔽与去定位默认开启
```

### 3.2 存在场景（Context Shot）提示词
```text
生成“工作坊存在场景”：
- 桌面有草图、图解、便签、试盘小样（抽象）
- 画面可见本次菜品作品卡缩略
- 氛围：研发/迭代/分类，而非家庭烹饪教程
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Deconstruction Map（解构图谱）
```text
6个元素：来源隐喻（来自照片）/ 形态 / 口感 / 温度 / 作用（主角/背景/转折）。
最后一句：这道菜的“规则”是什么（≤18字）。
```

### Artifact B｜Prototype Log 3（迭代日志）
```text
三轮：v1/v2/v3
每轮3行：改变了什么 / 为什么 / 牺牲了什么（承认代价）。
```

### Artifact C｜Menu Card（菜单落地卡）
```text
字段：Course No./Dish Title/Allergens（可用“unknown/varies”）/ Serving Temp / Duration（秒）/ One-line Story（≤16字）。
```

### Artifact D｜Service Script（上菜台词）
```text
一句话：告诉客人“先吃哪一口/为什么”，像仪式指令，不解释道理。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“把照片当食材隐喻”；证据=3个纹理/颜色线索
2) Load：方法/口感轴推荐
3) Direct：0–2按钮
4) Reveal：先出菜品作品卡，再补解构图谱+迭代日志+菜单卡
5) Collect：默认主展品=Deconstruction Map

---

## 6) 安全与边界（必须遵守）
- 不提供危险食品处理/化学操作细节；只做概念化研发文件。
- 不使用真实品牌/药品作为食材暗示。
- 隐私遮蔽与去定位默认开启。
