<!-- SOURCE: source_packs/artist_cases_pack_v4/03_Adam_Curtis.md -->

# Adam Curtis｜ARCHIVE COLD OPEN / 无旁白档案蒙太奇（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 档案拼贴/蒙太奇：通过并置制造讽刺与不安，字幕/标题推进观点。
- 访谈中提到“用图像写作”与依赖大型档案库的拼贴写法。
- 本卡把视频转译为静帧化：标题卡+字幕链+镜头条目+并置规则。

### 参考来源（链接归档）
```text
- https://www.thewire.co.uk/in-writing/interviews/an-interview-with-adam-curtis
- https://www.e-flux.com/journal/33/68302/in-conversation-with-adam-curtis-part-ii
- https://www.ft.com/content/ffa5f947-accb-4fc5-b3d4-74108662b4e6
```

---

# 案例能力牌：ARCHIVE COLD OPEN / 无旁白档案蒙太奇（Adam Curtis 向）

## 1) 归属牌组（固定掉落载体）
**牌组：视听系｜字幕驱动蒙太奇牌组（Cards + Caption Chain + Clip Ledger）**  
固定掉落（不可漂移）：
- 5张标题/字幕卡拼贴主视觉
- Clip Ledger（类型/年份范围/用途动词）
- 并置规则3条
- 电视/投影存在场景

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1：主题：恐惧（默认）/ 欲望 / 现实可塑
- 按钮2：推进：字幕导向（默认）/ 轻旁白导向
- 默认：恐惧 + 字幕

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
生成5张卡片（2大标题+3短字幕），每张取输入图不同裁切；字幕断言式冷幽默；右侧Clip Ledger：type+year_range(模糊)+function_verb+what_it_hides；底部并置规则3条；不贴真实来源与现实指控。
```

### 3.2 存在场景（Context Shot）提示词
```text
电视播放界面或黑盒投影显示本次标题序列；观众背影可选。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认）｜Caption Chain 12
```text
12条字幕≤14字：事实/系统动词/荒诞钉子各4条；≥2条互相拆台。
```
### Artifact B｜Clip Ledger
```text
5条：clip_type + implied_year_range + function_verb + what_it_hides。
```
### Artifact C｜Juxtaposition Rules
```text
3条：宏大→细节；严肃→荒诞；字幕施压而非旁白讲道理。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
Scan：被剪辑的现实 → Load：主题 → Direct：2按钮 → Reveal：5卡板+字幕链+条目 → Collect：主展品=字幕链。

---

## 6) 安全与边界（必须遵守）
- 不引用真实新闻片段；全部为作品化档案模拟。
- 避免现实指控与可追踪细节。
- 隐私遮蔽默认开启。
