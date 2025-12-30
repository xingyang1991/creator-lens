<!-- SOURCE: source_packs/artist_cases_pack_v4/06_Mark_Dion.md -->

# Mark Dion｜FIELD CABINET / 田野收藏柜（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 用科学/考古的收集-排序-展示方法反思机构知识生产。
- Tate Thames Dig 等项目强调地点性采集与柜体陈列，分类原则即作品。
- 本卡输出收藏柜+标签+采集日志（地点withheld），并禁止现实非法采集指引。

### 参考来源（链接归档）
```text
- https://art21.org/watch/extended-play/mark-dion-methodology-short/
- https://www.tate.org.uk/art/artworks/dion-tate-thames-dig-t07669/digging-thames-mark-dion
- https://www.tate.org.uk/whats-on/tate-britain/art-now-mark-dion
```

---

# 案例能力牌：FIELD CABINET / 田野收藏柜（Mark Dion 向）

## 1) 归属牌组（固定掉落载体）
**牌组：展陈系｜收藏柜牌组（Cabinet + Labels + Field Log）**  
固定掉落（不可漂移）：
- 9–16格收藏柜主视觉
- Taxonomy Labels 12条
- Field Log 5条（withheld）
- 展厅存在场景

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1：分类法：按类型（默认）/ 按地点 / 按用途
- 按钮2：学科皮肤：自然史（默认）/ 城市垃圾学 / 制度遗物
- 默认：按类型 + 自然史

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
生成分格柜（9–16格）：每格放‘发现物’（由照片裁切细节抽象化）；编号+标签（material/condition/category）；右侧标签表；底部Field Log（withheld）；声明模拟件。
```

### 3.2 存在场景（Context Shot）提示词
```text
白盒展厅摆放柜体+展签+标签表；观众背影可选；不出现真实馆名地址。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认）｜Taxonomy Labels 12
```text
12条：ID / specimen_name(拟学名) / material / condition / category / note。
```
### Artifact B｜Field Log 5
```text
date(模糊)/location(withheld)/found_object/collection_method(观察/记录)/institutional_question。
```
### Artifact C｜Cabinet Map
```text
网格坐标+3条归档纪律：同类同格；破损也入档；标签比物更重要。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
Scan：收集即批评 → Load：分类/皮肤 → Direct：2按钮 → Reveal：柜体+标签+日志 → Collect：主展品=标签。

---

## 6) 安全与边界（必须遵守）
- 不鼓励现实挖掘/采集；全部对象为模拟。
- 地点一律 withheld。
- 不输出可用于违法的步骤。
