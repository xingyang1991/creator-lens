<!-- SOURCE: source_packs/image_creator_cases_pack_v1/08_Duane_Michals.md -->

# Duane Michals｜SEQUENCE + HANDWRITING / 叙事序列与手写句（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- 方法特征：以多格“序列摄影”模拟电影逐帧叙事（frame-by-frame），并将手写文字/诗句直接写入作品，形成图像与文本的合成。
- 输出形式稳定：6–12格序列 + 手写句；主题常偏形而上（灵魂、时间、欲望、身份），但呈现非常具体。
- 本能力转译重点：把照片编译成“6帧序列+手写句”：每帧来自同图不同裁切/动作想象，文字承担转折。

### 参考来源（链接归档）
```text
- https://www.dcmooregallery.com/artists/duane-michals/series/sequences
- https://www.newyorker.com/culture/photo-booth/duane-michalss-beguiling-celebrity-portraits
```

---

# 案例能力牌：SEQUENCE + HANDWRITING / 叙事序列与手写句（Duane Michals 向）

## 1) 归属牌组（固定掉落载体）
**牌组：展陈系×文档系｜序列摄影牌组（Sequence Grid + Handwritten Text + Frame Notes）**  
固定掉落（不可漂移）：
- 主视觉：6帧序列网格（黑白）
- 右侧：Frame Notes（每帧一句功能）
- 底部：Handwritten Poem（手写短诗/断言）
- 存在场景：画框中展示的序列作品

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜叙事类型：形而上（默认）/ 日常荒诞
- 按钮2｜文字密度：轻（默认）/ 重
- 默认：形而上 + 轻

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“6帧叙事序列作品”（黑白）：
- 6帧都来自同一张照片的不同裁切/局部/轻微变形（像镜头推进），形成‘发生了变化’的错觉
- 每帧下方留一行手写文字位（可由系统写入）
- 底部写一段手写短诗/断言（60–90字或更短），语气偏哲思但具体
- 右侧写Frame Notes：每帧的叙事功能（引子/转折/失真/回收）
- 去识别/去定位默认开启；不出现可识别隐私
- 禁止复刻具体作品标题与原文，只致敬结构与媒介
```

### 3.2 存在场景（Context Shot）提示词
```text
生成存在场景：
- 白墙展厅框装一组6帧序列作品，旁边小展签
- 观众背影可选（不可识别）
- 氛围：像你在读一首被拆成镜头的诗
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Sequence Script 6（六帧脚本）
```text
6帧：frame_title（≤6字）+ image_transform（裁切/变形说明）+ line（≤12字手写句）。
要求：第6帧要么回到第1帧，要么把它完全否定（形成哲思回路）。
```

### Artifact B｜Handwritten Poem（手写短诗）
```text
60–90字：必须包含一个“我以为/其实/也许”结构；不抒情泛滥，保持具体。
```

### Artifact C｜Frame Notes（帧功能说明）
```text
6条：每条=这一帧负责什么（引子/推进/失真/证词/反转/回收）。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“单帧不够，要序列”；证据=3个可推进的细节
2) Load：叙事类型/文字密度推荐
3) Direct：0–2按钮
4) Reveal：先出6帧网格，再补手写句与帧功能说明
5) Collect：默认主展品=Sequence Script 6

---

## 6) 安全与边界（必须遵守）
- 不复刻具体作品文本；全部原创。
- 去识别/去定位默认开启。
- 避免生成涉及真实个人隐私与现实指控的内容。
