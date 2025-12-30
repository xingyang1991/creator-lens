<!-- SOURCE: source_packs/artist_cases_pack_v1/05_YayoiKusama_INFINITY_DOT_ROOM.md -->

# 05｜Yayoi Kusama｜INFINITY DOT ROOM / 自我消融镜屋编译器（案例级）
生成日期：2025-12-28

## 研究要点：Kusama 的“日常媒介纪律”与可工程化点
- **Infinity Mirror Rooms**：镜面空间让点光/物件无限复制，观众进入其中成为作品的一部分（沉浸体验）。  
- **标志性视觉语法**：波点（polka dots）、重复与密度、镜面反射；对象母题（如南瓜）在镜面中扩张为宇宙尺度。  
- **机构叙述关键词**：self-obliteration（自我消融）——个体在无限重复的视觉系统中“被复制/被吞没”。  
- **可工程化点**：不要把它做成“给照片加波点的滤镜”；而是：  
  1) 把输入照片提取为“一个对象/轮廓（core object）或一个空间边界”；  
  2) 把它编译成“可进入的房间装置摄影”；  
  3) 输出图案协议与入场规则，让“体验”成立。

参考来源：  
- Tate（Infinity Mirror Rooms）：https://www.tate.org.uk/whats-on/tate-modern/exhibition/yayoi-kusama-infinity-mirror-rooms  
- Hirshhorn（Infinity Rooms）：https://hirshhorn.si.edu/kusama/infinity-rooms/  
- Buffalo AKG（self-obliteration与跨媒介实践）：https://buffaloakg.org/art/exhibitions/one-eternity-yayoi-kusama  
- NGV（沉浸、镜面、密集图案）：https://www.ngv.vic.gov.au/exhibition/yayoi-kusama/

---

# 案例能力牌：INFINITY DOT ROOM / 自我消融镜屋编译器（Kusama 向）

## 0) 三件套
- **强偏见**：先把现实变成图案，再把图案变成房间；最后让你在镜面里“被复制到消失”。
- **强产物纪律**：必掉落：镜屋主视觉 + 入场现场照 + 波点协议 + 房间平面/动线 + 展签（why≤2）。
- **强语境包装**：输出必须带“观众尺度与入场规则”，否则会退化成滤镜图。

---

## 1) 归属牌组
**展陈系｜沉浸镜屋牌组（Infinity Room + Pattern Sheet + Visitor Protocol）**  
固定结构：Main Visual（镜屋）+ Context Shot（入场）+ Pattern Protocol + Room Plan + Wall Label

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜Motif（母题）**
- A `DOT FIELD（默认）`：纯波点/点光系统
- B `OBJECT CORE`：从输入照片提取一个对象轮廓，转译为中心体量（不可复刻任何具体作品形态）
- C `PUMPKIN-LIKE MASS`：南瓜式体量逻辑（仅致敬“体量+波点”，不复刻造型）

**按钮2｜Density（密度）**
- A `OVERLOAD（默认）`：高密度点阵，压迫式无限
- B `SPARSE`：稀疏点阵，空旷式无限

默认：DOT FIELD + OVERLOAD  
UI文案建议：`选择母题` / `选择密度`。

---

## 3) visual_spec

### 3.1 Main Visual｜Infinity Mirror Room（主视觉提示词）
```text
把输入照片编译为“可进入的无限镜屋装置摄影”（Kusama式方法论致敬，非复刻具体作品）：

硬结构（必须满足）：
1) 镜面：四壁必须为镜面；顶与地至少一处为镜面/高反射（形成无限反射）
2) 点阵系统：波点贴膜或点光灯，且在镜中产生无限复制
3) 观众尺度：可出现1位模糊背影/剪影或入口栏杆来暗示尺度（不可识别面部）
4) 若选择OBJECT CORE / PUMPKIN-LIKE MASS：
   - 从输入照片提取一个对象轮廓或体量逻辑，转译为中心雕塑体量
   - 中心体量必须覆盖波点或点阵，并在镜中无限复制
   - 严禁复刻任何具体Kusama作品造型；保持原创对象来源于用户照片

禁令：不要把它做成“给照片加点点滤镜”；必须是“房间装置摄影”，让空间成立。
输出：一张可作为展览宣传的镜屋主视觉。
```

### 3.2 Context Shot｜Entry / Visitor Experience（存在场景提示词）
```text
生成“入场体验现场照”：
- 入口处排队/等待（背影、不可识别面部）；可有提示牌与工作人员（不写真实馆名/地址）
- 透过入口可见镜屋内部点阵的光与反射（本次主视觉缩略可辨）
- 强调“短时入场”的仪式：限时、限人数、停留区
输出：一张作品被体验的现场照。
```

---

## 4) artifacts

### Artifact A（默认主展品）｜PATTERN PROTOCOL / 波点协议（LLM Prompt）
```text
生成一份“波点协议”（像装置的规则说明，不写代码）：
- DOT SIZE：小/中/大（三档）+ 选择理由（观看机制）
- DOT SPACING：密/中/疏（三档）+ 理由
- COLOR LOGIC：高对比/单色/霓虹（三选一）+ 理由
- MIRROR RULE：镜面覆盖范围（四壁+顶 / 四壁不含顶 / 全镜）
- LIGHT RULE：点光频率（常亮/慢闪/呼吸闪）+ 理由
- VISITOR RULE（≤2句）：你如何在其中“被复制/被吞没”（克制，不鸡汤）
```

### Artifact B｜ROOM PLAN / 房间平面与动线（LLM Prompt）
```text
输出“房间平面说明”（文字版）：
- ROOM SIZE：小/中/大（用范围表达）
- ENTRY/EXIT：入口/出口（相对位置）
- PATH：3步动线（进入→停留点→退出）
- LIMIT：一次入场人数（1–3人）与限时（30–90秒）
- NOTE：1句说明“限制是作品的一部分”（制度化口吻）
```

### Artifact C｜VISITOR SCRIPT / 入场脚本（LLM Prompt）
```text
写一个“入场脚本”（像馆方提示，冷静）：
- BEFORE ENTER（2条）：如何准备（不要触碰/保持距离）
- INSIDE（3条）：如何停留（站位、视线、拍摄限制可选）
- EXIT（1条）：如何退出（回头看最后一次反射）
要求：不出现真实馆名地址；不做人身指令。
```

### Artifact D｜WALL LABEL / 展签（LLM Prompt）
```text
写120–170字展签：
- 第一行：作品名 / 年份 / 媒介（mirrors, lights, polka-dot elements, installation）
- 中间：只讲“无限复制/自我消融/观看条件”
- why≤2：两条规则（为何必须镜面；为何必须重复密度）
```

---

## 5) Session
Scan：判词=“把现实变成房间”；证据=3个可图案化线索（边界/重复/轮廓）  
Load：3推荐（DOT/OBJECT CORE/PUMPKIN-LIKE）+ 危险槽（含隐私→只用抽象轮廓，不用可识别脸）  
Direct：0–2按钮（Motif/Density）  
Reveal：先出镜屋主视觉，再补入场现场+波点协议+房间平面+入场脚本+展签  
Collect：默认主展品=镜屋主视觉；备选=波点协议

---

## 安全与边界
- 不复刻具体Infinity Room；只致敬“镜面+重复+沉浸制度”。
- 不输出真实馆名地址；观众面部不可识别；输入照片隐私信息必须遮蔽。

## 上线验收点
- 是否一眼看出“房间装置摄影”而非滤镜图？
- 是否有入场规则/动线，令“体验”成立？
- 波点协议是否可控（密度/尺寸/镜面范围）？
