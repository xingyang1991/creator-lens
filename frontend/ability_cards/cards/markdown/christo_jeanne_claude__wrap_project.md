<!-- SOURCE: source_packs/artist_cases_pack_v2/01_ChristoJeanneClaude_WRAP_PROJECT.md -->

# Christo & Jeanne-Claude｜WRAP PROJECT / 临时公共工程编译器（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 他们的项目往往是**巨型、短暂、面向公众开放的公共工程**：包裹建筑/桥梁/海岸线、铺设门廊、搭建遮阳伞阵等；作品“完成态”包含现场与公众经验。  
- 其商业与制作模型极可工程化：项目通常**不接受赞助/捐助**，通过出售 Christo 的**预备性图纸/拼贴/模型**为项目融资；同时项目伴随大量工程、许可、环境与通信文件，形成完整“项目卷宗”。  
- 因此在你们产品里，“能力上身”应被转译为：**把输入照片改写成一项临时公共工程的‘拟议项目’**——先生成“包裹/介入”的装置主视觉，再生成项目卷宗（地图、材料样本、许可摘要、施工与拆除时间线）。

### 参考来源（链接放在代码块，便于归档）
```text
- National Gallery of Art：Dream Big with Christo and Jeanne-Claude（预备图纸融资）
  https://www.nga.gov/stories/articles/dream-big-christo-and-jeanne-claude
- Artsy：L'Arc de Triomphe, Wrapped 融资与“免费公共项目”说明（售卖预备作品融资）
  https://www.artsy.net/article/artsy-editorial-christo-jeanne-claudes-final-project-arrives-amid-growing-market-interest
- Artquest（Christo & Jeanne-Claude funding quote / sales of preparatory drawings）
  https://artquest.org.uk/artlaw-article/christo-jeanne-claude/
- Christo and Jeanne-Claude 官方站：The Umbrellas（明确“entirely financed by the artists”）
  https://christojeanneclaude.net/artworks/the-umbrellas/
- NSU Art Museum：Surrounded Islands 档案构成（工程调查/许可/部件/通信等）
  https://nsuartmuseum.org/exhibition/surrounded-islands/
```

---

# 案例能力牌：WRAP PROJECT / 临时公共工程编译器（Christo & Jeanne-Claude 向）

## 1) 归属牌组（固定掉落载体）
**展陈系｜项目工程牌组（Project Dossier + Site Installation）**  
固定掉落（不可漂移）：
1) **Main Visual**：项目效果图（把现实场景“包裹/门廊化/织物介入”）
2) **Context Shot**：施工中的现场（吊装/织物展开/安全围挡）
3) **Project Dossier（卷宗页）**：地图与路径、织物样本、尺寸与材料、许可摘要、施工/拆除日程、融资声明（“售卖预备作品自筹”）
4) **Wall Label**：制度化展签（why≤2）

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜介入类型（Intervention Type）**
- A `WRAP / 包裹（默认）`：对建筑/物件进行织物包裹，强调褶皱与体量
- B `GATES / 路径门廊`：沿路径设置重复门廊结构（像“步行通过作品”）
- C `UMBRELLA FIELD / 伞阵`：规则网格或地形跟随的伞阵（强调地貌尺度）

**按钮2｜尺度（Scale）**
- A `OBJECT（默认）`：单一物件/局部建筑（更易读）
- B `LANDSCAPE`：场域级（河岸/街区/公园）

**默认路径**：WRAP + OBJECT

---

## 3) visual_spec（主视觉 + 存在场景图 prompts）

### 3.1 Main Visual｜Project Rendering（主视觉提示词）
```text
把输入照片编译成“临时公共工程的项目效果图”（Christo & Jeanne-Claude式：织物介入、体量被重写、可被公众穿行/观看）

硬要求：
1) 介入必须是“织物/结构”而非滤镜：包裹、门廊或伞阵三选一（由按钮决定）
2) 织物必须有真实褶皱、张力、绑扎与边界线（像工程材料，不像装饰布）
3) 场景必须保留现实感（地面、树、建筑、街道等）——这是“公共工程”
4) 人物如出现：只作为尺度参照（背影/剪影，不可识别面部）
5) 输入照片如果含可定位门牌/车牌/可识别招牌：必须遮蔽或裁切

输出：一张“项目效果图/装置主视觉”，像会出现在项目发布材料与展览中。
```

### 3.2 Context Shot｜Construction & Unwrapping（存在场景提示词）
```text
生成一张“施工现场照”（作品存在场景）：
- 现场有织物展开、吊装或工人操作的迹象（安全围挡、绳索、起重设备的抽象化呈现）
- 画面中能辨识主视觉作为正在实现的项目
- 观众可出现为模糊背影（不可识别面部）
- 氛围：公共、临时、可被观看的建造过程
输出：一张“项目成为事件”的存在场景照
```

---

## 4) artifacts（可标记主展品 2–4）

### Artifact A（默认主展品）｜PROJECT DOSSIER / 项目卷宗页（LLM Prompt）
```text
你在为一项临时公共工程写“项目卷宗”。语气必须像：工程+机构+艺术项目文件，不写抒情散文。

输出结构（严格）：
1) PROJECT TITLE（≤12字）
2) SITE（withheld / 某城市某片区；禁止真实地址）
3) INTERVENTION（WRAP/GATES/UMBRELLA + 一句说明）
4) MATERIAL SAMPLE（3条：织物材质/颜色/表面触感；像样本卡）
5) DIMENSIONS（3条：尺度用范围表达；允许variable）
6) ROUTE / FOOTPRINT（2条：路径或覆盖范围描述，不给可定位细节）
7) PERMIT SUMMARY（3条：以“需许可/需评估/需协调”表述，不给绕过方法）
8) SCHEDULE（4段：勘测→制作→安装→拆除；每段1句）
9) FUNDING NOTE（1句）：项目通过售卖预备性作品自筹，不接受赞助（制度口吻）
10) PUBLIC ACCESS（1句）：免费/面向公众开放（如适用）
```

### Artifact B｜PERMIT ABSTRACT / 许可摘要（LLM Prompt）
```text
写一张“许可摘要卡”（像提交给市政/公园/业主的摘要）：
- IMPACTS（3条）：人流/植被/交通（中性）
- MITIGATIONS（3条）：保护/标识/拆除恢复（中性）
- DISCLAIMERS（2条）：这是艺术项目模拟件；不提供现实施工指引
语气：克制、制度化。
```

### Artifact C｜WALL LABEL / 展签（LLM Prompt）
```text
写120–180字展签：
- 第一行：作品名 / 年份（当年）/ 媒介（fabric, steel/aluminum structure, temporary installation）
- 中间：只讲“临时性+公共可达性+工程卷宗”如何构成作品
- why≤2：两条规则（为何必须临时；为何必须可拆除/可恢复）
```

---

## 5) 一次 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“把现实变成公共工程项目”；证据=3个可被织物重写的线索  
2) Load：3推荐（WRAP/GATES/UMBRELLA）+ 危险槽（含隐私→强遮蔽+只输出卷宗）  
3) Direct：0–2按钮（Intervention/Scale）  
4) Reveal：先出主视觉效果图，再补施工现场+卷宗+展签  
5) Collect：默认主展品=卷宗页；备选=主视觉

---

## 6) 安全与边界
- 仅生成“作品化模拟件”，不鼓励现实包裹/张贴/占用公共设施；不提供施工可执行细节。  
- 默认去定位/去识别；卷宗中的地点与许可均为摘要化、不可追踪。
