<!-- SOURCE: source_packs/artist_cases_pack_v4/14_Orson_Welles.md -->

# Orson Welles｜F/FAKE ESSAY ENGINE / 随笔电影机（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 随笔电影/伪纪录：非线性拼贴围绕伪造与作者；Welles以主持人姿态引导怀疑。
- BFI 指出其制作有“剪辑先行”的特点：编辑台生成叙事。
- 本卡静帧化输出：Truth/Lie卡片+剪辑日志+反转卡；必须原创，不引用台词。

### 参考来源（链接归档）
```text
- https://www.bfi.org.uk/sight-and-sound/features/hey-presto-f-fake-invention-essay-film
- https://www.documentary.org/online-feature/orson-welles-faux-doc-f-fake-gets-blu-ray-release
- https://jonathanrosenbaum.net/2023/09/on-f-for-fake-1995-essay/
```

---

# 案例能力牌：F/FAKE ESSAY ENGINE / 随笔电影机（Orson Welles 向）

## 1) 归属牌组（固定掉落载体）
**牌组：视听系｜随笔电影牌组（Truth/Lie Cards + Editing Ledger）**  
固定掉落（不可漂移）：
- 7张卡片拼贴主视觉
- Editing Ledger 5条
- Twist Card（1–2次）
- 剪辑室存在场景

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1：坦白：先（默认）/ 后
- 按钮2：反转：1次（默认）/ 2次
- 默认：先坦白 + 1次

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
7张卡片（TRUTH/LIE/ALMOST TRUE/CUT/RECEIPT/HOST/END），各自用输入图不同裁切并加原创字幕≤16字；右侧Editing Ledger 5条（剪辑先行）；底部One Rule（真实性窗口，原创）；隐私遮蔽；不得现实指控。
```

### 3.2 存在场景（Context Shot）提示词
```text
剪辑室：多屏时间线与便签；屏幕可见本次卡片板缩略；氛围狡黠而克制。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A｜Editing Ledger 5
```text
每条：剪辑动作→需要补的镜头类型→如何让观众更信/更疑（不贴真实素材来源）。
```
### Artifact B｜Truth/Lie字幕脚本
```text
7条字幕≤16字，主持人/魔术师口吻；必须原创。
```
### Artifact C｜Twist Card
```text
1或2次反转：一句话指出“你刚刚相信的依据是什么”。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
Scan：真实性窗口 → Load：坦白/反转 → Direct：2按钮 → Reveal：卡片板+日志+反转 → Collect：主展品=Editing Ledger。

---

## 6) 安全与边界（必须遵守）
- 不引用原作台词与长段文本；全部原创。
- 不用于现实造谣与指控。
- 主题是‘相信机制’，不是‘传播谎言’。
