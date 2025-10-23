// Application layer DTOs for deck size validation

/**
 * Input DTO for deck size validation use case
 * Includes application-level concerns like tracing
 */
export interface ValidateDeckSizeInputDto {
  readonly deckList: readonly {
    readonly cardName: string;
    readonly quantity: number;
    readonly isSideboard?: boolean;
  }[];
  readonly format: string; // Will be validated as MTGFormat enum
  readonly includeSideboard?: boolean;
  readonly requestId?: string;
}

/**
 * Output DTO for deck size validation use case
 * Matches the domain result but with application-level structure
 */
export interface ValidateDeckSizeOutputDto {
  readonly success: boolean;
  readonly data?: {
    readonly isValid: boolean;
    readonly currentCount: number;
    readonly validRange: {
      readonly min: number;
      readonly max: number | null;
    };
    readonly format: string;
    readonly message: string;
    readonly validationDetails: {
      readonly mainDeckCount: number;
      readonly sideboardCount: number;
      readonly totalCards: number;
      readonly formatRequirements: string;
    };
    readonly errors: readonly {
      readonly code: string;
      readonly message: string;
      readonly field?: string;
      readonly value?: unknown;
      readonly cardName?: string;
    }[];
  };
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly details?: unknown;
  };
  readonly requestId: string;
  readonly timestamp: string;
}
