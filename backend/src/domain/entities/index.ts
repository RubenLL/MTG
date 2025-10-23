// Core domain entities for MTG Deck Analyzer

/**
 * Represents a Magic: The Gathering card
 */
export interface Card {
  readonly id: string;
  readonly name: string;
  readonly manaCost?: string;
  readonly convertedManaCost: number;
  readonly colors: readonly CardColor[];
  readonly type: string;
  readonly rarity: CardRarity;
  readonly text?: string;
  readonly power?: string;
  readonly toughness?: string;
  readonly loyalty?: string;
  readonly isLegalInFormats: readonly MTGFormat[];
  readonly isBannedInFormats: readonly MTGFormat[];
  readonly isRestrictedInFormats: readonly MTGFormat[];
  readonly setCode: string;
  readonly collectorNumber: string;
  readonly imageUrl?: string;
}

/**
 * Represents a card in a deck list with quantity
 */
export interface DeckCard {
  readonly card: Card;
  readonly quantity: number;
  readonly isSideboard: boolean;
}

/**
 * Represents a Magic: The Gathering deck
 */
export interface Deck {
  readonly cards: readonly DeckCard[];
  readonly format: MTGFormat;
  readonly mainDeck: readonly DeckCard[];
  readonly sideboard: readonly DeckCard[];
  readonly totalCards: number;
  readonly isValid: boolean;
  readonly validationErrors: readonly ValidationError[];
}

/**
 * Represents a validation error
 */
export interface ValidationError {
  readonly code: ValidationErrorCode;
  readonly message: string;
  readonly field?: string;
  readonly value?: unknown;
  readonly cardName?: string;
}

/**
 * Magic: The Gathering card colors
 */
export enum CardColor {
  WHITE = 'W',
  BLUE = 'U',
  BLACK = 'B',
  RED = 'R',
  GREEN = 'G',
  COLORLESS = 'C',
}

/**
 * Card rarity levels
 */
export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  MYTHIC = 'mythic',
}

/**
 * Supported MTG formats
 */
export enum MTGFormat {
  STANDARD = 'standard',
  MODERN = 'modern',
  PIONEER = 'pioneer',
  COMMANDER = 'commander',
  LEGACY = 'legacy',
  VINTAGE = 'vintage',
  PAUPER = 'pauper',
  DRAFT = 'draft',
  SEALED = 'sealed',
}

/**
 * Validation error codes
 */
export enum ValidationErrorCode {
  CARD_NOT_FOUND = 'CARD_NOT_FOUND',
  INVALID_CARD_COUNT = 'INVALID_CARD_COUNT',
  CARD_BANNED = 'CARD_BANNED',
  CARD_RESTRICTED = 'CARD_RESTRICTED',
  INVALID_FORMAT = 'INVALID_FORMAT',
  DECK_SIZE_INVALID = 'DECK_SIZE_INVALID',
  TOO_MANY_COPIES = 'TOO_MANY_COPIES',
  INVALID_INPUT = 'INVALID_INPUT',
}

/**
 * Format-specific rules
 */
export interface FormatRules {
  readonly format: MTGFormat;
  readonly minDeckSize: number;
  readonly maxDeckSize: number | null;
  readonly maxSideboardSize: number;
  readonly maxCopiesPerCard: number;
  readonly allowsBasicLands: boolean;
  readonly bannedCards: readonly string[];
  readonly restrictedCards: readonly string[];
}

/**
 * External API response types
 */
export interface ScryfallCardResponse {
  readonly id: string;
  readonly name: string;
  readonly mana_cost?: string;
  readonly cmc: number;
  readonly colors: readonly string[];
  readonly type_line: string;
  readonly rarity: string;
  readonly oracle_text?: string;
  readonly power?: string;
  readonly toughness?: string;
  readonly loyalty?: string;
  readonly legalities: Record<string, 'legal' | 'not_legal' | 'restricted' | 'banned'>;
  readonly set: string;
  readonly collector_number: string;
  readonly image_uris?: {
    readonly normal: string;
  };
}
