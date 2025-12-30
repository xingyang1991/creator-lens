<!-- SOURCE: source_packs/image_creator_cases_pack_v1/05_Andreas_Gursky.md -->

# Andreas Gursky｜MEGA SYSTEM PANORAMA / 巨幅系统全景（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- 方法特征：巨幅打印、极高细节、俯瞰式/系统式观看；作品常通过拼接/编辑把现代生活的“信息过载与秩序”压成一张画面。
- 输出形式稳定：大尺幅成片 + 局部放大窗口（让观众在宏观与微观之间跳转）。
- 本能力转译重点：把照片编译成“系统全景页”：主画面+3个zoom窗+Pattern Ledger（重复模式清单）+ 展示规格。

### 参考来源（链接归档）
```text
- https://www.moma.org/collection/works/88067
- https://www.theguardian.com/artanddesign/2025/oct/07/epic-impossible-images-andreas-gursky
- https://www.artsy.net/artwork/andreas-gursky-99-cent-ii
```

---

# 案例能力牌：MEGA SYSTEM PANORAMA / 巨幅系统全景（Gursky 向）

## 1) 归属牌组（固定掉落载体）
**牌组：观看机制牌组（Panorama + Zoom Windows + Pattern Ledger）**  
固定掉落（不可漂移）：
- 主视觉：超宽全景（大画幅质感）
- 右侧：Zoom Windows（3个局部放大窗）
- 底部：Pattern Ledger（6条模式）+ 展示规格（尺寸/观看距离）
- 存在场景：白盒展厅巨幅打印

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜系统对象：人群/事件（默认） / 消费货架 / 基础设施纹理
- 按钮2｜距离：俯瞰（默认） / 平视
- 默认：人群/事件 + 俯瞰

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“超宽系统全景页”：
- 主画面必须超宽（像巨幅摄影），细节清晰，色彩中性偏冷
- 生成3个Zoom窗：从主画面裁切出微观细节（标签/手势/排列/边缘）并用细线连接回主画面
- 底部Pattern Ledger 6条：每条描述一种重复模式（队列/网格/堆叠/反光/标识/隔离线）并指向对应Zoom窗
- 加展示规格：尺寸用范围表达（例如2–6米宽）+ 建议观看距离
- 隐私遮蔽：人脸可不可辨，禁止输出可定位文本
```

### 3.2 存在场景（Context Shot）提示词
```text
生成展厅存在场景：
- 白盒展厅墙上挂一张巨幅打印，观众背影对比尺度（不可识别）
- 旁边有一块说明板显示Zoom窗与Pattern Ledger
- 氛围：像在看‘现代系统的壁画’
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Pattern Ledger 6（重复模式清单）
```text
6条：模式名 + 证据（指向Zoom窗）+ 这模式在系统里“让什么发生”（控制/加速/分层/麻木）。
```

### Artifact B｜Zoom Window Notes（3窗注释）
```text
每窗：看到什么（可见）/ 系统如何使用它（推测）/ 被牺牲的信息（代价）。
```

### Artifact C｜Display Spec（展示规格）
```text
MEDIUM：large-scale chromogenic print（style）
SIZE：范围（m）
VIEWING DISTANCE：近/中/远 + 1句理由
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“系统壁画”；证据=3个重复结构
2) Load：对象/距离推荐
3) Direct：0–2按钮
4) Reveal：先出全景，再补Zoom窗与Pattern Ledger
5) Collect：默认主展品=Pattern Ledger 6

---

## 6) 安全与边界（必须遵守）
- 不输出可定位信息（招牌、门牌、车牌遮蔽）。
- 不做现实指认与舆论攻击；只讨论结构与系统观看。
