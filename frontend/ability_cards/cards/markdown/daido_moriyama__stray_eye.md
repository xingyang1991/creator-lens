<!-- SOURCE: source_packs/image_creator_cases_pack_v1/02_Daido_Moriyama.md -->

# 森山大道｜STRAY EYE / 流浪犬视角（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- 典型工作方式：在城市中‘游荡式’拍摄，偏好高反差、粗颗粒、模糊、倾斜与截断的构图，让街头变成心理/感官噪声。
- 与“Provoke”时代的‘are-bure-boke（粗、晃、虚）’审美谱系强关联，强调身体化观看而非清晰叙事。
- 本能力转译重点：把照片编译成‘流浪犬视角的街头碎片’：黑白成片+接触印相+漂移地图+手写碎句。

### 参考来源（链接归档）
```text
- https://www.moma.org/collection/works/52359
- https://www.sfmoma.org/artist/Daido_Moriyama/
- https://www.artsy.net/artwork/daido-moriyama-stray-dog-misawa-aomori
```

---

# 案例能力牌：STRAY EYE / 流浪犬视角（森山大道 向）

## 1) 归属牌组（固定掉落载体）
**牌组：摄影牌组（Are-Bure-Boke Still + Contact Sheet + Drift Map）**  
固定掉落（不可漂移）：
- 主视觉：高反差颗粒黑白成片（晃/虚/截断）
- 右侧：Contact Sheet 12（试拍序列）
- 底部：Drift Map（漂移路线抽象）+ Text Shards（手写碎句3条）
- 存在场景：暗房灯箱桌/展厅大尺幅黑白打印

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜强度：更野（默认） / 稍克制
- 按钮2｜结构：纯街头漂移（默认） / 目标凝视（更‘犬眼’：盯一个物件/招牌残片）
- 默认：更野 + 纯街头漂移

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“are-bure-boke街头成片”：
- 黑白，高反差，粗颗粒，允许轻微模糊与倾斜
- 构图要截断：切掉完整叙事，保留边缘与噪声
- 强调反光、霓虹残影、路面纹理、广告碎片（但文字要么裁切要么遮蔽以防定位）
- 画面角落加VOL.#与暗房式编号
- 人物若出现：侧脸不可辨或背影；不做身份暗示
- 禁止“电影调色滤镜感”，要像粗糙冲洗的银盐
```

### 3.2 存在场景（Context Shot）提示词
```text
生成存在场景：
- 暗房灯箱桌：contact sheet摊开、红铅笔圈选；旁边放大镜
- 或白墙展厅：一张大尺幅黑白打印，观众背影可选（不可识别）
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Contact Sheet 12（接触印相脚本）
```text
12格：每格写“裁切/倾斜/模糊方向/光源残影”，最后圈选SELECTED FRAME，并给理由：因为它最像“失控的现实”。
```

### Artifact B｜Drift Map（漂移地图）
```text
生成一条抽象路线：进入/偏离/回收三段（不含真实地名）；每段写1句“看到什么噪声”。
```

### Artifact C｜Text Shards 3（手写碎句）
```text
3句≤12字：像街头意识流；不讲道理，不解释。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“城市噪声上身”；证据=3个纹理/反光线索
2) Load：强度/结构推荐
3) Direct：0–2按钮
4) Reveal：先出黑白成片，再补contact sheet与漂移地图
5) Collect：默认主展品=Contact Sheet 12

---

## 6) 安全与边界（必须遵守）
- 去识别/去定位默认开启；招牌、门牌、可追踪文本必须遮蔽或裁切。
- 不鼓励现实偷拍/骚扰；仅对用户输入照片做作品化编译。
