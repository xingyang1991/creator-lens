import { GoogleGenAI, Type } from '@google/genai';
import type { AppContext, Card, Deck, OutputContract, SignalTag } from '../types';
import { LIBRARY_DECKS } from '../constants';
import { ALL_CARDS, getCardById, getDeckBySuitId } from '../library';

// -----------------------------
// Gemini client
// -----------------------------

const apiKey = process.env.API_KEY;

if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn('[Creator Lens] Missing API_KEY. Please set it in .env.local');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// -----------------------------
// Helpers
// -----------------------------

function safeJson<T>(raw: unknown, fallback: T): T {
  if (raw && typeof raw === 'object') return raw as T;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function clampTagList(tags: unknown, max = 16): SignalTag[] {
  const list = Array.isArray(tags) ? tags : [];
  return uniq(
    list
      .filter((t) => typeof t === 'string')
      .map((t) => t.trim())
      .filter(Boolean)
  ).slice(0, max);
}

function scoreBySignals(card: Card, signals: SignalTag[]): number {
  const cardTags = card.tags ?? [];
  if (!signals.length) return 0;

  const prefixWeight: Record<string, number> = {
    origin: 1.4,
    ui: 2.2,
    object: 1.2,
    scene: 1.1,
    structure: 1.8,
    theme: 2.0,
    risk: 0.6,
  };

  let score = 0;
  for (const s of signals) {
    const [prefix] = s.split(':');
    const w = prefixWeight[prefix] ?? 1.0;

    if (cardTags.includes(s)) {
      score += 3.0 * w;
      continue;
    }

    // Partial match: same namespace (e.g., ui:*)
    const hasSamePrefix = cardTags.some((t) => t.startsWith(prefix + ':'));
    if (hasSamePrefix) score += 0.35 * w;
  }

  // Tie-breaker: prefer sharper cards slightly.
  if (typeof card.sharpness === 'number') score += card.sharpness * 0.08;

  return score;
}

function pickTopCards(
  cards: Card[],
  signals: SignalTag[],
  opts: { limit: number; requireDiversity: boolean }
): Card[] {
  const scored = cards
    .map((c) => ({ c, s: scoreBySignals(c, signals) }))
    .sort((a, b) => b.s - a.s);

  if (!scored.length) return [];

  const picked: Card[] = [];
  const usedSuit = new Set<string>();

  for (const it of scored) {
    if (picked.length >= opts.limit) break;
    const suit = it.c.suitId ?? '';
    if (opts.requireDiversity && suit && usedSuit.has(suit)) continue;
    picked.push(it.c);
    if (suit) usedSuit.add(suit);
  }

  // If diversity filtering was too strict, fill the rest by score.
  if (picked.length < opts.limit) {
    for (const it of scored) {
      if (picked.length >= opts.limit) break;
      if (picked.some((p) => p.id === it.c.id)) continue;
      picked.push(it.c);
    }
  }

  return picked.slice(0, opts.limit);
}

function selectCardFromCtx(ctx: AppContext): Card | undefined {
  const pick = ctx.pick;
  if (!pick) return undefined;
  if (pick.isJoker) return ctx.reco?.joker;
  const fromReco = ctx.reco?.cards?.find((c) => c.id === pick.cardId);
  return fromReco ?? getCardById(pick.cardId);
}

function condenseCardSpecForPrompt(card: Card): string {
  const md = (card.markdown || '').trim();
  if (!md) return '';
  // Keep prompts compact: cut off after ~1200 chars.
  const max = 1200;
  return md.length <= max ? md : md.slice(0, max) + '\n\n...(truncated)';
}

// -----------------------------
// Service
// -----------------------------

export const geminiService = {
  /**
   * SCAN: analyze image and return verdict + evidence + safety flags + signal tags.
   */
  analyzeImage: async (imageBase64: string) => {
    // 移除 data URL 前缀（如果存在）
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
    
    const prompt = `你是"Creator Lens"的图像分析器。
你将看到一张图片，请输出：
1) 判词：一句话解释这张图“最像什么样的创作者/作品语法”。
2) 证据：3-5条可观察证据（type/value），尽量具体。
3) 安全标记：从以下集合中选择 0-3 个：face_detected, private_space, minor_possible。
4) signal_tags：输出 8-14 个“信号标签”，用于后续跨卡组配牌。标签格式为 namespace:value。

可用 namespace 示例（自由发挥，但尽量贴近以下语义）：
- origin:* (photo/screenshot/document/scan/camera_roll)
- ui:* (social_feed/timestamp_overlay/subtitle_bar/map_ui/notification)
- object:* (face/handwriting/signage/screen/map/poster/ledger)
- scene:* (public_space/private_space/street/gallery_like/night)
- structure:* (text_dominant/sequence_potential/split_screen/evidence_points)
- theme:* (platform/evidence/archive/public_statement/ritual/cinema_still)
- risk:* (face_present/private_space/minor_possible)

只返回严格 JSON，不要包含任何多余文字。`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        verdict: { type: Type.STRING },
        evidence: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              value: { type: Type.STRING },
            },
            required: ['type', 'value'],
          },
        },
        safety_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
        signal_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['verdict', 'evidence', 'safety_flags', 'signal_tags'],
    };

    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const parsed = safeJson<any>(res.text, {
      verdict: '',
      evidence: [],
      safety_flags: [],
      signal_tags: [],
    });

    return {
      verdict: String(parsed.verdict || ''),
      evidence: Array.isArray(parsed.evidence)
        ? parsed.evidence
            .filter((e: any) => e && typeof e.type === 'string' && typeof e.value === 'string')
            .slice(0, 6)
        : [],
      safetyFlags: Array.isArray(parsed.safety_flags)
        ? parsed.safety_flags.filter((s: any) => typeof s === 'string').slice(0, 4)
        : [],
      signalTags: clampTagList(parsed.signal_tags, 16),
    };
  },

  /**
   * RECOMMEND: deterministic scoring across the full 49-card library.
   * - Cards can come from different suits (cross-deck mix).
   * - Safety mode filters out high-risk cards.
   */
  recommendDecks: async (ctx: AppContext) => {
    const signals = clampTagList(ctx.scan?.signalTags ?? [], 16);
    const isSoftened = ctx.safety?.mode === 'softened';

    // Base pool: exclude jokers.
    let pool = ALL_CARDS.filter((c) => !c.isJoker);

    // Safety filter: avoid higher-risk cards when SAFE is ON.
    if (isSoftened) {
      pool = pool.filter((c) => (c.riskLevel ?? 0) <= 1);
    }

    // If we have no signals (edge case), fall back to sharpness.
    const picked = signals.length
      ? pickTopCards(pool, signals, { limit: 3, requireDiversity: true })
      : [...pool]
          .sort((a, b) => (b.sharpness ?? 0) - (a.sharpness ?? 0))
          .slice(0, 3);

    // Primary deck = suit of best card (fallback to first deck).
    const primarySuit = picked[0]?.suitId ?? LIBRARY_DECKS[0]?.id;
    const deck = getDeckBySuitId(primarySuit) ?? LIBRARY_DECKS[0];

    return {
      deck,
      cards: picked,
      joker: deck.joker,
    };
  },

  /**
   * REVEAL: generate OutputContract JSON using the chosen card's spec markdown + director knobs.
   */
  generateOutput: async (ctx: AppContext): Promise<OutputContract> => {
    const card = selectCardFromCtx(ctx);
    const deck = ctx.reco?.deck;
    if (!card || !deck) throw new Error('Missing card/deck');
    
    // 使用 ctx.asset 作为图片数据，并移除 data URL 前缀
    const assetData = ctx.asset || '';
    const imageData = assetData.includes(',') ? assetData.split(',')[1] : assetData;
    const imageMimeType = assetData.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';

    const directorChoices = (ctx.direct?.answers || [])
      .map((a) => `- ${a.category}: ${a.label}`)
      .join('\n');

    const evidenceLines = (ctx.scan?.evidence || [])
      .slice(0, 6)
      .map((e) => `- ${e.type}: ${e.value}`)
      .join('\n');

    const safetyFlags = (ctx.scan?.safetyFlags || []).join(', ');
    const signalTags = (ctx.scan?.signalTags || []).join(', ');
    const cardSpec = condenseCardSpecForPrompt(card);

    const prompt = `你是“Creator Lens”的策展文本生成器。

你会得到：
1) 用户上传图片的分析结果（判词/证据/信号标签）
2) 当前选择的能力卡（含卡片规范说明）
3) DIRECT 导演参数（用户的选择）

你的任务：生成一份可展出的“展签式文本”，但必须深度贴合该能力卡的创作方法论（而不是泛泛的影评/文案）。

【能力卡】
id: ${card.id}
title: ${card.title}
creator: ${card.creator ?? ''}
suit: ${card.suitName ?? ''}
deck: ${card.deckName ?? ''}
tags: ${(card.tags || []).slice(0, 10).join(', ')}

【能力卡规范（节选）】
<<<
${cardSpec}
>>>

【DIRECT 参数】
${directorChoices || '(none)'}

【图像分析】
verdict: ${ctx.scan?.verdict || ''}
evidence:\n${evidenceLines || '- (none)'}
safety_flags: ${safetyFlags || '(none)'}
signal_tags: ${signalTags || '(none)'}

输出要求：
- 只返回严格 JSON（不要 markdown、不要解释）
- 必须遵循 schema：title/hook/sections/coreCandidates
- title：10-18字，像作品标题
- hook：1-2句，像策展人开场
- sections：固定 2 段，每段：title + body（body 80-160字，结构清晰，尽量用短句/分号）
- coreCandidates：给出 3 个可选“核心机制/展览锚点”，每个包含 label 与 reason（reason 40-80字）

不要包含任何提示词痕迹。`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        hook: { type: Type.STRING },
        sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ['title', 'body'],
          },
        },
        coreCandidates: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ['label', 'reason'],
          },
        },
      },
      required: ['title', 'hook', 'sections', 'coreCandidates'],
    };

    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: imageData!, mimeType: imageMimeType } },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const parsed = safeJson<OutputContract>(res.text, {
      title: card.title,
      hook: '',
      sections: [
        { title: '观察', body: '' },
        { title: '转译', body: '' },
      ],
      coreCandidates: [],
    });

    // Basic normalization for UI safety.
    const sections = Array.isArray(parsed.sections) ? parsed.sections.slice(0, 2) : [];
    while (sections.length < 2) sections.push({ title: '补充', body: '' });

    return {
      title: String(parsed.title || card.title),
      hook: String(parsed.hook || ''),
      sections: sections.map((s: any) => ({
        title: String(s?.title || ''),
        body: String(s?.body || ''),
      })),
      coreCandidates: Array.isArray(parsed.coreCandidates)
        ? parsed.coreCandidates
            .filter((c: any) => c && typeof c.label === 'string' && typeof c.reason === 'string')
            .slice(0, 3)
        : [],
    };
  },

  /**
   * IMAGE: generate an "artified" image from the chosen card spec.
   * Uses gemini-2.5-flash-image model for image generation.
   */
  generateArtisticImage: async (ctx: AppContext): Promise<string> => {
    const card = selectCardFromCtx(ctx);
    if (!card) throw new Error('Missing card');
    
    // 使用 ctx.asset 作为图片数据，并移除 data URL 前缀
    const assetData = ctx.asset || '';
    const imageData = assetData.includes(',') ? assetData.split(',')[1] : assetData;
    const imageMimeType = assetData.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';

    const directorChoices = (ctx.direct?.answers || [])
      .map((a) => `${a.category}: ${a.label}`)
      .join(' | ');

    const cardSpec = condenseCardSpecForPrompt(card);
    const isSoftened = ctx.safety?.mode === 'softened';

    const prompt = `You are a visual director.

Goal: Transform the input image into a new, gallery-grade artwork that follows the selected Ability Card methodology.

Ability Card: ${card.title}
Creator: ${card.creator ?? ''}
Suit/Deck: ${card.suitName ?? ''} / ${card.deckName ?? ''}
Director knobs: ${directorChoices || 'none'}

Card spec (excerpt):
"""
${cardSpec}
"""

Hard constraints:
- Keep the main subject and composition readable.
- Do NOT add any real-person identifiable facial features. If the input contains faces, abstract them (blur/silhouette/mask).
- No text generation unless it is clearly present in the original image.
- Produce one coherent final image (no multi-panel).

Return: an image only.`;

    console.log('[Creator Lens] Starting image generation with gemini-2.5-flash-image...');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: imageData!, mimeType: imageMimeType } },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    console.log('[Creator Lens] Image generation response received');
    
    // 查找包含图像数据的 part
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData && p.inlineData.data
    );
    
    if (!imagePart) {
      console.error('[Creator Lens] No image part found in response');
      throw new Error('No image generated');
    }
    
    // 处理返回的图像数据
    // @google/genai SDK 返回的 data 可能是 bytes 或 base64 字符串
    const rawData = imagePart.inlineData.data;
    let base64Data: string;
    
    if (typeof rawData === 'string') {
      // 已经是 base64 字符串
      base64Data = rawData;
    } else if (rawData instanceof Uint8Array || rawData instanceof ArrayBuffer) {
      // 是二进制数据，需要转换为 base64
      const bytes = rawData instanceof ArrayBuffer ? new Uint8Array(rawData) : rawData;
      base64Data = btoa(String.fromCharCode(...bytes));
    } else {
      // 尝试作为 base64 处理
      base64Data = String(rawData);
    }
    
    console.log('[Creator Lens] Image data processed, length:', base64Data.length);
    return base64Data;
  },
};
