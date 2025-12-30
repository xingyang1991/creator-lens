<!-- SOURCE: source_packs/artist_cases_pack_v4/07_Becher.md -->

# Bernd & Hilla Becher｜TYPOLOGY GRID / 工业类型学网格（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 系统性黑白摄影记录工业建筑，并用网格并置形成类型学比较。
- 纪律：统一视角、光线与背景（空白天空）、主体占比一致，差异只来自结构。
- 本卡把一张图编译为3×3/4×4类型学网格，并输出对齐规则与差异清单。

### 参考来源（链接归档）
```text
- https://www.guggenheim.org/artwork/500
- https://smarthistory.org/becher-water-towers/
- https://fraenkelgallery.com/portfolios/bernd-and-hilla-becher-typologies
```

---

# 案例能力牌：TYPOLOGY GRID / 工业类型学网格（Becher 向）

## 1) 归属牌组（固定掉落载体）
**牌组：连载账本 × 展陈系｜类型学网格牌组**  
固定掉落（不可漂移）：
- 3×3或4×4黑白网格主视觉
- Alignment Rules 6条
- Difference List（9/16条）
- 展厅网格挂法存在场景

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1：网格：3×3（默认）/ 4×4
- 按钮2：对齐：严格（默认）/ 轻微偏差
- 默认：3×3 + 严格

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
生成黑白类型学网格：统一背景（空白天空）、统一视角（正面或轻微三分之一）、统一尺度；每格caption=TYPE/LOCATION(withheld)/YEAR(approx)；隐私遮蔽。
```

### 3.2 存在场景（Context Shot）提示词
```text
白墙展厅挂网格照片；灯光均匀；观众背影可选。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认）｜Alignment Rules
```text
6条对齐纪律：视角/光线/背景/尺度/去情绪化/caption最小化。
```
### Artifact B｜Difference List
```text
按格子坐标(A1…): 描述结构差异（支撑/罐体/管线/基座/开口）。
```
### Artifact C｜Typology Index
```text
TYPE NAME / SERIES VOL.# / RULES SUMMARY / MISSING TYPE（一句缺失变体）。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
Scan：匿名雕塑比较 → Load：网格/对齐 → Direct：2按钮 → Reveal：网格+规则+差异 → Collect：主展品=差异清单。

---

## 6) 安全与边界（必须遵守）
- location一律 withheld；不用于现实勘察。
- 不包含可识别个人。
- 不输出可追踪设施位置。
