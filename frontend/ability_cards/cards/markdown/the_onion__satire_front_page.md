<!-- SOURCE: source_packs/creator_cases_pack_v5/04_The_Onion.md -->

# The Onion｜SATIRE FRONT PAGE / 讽刺头版机（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- The Onion 的关键风格是“straight-faced delivery”：用极像真实新闻的口吻讲荒诞，从而让读者在误认与顿悟之间产生效果。
- 它把“头版结构”当作一个装置：标题、导语、版面分区、假广告、以及可反复复用的固定句式（例如重复改写同一结构来评论公共事件）。
- 本能力转译：把照片编译成“头版作品卡”：主标题+副标题+短文+假广告+更正声明；并设定安全规则：讽刺系统与现象，不针对现实弱势与个人。

### 参考来源（链接归档）
```text
- https://www.reuters.com/lifestyle/onions-chad-nackers-enduring-power-satire-2025-09-11/
- https://www.theguardian.com/law/2022/oct/04/the-onion-defends-right-to-parody-in-very-real-supreme-court-brief-supporting-local-satirist
- https://en.wikipedia.org/wiki/The_Onion
```

---

# 案例能力牌：SATIRE FRONT PAGE / 讽刺头版机（The Onion 向）

## 1) 归属牌组（固定掉落载体）
**牌组：媒体皮肤牌组（Front Page + Fake Ads + Corrections）**  
固定掉落（不可漂移）：
- 主视觉：头版版式（主标题+副标题+主图+3条小标题）
- 右侧：Fake Ad（1条假广告）
- 底部：Correction/Disclaimer（更正+免责声明）
- 存在场景：报纸摊开/打印头版墙贴

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜**版面类型**：新闻头版（默认）/ 财经版 / 文化版
- 按钮2｜**笑点温度**：冷（默认）/ 更狠（危险槽：自动去指向个人）
- 默认路径：新闻头版 + 冷

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“讽刺头版”（作品化模拟件）：
- 主标题≤14字：像真正新闻但荒诞（直脸）
- 副标题1句：解释得像事实
- 主图：用输入照片，但必须去识别/去定位（人脸/门牌/车牌/地标文字遮蔽）
- 版面有3条小标题（每条≤12字），分别对应：社会/经济/文化
- 右侧Fake Ad：一条假广告（模仿真实广告结构，但不使用真实品牌）
- 底部必须有：Correction（1条更正自嘲）+ Disclaimer（这是讽刺模拟，不指控现实个人）
- 讽刺对象必须是制度/现象/语言套话，禁止攻击现实弱势群体或具体个人
```

### 3.2 存在场景（Context Shot）提示词
```text
生成“报纸存在场景”：
- 报纸摊开在桌面或墙上贴着头版打印
- 画面可见本次头版主视觉缩略
- 不出现真实报社名、真实二维码或可追踪发行信息
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Headlines Pack（标题包）
```text
输出：主标题1条 + 小标题3条 + 导语1段（≤80字）。
要求：直脸、像新闻；讽刺系统与现象，不攻击个人。
```

### Artifact B｜Fake Ad（假广告）
```text
输出1条假广告：产品名（虚构）+ slogan + 3条卖点（荒诞但像真的）+ 免责声明一句。
禁止真实品牌与医疗功效暗示。
```

### Artifact C｜Corrections & Disclaimer（更正与免责声明）
```text
1条更正（自嘲），+ 免责声明（讽刺模拟件、不指控现实个人、已去识别去定位）。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“像新闻一样说荒诞”；证据=照片里3个可被写成头版的线索
2) Load：版面/温度推荐
3) Direct：0–2按钮
4) Reveal：先出主标题+头版，再补假广告与更正
5) Collect：默认主展品=Headlines Pack

---

## 6) 安全与边界（必须遵守）
- 不进行诽谤：不点名真实个人，不制造可识别指控。
- 不攻击弱势群体；避免仇恨/骚扰。
- 假广告不得暗示真实医疗/金融建议；全部虚构并有免责声明。
