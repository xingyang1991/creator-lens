<!-- SOURCE: source_packs/creator_cases_pack_v5/01_VICE_early_era.md -->

# VICE early-era｜ACCESS-ALL-AREAS ZINE / 直闯现场小报（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- 早期 VICE 以“挑衅/混合真诚与嘲讽/把荒诞当作事实口吻”著称：其影响更多来自语气与姿态，而非单条内容本身（读者要么“get it”，要么出局）。
- 其“access-all-areas / 上身式报道”是可工程化资产：第一人称、贴身、现场、快速结论、夸张标题、以及杂志化版式（像 zine / 小报 / 专栏）。
- 本能力的转译重点：保留“语气与版式纪律”，但去掉早期粗鄙/冒犯成分——输出为**作品化杂志模拟件**，不鼓励违法、骚扰或仇恨。

### 参考来源（链接归档）
```text
- https://hazlitt.net/longreads/vice-weve-been-had-and-we-let-it-happen
- https://www.theguardian.com/media/2015/jan/01/virtues-of-vice-magazine-transformed-into-global-giant
- https://www.axios.com/2023/05/02/vice-media-preparing-bankruptcy
- https://en.wikipedia.org/wiki/Vice_%28magazine%29
```

---

# 案例能力牌：ACCESS-ALL-AREAS ZINE / 直闯现场小报（VICE early-era 向）

## 1) 归属牌组（固定掉落载体）
**牌组：媒体皮肤牌组（Zine Spread + Field Notes + Straight-faced Voice）**  
固定掉落（不可漂移）：
- 主视觉：双页zine版式（大标题 + 现场照 + 3块栏目）
- 右侧：Field Notes（5条“现场笔记”）
- 底部：Corrections & Disclaimer（更正/免责声明）
- 存在场景：印刷小报/摊开的杂志页（带胶带/折痕）

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜**报道姿态**：直闯现场（默认） / 冷幽默旁观
- 按钮2｜**风险温度**：低风险（默认） / 高风险（危险槽：自动加强遮蔽与去指向）
- 默认路径：直闯现场 + 低风险

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“zine双页报道”（作品化模拟件）：
- 左页：大标题（≤14字，像冲进现场的句子），副标题1句（冷静像事实）
- 中部：照片作为“现场证据”（去识别/去定位：人脸/门牌/车牌/地标文字████遮蔽）
- 右页：3块栏目（固定格式）：
  A) WHAT I SAW（3条，只写可见事实）
  B) WHAT THEY SAID（2条匿名引语碎片，不写姓名/机构）
  C) WHAT THIS REALLY IS（1句制度性解释：权力/欲望/规则）
- 底部必须有：DISCLAIMER（fictional zine / no real accusation）+ CORRECTIONS（1条自嘲更正）
- 语气：直闯、冷、像把荒诞当作事实；但**禁止冒犯弱势群体、仇恨或骚扰**。
```

### 3.2 存在场景（Context Shot）提示词
```text
生成“杂志摊开/桌面存在场景”：
- 一张双页zine摊开在桌上，边缘有折痕/胶带/咖啡渍（抽象）
- 画面可见本次双页主视觉缩略
- 不出现真实出版物名称、真实二维码或可追踪发行信息
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Zine Copy（三栏固定文本）
```text
输出三栏：WHAT I SAW（3条）/ WHAT THEY SAID（2条匿名引语）/ WHAT THIS REALLY IS（1句制度解释）。
要求：直白、冷、短；不点名真实个人与组织。
```

### Artifact B｜Field Notes 5（现场笔记）
```text
5条：每条=一个细节（边缘/反光/遮挡/物件）+ 一个“我当时的反应”（1词）+ 一个“结构动词”（管理/诱导/售卖/排除）。
```

### Artifact C｜Corrections & Disclaimer（更正与免责声明）
```text
写1条更正（自嘲式），+ 1段免责声明（这是作品化杂志模拟件；不指控现实个人；已去识别去定位）。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“冲进现场的标题”；证据=3个可见线索
2) Load：姿态/风险温度推荐
3) Direct：0–2按钮
4) Reveal：先出标题+双页主视觉，再补Field Notes与更正
5) Collect：默认主展品=Zine Copy

---

## 6) 安全与边界（必须遵守）
- 不鼓励违法进入、骚扰、跟踪或仇恨表达。
- 不输出可定位细节与真实组织指认。
- 高风险模式自动加强遮蔽与免责声明，并转向“制度解释”而非个人指向。
