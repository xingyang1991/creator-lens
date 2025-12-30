<!-- SOURCE: source_packs/artist_cases_pack_v1/03_DamienHirst_CLINICAL_DISPLAY.md -->

# 03｜Damien Hirst｜CLINICAL DISPLAY / 临床陈列编译器（案例级）
生成日期：2025-12-28

## 研究要点：Hirst 的“日常媒介纪律”与可工程化点
- **Natural History** 路线：动物置于玻璃展柜中悬浮于福尔马林溶液，以“临床陈列”语法直视生命/死亡。  
- **Medicine Cabinets / Spot Paintings**：以网格、编号、序列与命名系统把视觉变成制度化输出。  
- **可工程化点**：你的系统不做血腥、不做危险化学；只致敬“陈列制度与序列化语法”：  
  1) 生成药柜/展柜主视觉（模拟、抽象、去品牌）  
  2) 生成编目网格（inventory）与证书条款（COA）  
  3) 生成展厅现场照（观看距离与玻璃反光）

参考来源：  
- White Cube（Natural History）：https://www.whitecube.com/artists/damien-hirst  
- Gagosian（Natural History series）：https://gagosian.com/exhibitions/2022/damien-hirst-natural-history/  
- The Broad（Spot Paintings 网格与命名）：https://www.thebroad.org/art/damien-hirst  
- Albertina（Medicine Cabinets/Spot/Formaldehyde works 概述）：https://www.albertina.at/site/assets/files/22325/pm_damienhirst_en.pdf  
- Phillips（Medicine Cabinets 的核心性概述）：https://www.phillips.com/detail/damien-hirst/172166  

> 安全声明：本能力牌仅生成“作品化模拟的临床陈列”；不提供任何危险化学品、伤害动物或违法操作信息。

---

# 案例能力牌：CLINICAL DISPLAY / 临床陈列编译器（Hirst 向）

## 0) 三件套
- **强偏见**：把现实改写为“可被编号与陈列的样本”，情绪被抽离，只剩制度化观看。
- **强产物纪律**：必掉落 4 件套：Main Visual（药柜/展柜）+ Inventory Grid + COA 条款 + 展签（why≤2）。
- **强语境包装**：白盒展厅 + 玻璃反光 + 安全距离线，让“看”变成一种制度。

---

## 1) 归属牌组
**展陈系｜临床陈列牌组（Vitrine/Cabinet + Labels + COA）**  
固定结构：主视觉（装置成片）+ Context Shot（展厅）+ Inventory Grid + COA + Wall Label

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜Display Type（陈列类型）**
- A `MEDICINE CABINET（默认）`：分格药柜（更安全、更易序列化）
- B `VITRINE SPECIMEN`：玻璃展柜 + 抽象样本对象（不出现血腥/尸体）

**按钮2｜System Logic（系统语法）**
- A `GRID（默认）`：编号对齐，像实验室与商店并置
- B `SINGLE ICON`：单一标本被“过度合法化”（证书更强）

默认：MEDICINE CABINET + GRID  
UI文案建议：`选择陈列类型` / `选择系统语法`。

---

## 3) visual_spec

### 3.1 Main Visual｜Cabinet / Vitrine Hero（主视觉提示词）
```text
把输入照片编译成“临床陈列装置主视觉”（Hirst式制度语法致敬）：

通用硬规则：
1) 画面必须包含玻璃/亚克力的反光与边缘（陈列装置成立）
2) 必须出现编号标签系统（ID、格号、条码式符号皆可）
3) 输入照片只能作为“来源碎片”出现：裁切成小卡，被贴在柜侧或柜内角落；去识别去定位
4) 禁止：真实药名、真实品牌Logo、危险制作细节；禁止任何血腥画面

模式A｜MEDICINE CABINET（默认）
- 白色/金属框药柜，分格整齐
- 每格放“通用符号样本”：空瓶、胶囊形状、标签条、样本卡（均为抽象/通用）
- 网格密度高，像“科学与消费合体的墙”

模式B｜VITRINE SPECIMEN
- 玻璃展柜内只有一个抽象标本对象（几何/半透明生物形态模型）
- 标本周围有编号、尺度标、警示条（制度化）
输出：一张可用于图录的装置成片（冷、干净、不可触）。
```

### 3.2 Context Shot｜Gallery Display（存在场景提示词）
```text
生成白盒展厅现场照：
- 装置摆放在展厅中央或靠墙；地面有距离线/观众停留区
- 墙上有展签；观众背影可选（不可识别面部）
- 必须能看到本次主视觉装置作为主体
输出：一张“观看被制度化”的现场照
```

---

## 4) artifacts

### Artifact A（默认主展品）｜INVENTORY GRID 18 / 编目网格（LLM Prompt）
```text
生成18条编目条目（ID 01–18），每条字段固定：
- ID
- ITEM TYPE（capsule / vial / sample card / label strip / tray 等通用名）
- STATUS（sealed / catalogued / on display）
- CONTROL NOTE（1句）：制度化语气（例如“不得触碰/仅供观看/编号优先于物件”）
- REDACTION（若涉及隐私则写“redacted”）

要求：冷静、像实验室+博物馆混合体；不出现真实药品/真实品牌。
```

### Artifact B｜COA + DISPLAY CONDITIONS / 证书与展示条款（LLM Prompt）
```text
写120–180字证书：
- 包含：作品名、编号、年份、媒介（cabinet/vitrine, mixed media, labels）
- 核心声明：作品成立于“陈列条件+编号系统”，不是单个物件
- 允许更换：可替换耗材（纸、空瓶、标签）但必须保持网格、编号、对齐纪律
- 禁止：将其当功能药柜或装饰柜
语气：制度化，略冷幽默但不讲笑话。
```

### Artifact C｜TAXONOMY TAGS / 6张分类标签（LLM Prompt）
```text
输出6张“分类标签”（每张1行）：
格式：TAG NAME（≤6字）｜定义（≤14字）｜观看禁令（≤10字）
标签主题围绕：生命/衰败/治疗/消费/信仰/统计（可调整）
要求：像展柜标签，冷静，像科学又像商店。
```

### Artifact D｜WALL LABEL / 展签（LLM Prompt）
```text
写120–170字展签：
- 第一行：作品名 / 年份 / 媒介
- 中间：说明“临床陈列如何把生死与消费并置”
- why≤2：两条规则（为何必须编号网格；为何必须去情绪化）
避免现实医疗建议与指控。
```

---

## 5) Session
Scan：判词=“样本化”；证据=3个可编号线索（重复/边界/标签位）  
Load：3推荐（药柜网格/单图标/展柜抽象标本）+ 危险槽（敏感→只用抽象+强遮蔽）  
Direct：0–2按钮（Display Type/System Logic）  
Reveal：先出装置成片，再补Inventory/COA/分类标签/展签  
Collect：默认主展品=装置成片；备选=Inventory Grid

---

## 安全与边界
- 只致敬“临床陈列与制度语法”，不复刻具体作品与敏感内容。
- 不生成危险制作步骤；不生成可识别个人与可定位信息。

## 上线验收点
- 是否一眼看出“陈列装置”（玻璃、反光、编号系统）？
- 是否是“制度化观看”而非滤镜特效？
- 是否有COA/Inventory让作品像“可归档的系统”？
