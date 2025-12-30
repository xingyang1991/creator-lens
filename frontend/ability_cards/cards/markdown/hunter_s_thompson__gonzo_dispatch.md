<!-- SOURCE: source_packs/creator_cases_pack_v5/05_Hunter_S_Thompson.md -->

# Hunter S. Thompson｜GONZO DISPATCH / 贡佐派遣（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- Gonzo journalism 的定义特征：记者置于故事中心，以高度个人化、参与式写法报道，常用讽刺、夸张、尖刻批评与“震撼描述”。
- Thompson 的文本常以第一人称推进，同时在自嘲与社会批评之间摆动；这种“作者即引擎”的稳定性非常适合作为人格外挂。
- 本能力转译：把照片编译成“第一人称派遣稿”：标题+三段快讯+比喻清单+脚注自毁；必须原创、不鼓励危险行为。

### 参考来源（链接归档）
```text
- https://www.britannica.com/topic/gonzo-journalism
- https://www.britannica.com/biography/Hunter-S-Thompson
- https://www.rollingstone.com/tv-movies/tv-movie-news/remembering-hunter-s-thompsons-fear-loathing-at-the-kentucky-derby-161098/
```

---

# 案例能力牌：GONZO DISPATCH / 贡佐派遣（Hunter S. Thompson 向）

## 1) 归属牌组（固定掉落载体）
**牌组：媒体皮肤牌组（First-Person Dispatch + Metaphors + Footnotes）**  
固定掉落（不可漂移）：
- 主视觉：派遣稿专栏页（标题+副标题+三段正文）
- 右侧：Metaphor List 5
- 底部：Footnotes 3（不可靠声明）+ Disclaimer
- 存在场景：杂志页/专栏打印

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜**对象**：权力机器（默认）/ 消费狂欢 / 自我崩坏
- 按钮2｜**失控强度**：轻度亢奋（默认）/ 高压混沌
- 默认路径：权力机器 + 轻度亢奋

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
生成贡佐派遣稿专栏页（原创）：
- 标题≤14字，副标题1句（冷笑但直脸）
- 正文三段（每段≤70字）：现场→制度→自嘲回收
- 右侧Metaphor List 5：把制度/人群行为比作怪物/机器/天气（禁止仇恨与群体攻击）
- 底部Footnotes 3：承认夸张、承认不可靠、承认自己也是笑话
- 隐私遮蔽与去定位默认开启；不得点名真实个人与地点
- 必须写免责声明：作品化模拟，不鼓励药物/暴力/危险行为
```

### 3.2 存在场景（Context Shot）提示词
```text
杂志/报纸专栏页摊开在桌面：咖啡渍/涂写（抽象）+ 可见标题与脚注；不出现真实出版物名称。
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Dispatch Copy（三段正文）
```text
标题+副标题+三段正文；第一人称；制度批评指向结构；不点名真实个人；全原创。
```

### Artifact B｜Metaphor List 5（比喻清单）
```text
5条比喻：制度/规则/欲望 → 怪物/机器/天气；禁止仇恨与针对群体攻击。
```

### Artifact C｜Footnotes 3（脚注）
```text
3条：自嘲/怀疑自己/承认夸张与不可靠。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“我在现场”；证据=3个荒诞线索
2) Load：对象/失控强度推荐
3) Direct：0–2按钮
4) Reveal：先标题后正文+比喻+脚注
5) Collect：默认主展品=Dispatch Copy

---

## 6) 安全与边界（必须遵守）
- 不引用原作句子；全部原创。
- 不鼓励药物/暴力/危险驾驶等；不提供操作细节。
- 不攻击具体群体或个体。
- 去定位与隐私遮蔽默认开启。
