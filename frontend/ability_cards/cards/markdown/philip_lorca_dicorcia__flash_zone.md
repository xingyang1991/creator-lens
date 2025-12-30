<!-- SOURCE: source_packs/artist_cases_pack_v2/04_PhilipLorcaDiCorcia_FLASH_ZONE.md -->

# Philip-Lorca diCorcia｜FLASH ZONE / 闪光剧场编译器（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- diCorcia 的街头系列（如 Heads/Streetwork）常被描述为：**在公共空间中布置闪光灯与固定机位**，把行人“瞬间从背景里切出来”，形成类似古典明暗对照（chiaroscuro）的静止感；MoMA 也提到他通过安排闪光灯与精确机位，使画面具有“安静的静止感”。  
- 这类作品的关键不是偷拍技巧，而是“观看机制”：**光域（zone of light）**让日常变成舞台；而“谁被照亮”成为伦理问题。  
- 因此在你们产品里，转译应是：对现有照片进行“光域隔离式编译”——生成主视觉（闪光隔离）+ 光域示意图 + 观看条件清单；并默认去识别/去定位，避免现实骚扰风险。

### 参考来源
```text
- MoMA 艺术家页：diCorcia 通过安排闪光灯与精确机位等方式（概述）
  https://www.moma.org/collection/artists/7027
- Artforum：Street Fare（谈及闪光灯挂在灯杆/路牌等与观看关系）
  https://www.artforum.com/features/street-fare-the-photography-of-philip-lorca-dicorcia-2-201248/
- photo-graph.org：提及 remote flash guns 让人物被隔离（概述性）
  https://photo-graph.org/2013/01/27/philip-lorca-dicorcia/
```

> 安全声明：本能力牌只做“对已有照片的风格化编译”，不提供在公共空间对陌生人进行无同意拍摄/布灯的操作指南。

---

# 案例能力牌：FLASH ZONE / 闪光剧场编译器（Philip-Lorca diCorcia 向）

## 1) 归属牌组（固定掉落载体）
**观看机制｜光域隔离牌组（Flash-Isolation Still + Diagram + Conditions）**  
固定掉落：
1) **Main Visual**：闪光隔离成片（背景压暗、主体被“光域”抓住）
2) **Context Shot**：展厅墙面“对照展示”（成片 + 光域图）
3) **Light-Zone Diagram**：光域示意（不涉及现实布灯细节）
4) **Conditions of Viewing**：观看条件清单（6条）
5) **Caption**：一句制度化说明（推断≠指控；光域≠现实追踪）

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜裁切协议（Crop）**
- A `HEADS（默认）`：更紧的肖像裁切（不露可识别细节时优先）
- B `STREETWORK`：更宽的街景/全身（但仍保持主体隔离）

**按钮2｜对比强度（Contrast）**
- A `CH... (high)（默认）`：强明暗、背景接近黑
- B `CH... (medium)`：背景仍可读但不抢主角

**默认路径**：HEADS + high

---

## 3) visual_spec

### 3.1 Main Visual｜Flash Isolation Still（主视觉提示词）
```text
把输入照片编译为“光域隔离”的摄影成片（diCorcia式明暗对照感）：
- 主体被强光击中（像闪光灯），背景显著压暗
- 画面中必须能读出“光域边界”的痕迹（光从哪里开始、哪里结束）
- 质感：清晰、静止、像瞬间被暂停
- 若原图有人脸：默认进行去识别（模糊/裁切/遮挡）；不输出可定位文字
- 禁止把结果做成“酷炫特效”；要像严肃摄影作品
输出：一张可展陈的大尺幅成片
```

### 3.2 Context Shot｜Gallery Comparison Wall（存在场景提示词）
```text
生成一张“展厅对照呈现”的现场照：
- 白墙上并列两幅：左为本次成片，右为“光域示意图+观看条件清单”
- 观众背影可出现（不可识别面部）
- 氛围：像在研究“图像如何工作”，不是看故事
输出：一张制度化观看成立的现场照
```

---

## 4) artifacts

### Artifact A（默认主展品）｜LIGHT-ZONE DIAGRAM / 光域示意（LLM Prompt）
```text
生成一份“光域示意说明”（文本版，用于配图）：
- ZONE SHAPE（光域形状：椭圆/条带/扇形）
- ENTRY EDGE（进入边界：硬/软）
- SUBJECT ANCHOR（主体锚点：脸/手/衣物高光/物件反光）
- BACKGROUND DROP（背景如何被压暗：用“视觉结果”描述，不写布灯参数）
- ETHICS NOTE（1句）：光域是观看机制，不是跟踪工具
语言必须冷静、制作化。
```

### Artifact B｜CONDITIONS OF VIEWING 6 / 观看条件清单（LLM Prompt）
```text
输出6条观看条件，每条格式固定：
- 条件：裁切/遮挡/阈值/反光/站位/时间码（选其一）
- 作用：它让观众看见什么
- 代价：它抹去什么
要求：每条回到照片的具体细节（边缘/反光/遮挡处）。
```

### Artifact C｜CAPTION / 图录说明（LLM Prompt）
```text
写一段80–120字图录说明：
- 说明“光域隔离”如何把日常变成舞台
- 明确：不进行现实指认、不提供追踪线索；推断≠指控
语气：制度化、克制。
```

---

## 5) 一次 Session
Scan：判词=“光域抓住主体”；证据=3个可被隔离的线索（高光/边界/遮挡）  
Load：3推荐（HEADS/Streetwork/medium）+ 危险槽（隐私→强遮蔽+只输出diagram）  
Direct：0–2按钮（Crop/Contrast）  
Reveal：先出成片，再补光域图+观看条件+caption  
Collect：默认主展品=光域示意；备选=成片

---

## 6) 安全与边界
- 不提供对陌生人无同意拍摄的现实操作步骤；本能力仅对用户输入照片做作品化编译。  
- 默认去识别/去定位；任何可能引发骚扰的细节一律遮蔽。
