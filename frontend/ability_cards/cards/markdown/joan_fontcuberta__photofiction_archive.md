<!-- SOURCE: source_packs/artist_cases_pack_v4/13_Joan_Fontcuberta.md -->

# Joan Fontcuberta｜PHOTOFICTION ARCHIVE / 拟真伪档案（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 用伪档案与伪科学叙事质疑摄影真实：中性样本照+分类卡+笔记+证据物组成体系。
- 《Herbarium》式中性背景便于比对；《Fauna》式‘发现档案’提供完整证据链语法。
- 本卡必须强制水印 FICTIONAL ARCHIVE，避免误导。

### 参考来源（链接归档）
```text
- https://www.scienceandmediamuseum.org.uk/what-was-on/joan-fontcuberta-stranger-fiction
- https://time.com/3807527/joan-fontcuberta-photography/
- https://www.juanmagonzalez.com/fontcuberta/fauna.html
```

---

# 案例能力牌：PHOTOFICTION ARCHIVE / 拟真伪档案（Fontcuberta 向）

## 1) 归属牌组（固定掉落载体）
**牌组：文档系｜伪科学档案牌组（Specimen + Taxonomy + Break）**  
固定掉落（不可漂移）：
- 中性背景样本照
- Taxonomy Card（虚构拉丁名/字段/编号）
- Field Notes 3条 + Break破绽
- 档案抽屉存在场景 + FICTION水印

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1：学科：植物学（默认）/ 动物学 / 地貌学（抽象）
- 按钮2：破绽：微（默认）/ 硬（揭示卡）
- 默认：植物学 + 微破绽

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
伪档案标本页：中性灰白底样本照（主体来自输入图细节抽象重组，不能是可识别个人）；右侧Taxonomy Card（虚构拉丁名+字段+编号+withheld）；底部Field Notes 3条；Break微破绽；强制水印FICTIONAL ARCHIVE；不得假冒真实机构。
```

### 3.2 存在场景（Context Shot）提示词
```text
档案抽屉/研究展陈：抽屉里多张标本卡；其中一张为本次主视觉缩略；氛围可信但不对劲。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A｜Taxonomy Card
```text
specimen_id / latin_name(虚构) / classification / collected(withheld) / note（含微破绽）。
```
### Artifact B｜Field Notes 3
```text
观察/假设(标注假设)/缺口；必须标注fiction。
```
### Artifact C｜Reveal Card（硬破绽）
```text
80–120字：承认这是关于摄影可信度的作品档案，并点出观众的相信机制。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
Scan：可信度作为材料 → Load：学科/破绽 → Direct：2按钮 → Reveal：样本页+分类卡+笔记 → Collect：主展品=Taxonomy Card。

---

## 6) 安全与边界（必须遵守）
- 必须标注FICTIONAL ARCHIVE。
- 不假冒真实机构与真实科学结论。
- 不用可识别个人为标本；隐私遮蔽默认开启。
