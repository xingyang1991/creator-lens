<!-- SOURCE: source_packs/artist_cases_pack_v1/02_CindySherman_UNTITLED_ROLE.md -->

# 02｜Cindy Sherman｜UNTITLED ROLE / 电影剧照角色上身（案例级）
生成日期：2025-12-28

## 研究要点：Sherman 的“日常媒介纪律”与可工程化点
- **单帧叙事机制**：她用“电影剧照（film still）”的惯例构造照片：观众会用自身的影像记忆去补完前史与后果。  
- **角色不是自拍**：核心是“类型角色的扮演/变装”，借由摄影语言揭示角色模板与凝视机制。  
- **可工程化点**：把输入照片编译为：  
  1) **虚构电影剧照成片（B/W）**；  
  2) **角色档案（wardrobe/pose/gaze）**；  
  3) **Contact Sheet（试拍序列+圈选）**；  
  4) **展签**（只给少量信息，让观众补完）。

参考来源：  
- MoMA（film stills 结构描述）：https://www.moma.org/collection/artists/5392  
- Moderna Museet（单帧如何让观众填空）：https://www.modernamuseet.se/stockholm/en/exhibitions/cindy-sherman/about-cindy-sherman/  
- VanArtGallery Study Guide（凝视/角色/表演讨论）：https://www.vanartgallery.bc.ca/wp-content/uploads/2019/11/cindy-sherman-study-guide.pdf

---

# 案例能力牌：UNTITLED ROLE / 电影剧照角色上身（Cindy Sherman 向）

## 0) 三件套
- **强偏见（1秒）**：这张照片不是你，而是一个被类型片召唤出的角色；“像真的”来自模板，而非真实。
- **强产物纪律（固定掉落）**：必掉落  
  1) **Main Visual：黑白剧照成片**（胶银颗粒/构图/姿态）  
  2) **Role Sheet：角色档案**（衣着/道具/姿态/视线）  
  3) **Contact Sheet：接触印相**（12格试拍+圈选）  
  4) **Wall Label：展签**（信息极少，诱发补完）
- **强语境包装**：存在场景＝暗房灯箱桌（圈选）或展厅框装黑白照片。

---

## 1) 归属牌组（固定掉落载体）
**媒体皮肤｜电影剧照牌组（Film Still + Contact Sheet + Role Ledger）**  
固定结构：主视觉剧照 + Context Shot + Role Sheet + Contact Sheet + 展签

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜Archetype（角色模板）**
- A `都市漂泊者（默认）`：街角/楼群间，像刚离开或将要进入某处
- B `室内阈限者`：门口/走廊/窗边的停顿与迟疑
- C `悬疑目击者`：回头、遮挡、像被跟随或刚见证某事

**按钮2｜Crack（露馅强度）**
- A `微裂缝（默认）`：一切像真的，但有一点过度模板/过度正确
- B `硬裂缝`：更明显的扮演痕迹（假发/妆面/姿态更戏剧）

默认：都市漂泊者 + 微裂缝  
UI文案建议：`选择角色模板` / `选择露馅强度`（像导演位，不像问卷）。

---

## 3) visual_spec
### 3.1 Main Visual｜B/W Film Still（主视觉提示词）
```text
将输入照片编译为“虚构电影的黑白剧照”（不复刻任何具体电影/具体Sherman作品）：

硬规则：
1) 胶银黑白质感：颗粒明显、对比强、35mm/16mm电影感
2) 构图像剧照：阈限（窗/门/街角）+ 叙事留白（观众可补完）
3) 角色表演克制：像在“听见/看见/决定”某事，但不说破
4) 边缘信息要可读：路牌残片、反光、遮挡、背景人物虚影（但不指认现实个体）
5) 画面上加极小档案条：UNTITLED FILM STILL (mock) / VOL.### / YEAR:2025
6) 隐私：可识别面孔/车牌/门牌必须遮蔽或裁切；禁止真实地址与姓名

输出：可框装展陈的黑白剧照成片（单帧叙事成立）。
```

### 3.2 Context Shot｜Light Table / Gallery Wall（存在场景提示词）
```text
生成一张“制作/展陈现场”存在场景（二选一或混合）：
- 暗房/工作台：灯箱桌上摊开contact sheet，红铅笔圈选最终帧，旁有放大镜
- 展厅墙面：框装黑白照片并列，观众背影停留（不可识别面部）
要求：本次主视觉必须在画面中可辨（作为成片或被圈选的一格）。
```

---

## 4) artifacts

### Artifact A（默认主展品）｜ROLE SHEET / 角色档案（LLM Prompt）
```text
生成“角色档案”（制作笔记口吻，不抒情）：
- ROLE NAME（≤10字，类型片感）
- WARDROBE（3条：衣物/材质/颜色；不出现真实品牌）
- HAIR/MAKEUP（2条：发型/妆面“类型化”要点）
- PROP（2条：道具，必须来自输入照片可合理延伸）
- POSE（2条：站位/手势/身体倾向）
- GAZE（1条：视线方向与“被看见”关系）
- CRACK HINT（1条：微裂缝/硬裂缝的具体表现）
```

### Artifact B｜CONTACT SHEET 12 / 接触印相脚本（LLM Prompt）
```text
生成12格试拍列表（Frame 01–12），每格包含：
- framing（景别：近/中/远）
- move（一个极小动作：回头/停住/抓紧/看向窗外/按住门把手）
- light cue（窗光/背光/街灯/反光）
- story pressure（这格的“补完诱因”：观众会以为发生了什么）
最后：SELECTED FRAME（圈选哪一格）+ 1句理由（只谈观看机制，不谈好看）。
```

### Artifact C｜CAPTION STRIP / 剧照字幕条（LLM Prompt）
```text
生成一条“剧照字幕条”（不是电影剧本）：
- FILM TITLE（虚构片名，≤10字）
- SCENE TAG（如：EXT./INT. + 地点类型 + NIGHT/DAY）
- ONE-LINE TAGLINE（≤16字：像宣传语，留白）
要求：不涉及真实地点与真实机构，不引用现成电影台词。
```

### Artifact D｜WALL LABEL / 展签（LLM Prompt）
```text
写120–160字展签：
- 第一行：UNTITLED FILM STILL (mock) / 2025 / gelatin silver print (style)
- 中间：单帧如何让观众补完故事、以及角色模板如何塑造观看
- 结尾：一句把观众放进机制（你在补完，也在被模板塑形）
```

---

## 5) Session
Scan：判词=“角色被召唤”；证据=阈限/遮挡/反光  
Load：3推荐（3种角色）+ 危险槽（含隐私→强遮蔽与背影）  
Direct：0–2按钮（Archetype/Crack）  
Reveal：先出剧照+片名字幕条，再补Role Sheet + Contact Sheet + 展签  
Collect：默认主展品=剧照；备选=Contact Sheet

---

## 安全与边界
- 输出默认为“mock still”，避免被误用为现实身份伪装指南；不生成可识别个人信息。
- 不复刻任何具体Sherman作品构图与造型，只致敬“film still语法与角色机制”。

## 上线验收点
- 单帧叙事是否成立（观众能补完）？
- Contact Sheet 是否让“制作过程”成立？
- 是否避免滤镜化与现实指认？
