// Domain layer exports - Pure business logic
export * from './entities';
export * from './valueObjects';

// Re-export commonly used types
export type {
  Card,
  Deck,
  DeckCard,
  ValidationError,
  ScryfallCardResponse,
  FormatRules,
} from './entities';

export {
  CardId,
  CardName,
  ManaCost,
  CardQuantity,
  RequestId,
  CardColor,
  CardRarity,
  MTGFormat,
  ValidationErrorCode,
} from './valueObjects';
