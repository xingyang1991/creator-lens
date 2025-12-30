<!-- SOURCE: source_packs/artist_cases_pack_v1/04_TarynSimon_HIDDEN_INDEX.md -->

# 04｜Taryn Simon｜HIDDEN INDEX / 不可见之物索引编译器（案例级）
生成日期：2025-12-28

## 研究要点：Simon 的“日常媒介纪律”与可工程化点
- 《An American Index of the Hidden and Unfamiliar》以**索引/清单（inventory/index）**为结构：用摄影与文本记录公众通常无法进入或看不见之物，并跨领域整理（科学、政府、医疗、安保、宗教等）。  
- 作品成立于：**冷静的摄影 + 严格 caption + 权限/访问条件进入文本**（“看见”与“被允许看见”绑定）。  
- 可工程化点：把输入照片转译为“条目”，让它在制度语法里成立：  
  1) Index Plate 主视觉（白空间/中性光/大画幅感）  
  2) Caption Block（机构式字段）  
  3) Access Log（申请/拒绝/条件）  
  4) Cross Index（交叉索引与缺口）

参考来源：  
- Whitney：https://whitney.org/exhibitions/taryn-simon  
- 官方作品页：https://tarynsimon.com/works/aihu/  
- Louisiana：https://louisiana.dk/en/exhibition/taryn-simon-an-american-index/  
- Photographers’ Gallery：https://thephotographersgallery.org.uk/whats-on/taryn-simon-american-index-hidden-and-unfamiliar  
- 书籍导言PDF（inventory表述）：https://tarynsimon.com/essays-videos/docs/Introduction%20from%20An%20American%20Index%20of%20the%20Hidden%20and%20Unfamiliar_Elisabeth%20Sussman%20%26%20Tina%20Kukielski.pdf

---

# 案例能力牌：HIDDEN INDEX / 不可见之物索引编译器（Taryn Simon 向）

## 0) 三件套
- **强偏见**：这张照片不是瞬间，而是一条条目：它属于哪个体系？为何不可见？谁允许它被看？
- **强产物纪律**：必掉落：Index Plate + Caption Block + Access Log + Cross Index（全部是“可归档的制度文件”）。
- **强语境包装**：阅读室/索引墙/文件夹，让作品像一本可翻阅的展览。

---

## 1) 归属牌组
**文档系｜索引板牌组（Index Plate + Caption + Access Log）**  
固定结构：主视觉索引板 + Context Shot + Caption + Access Log + Cross Index + why≤2

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜Domain（领域）**
- A `SCIENCE（默认）`
- B `GOVERNMENT / SECURITY`
- C `MEDICINE`
- D `RELIGION / MYTH`

**按钮2｜Visibility（可见性状态）**
- A `RESTRICTED（默认）`：通常不可进入/不可见
- B `BACKSTAGE`：日常可见，但其后台机制不可见

默认：SCIENCE + RESTRICTED  
UI文案建议：`选择索引领域` / `选择可见性状态`。

---

## 3) visual_spec
### 3.1 Main Visual｜INDEX PLATE（主视觉提示词）
```text
把输入照片编译为“索引板条目（index plate）”主视觉：

硬规则：
1) 冷静中性光，细节清晰（大画幅/档案感）
2) 画面背景为“虚拟白空间/档案背景”，强调对象被制度化呈现
3) 下方必须有Caption Block区（字段占位：subject/domain/access/location withheld/method/notes）
4) 必须有“编号”与“归档标识”：VOL.### / FILE ID
5) 隐私：人脸/车牌/门牌/可追踪文字必须遮蔽；location默认写withheld
6) 禁止戏剧化光效与滤镜；禁止“故事化”表情包文案

输出：一张可用于图录的索引条目主视觉。
```

### 3.2 Context Shot｜Reading Room / Index Wall（存在场景提示词）
```text
生成“阅读室/索引墙”存在场景：
- 桌面摊开多张索引板打印件与文件夹、透明档案袋、铅笔
- 或白墙网格挂满索引板（其中一张为本次主视觉缩略，可辨）
- 观众背影可选（不可识别面部）
输出：一张作品在世界里被阅读/被归档的现场照。
```

---

## 4) artifacts

### Artifact A（默认主展品）｜CAPTION BLOCK / 机构式说明（LLM Prompt）
```text
生成机构式caption（字段顺序固定）：
- FILE ID:
- SUBJECT（≤12字名词短语）
- DOMAIN（与按钮一致）
- LOCATION（withheld / undisclosed；禁止真实地名）
- ACCESS（restricted/backstage + 1句：为什么）
- METHOD（1句：如何记录，冷静不写冒险）
- NOTE（1句：它在制度/日常中的位置）
语气：图录/档案口吻；不煽情、不指认。
```

### Artifact B｜ACCESS LOG / 权限日志（LLM Prompt）
```text
生成5条访问日志：
字段：request_id / purpose / response(approved/denied/conditional) / condition / redaction_applied
要求：条件必须围绕“保护隐私/设施/机密”；不提供绕过/潜入方法；不出现真实机构与地址。
```

### Artifact C｜CHAIN OF CUSTODY / 保管链（LLM Prompt）
```text
输出一条“保管链”（4级）：
采集 → 处理（遮蔽/裁切/编号）→ 归档（入库）→ 展示（索引板）
每级包含：
- 动作动词（采集/遮蔽/编号/封存/陈列等）
- 牺牲的信息（语境/情绪/人名/地点等）
- 留下的证据（编号/截图边缘/遮蔽条等）
```

### Artifact D｜CROSS INDEX / 交叉索引卡（LLM Prompt）
```text
生成3条交叉索引：RELATED ENTRY ID + RELATION TYPE + LINK REASON（必须回到照片具体细节）。
最后一行：MISSING CATEGORY（1句）：指出分类体系的空缺（留缺口）。
```

---

## 5) Session
Scan：判词=“成为条目”；证据=3个“可归档细节”  
Load：3推荐（不同Domain/Visibility）+ 危险槽（敏感→withheld+强遮蔽）  
Direct：0–2按钮（Domain/Visibility）  
Reveal：先出索引板成片，再补caption/权限日志/保管链/交叉索引  
Collect：默认主展品=索引板；备选=Caption Block

---

## 安全与边界
- 不输出可定位地址/真实机构；默认withheld。
- 只致敬“索引方法”，不把它变成现实调查工具。

## 上线验收点
- 是否像“索引板条目”而非海报/滤镜图？
- Caption与Access Log是否让“被允许看见”的制度逻辑成立？
- 是否留缺口（missing category）避免伪装成真相宣告？
