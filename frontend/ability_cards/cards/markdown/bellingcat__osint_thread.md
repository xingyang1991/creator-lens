<!-- SOURCE: source_packs/artist_cases_pack_v4/01_Bellingcat.md -->

# Bellingcat（OSINT 调查团队）｜OSINT THREAD / 证据链热帖（案例级）
生成日期：2025-12-28

## 研究要点（方法与媒介纪律）
- OSINT 的核心是“可复核链条”：公开来源→交叉验证→记录缺口与可反驳点。
- Bellingcat 把地理定位、卫星影像、验证等流程做成指南/工具集合，极易卡牌化。
- 本能力只做“调查美学作品化线程”，默认去定位去识别，避免现实追踪。

### 参考来源（链接归档）
```text
- https://bellingcat.gitbook.io/toolkit/resources/guides-and-handbooks
- https://www.bellingcat.com/resources/how-tos/2015/07/25/searching-the-earth-essential-geolocation-tools-for-verification/
- https://www.bellingcat.com/resources/how-tos/2023/05/08/finding-geolocation-leads-with-bellingcats-openstreetmap-search-tool/
```

---

# 案例能力牌：OSINT THREAD / 证据链热帖（Bellingcat 向）

## 1) 归属牌组（固定掉落载体）
**牌组：证据板牌组（Thread + Evidence Chain）**  
固定掉落（不可漂移）：
- 线程式证据板主视觉（6点标注+2放大窗+Source Log）
- 缺口清单（Uncertainty）+ 可反驳点（Falsification）
- 编辑部/浏览器长图存在场景

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1：组织方式：时间线（默认）/ 空间线索 / 责任链
- 按钮2：公开姿态：克制核验（默认）/ 锋利推断（危险槽）
- 默认：时间线 + 克制核验

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
中心原图+6编号标注点+2放大窗；右侧Source Log（只写来源类型与置信度，不贴真实URL）；底部缺口3条+可反驳点1条；人脸/门牌/车牌/地标文字████遮蔽；禁止给出现实定位指引。
```

### 3.2 存在场景（Context Shot）提示词
```text
电脑屏幕/网页长图界面展示本次线程；桌面研究便签与截图打印件（抽象）；人物仅手部/背影。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认）｜Evidence Chain 6
```text
6点：观察/推测(含替代解释)/缺失；≥2点写观看条件；结尾可反驳点。
```
### Artifact B｜Source Log
```text
每点：source_type + confidence + redaction_applied（不贴真实URL）。
```
### Artifact C｜Thread Summary
```text
≤90字：能成立/不能成立；含“推测≠指控”；列出需要的证据类型（非现实行动）。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
Scan：可复核证据帧 → Load：时间/空间/责任 → Direct：2按钮 → Reveal：证据板+来源+缺口 → Collect：主展品=Evidence Chain 6。

---

## 6) 安全与边界（必须遵守）
- 不输出具体地址/坐标/路线；地点一律 withheld。
- 不点名真实个人与机构；隐私必须遮蔽。
- 推测必须标注并提供替代解释与可反驳点。
