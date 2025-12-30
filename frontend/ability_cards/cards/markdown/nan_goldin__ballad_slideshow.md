<!-- SOURCE: source_packs/artist_cases_pack_v2/02_NanGoldin_BALLAD_SLIDESHOW.md -->

# Nan Goldin｜BALLAD SLIDESHOW / 幻灯片日记编译器（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 《The Ballad of Sexual Dependency》是一部由**数百张照片组成的幻灯片放映作品**，并配以**同步音乐音轨**；机构资料常提到其规模接近七百张左右且会随时间调整。  
- Goldin 将其称作“**the diary I let people read（我让人读的日记）**”，其核心不是“漂亮”，而是亲密、脆弱、关系与时间的连续。  
- 因此在你们产品里，关键不是“做出Goldin滤镜”，而是把输入照片编译成：**可放映的序列（slide script）+ 声轨骨架 + 放映语境（黑房间/地面散落照片/观众停留）**。

### 参考来源
```text
- MoMA 展览页：The Ballad…（近700张、配乐、幻灯片语法）
  https://www.moma.org/calendar/exhibitions/1651
- Whitney 藏品页：Goldin 将其描述为“the diary I let people read”；近七百张与同步音轨
  https://whitney.org/collection/works/8274
- Art Institute of Chicago：作品为“hundreds… accompanied by specified music”
  https://www.artic.edu/artworks/187155/the-ballad-of-sexual-dependency
- NGA（澳洲国家美术馆）文章：关于作品呈现与社群语境的概述
  https://nga.gov.au/stories-ideas/nan-goldins-lens-on-relationships/
```

---

# 案例能力牌：BALLAD SLIDESHOW / 幻灯片日记编译器（Nan Goldin 向）

## 1) 归属牌组（固定掉落载体）
**视听系｜幻灯片电影牌组（Slideshow + Soundtrack + Installation）**  
固定掉落：
1) **Main Visual**：放映中的单帧（投影在黑房间）
2) **Context Shot**：装置现场（黑房间/地面散落照片或长凳/观众背影）
3) **Slide Script**：24–36帧序列脚本（时间码、画面来源、字幕）
4) **Soundtrack Skeleton**：音轨骨架（3段情绪）
5) **Diary Note + Wall Label**：极短旁注 + 展签（why≤2）

---

## 2) director_spec（0–2按钮 + 默认路径）
**按钮1｜亲密距离（Distance）**
- A `贴脸亲密（默认）`：更靠近身体/房间/桌面细节（从同一张照片裁切与重构）
- B `稍远旁观`：更多空间与边缘信息（更克制）

**按钮2｜情绪曲线（Arc）**
- A `夜晚→清晨（默认）`：从热度到疲惫的时间感
- B `爱→裂→修复`：关系三段式（不写狗血剧情，只写节奏）

**默认路径**：贴脸亲密 + 夜晚→清晨

---

## 3) visual_spec

### 3.1 Main Visual｜Projected Still（主视觉提示词）
```text
把输入照片编译为“幻灯片电影”的放映画面（不是滤镜美化）：
- 场景是黑房间，投影幕上出现本次“序列中的一帧”（由输入照片裁切/重构而来）
- 画面带轻微颗粒、闪光灯硬边或室内暖光的真实感
- 屏幕下方可有极淡的时间码（00:12:04）与VOL编号
- 不出现可识别面孔（若有则遮蔽/裁切），不输出可定位信息
输出：一张“放映中的单帧”主视觉
```

### 3.2 Context Shot｜Installation View（存在场景提示词）
```text
生成一张“装置现场照”：
- 黑房间或半黑盒空间，投影在墙面；地面可散落少量照片打印或有长凳
- 观众背影可出现（不可识别面部）
- 氛围：亲密、低亮度、像在“看一段私人日记被放给陌生人”
输出：一张作品在世界里被观看的现场照
```

---

## 4) artifacts

### Artifact A（默认主展品）｜SLIDE SCRIPT 30 / 30帧序列脚本（LLM Prompt）
```text
你在把“同一张照片”编译成一段可放映的幻灯片序列（30帧）。
注意：这是创作游戏的作品化输出，不是现实纪实；但语气必须像日记，不像文学散文。

输出30帧（FRAME 01–30），每帧字段固定：
- timecode（例如 00:00–00:40 的分配，间隔可不均）
- image_transform（从原照片如何得到：裁切/局部放大/反光提取/模糊/黑场插入/字幕覆盖；禁止“变美”措辞）
- caption（≤12字，口语、克制、像自言自语）
- emotional_note（1词：热/空/疼/笑/醉/醒/冷…）

硬规则：
1) 至少6帧是“边缘帧”（只取角落/反光/遮挡处）
2) 至少3帧是“黑场/空椅/空床”式缺席帧（用原图抽象生成）
3) 不出现明确可识别个人与可定位地址；涉及隐私内容用遮蔽/省略策略
```

### Artifact B｜SOUNDTRACK SKELETON / 音轨骨架（LLM Prompt）
```text
生成一份“音轨骨架”（不列真实歌曲名）：
- ACT 1（热）：3个曲风标签 + 节奏说明（快/中）
- ACT 2（裂）：3个曲风标签 + 声音质地（低频/噪点/停顿）
- ACT 3（晨）：3个曲风标签 + 结尾方式（渐弱/突然停）
并写2条“放映规则”：每帧停留时长范围、何处允许音乐压过图像。
语气：制作笔记，不抒情。
```

### Artifact C｜DIARY NOTE / 日记旁注（LLM Prompt）
```text
写一段90–130字“日记旁注”：
- 不解释事件，只承认情绪与关系的存在
- 必须出现1条“自我保护声明”（例如：不写名字/不写地址/不说清楚）
- 结尾一句像钉子：把观众放进“读日记”的不舒服位置
```

---

## 5) 一次 Session
Scan：判词=“让照片变成日记序列”；证据=3个亲密细节  
Load：3推荐（距离/情绪曲线组合）+ 危险槽（含隐私→强遮蔽）  
Direct：0–2按钮（Distance/Arc）  
Reveal：先出投影帧主视觉，再补序列脚本+音轨骨架+旁注+展签  
Collect：默认主展品=Slide Script；备选=音轨骨架

---

## 6) 安全与边界
- 任何可能涉及私密/裸露/暴力的内容一律“降敏”：遮蔽、改写为缺席帧或物件细节；不做猎奇呈现。  
- 不输出真实姓名/地址/可追踪信息；所有人物只作为“关系的影子”。
