<!-- SOURCE: source_packs/artist_cases_pack_v4/04_Trevor_Paglen.md -->

# Trevor Paglen｜INVISIBLE SYSTEMS / 不可见系统显影（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- 关注“为机器而生的图像”与不可见基础设施（机器视觉、数据集、监控系统）。
- 方法包含系统化观看与把不可见机制写进可展示的图像与文本。
- 本卡输出“机器视角 vs 人眼”对照 + 系统标签 + 伦理提示（不做现实追踪/点名）。

### 参考来源（链接归档）
```text
- https://opentranscripts.org/transcript/invisible-images-of-surveillance/
- https://www.phaidon.com/en-int/blogs/stories/trevor-paglen-on-how-machine-made-images-are-policing-society
- https://paglen.studio/2023/05/10/unids/
```

---

# 案例能力牌：INVISIBLE SYSTEMS / 不可见系统显影（Trevor Paglen 向）

## 1) 归属牌组（固定掉落载体）
**牌组：证据板 × 视觉仪器牌组（Machine View + Tags + Ethics）**  
固定掉落（不可漂移）：
- 机器视角主视觉（框/阈值/置信度占位）
- 人眼缩略对照
- System Tags 6 + Ethics Note
- 展厅对照呈现存在场景

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1：对象：机器视觉/训练数据（默认）/ 轨道卫星（抽象）
- 按钮2：显影：注释板（默认）/ 对照台
- 默认：机器视觉 + 注释板

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
生成机器观看式图像：检测框/置信度条/类别标签（虚构占位）+ 人眼缩略；右侧System Tags（分类/阈值/目标/误差/遗漏/反馈）；底部Ethics Note；隐私遮蔽与去定位。
```

### 3.2 存在场景（Context Shot）提示词
```text
展厅对照墙：左为主视觉，右为注释板；观众背影可选；研究氛围。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认）｜Machine vs Human
```text
HUMAN 3条 / MACHINE 3条 + 1句“为谁工作”。
```
### Artifact B｜System Tags 6
```text
每条：线索→系统动作→被抹去的信息（不含追踪指引）。
```
### Artifact C｜Ethics Note（why≤2）
```text
两条：为何遮蔽；为何写“为机器而生”。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
Scan：为系统工作的图像 → Load：对象/显影 → Direct：2按钮 → Reveal：主视觉+注释+伦理 → Collect：主展品=对照。

---

## 6) 安全与边界（必须遵守）
- 禁止现实定位/追踪/点名组织。
- 敏感信息必须遮蔽。
- 输出为批评性作品，不是监控指南。
