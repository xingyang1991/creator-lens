<!-- SOURCE: source_packs/artist_cases_pack_v2/03_AlecSoth_RIVER_ROAD_LEDGER.md -->

# Alec Soth｜RIVER ROAD LEDGER / 路上田野编译器（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 《Sleeping by the Mississippi》源自沿密西西比河的多次公路旅行，作品以**大画幅（large-format）色彩摄影**记录人物、风景与室内，并在编辑中形成一致的情绪（孤独、渴望、遐想）。  
- 其“像”的来源是：**缓慢的田野节奏 + 画像/室内/风景的交替 + 书页化编辑**（photobook logic），而不是戏剧化摆拍。  
- 因此在你们产品里，转译应是：把输入照片编译成“某次路上停靠点”的**书页作品卡**：成片+田野笔记+路线索引+‘拾得文本’（found text）+展签。

### 参考来源
```text
- MACK 出版页：Sleeping by the Mississippi（road trips & large-format color）
  https://www.mackbooks.us/products/sleeping-by-the-mississippi-br-alec-soth
- Magnum Photos：Sleeping by the Mississippi 介绍与回顾（项目语境）
  https://www.magnumphotos.com/arts-culture/alec-soth-sleeping-by-the-mississippi/
- Fraenkel Gallery 商店页（large format color photographs 描述）
  https://fraenkelgallery.com/shop/sleeping-by-the-mississippi
```

---

# 案例能力牌：RIVER ROAD LEDGER / 路上田野编译器（Alec Soth 向）

## 1) 归属牌组（固定掉落载体）
**书信旅行｜公路书页牌组（Large-Format Still + Field Notes + Book Spread）**  
固定掉落：
1) **Main Visual**：大画幅色彩成片（细节丰富、克制）
2) **Context Shot**：书页摊开/桌面编辑（照片、便签、地图）
3) **Field Notes**：三段田野笔记（观察/对话/环境）
4) **Route Index**：路线与章节索引（模糊化地点）
5) **Book Spread Layout**：一页书页排版规则 + 展签

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜停靠点类型（Stop Type）**
- A `PORTRAIT（默认）`：人像为主（可用背影/匿名剪影避免识别）
- B `INTERIOR`：室内/居所的物件与光线
- C `LANDSCAPE`：河岸/空地/边缘地带

**按钮2｜章节气氛（Mood）**
- A `reverie（默认）`：更梦游、更松
- B `lonely`：更冷、更空
- C `odd`：更怪一点（但仍克制）

**默认路径**：PORTRAIT + reverie

---

## 3) visual_spec

### 3.1 Main Visual｜Large-Format Color Still（主视觉提示词）
```text
把输入照片编译为“大画幅彩色公路摄影成片”（Alec Soth式：细节丰富、色彩克制、情绪统一，不做戏剧滤镜）：
- 画面清晰、层次深，像用大画幅拍摄
- 构图给空间：人物/物件/环境之间留白
- 色彩自然偏淡、不过饱和；光线像路上的自然光
- 若画面有人：不得可识别面孔（背影/侧脸不可辨/遮挡），避免现实指认
- 不添加夸张特效；重点是“停靠点的安静与奇怪”
输出：一张可进入摄影书的成片
```

### 3.2 Context Shot｜Book Editing Table（存在场景提示词）
```text
生成一张“书页化存在场景”：
- 桌上摊开一本摄影书的双页，其中一页是本次主视觉（缩略可辨）
- 桌面有便签、地图、铅笔、打印的短文本（田野笔记）
- 氛围：编辑中的安静（不是展厅，是书的诞生现场）
输出：一张作品被编入“系列”的现场照
```

---

## 4) artifacts

### Artifact A（默认主展品）｜FIELD NOTES 3 / 三段田野笔记（LLM Prompt）
```text
写三段田野笔记（每段60–90字），像摄影师的现场记录：
1) OBSERVATION：只写可见事实（引用照片具体细节：地面/墙面/物件/光线）
2) DIALOGUE FRAGMENT：一段匿名对话碎片（不写姓名，不写地址，像路上遇到的人说的半句）
3) ENVIRONMENT：声音/天气/气味的客观词（不抒情），并点出“为什么会停下来拍”但不解释意义
要求：克制、具体、带一点奇怪但不煽情。
```

### Artifact B｜ROUTE INDEX / 路线索引卡（LLM Prompt）
```text
生成一张“路线索引卡”（完全模糊化地点）：
- CHAPTER：Vol.# / Stop #（编号）
- LOCATION：某州某河段/某小镇附近（禁止真实可定位地址）
- FOUND TEXT：从照片中提取一个“可当章节名的词”（若无文字就从物件命名中取）
- RELATED STOPS：3条关联（Portrait/Interior/Landscape 各1）+ 1句关联理由（回到照片细节）
结尾：MISSING STOP（1句）：指出这一系列里最缺的是什么（留缺口）。
```

### Artifact C｜BOOK SPREAD LAYOUT / 书页排版规则（LLM Prompt）
```text
输出双页排版规则：
- 左页：主视觉占比（例如 70%）+ 1条caption
- 右页：田野笔记区 + 索引卡（小字号）
- 规定：留白比例、字体（打字机/简洁无衬线）、编号位置
语气：像编辑说明，不像设计美学文章。
```

---

## 5) 一次 Session
Scan：判词=“把照片变成一次停靠点”；证据=3个路上线索（边缘地带/物件/光）  
Load：3推荐（Stop Type 变化）+ 危险槽（隐私→只用物件与空间）  
Direct：0–2按钮（Stop Type/Mood）  
Reveal：先出大画幅成片，再补田野笔记+索引卡+书页排版+展签  
Collect：默认主展品=田野笔记；备选=书页排版
