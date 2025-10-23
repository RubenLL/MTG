// Value objects for MTG domain - immutable and validated

/**
 * Unique identifier for a card
 */
export class CardId {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('CardId cannot be empty');
    }
  }

  static create(value: string): CardId {
    return new CardId(value.trim().toLowerCase());
  }

  static fromScryfallId(id: string): CardId {
    return new CardId(id);
  }

  equals(other: CardId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  get value(): string {
    return this._value;
  }
}

/**
 * Card name value object with validation
 */
export class CardName {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('CardName cannot be empty');
    }
    if (_value.length > 200) {
      throw new Error('CardName too long');
    }
  }

  static create(value: string): CardName {
    return new CardName(value.trim());
  }

  equals(other: CardName): boolean {
    return this._value.toLowerCase() === other._value.toLowerCase();
  }

  toString(): string {
    return this._value;
  }

  get value(): string {
    return this._value;
  }
}

/**
 * Mana cost representation
 */
export class ManaCost {
  private constructor(private readonly _value: string) {
    if (_value && !this.isValidManaCost(_value)) {
      throw new Error(`Invalid mana cost: ${_value}`);
    }
  }

  private isValidManaCost(cost: string): boolean {
    // Basic validation for MTG mana cost format
    const manaSymbolPattern = /\{[^}]+\}/g;
    const symbols = cost.match(manaSymbolPattern);
    return symbols !== null || cost === '';
  }

  static create(value: string): ManaCost {
    return new ManaCost(value);
  }

  static colorless(): ManaCost {
    return new ManaCost('');
  }

  toString(): string {
    return this._value;
  }

  get value(): string {
    return this._value;
  }

  get convertedManaCost(): number {
    if (!this._value) return 0;

    let cmc = 0;
    const manaSymbols = this._value.match(/\{[^}]+\}/g);

    if (manaSymbols) {
      for (const symbol of manaSymbols) {
        if (symbol.includes('{') && symbol.includes('}')) {
          const inner = symbol.slice(1, -1);
          if (/^\d+$/.test(inner)) {
            cmc += parseInt(inner, 10);
          } else {
            cmc += 1; // Most symbols cost 1 mana
          }
        }
      }
    }

    return cmc;
  }
}

/**
 * Deck list quantity validation
 */
export class CardQuantity {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new Error('CardQuantity cannot be negative');
    }
    if (_value > 4) {
      throw new Error('CardQuantity cannot exceed 4 in most formats');
    }
  }

  static create(value: number): CardQuantity {
    return new CardQuantity(value);
  }

  static one(): CardQuantity {
    return new CardQuantity(1);
  }

  toNumber(): number {
    return this._value;
  }

  equals(other: CardQuantity): boolean {
    return this._value === other._value;
  }
}

/**
 * Request correlation ID for tracing
 */
export class RequestId {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('RequestId cannot be empty');
    }
  }

  static create(value?: string): RequestId {
    const id = value || this.generateId();
    return new RequestId(id);
  }

  private static generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toString(): string {
    return this._value;
  }
}

// Magic: The Gathering card colors
export { CardColor } from '../entities';

// Card rarity levels
export { CardRarity } from '../entities';

// Supported MTG formats
export { MTGFormat } from '../entities';

// Validation error codes
export { ValidationErrorCode } from '../entities';
