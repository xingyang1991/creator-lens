<!-- SOURCE: source_packs/image_creator_cases_pack_v1/04_Bi_Gan.md -->

# 毕赣｜TIME FOG NOIR / 时间雾·黑夜散文（案例级）
生成日期：2025-12-28

## 研究要点（工作方式 / 特征 / 输出形式 / 风格）
- 方法特征：梦游式叙事、时间与记忆的折叠、黑夜/霓虹/雾与反光的情绪场景；“诗性旁白+空间游走”是稳定语法。
- 输出形式可工程化：单帧电影感（但更像‘被雾包裹的记忆’），适合转成‘分镜页+旁白碎句+时间标签’的作品卡。
- 本能力转译重点：把一张照片编译成“时间雾的电影单帧+6帧分镜页+旁白碎句”，强调可连载的时间编号。

### 参考来源（链接归档）
```text
- https://www.festival-cannes.com/en/2018/long-day-s-journey-into-night-as-seen-by-bi-gan/
- https://en.wikipedia.org/wiki/Long_Day%27s_Journey_into_Night_%282018_film%29
- https://kinolorber.com/film/long-days-journey-into-night?srsltid=AfmBOopgU4NWjc5meK4JL8Eqr3-8K005BaoLtkKN4MbvQR-pzJ0Nr2iz
```

---

# 案例能力牌：TIME FOG NOIR / 时间雾·黑夜散文（毕赣向·语法致敬）

## 1) 归属牌组（固定掉落载体）
**牌组：视听系牌组（Film Still + Storyboard Page + Voiceover Shards）**  
固定掉落（不可漂移）：
- 主视觉：黑夜雾感电影帧（反光/霓虹/空旷）
- 右侧：6帧分镜页（同图裁切变体）
- 底部：旁白碎句3条 + 时间标签（Vol.# / 00:00）
- 存在场景：影院放映/黑盒屏幕

---

## 2) director_spec（0–2 个按钮 + 默认路径）
- 按钮1｜结构：环形回到原点（默认）/ 直线追寻
- 按钮2｜温度：冷梦（默认）/ 更温柔
- 默认：环形 + 冷梦

---

## 3) visual_spec（主视觉 Image + 存在场景 Context Shot）

### 3.1 主视觉（Image）提示词
```text
把输入照片编译成“时间雾的电影单帧”：
- 画面是黑夜/室内昏光/霓虹反光的氛围（可用雾化、玻璃反射、湿地面）
- 构图强调‘走廊/通道/门口/台阶/镜面’等可游走空间
- 画面角落加时间标签：VOL.# + 00:00:00（仅作为作品编号）
- 同时生成一页6帧分镜：每帧来自原图不同裁切（反光/边缘/遮挡/路面纹理/空位），每帧下方一行极短旁白占位
- 去识别/去定位：人脸与门牌车牌文字遮蔽
- 禁止直接复刻具体电影台词与情节，只致敬语气与结构
```

### 3.2 存在场景（Context Shot）提示词
```text
生成存在场景：
- 黑盒放映或影院屏幕上播放本次主视觉（缩略可辨）
- 观众背影可选（不可识别）
- 氛围：静、潮湿、像在看一段记忆回放
```

---

## 4) artifacts（主展品候选 2–4：名称 + 详细提示词）
### Artifact A（默认主展品）｜Storyboard 6（六帧分镜脚本）
```text
6帧：frame_title（≤6字）+ image_crop_instruction + voiceover_line（≤14字）。
结构必须满足：第6帧回扣第1帧（环形）或明确“继续追寻”（直线）。
```

### Artifact B｜Voiceover Shards 3（旁白碎句）
```text
3句≤16字：时间词必须出现（今天/那天/后来/再一次），但不讲明白；保持留白。
```

### Artifact C｜Time Tags（时间标签规则）
```text
写3条规则：编号如何递增、何时重置、何时标注“缺口/失焦”。
```

---

## 5) 一次完整 Session（Scan → Load → Direct → Reveal → Collect）
1) Scan：判词=“记忆雾上身”；证据=3个反光/空位线索
2) Load：结构/温度推荐
3) Direct：0–2按钮
4) Reveal：先出主视觉电影帧，再补6帧分镜与旁白
5) Collect：默认主展品=Storyboard 6

---

## 6) 安全与边界（必须遵守）
- 不复刻具体电影台词与情节；只致敬氛围与结构。
- 去识别/去定位默认开启。
- 避免对现实人物做指认与隐私暴露。
