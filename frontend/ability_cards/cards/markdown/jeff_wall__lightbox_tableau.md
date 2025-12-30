<!-- SOURCE: source_packs/artist_cases_pack_v1/01_JeffWall_LIGHTBOX_TABLEAU.md -->

# 01｜Jeff Wall｜LIGHTBOX TABLEAU / 灯箱叙事编译器（案例级）
生成日期：2025-12-28

## 研究要点：Wall 的“日常媒介纪律”与可工程化点
- **展示格式即语法**：Wall 以大尺幅**背光彩色透明片装入灯箱（lightbox）**著称；这一格式在当时更接近广告/宣传展示，而他将其推进为当代艺术的展示语言。  
- **两条生产路径**：一条是高度构成的 staged tableau（像电影/像历史绘画）；另一条是他称作“**near documentary**”的路径：画面看似纪录摄影，但通过协作与重构获得“像纪录”的戏剧结构。  
- **可工程化点**：你的系统不需要“把照片变好看”，而要把照片变成“被陈列的现实”：  
  1) 生成 **灯箱成片**（发光边框+大尺幅质感）；  
  2) 生成 **重构文件**（场面调度/协作说明/观看条件）；  
  3) 生成 **展厅现场照**（作品存在场景）。

参考来源（关键句/结构来自这些公开资料的概述）：  
- Gagosian（背光透明片与 near documentary 介绍）：https://gagosian.com/artists/jeff-wall/  
- Fondation Beyeler press kit（lightbox 与广告语境）：https://www.fondationbeyeler.ch/fileadmin/user_upload/Presse/Medienmitteilungen_E/en2024/EN_press_kit_Jeff_Wall-1.pdf  
- The Art Story（广告/电影/艺术史展示语法的并置）：https://www.theartstory.org/artist/wall-jeff/

---

# 案例能力牌：LIGHTBOX TABLEAU / 灯箱叙事编译器（Jeff Wall 向）

## 0) 三件套（强偏见 / 强产物纪律 / 强语境包装）
- **强偏见（1秒）**：这不是抓拍；这是一张被“重构后才被允许看见”的现实。
- **强产物纪律（固定掉落）**：必掉落 3 件套：  
  1) **Main Visual：背光灯箱成片**（发光边框+均匀背光+大尺幅质感）  
  2) **Reconstruction Packet：重构文件**（不是剧本，而是“如何被构成”）  
  3) **Context Shot：展厅安装现场照**（作品存在语境成立）
- **强语境包装（context-first）**：先把它变成“展厅里的灯箱”，再谈图像内容。

---

## 1) 归属牌组（固定掉落载体）
**展陈系｜灯箱摄影牌组（Lightbox + Label + Reconstruction Notes）**  
固定结构（不可漂移）：
- Header：作品名 / VOL.# / “Transparency in lightbox”
- Main Visual：灯箱摄影成片（可见发光边框）
- Text Modules：Reconstruction Notes + Display Spec + Ethics Note（why≤2）
- Context Shot：白盒展厅安装现场照

---

## 2) director_spec（0–2 个按钮 + 默认路径）
**按钮1｜Production Mode（生产模式）**
- A `TABLEAU / 构成叙事（默认）`：明显“被安排”的场面调度（人物/物件/光）
- B `NEAR DOC / 近纪录`：像纪录，但加入“协作重构”的证据（更隐蔽）

**按钮2｜Tension Level（叙事压强）**
- A `QUIET TENSION / 安静张力（默认）`：无爆炸点，靠结构不安
- B `EVENT TRACE / 事件痕迹`：画面里有“刚发生过”的线索（但不解释）

**默认路径**：TABLEAU + QUIET TENSION  
**UI文案建议**：按钮像“导演位指令”，不用问卷口吻：`选择构成方式` / `选择张力强度`。

---

## 3) visual_spec（主视觉 + 存在场景图）

### 3.1 Main Visual｜Backlit Lightbox Still（主视觉提示词）
```text
将输入照片编译为“可展陈的背光灯箱摄影成片”（Jeff Wall式方法论致敬，非复刻任何具体作品）

硬规则（必须满足）：
1) 画面必须是“灯箱对象”：可见发光边框或背光发散的边缘；背光均匀、像透明片被点亮
2) 大尺幅质感：细节密度高、层次深、空间信息完整（像大画幅/高分辨输出）
3) 叙事是“单帧电影”：发生感强，但禁止解释前史/后果
4) 光线像被制作：主光、辅光、反光逻辑清晰（像片场/广告棚，但不俗艳）
5) 隐私与安全：人脸/车牌/门牌/可定位文字必须遮蔽或裁切；不生成现实指认
6) 禁止滤镜化：不要出现“磨皮/变美/调曝光”叙事；重点在“被重构的现实被陈列”

可选分支（由director_spec驱动）：
- TABLEAU：更明确的场面调度与构图秩序
- NEAR DOC：更像纪录的杂讯与偶然，但要保留“协作重构”的证据（例如微妙的站位、道具的刻意）

输出：一张可作为美术馆灯箱装置展示的成片。
```

### 3.2 Context Shot｜Gallery Installation（存在场景提示词）
```text
生成一张“展厅安装现场照”：
- 白盒展厅墙上挂着一件发光灯箱作品（屏内画面为本次主视觉缩略、可辨）
- 地面与墙面克制；可出现1–2位观众背影（不可识别面部）
- 强调观看距离：灯箱尺度明显大于观众上半身，或通过留白墙面体现尺度
输出：一张“作品在世界里存在”的现场照
```

---

## 4) artifacts（2–4 个主展品候选模板）

### Artifact A（默认主展品）｜RECONSTRUCTION NOTES / 重构笔记（LLM Prompt）
```text
你是“灯箱摄影作品”的重构记录员。写作气质：制作化、冷静、条目式（不是影评、不是散文）。

输出结构（严格）：
1) SCENE SUMMARY（≤2句）：这帧发生了什么（只描述可见事实）
2) COMPOSED ELEMENTS（3条）：哪些元素明显被安排（站位/道具/光源/视线）
3) DOCUMENTARY SURFACE（3条）：哪些元素看似偶然（边缘信息/杂讯/真实材质）
4) THE CONTRACT（1句）：说明“它像纪录但不是纪录”的契约（near documentary精神）
5) ETHICS（1句）：不指认现实个人/地点；承认重构介入；不制造可追踪线索

要求：每条必须引用输入照片一个具体细节（边缘、反光、遮挡、残留文字、材质纹理）。
```

### Artifact B｜SHOT LIST / 场面调度清单（LLM Prompt）
```text
生成一份“单帧成片的场面调度清单”（像剧组文件，但服务于一张照片）：
- CAST（角色类型2–4个，禁止真实姓名）
- BLOCKING（站位/目光/身体倾向3条）
- PROPS（道具5条，必须从输入照片合理生长出来）
- LIGHTING INTENT（光线目标2条：强调什么、遮蔽什么）
- UNCANNY DETAIL（1条）：一个极小但致命的不对劲（不解释）
语气：冷静、像制作记录。
```

### Artifact C｜DISPLAY SPEC / 灯箱展示规格（LLM Prompt）
```text
写一页“灯箱展示规格”（博物馆技术单口吻）：
- MEDIUM: Transparency in lightbox
- SIZE: 以范围表达（例如 140–240cm 宽；允许 “variable”）
- COLOR TEMPERATURE: 冷白/中性/偏暖（三档）+ 选择理由
- VIEWING DISTANCE: 近/中/远 + 1句理由（观看机制）
- INSTALLATION: 墙挂/嵌墙（二选一）+ 1条禁令（不要当装饰灯）
```

### Artifact D｜WALL LABEL / 展签（LLM Prompt）
```text
写120–170字展签：
- 第一行：作品名（短）/ 年份（当年）/ transparency in lightbox
- 中间：只讲“被重构的现实”如何产生叙事（不解释故事）
- 结尾一句：把观众放进观看机制（你在补完它）
```

---

## 5) 一次 Session（Scan → Load → Direct → Reveal → Collect）
1) **Scan**：4A判词=“被陈列的重构现实”；4B证据=3个可被安排的线索  
2) **Load**：3推荐（Tableau/ Near Doc / Event Trace）+ 危险槽（含隐私→强遮蔽）  
3) **Direct**：0–2按钮（Production Mode / Tension Level）  
4) **Reveal**：先出灯箱成片+标题，再补重构笔记+场面清单+展示规格+展签  
5) **Collect**：默认主展品=灯箱成片；备选=重构笔记/场面清单

---

## 安全与边界
- 不复刻任何具体作品内容与构图；只致敬“灯箱格式 + 重构契约”。
- 不提供现实跟踪、定位、指认内容；隐私信息必须遮蔽。

## 上线验收点（不通过就回炉）
- 是否一眼看出“灯箱对象”（发光边框/背光透明片语法）？
- 是否有“重构证据”（场面调度/协作痕迹）而非滤镜？
- 是否给出展签/展示规格，让“作品存在场景”成立？
