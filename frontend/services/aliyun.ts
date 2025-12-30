import OpenAI from 'openai';
import type { AppContext, Card, Deck, OutputContract, OutputModule, SignalTag, DeckInfo } from '../types';
import { LIBRARY_DECKS } from '../constants';
import { ALL_CARDS, getCardById, getDeckBySuitId, getDeckInfoById } from '../library';
import { buildTextPrompt, buildImagePrompt, getCreatorKnowledge } from './promptEngine';

// -----------------------------
// 阿里云百炼 API 客户端
// -----------------------------

const apiKey = import.meta.env.VITE_DASHSCOPE_API_KEY || '';

if (!apiKey) {
  console.warn('[Creator Lens] Missing VITE_DASHSCOPE_API_KEY. Please set it in .env.local');
}

// OpenAI 兼容模式客户端（用于视觉理解和文本生成）
const openaiClient = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  dangerouslyAllowBrowser: true, // 允许在浏览器中使用
});

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

    const hasSamePrefix = cardTags.some((t) => t.startsWith(prefix + ':'));
    if (hasSamePrefix) score += 0.35 * w;
  }

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
  const max = 1200;
  return md.length <= max ? md : md.slice(0, max) + '\n\n...(truncated)';
}

/**
 * 判断是否需要基于原图生成
 * 根据能力卡的 tags 和安全标记来决定
 */
function shouldUseImageReference(ctx: AppContext, card: Card): boolean {
  const cardTags = card.tags ?? [];
  const safetyFlags = ctx.scan?.safetyFlags ?? [];
  const signalTags = ctx.scan?.signalTags ?? [];

  // 需要基于原图的标签（人物、肖像、证据、档案、真实照片等）
  const requireReferencePatterns = [
    'risk:face_clear',      // 有清晰人脸
    'risk:face_present',    // 有人脸
    'origin:photo',         // 真实照片
    'origin:scan',          // 扫描件
    'object:face',          // 人脸对象
    'object:portrait',      // 肖像
    'object:map',           // 地图（需要保持位置信息）
    'object:form',          // 表格（需要保持结构）
    'object:certificate',   // 证书
    'object:archive_box',   // 档案
    'structure:evidence',   // 证据结构
  ];

  // 不需要基于原图的标签（纯艺术创作、抽象表达等）
  const noReferencePatterns = [
    'structure:abstract',   // 抽象结构
    'output:wall_label',    // 墙标签（纯文字）
    'quality:compressed',   // 压缩质量（可能是截图，不需要保持）
  ];

  // 检查安全标记：如果检测到人脸，强制使用原图参考
  if (safetyFlags.includes('face_detected')) {
    console.log('[Creator Lens] Face detected, using image reference');
    return true;
  }

  // 检查信号标签中是否有人脸相关
  const hasPersonSignal = signalTags.some(tag => 
    tag.includes('face') || 
    tag.includes('portrait') || 
    tag.includes('person') ||
    tag.includes('human')
  );
  if (hasPersonSignal) {
    console.log('[Creator Lens] Person-related signal detected, using image reference');
    return true;
  }

  // 检查能力卡标签：是否需要原图参考
  const needsReference = cardTags.some(tag => 
    requireReferencePatterns.some(pattern => tag.includes(pattern.split(':')[1]))
  );

  // 检查能力卡标签：是否明确不需要原图参考
  const noReference = cardTags.some(tag =>
    noReferencePatterns.some(pattern => tag.includes(pattern.split(':')[1]))
  );

  // 如果明确不需要，返回 false
  if (noReference && !needsReference) {
    console.log('[Creator Lens] Card suggests no image reference needed');
    return false;
  }

  // 如果需要参考，返回 true
  if (needsReference) {
    console.log('[Creator Lens] Card requires image reference');
    return true;
  }

  // 默认情况：基于原图生成（保守策略，确保一致性）
  console.log('[Creator Lens] Default: using image reference for consistency');
  return true;
}

// -----------------------------
// 阿里云百炼服务
// -----------------------------

export const aliyunService = {
  /**
   * SCAN: 使用 qwen-vl-plus 分析图像
   */
  analyzeImage: async (imageBase64: string) => {
    console.log('[Creator Lens] Starting image analysis with qwen-vl-plus...');
    
    // 构建 Data URL
    const mimeType = imageBase64.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    const prompt = `你是"Creator Lens"的图像分析器。
你将看到一张图片，请输出：
1) 判词：一句话解释这张图"最像什么样的创作者/作品语法"。
2) 证据：3-5条可观察证据（type/value），尽量具体。
3) 安全标记：从以下集合中选择 0-3 个：face_detected, private_space, minor_possible。
4) signal_tags：输出 8-14 个"信号标签"，用于后续跨卡组配牌。标签格式为 namespace:value。

可用 namespace 示例（自由发挥，但尽量贴近以下语义）：
- origin:* (photo/screenshot/document/scan/camera_roll)
- ui:* (social_feed/timestamp_overlay/subtitle_bar/map_ui/notification)
- object:* (face/handwriting/signage/screen/map/poster/ledger)
- scene:* (public_space/private_space/street/gallery_like/night)
- structure:* (text_dominant/sequence_potential/split_screen/evidence_points)
- theme:* (platform/evidence/archive/public_statement/ritual/cinema_still)
- risk:* (face_present/private_space/minor_possible)

只返回严格 JSON，不要包含任何多余文字。格式如下：
{
  "verdict": "...",
  "evidence": [{"type": "...", "value": "..."}],
  "safety_flags": ["..."],
  "signal_tags": ["..."]
}`;

    const startTime = Date.now();
    
    const completion = await openaiClient.chat.completions.create({
      model: 'qwen-vl-plus',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    });

    const elapsed = Date.now() - startTime;
    console.log(`[Creator Lens] Image analysis completed in ${elapsed}ms`);

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // 尝试从响应中提取 JSON
    let jsonText = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = safeJson<any>(jsonText, {
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
   * RECOMMEND: 基于信号标签推荐卡片（本地计算，无需 API 调用）
   */
  recommendDecks: async (ctx: AppContext) => {
    const signals = clampTagList(ctx.scan?.signalTags ?? [], 16);
    const isSoftened = ctx.safety?.mode === 'softened';

    let pool = ALL_CARDS.filter((c) => !c.isJoker);

    if (isSoftened) {
      pool = pool.filter((c) => (c.riskLevel ?? 0) <= 1);
    }

    const picked = signals.length
      ? pickTopCards(pool, signals, { limit: 3, requireDiversity: true })
      : [...pool]
          .sort((a, b) => (b.sharpness ?? 0) - (a.sharpness ?? 0))
          .slice(0, 3);

    const primarySuit = picked[0]?.suitId ?? LIBRARY_DECKS[0]?.id;
    const deck = getDeckBySuitId(primarySuit) ?? LIBRARY_DECKS[0];

    return {
      deck,
      cards: picked,
      joker: deck.joker,
    };
  },

  /**
   * REVEAL: 使用 qwen-plus 生成策展文本
   * 集成知识库提示词，深度贴合每位创作者的方法论
   */
  generateOutput: async (ctx: AppContext): Promise<OutputContract> => {
    console.log('[Creator Lens] Starting knowledge-enhanced text generation with qwen-plus...');
    
    const card = selectCardFromCtx(ctx);
    const deck = ctx.reco?.deck;
    if (!card || !deck) throw new Error('Missing card/deck');

    // 获取 DeckInfo 以获取模块定义
    const deckId = card.deckId || '';
    const deckInfo = getDeckInfoById(deckId);
    const creatorName = card.creator || 'Unknown';
    
    console.log(`[Creator Lens] Card: ${card.id}, Creator: ${creatorName}, Deck: ${deckId}`);

    // 获取创作者知识库
    const knowledge = getCreatorKnowledge(creatorName);
    if (knowledge) {
      console.log(`[Creator Lens] Found knowledge base for ${creatorName}`);
    } else {
      console.log(`[Creator Lens] No knowledge base found for ${creatorName}, using default template`);
    }

    const directorChoices = (ctx.direct?.answers || [])
      .map((a: any) => a.label)
      .filter(Boolean);

    const evidenceLines = (ctx.scan?.evidence || [])
      .slice(0, 6)
      .map((e) => `- ${e.type}: ${e.value}`)
      .join('\n');

    const verdict = ctx.scan?.verdict || '';
    const signalTags = (ctx.scan?.signalTags || []).join(', ');
    const cardSpec = condenseCardSpecForPrompt(card);

    // 构建模块化输出指令
    let modulesInstruction = '';
    let modulesSchema = '';
    
    if (deckInfo && deckInfo.modules && deckInfo.modules.length > 0) {
      const textModules = deckInfo.modules.filter(m => m.format === 'text');
      
      if (textModules.length > 0) {
        modulesInstruction = `

【牌组模块要求】
牌组名称：${deckInfo.deck_ui}
牌组描述：${deckInfo.description}

你必须为以下每个模块生成对应的内容：
${textModules.map((m, i) => `${i + 1}. ${m.module_id}（${m.desc}）${m.required ? '【必需】' : '【可选】'}`).join('\n')}`;

        modulesSchema = `,
  "modules": [
${textModules.map(m => `    {"moduleId": "${m.module_id}", "title": "${m.desc}", "content": "...(80-200字)"}`).join(',\n')}
  ]`;
      }
    }

    // 构建知识库增强的提示词
    let knowledgeSection = '';
    if (knowledge) {
      knowledgeSection = `

【创作者知识库 - ${knowledge.creator_name}】

核心偏见（这位创作者如何看世界）：
${knowledge.core_bias}

工艺规则（不可违反的创作纪律）：
${knowledge.craft_rules}

语境制度（作品成立的舞台）：
${knowledge.context_stage}

语料库（代表性语句/思想钢印）：
${knowledge.corpus_quotes}

【重要】你的输出必须：
1. 深度体现上述核心偏见——用这位创作者的视角来"歪曲"地看这张图像
2. 严格遵循工艺规则——这是这位创作者的创作纪律
3. 语气和风格要像语料库中的表达——这是这位创作者的"思想钢印"
4. 让读者感受到"这位艺术家也会这么做"的体验`;
    }

    const prompt = `你是"Creator Lens"的策展文本生成器。

你的任务：为用户上传的图像生成一份"展签式文本"，让用户强烈感受到"${creatorName} 也会这么做"的体验。

这不是简单的风格模仿，而是要注入这位创作者的"偏见-规则-语境"三元组，让输出物成为一件"有社会位置的东西"。${knowledgeSection}

【能力卡信息】
id: ${card.id}
title: ${card.title}
creator: ${creatorName}
suit: ${card.suitName ?? ''}
deck: ${card.deckName ?? ''}

【能力卡规范（节选）】
<<<
${cardSpec}
>>>${modulesInstruction}

【用户选择的创作方向】
${directorChoices.length > 0 ? directorChoices.join('、') : '综合观察'}

【图像分析】
判词: ${verdict}
证据:\n${evidenceLines || '- (none)'}
信号标签: ${signalTags || '(none)'}

【输出要求】
- 只返回严格 JSON（不要 markdown、不要解释）
- title：10-18字，像作品标题，要有立场、有态度
- hook：1-2句，像策展人开场，点明方法论核心，要"短、硬、有立场"
- modules：按照牌组模块要求生成，每个模块内容 80-200 字
- coreCandidates：给出 3 个可选"核心机制/展览锚点"，每个包含 label（2-4字）与 reason（40-80字）

【语气要求】
- 短、硬、有立场，可截图传播
- 可以带一点俏皮/反讽
- 像美术馆展签 + 专栏短评的混合体
- 不要长篇学术论文
- 不要完全模拟艺术家本人独白（避免复刻/冒充感）

格式如下：
{
  "title": "...",
  "hook": "..."${modulesSchema},
  "coreCandidates": [{"label": "...", "reason": "..."}]
}

不要包含任何提示词痕迹。`;

    const startTime = Date.now();

    const completion = await openaiClient.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const elapsed = Date.now() - startTime;
    console.log(`[Creator Lens] Modular text generation completed in ${elapsed}ms`);

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // 尝试从响应中提取 JSON
    let jsonText = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = safeJson<any>(jsonText, {
      title: card.title,
      hook: '',
      modules: [],
      coreCandidates: [],
    });

    // 处理模块化输出
    const modules: OutputModule[] = [];
    if (Array.isArray(parsed.modules)) {
      for (const m of parsed.modules) {
        if (m && typeof m.moduleId === 'string' && typeof m.content === 'string') {
          modules.push({
            moduleId: m.moduleId,
            title: String(m.title || m.moduleId),
            content: m.content,
            format: 'text',
          });
        }
      }
    }

    // 将模块转换为 sections（向后兼容）
    const sections = modules.length > 0
      ? modules.map(m => ({ title: m.title, body: m.content }))
      : [
          { title: '观察', body: String(parsed.observation || '') },
          { title: '转译', body: String(parsed.translation || '') },
        ];

    // 确保至少有 2 个 sections
    while (sections.length < 2) {
      sections.push({ title: '补充', body: '' });
    }

    return {
      title: String(parsed.title || card.title),
      hook: String(parsed.hook || ''),
      sections: sections.slice(0, 4), // 最多 4 个 sections
      modules: modules.length > 0 ? modules : undefined,
      deckId: deckId || undefined,
      deckUi: deckInfo?.deck_ui || card.deckName || undefined,
      coreCandidates: Array.isArray(parsed.coreCandidates)
        ? parsed.coreCandidates
            .filter((c: any) => c && typeof c.label === 'string' && typeof c.reason === 'string')
            .slice(0, 3)
        : [],
    };
  },

  /**
   * IMAGE: 使用后端代理服务生成艺术图像
   * 集成知识库提示词，让用户感受到"这位艺术家也会这么做"
   */
  generateArtisticImage: async (ctx: AppContext): Promise<string> => {
    console.log('[Creator Lens] Starting knowledge-enhanced image generation...');
    
    const card = selectCardFromCtx(ctx);
    if (!card) throw new Error('Missing card');

    const creatorName = card.creator || 'Unknown';
    
    // 获取创作者知识库
    const knowledge = getCreatorKnowledge(creatorName);
    if (knowledge) {
      console.log(`[Creator Lens] Found knowledge base for ${creatorName}`);
    } else {
      console.log(`[Creator Lens] No knowledge base found for ${creatorName}`);
    }

    // 智能判断是否需要基于原图生成
    const useImageReference = shouldUseImageReference(ctx, card);
    console.log(`[Creator Lens] Use image reference: ${useImageReference}`);

    const directorChoices = (ctx.direct?.answers || [])
      .map((a) => a.label)
      .filter(Boolean);

    const verdict = ctx.scan?.verdict || '';
    const deckName = card.deckName || '';

    // 构建知识库增强的图像提示词
    let prompt: string;
    
    if (knowledge && knowledge.image_prompt_template) {
      // 使用知识库中的图像提示词模板
      prompt = knowledge.image_prompt_template
        .replace(/这张图片/g, `这张${verdict}的图片`)
        .replace(/\[用户上传的图片描述\]/g, verdict);
      
      // 添加用户选择的方向
      if (directorChoices.length > 0) {
        prompt += `\n\n用户选择的创作方向：${directorChoices.join('、')}。`;
      }
      
      // 添加语境制度
      if (knowledge.context_stage) {
        prompt += `\n\n作品呈现语境：${knowledge.context_stage}`;
      }
      
      // 添加视觉词汇
      if (knowledge.visual_vocabulary) {
        prompt += `\n\n视觉词汇：${knowledge.visual_vocabulary}`;
      }
    } else {
      // 回退到默认模板，但依然注入知识库信息
      const knowledgeContext = knowledge ? `

【创作者知识库】
核心偏见：${knowledge.core_bias}
工艺规则：${knowledge.craft_rules}
语境制度：${knowledge.context_stage}
视觉词汇：${knowledge.visual_vocabulary}` : '';
      
      if (useImageReference) {
        prompt = `将这张${verdict}的图片转化为 ${creatorName} 风格的作品。

方法论：${card.title}
牌组：${deckName}
创作方向：${directorChoices.join('、') || '综合观察'}${knowledgeContext}

【核心要求】
1. 这不是简单的风格迁移或滤镜效果
2. 要把原图放进"作品成立的舞台"——让它看起来像一件有社会位置的作品
3. 可能的呈现形式：展陈、档案、热搜截图、分镜、EP封面、图录条目、头版快讯、案卷页等
4. 保持原图中主体的可识别性和核心特征
5. 遵循这位艺术家的创作规则和视觉语言

【禁止】
- 简单的滤镜效果
- 过度的风格化
- 失去原图的核心内容`;
      } else {
        prompt = `根据 ${creatorName} 的创作方法论，创作一幅艺术作品。

方法论：${card.title}
牌组：${deckName}
灵感来源：${verdict}
创作方向：${directorChoices.join('、') || '综合观察'}${knowledgeContext}

【核心要求】
1. 这不是简单的风格模仿，而是要注入这位创作者的"偏见-规则-语境"三元组
2. 让输出物成为一件"有社会位置的东西"
3. 可能的呈现形式：展陈、档案、热搜截图、分镜、EP封面、图录条目、头版快讯、案卷页等`;
      }
    }

    const startTime = Date.now();

    // 后端代理服务地址
    // 优先使用环境变量，否则尝试本地服务
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3001' 
        : 'https://3001-ii45ssaaaqz82u4fr6ulh-c74f0814.us2.manus.computer');

    // 前端 API 密钥
    const API_KEY = import.meta.env.VITE_FRONTEND_API_KEY || '${FRONTEND_API_KEY}';

    // 准备请求体
    const requestBody: {
      prompt: string;
      useImageReference: boolean;
      imageBase64?: string;
    } = {
      prompt,
      useImageReference,
    };

    // 如果需要基于原图，传入原图数据
    if (useImageReference && ctx.asset) {
      requestBody.imageBase64 = ctx.asset;
      console.log('[Creator Lens] Including original image in request');
    }

    // 通过代理服务调用图像生成 API
    const response = await fetch(`${API_BASE}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Creator Lens] Image generation request failed:', errorText);
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      console.error('[Creator Lens] Image generation failed:', result.error);
      throw new Error(result.error || 'Image generation failed');
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Creator Lens] Image generation completed in ${elapsed}ms (mode: ${result.mode || 'unknown'})`);

    // 如果有 base64，直接返回
    if (result.base64) {
      return result.base64;
    }
    
    // 如果后端下载失败但返回了 URL，尝试在前端下载
    if (result.imageUrl) {
      console.log('[Creator Lens] Backend download failed, trying frontend download...');
      try {
        const imgResponse = await fetch(result.imageUrl);
        if (imgResponse.ok) {
          const blob = await imgResponse.blob();
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      } catch (frontendDownloadError) {
        console.error('[Creator Lens] Frontend download also failed:', frontendDownloadError);
      }
    }
    
    throw new Error('Image generation failed: no image data received');
  },
};
