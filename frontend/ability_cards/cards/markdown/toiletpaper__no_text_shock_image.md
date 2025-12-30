<!-- SOURCE: source_packs/image_creator_cases_pack_v1/03_TOILETPAPER.md -->

# TOILETPAPER｜NO-TEXT SHOCK IMAGE / 无文章图像爆破（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- TOILETPAPER 是以图像为核心的杂志/创意项目：强色彩、高饱和、荒诞道具、商业摄影般的干净光线，但内容是反常识与不适感（‘irreverent style’）。
- 输出形式稳定：封面/跨页/海报式图像——几乎不依赖文章文本，靠“图像冲击+道具逻辑”完成阅读。
- 本能力转译重点：把照片编译成‘TOILETPAPER式无文本跨页’：高饱和静物/人物道具剧场 + 最小字号期号 + 免责声明（不做暴力血腥）。

### 参考来源（链接归档）
```text
- https://www.toiletpapermagazine.org/
- https://shoptoiletpaper.com/pages/about-us
- https://berlin.fotografiska.com/exhibitions/toiletpaper
```

---

# 案例能力牌：NO-TEXT SHOCK IMAGE / 无文章图像爆破（TOILETPAPER 向）

## 1) 归属牌组（固定掉落载体）
**牌组：媒体皮肤牌组（Cover + Spread + Prop Logic）**  
固定掉落（不可漂移）：
- 主视觉：封面或跨页（高饱和、强道具、商业光）
- 右侧：Prop Logic（道具逻辑：3条）
- 底部：Safety Caption（不冒犯版/去血腥）+ Issue No.
- 存在场景：杂志摊开/展览海报墙

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜母题：消费物（默认）/ 身体部位（安全抽象）/ 动物意象（不伤害）
- 按钮2｜冲击强度：安全荒诞（默认）/ 更刺（危险槽：自动避开暴力、血腥、仇恨）
- 默认：消费物 + 安全荒诞

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“TOILETPAPER式无文本跨页”（作品化模拟）：
- 画面必须是棚拍质感：干净硬光/高饱和/道具超清
- 把照片中的一个元素‘商品化’，再加入一个极不合逻辑的道具（例如：夸张比例、错位使用）形成视觉笑点/不适
- 文字极少：仅角落 Issue No. / Vol.#（不出现品牌logo）
- 禁止血腥与暴力伤害；避免冒犯弱势群体
- 去识别/去定位：人脸可裁切或做不可辨处理；门牌车牌地标文字遮蔽
```

### 3.2 存在场景（Context Shot）提示词
```text
生成存在场景：
- 杂志摊开在桌上：跨页占满画面
- 或展厅海报墙：同风格多张海报并排，本次主视觉在中央
- 观众背影可选（不可识别）
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Prop Logic 3（道具逻辑）
```text
3条：
1) 主道具（来自照片）被如何“商品化”
2) 反道具（荒诞元素）如何破坏常识
3) 画面如何在1秒内成立（冲突点是什么）
```

### Artifact B｜Alt-safe Variant（不冒犯变体规则）
```text
写2条规则：当画面可能冒犯/过于暴力时，如何改写为“荒诞但安全”（替换道具、转成静物、降低身体指向）。
```

### Artifact C｜Issue Caption（期号小字）
```text
输出：Issue No./Vol.# + 1句≤12字的“假说明”（像产品说明但荒诞）。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“图像爆破”；证据=3个可当道具的线索
2) Load：母题/冲击强度推荐
3) Direct：0–2按钮
4) Reveal：先出跨页主视觉，再补道具逻辑与安全变体
5) Collect：默认主展品=Prop Logic 3

---

## 6) 安全与边界（必须遵守）
- 禁止血腥、暴力伤害、仇恨或骚扰内容。
- 不使用真实品牌与商标。
- 去识别/去定位默认开启。
