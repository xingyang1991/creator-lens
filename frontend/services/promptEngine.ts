/**
 * PromptEngine - 创作者知识库驱动的提示词引擎
 * 
 * 核心理念：
 * - 注入"偏见-规则-语境"三元组
 * - 让用户强烈感受到"这位艺术家也会这么做"
 * - 输出物是"有社会位置的东西"，而非简单的生成内容
 */

import creatorKnowledgeBase from '../knowledge_base/creator_knowledge_base.json';

// 知识库类型定义
interface CreatorKnowledge {
  creator_name: string;
  core_bias: string;
  craft_rules: string;
  context_stage: string;
  corpus_quotes: string;
  visual_vocabulary: string;
  text_prompt_template: string;
  image_prompt_template: string;
}

interface KnowledgeBaseResult {
  input: string;
  output: CreatorKnowledge;
  error: string;
}

interface KnowledgeBase {
  results: KnowledgeBaseResult[];
}

// 创建创作者名称到知识库的映射
const knowledgeMap = new Map<string, CreatorKnowledge>();

// 初始化映射
(creatorKnowledgeBase as KnowledgeBase).results.forEach((item) => {
  if (item.output && item.output.creator_name) {
    // 使用多种键来匹配
    const name = item.output.creator_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    knowledgeMap.set(name, item.output);
    
    // 也用原始名称作为键
    knowledgeMap.set(item.output.creator_name.toLowerCase(), item.output);
  }
});

/**
 * 根据创作者名称获取知识库
 */
export function getCreatorKnowledge(creatorName: string): CreatorKnowledge | null {
  // 尝试多种匹配方式
  const normalizedName = creatorName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (knowledgeMap.has(normalizedName)) {
    return knowledgeMap.get(normalizedName)!;
  }
  
  if (knowledgeMap.has(creatorName.toLowerCase())) {
    return knowledgeMap.get(creatorName.toLowerCase())!;
  }
  
  // 模糊匹配
  for (const [key, value] of knowledgeMap.entries()) {
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      return value;
    }
  }
  
  return null;
}

/**
 * 构建文本生成提示词
 * 
 * 目标：生成"展签/墙文"风格的文本
 * - 短、硬、有立场，可截图传播
 * - 有 1-2 条可解释证据/规则
 * - 语气可带一点俏皮/反讽
 */
export function buildTextPrompt(
  creatorName: string,
  methodName: string,
  imageDescription: string,
  selectedOptions: string[],
  deckName: string
): string {
  const knowledge = getCreatorKnowledge(creatorName);
  
  if (knowledge && knowledge.text_prompt_template) {
    // 使用知识库中的模板，并替换占位符
    let prompt = knowledge.text_prompt_template
      .replace(/\[用户上传的图片描述\]/g, imageDescription)
      .replace(/\[图片描述\]/g, imageDescription);
    
    // 添加用户选择的方向
    if (selectedOptions.length > 0) {
      prompt += `\n\n用户选择的创作方向：${selectedOptions.join('、')}。请在创作中体现这些方向。`;
    }
    
    // 添加输出格式要求
    prompt += `\n\n【输出要求】
请生成以下格式的内容：

1. **标题**：一个简短有力的作品标题（5-15字）
2. **Hook**：一句引人入胜的开场白（20-40字），要有立场、有态度
3. **牌组**：${deckName}
4. **核心洞察**：2-3条关于这张图像的独特观察（每条30-50字）
5. **创作规则**：1-2条这位艺术家会遵循的创作纪律
6. **反直觉断言**：一个挑战常规认知的观点

语气要求：
- 短、硬、有立场
- 可以带一点俏皮/反讽
- 像美术馆展签 + 专栏短评的混合体
- 不要长篇学术论文
- 不要完全模拟艺术家本人独白（避免复刻/冒充感）`;

    return prompt;
  }
  
  // 回退到默认模板
  return buildDefaultTextPrompt(creatorName, methodName, imageDescription, selectedOptions, deckName);
}

/**
 * 默认文本提示词模板
 */
function buildDefaultTextPrompt(
  creatorName: string,
  methodName: string,
  imageDescription: string,
  selectedOptions: string[],
  deckName: string
): string {
  return `你是一位深谙 ${creatorName} 创作方法论的策展人。

你正在为一张图像创作展签文字。这张图像的描述是：${imageDescription}

创作者：${creatorName}
方法论：${methodName}
牌组：${deckName}
用户选择的方向：${selectedOptions.join('、') || '综合观察'}

【输出要求】
请生成以下格式的内容：

1. **标题**：一个简短有力的作品标题（5-15字）
2. **Hook**：一句引人入胜的开场白（20-40字），要有立场、有态度
3. **牌组**：${deckName}
4. **核心洞察**：2-3条关于这张图像的独特观察（每条30-50字）
5. **创作规则**：1-2条这位艺术家会遵循的创作纪律
6. **反直觉断言**：一个挑战常规认知的观点

语气要求：
- 短、硬、有立场
- 可以带一点俏皮/反讽
- 像美术馆展签 + 专栏短评的混合体`;
}

/**
 * 构建图像生成提示词
 * 
 * 目标：生成"这位艺术家也会这么做"的图像
 * - 概念重构/语境化再呈现（先语境后风格）
 * - 把原图放进"作品成立的舞台"
 * - 让它像作品而不是滤镜
 */
export function buildImagePrompt(
  creatorName: string,
  methodName: string,
  imageDescription: string,
  selectedOptions: string[],
  deckName: string
): string {
  const knowledge = getCreatorKnowledge(creatorName);
  
  if (knowledge && knowledge.image_prompt_template) {
    // 使用知识库中的模板
    let prompt = knowledge.image_prompt_template
      .replace(/这张图片/g, `这张${imageDescription}的图片`)
      .replace(/\[用户上传的图片描述\]/g, imageDescription);
    
    // 添加用户选择的方向
    if (selectedOptions.length > 0) {
      prompt += `\n\n用户选择的创作方向：${selectedOptions.join('、')}。`;
    }
    
    // 添加语境制度
    if (knowledge.context_stage) {
      prompt += `\n\n作品呈现语境：${knowledge.context_stage}`;
    }
    
    return prompt;
  }
  
  // 回退到默认模板
  return buildDefaultImagePrompt(creatorName, methodName, imageDescription, selectedOptions, deckName);
}

/**
 * 默认图像提示词模板
 */
function buildDefaultImagePrompt(
  creatorName: string,
  methodName: string,
  imageDescription: string,
  selectedOptions: string[],
  deckName: string
): string {
  return `将这张${imageDescription}的图片转化为 ${creatorName} 风格的作品。

方法论：${methodName}
牌组：${deckName}
创作方向：${selectedOptions.join('、') || '综合观察'}

核心要求：
1. 这不是简单的风格迁移或滤镜效果
2. 要把原图放进"作品成立的舞台"——让它看起来像一件有社会位置的作品
3. 可能的呈现形式：展陈、档案、热搜截图、分镜、EP封面、图录条目、头版快讯、案卷页等
4. 遵循这位艺术家的创作规则和视觉语言

禁止：
- 简单的滤镜效果
- 过度的风格化
- 失去原图的核心内容`;
}

/**
 * 构建扫描阶段的判词提示词
 * 
 * 目标：生成"被看穿的爽感"
 */
export function buildScanPrompt(imageDescription: string): string {
  return `你是一位敏锐的图像分析师。请分析这张图像，并给出一个简短但有洞察力的"判词"。

图像描述：${imageDescription}

【输出要求】
1. **判词**：一句话概括这张图像的核心特质（10-20字），要有"被看穿"的感觉
2. **关键词**：3-5个描述这张图像的关键词
3. **情绪**：这张图像传达的主要情绪
4. **潜台词**：这张图像没有直接说出但暗示的内容

语气要求：
- 精准、犀利
- 让用户感到"它居然看出了这个！"
- 不要泛泛而谈`;
}

/**
 * 构建核心词候选提示词
 */
export function buildCoreCandidatesPrompt(
  creatorName: string,
  methodName: string,
  imageDescription: string,
  generatedText: string
): string {
  const knowledge = getCreatorKnowledge(creatorName);
  
  let biasContext = '';
  if (knowledge) {
    biasContext = `
创作者核心偏见：${knowledge.core_bias}
创作者语料库：${knowledge.corpus_quotes}`;
  }
  
  return `基于以下内容，生成3个可以作为"档案核心词"的候选项。

创作者：${creatorName}
方法论：${methodName}
图像描述：${imageDescription}
${biasContext}

已生成的展签文字：
${generatedText}

【输出要求】
请生成3个核心词候选，每个包含：
1. **label**：核心词（2-4个字）
2. **reason**：为什么选择这个词作为核心（30-50字）

核心词应该：
- 能够概括这件作品的精髓
- 有一定的概念深度
- 可以作为档案索引使用`;
}

export default {
  getCreatorKnowledge,
  buildTextPrompt,
  buildImagePrompt,
  buildScanPrompt,
  buildCoreCandidatesPrompt
};
