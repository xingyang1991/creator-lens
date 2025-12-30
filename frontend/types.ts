
export enum Step {
  HOME = 'HOME',
  CAPTURE = 'CAPTURE',
  SCAN = 'SCAN',
  RECOMMEND = 'RECOMMEND',
  INJECT = 'INJECT',
  DIRECT = 'DIRECT',
  REVEAL = 'REVEAL',
  CORE = 'CORE',
  SHARE = 'SHARE',
  MUSEUM = 'MUSEUM',
  LIBRARY = 'LIBRARY',
  SHARE_LANDING = 'SHARE_LANDING'
}

export type SafetyMode = 'normal' | 'softened' | 'blocked';
export type SafetyFlag = 'face_present' | 'minor_risk' | 'private_space' | 'strong_attack';

export interface Evidence {
  type: string;
  value: string;
}

// Signal tags are lightweight, model-generated labels extracted from the input image.
// They are used for deterministic matching/scoring across the whole card library.
// Example: origin:screenshot, ui:social_feed, object:map, structure:sequence_potential
export type SignalTag = string;

// --- Ability Card Director Spec (dynamic Direct step) ---
// Each card can expose 0..N “director knobs”. In UI we render them as button groups.
// The user's selections are written back into prompt for both text and image generation.
// Legacy format from markdown parsing
export interface DirectorSpecItem {
  id: string;                 // e.g. "A", "B", "C", "D"
  label: string;              // 维度名称，如 "主题"、"推进"
  desc: string;               // 描述
  options?: string[];         // 可选项列表，如 ["恐惧", "欲望", "现实可塑"]
}

export interface Card {
  id: string;
  title: string;
  bias: string;
  meta?: string;
  isJoker?: boolean;
  directorSpec?: DirectorSpecItem[];

  // Optional metadata (populated by the card loader from ability_cards/*)
  creator?: string;
  suitId?: string;
  suitName?: string;
  deckId?: string;
  deckName?: string;
  tags?: string[];
  riskLevel?: number;
  sharpness?: number;
  markdown?: string; // raw markdown content for prompting
}

export interface Deck {
  id: string;
  name: string;
  tagline: string;
  cards: Card[];
  joker: Card;
}

// --- Deck Module Definition (from decks.json) ---
export interface DeckModule {
  module_id: string;
  required: boolean;
  desc: string;
  format: 'text' | 'image';
}

export interface DeckInfo {
  deck_id: string;
  deck_ui: string;
  suit_id: string;
  suit_ui: string;
  description: string;
  modules: DeckModule[];
  tags_primary?: string[];
  tags_secondary?: string[];
  default_risk_level?: number;
  default_sharpness?: number;
  safety_defaults?: {
    default_redaction?: string[];
    default_disclaimer?: string;
  };
  version?: string;
}

// --- Modular Output (aligned with Deck modules) ---
export interface OutputModule {
  moduleId: string;    // e.g. "cold_open", "montage_script"
  title: string;       // Human-readable title from deck module desc
  content: string;     // Generated text content
  format: 'text' | 'image'; // Content format
}

export interface OutputContract {
  title: string;
  hook: string;
  // Legacy sections for backward compatibility
  sections: { title: string; body: string }[];
  // New modular output aligned with Deck
  modules?: OutputModule[];
  deckId?: string;
  deckUi?: string;
  coreCandidates: string[];
  selectedCore?: string;
}

export interface SavedWork {
  id: string;
  timestamp: number;
  asset: string;
  generatedImage: string;
  output: OutputContract;
  deckId: string;
  cardId: string;
  deckName: string;
  cardTitle: string;
  isJoker: boolean;
  evidence: Evidence[];
  safetyMode: SafetyMode;
}

export interface AppContext {
  asset: string | null;
  scan: {
    verdict: string;
    evidence: Evidence[];
    signalTags?: SignalTag[];
  };
  reco: {
    deck: Deck | null;
    cards: Card[];
    joker: Card | null;
  };
  pick: {
    cardId: string | null;
    isJoker: boolean;
  };
  direct: {
    answers: string[];
  };
  output: OutputContract | null;
  core: {
    selected: number;
  };
  safety: {
    mode: SafetyMode;
    flags: SafetyFlag[];
  };
  rerunCount: number;
  share: {
    assetReady: boolean;
    link: string;
  };
  stableHistory: Step[];
  pinnedCardId: string | null;
  activeWork: SavedWork | null;
  originStep: Step | null;
}
