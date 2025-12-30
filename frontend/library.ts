import type { Card, Deck, DirectorSpecItem, DeckInfo } from './types';

// Ability Cards live under /ability_cards
// - specs: machine-readable metadata (tags, risk, sharpness, suit/deck)
// - markdown: human-readable card “spec” that is fed into prompt builders
//
// Key design goal: cards are **data**, not hard-coded.
// Adding a new card should be as easy as dropping 2 files:
//   ability_cards/cards/specs/<card_id>.json
//   ability_cards/cards/markdown/<card_id>.md
//
// This file turns those assets into a runtime library for the app UI.

// --- Registry (optional) ----------------------------------------------------
// suits.json is optional-but-nice for descriptions & ordering.
import suitsRegistry from './ability_cards/registry/suits.json';
import decksRegistry from './ability_cards/registry/decks.json';

// --- Deck Info Registry (for modular output) --------------------------------
const DECK_INFO_BY_ID: Record<string, DeckInfo> = {};
for (const d of (decksRegistry as DeckInfo[])) {
  if (d?.deck_id) {
    DECK_INFO_BY_ID[d.deck_id] = d;
  }
}

export function getDeckInfoById(deckId: string): DeckInfo | undefined {
  return DECK_INFO_BY_ID[deckId];
}

export function getAllDeckInfos(): DeckInfo[] {
  return Object.values(DECK_INFO_BY_ID);
}

// --- Built-in card assets (auto-discovered) ---------------------------------
type CardSpec = {
  card_id: string;
  creator?: string;
  card_name_en?: string;
  card_name_zh?: string;
  suit_id: string;
  suit_ui?: string;
  deck_id?: string;
  deck_ui?: string;
  tags?: string[];
  risk_level?: number;
  sharpness?: number;
  content_markdown_path?: string;
};

type SuitRegistryItem = {
  suit_id: string;
  suit_ui: string;
  description?: string;
};

// NOTE: eager import so the card library is ready immediately.
const specModules = import.meta.glob('./ability_cards/cards/specs/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, CardSpec>;

const markdownModules = import.meta.glob('./ability_cards/cards/markdown/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

// --- Custom packs (optional, stored in localStorage) ------------------------
// This enables “user custom cards” without shipping a new build.
// UI is intentionally not changed; devs can wire UI later if needed.
//
// Stored value: JSON array of packs.
// Each pack: { name?, cards:[{spec, markdown}], suits?:[...] }
const CUSTOM_PACKS_KEY = 'creator_lens.custom_card_packs.v1';

export type CustomCardPackV1 = {
  version: 'v1';
  name?: string;
  suits?: SuitRegistryItem[];
  cards: Array<{ spec: CardSpec; markdown: string }>;
};

function safeJsonParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function loadCustomPacks(): CustomCardPackV1[] {
  if (typeof window === 'undefined') return [];
  const packs = safeJsonParse<CustomCardPackV1[]>(window.localStorage.getItem(CUSTOM_PACKS_KEY));
  if (!Array.isArray(packs)) return [];
  return packs.filter((p) => p && p.version === 'v1' && Array.isArray(p.cards));
}

function saveCustomPacks(packs: CustomCardPackV1[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs));
}

export function importCustomCardPack(pack: unknown): { ok: true; added: number } | { ok: false; error: string } {
  const p = pack as Partial<CustomCardPackV1> | null;
  if (!p || p.version !== 'v1') return { ok: false, error: 'Invalid pack: version must be "v1".' };
  if (!Array.isArray(p.cards) || p.cards.length === 0) return { ok: false, error: 'Invalid pack: cards[] missing.' };

  // Light validation (avoid breaking runtime)
  for (const c of p.cards) {
    if (!c?.spec?.card_id || !c?.spec?.suit_id) {
      return { ok: false, error: 'Invalid pack: each card must have spec.card_id and spec.suit_id.' };
    }
    if (typeof c.markdown !== 'string') {
      return { ok: false, error: `Invalid pack: card ${c?.spec?.card_id ?? ''} markdown must be a string.` };
    }
  }

  const packs = loadCustomPacks();
  packs.push({
    version: 'v1',
    name: p.name || 'Custom Pack',
    suits: Array.isArray(p.suits) ? p.suits : undefined,
    cards: p.cards as CustomCardPackV1['cards'],
  });
  saveCustomPacks(packs);
  return { ok: true, added: p.cards.length };
}

export function clearCustomCardPacks() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CUSTOM_PACKS_KEY);
}

// --- Markdown parsing --------------------------------------------------------
function extractKeyVibe(md: string): string {
  const m = md.match(/\*\*Key vibe\*\*:?\s*([^\n]+)/i);
  return (m?.[1] || '').trim();
}

// Extract director_spec into UI buttons.
// Supported formats:
//  1) "**Director_spec**" or "## 2) Director_spec" then lines like "A. Foo — ..."
//  2) bullets/lines starting with "A."/"B." etc.
//  3) New format: "按钮1：主题：恐惧（默认）/ 欲望 / 现实可塑"
//  4) New format: "职业池：`律师/花店/刑警...`"
function extractDirectorSpec(md: string): DirectorSpecItem[] {
  // 尝试多种格式匹配 Director_spec 部分
  let section = '';
  
  // 格式1: **Director_spec**
  const match1 = md.match(/\*\*Director_spec\*\*([\s\S]*?)(\n\*\*|\n#|$)/i);
  if (match1) section = match1[1].trim();
  
  // 格式2: ## 2) Director_spec 或 ## 2) director_spec
  if (!section) {
    const match2 = md.match(/##\s*\d+\)\s*[Dd]irector_spec([\s\S]*?)(\n##|\n---|$)/i);
    if (match2) section = match2[1].trim();
  }
  
  if (!section) return [];

  const lines = section
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  const out: DirectorSpecItem[] = [];
  let autoId = 0;
  
  for (const line of lines) {
    // 格式: "A. Foo — desc" 或 "A. Foo: desc"
    const m = line.match(/^([A-D])\.?\s*([^:\-—]+)\s*[:\-—]\s*(.+)$/);
    if (m) {
      out.push({ id: m[1], label: m[2].trim(), desc: m[3].trim() });
      continue;
    }
    
    // 格式: "A. Foo" only
    const m2 = line.match(/^([A-D])\.?\s*(.+)$/);
    if (m2) {
      out.push({ id: m2[1], label: m2[2].trim(), desc: '' });
      continue;
    }
    
    // 新格式: "按钮1：主题：恐惧（默认）/ 欲望 / 现实可塑"
    const m3 = line.match(/^按钮\d+[:：]\s*([^:：]+)[:：]\s*(.+)$/);
    if (m3) {
      const category = m3[1].trim();
      const options = m3[2].split(/[/／]/).map(o => o.replace(/[(（][^）)]*[）)]/g, '').trim()).filter(Boolean);
      if (options.length > 0) {
        const id = String.fromCharCode(65 + autoId++);
        out.push({ id, label: category, desc: options.join(' / '), options });
      }
      continue;
    }
    
    // 新格式: "职业池：`律师/花店/刑警...`" 或 "口吻：`温柔 / 冷酷 / 幽默`"
    const m4 = line.match(/^([^：:]+)[:：]\s*`([^`]+)`/);
    if (m4) {
      const category = m4[1].trim();
      const options = m4[2].split(/[/／]/).map(o => o.trim()).filter(Boolean);
      if (options.length > 0) {
        const id = String.fromCharCode(65 + autoId++);
        out.push({ id, label: category, desc: options.slice(0, 3).join(' / '), options: options.slice(0, 6) });
      }
      continue;
    }
  }
  
  return out;
}

function formatCardTitle(spec: CardSpec): string {
  const en = (spec.card_name_en || '').trim();
  const zh = (spec.card_name_zh || '').trim();
  if (en && zh) return `${en} / ${zh}`;
  return en || zh || spec.card_id;
}

function createDeckJoker(suitUi: string, suitId: string): Card {
  return {
    id: `${suitId}__joker`,
    title: `${suitUi} Joker`,
    bias: 'Overload the lens: introduce a controlled wildcard to break the default interpretation.',
    meta: 'Joker · Wildcard',
    isJoker: true,
    suitId,
    suitName: suitUi,
    directorSpec: [
      { id: 'A', label: 'Invert', desc: 'Reverse the most obvious reading.' },
      { id: 'B', label: 'Glitch', desc: 'Introduce a productive error/noise.' },
      { id: 'C', label: 'Overexplain', desc: 'Make hidden assumptions explicit.' },
      { id: 'D', label: 'Understate', desc: 'Say less; let absence speak.' },
    ],
  };
}

// --- Build runtime library ---------------------------------------------------
function buildSuitMeta() {
  const fromRegistry = (Array.isArray(suitsRegistry) ? suitsRegistry : []) as SuitRegistryItem[];
  const suitMetaById: Record<string, SuitRegistryItem> = {};
  const suitOrder: string[] = [];
  for (const s of fromRegistry) {
    if (!s?.suit_id) continue;
    suitMetaById[s.suit_id] = s;
    suitOrder.push(s.suit_id);
  }

  // Merge custom suit definitions (if any)
  const customPacks = loadCustomPacks();
  for (const p of customPacks) {
    for (const s of p.suits || []) {
      if (!s?.suit_id) continue;
      if (!suitMetaById[s.suit_id]) suitOrder.push(s.suit_id);
      suitMetaById[s.suit_id] = suitMetaById[s.suit_id] || s;
    }
  }
  return { suitMetaById, suitOrder };
}

function buildMarkdownIndex(): Record<string, string> {
  const mdById: Record<string, string> = {};
  for (const [path, raw] of Object.entries(markdownModules)) {
    const id = path.split('/').pop()?.replace(/\.md$/i, '') || '';
    if (id) mdById[id] = raw;
  }
  // Add custom markdown too (if any)
  const customPacks = loadCustomPacks();
  for (const p of customPacks) {
    for (const c of p.cards) {
      if (c?.spec?.card_id && typeof c.markdown === 'string') {
        mdById[c.spec.card_id] = c.markdown;
      }
    }
  }
  return mdById;
}

function buildAllSpecs(): CardSpec[] {
  const builtIn = Object.values(specModules) as unknown as CardSpec[];
  const customPacks = loadCustomPacks();
  const custom = customPacks.flatMap((p) => p.cards.map((c) => c.spec));
  return [...builtIn, ...custom];
}

function buildLibrary(): { decks: Deck[]; cards: Card[]; index: Record<string, Card> } {
  const mdById = buildMarkdownIndex();
  const { suitMetaById, suitOrder } = buildSuitMeta();
  const specs = buildAllSpecs();

  const cardsBySuit: Record<string, Card[]> = {};
  const cardIndex: Record<string, Card> = {};

  for (const spec of specs) {
    if (!spec?.card_id || !spec?.suit_id) continue;
    const md = mdById[spec.card_id] || '';
    const vibe = extractKeyVibe(md);
    const directorSpec = extractDirectorSpec(md);

    const suitUi = suitMetaById[spec.suit_id]?.suit_ui || spec.suit_ui || spec.suit_id;
    const deckUi = spec.deck_ui || suitUi;
    const c: Card = {
      id: spec.card_id,
      title: formatCardTitle(spec),
      bias: vibe || `Use ${deckUi} lens to reinterpret what is visible and what is missing.`,
      meta: `${spec.creator || 'Unknown'} · ${deckUi}`,
      creator: spec.creator,
      deckId: spec.deck_id,
      deckName: deckUi,
      suitId: spec.suit_id,
      suitName: suitUi,
      tags: Array.isArray(spec.tags) ? spec.tags : [],
      riskLevel: typeof spec.risk_level === 'number' ? spec.risk_level : undefined,
      sharpness: typeof spec.sharpness === 'number' ? spec.sharpness : undefined,
      markdown: md,
      directorSpec,
    };
    cardsBySuit[spec.suit_id] = cardsBySuit[spec.suit_id] || [];
    cardsBySuit[spec.suit_id].push(c);
    cardIndex[c.id] = c;
  }

  // Build decks in registry order first
  const decks: Deck[] = [];
  const seenSuits = new Set<string>();

  const makeDeck = (suitId: string): Deck | null => {
    const suitCards = cardsBySuit[suitId];
    if (!suitCards || suitCards.length === 0) return null;
    const suitUi = suitMetaById[suitId]?.suit_ui || suitCards[0]?.suitName || suitId;
    const description = suitMetaById[suitId]?.description || '';
    const joker = createDeckJoker(suitUi, suitId);
    const cardsSorted = [...suitCards].sort((a, b) => (b.sharpness ?? 0) - (a.sharpness ?? 0));
    return {
      id: suitId,
      name: `${suitUi}系`,
      tagline: description || '—',
      cards: cardsSorted,
      joker,
    };
  };

  for (const suitId of suitOrder) {
    const d = makeDeck(suitId);
    if (d) {
      decks.push(d);
      seenSuits.add(suitId);
    }
  }

  // Any extra suits not in registry
  for (const suitId of Object.keys(cardsBySuit)) {
    if (seenSuits.has(suitId)) continue;
    const d = makeDeck(suitId);
    if (d) decks.push(d);
  }

  const allCards = decks.flatMap((d) => d.cards);
  return { decks, cards: allCards, index: cardIndex };
}

const LIB = buildLibrary();

// --- Public exports ----------------------------------------------------------
export const LIBRARY_DECKS: Deck[] = LIB.decks;
export const ALL_CARDS: Card[] = LIB.cards;
export const CARD_INDEX: Record<string, Card> = LIB.index;

export function getCardById(cardId: string): Card | undefined {
  return CARD_INDEX[cardId];
}

export function getDeckBySuitId(suitId: string): Deck | undefined {
  return LIBRARY_DECKS.find((d) => d.id === suitId);
}
