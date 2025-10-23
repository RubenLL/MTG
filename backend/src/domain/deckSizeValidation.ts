// Domain logic for deck size validation
import {
  DeckSizeValidationInput,
  DeckSizeValidationResult,
  MTGFormat,
  ValidationError,
  ValidationErrorCode
} from './entities';

/**
 * Format-specific deck size requirements
 * Based on official MTG rules and BO decisions
 */
export const FORMAT_REQUIREMENTS: Record<MTGFormat, {
  minDeckSize: number;
  maxDeckSize: number | null;
  maxSideboardSize: number | null;
  description: string;
}> = {
  [MTGFormat.STANDARD]: {
    minDeckSize: 60,
    maxDeckSize: null,
    maxSideboardSize: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  [MTGFormat.MODERN]: {
    minDeckSize: 60,
    maxDeckSize: null,
    maxSideboardSize: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  [MTGFormat.PIONEER]: {
    minDeckSize: 60,
    maxDeckSize: null,
    maxSideboardSize: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  [MTGFormat.COMMANDER]: {
    minDeckSize: 100,
    maxDeckSize: 100,
    maxSideboardSize: 10,
    description: 'Exactly 100 cards in main deck, maximum 10 in sideboard'
  },
  [MTGFormat.LEGACY]: {
    minDeckSize: 60,
    maxDeckSize: null,
    maxSideboardSize: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  [MTGFormat.VINTAGE]: {
    minDeckSize: 60,
    maxDeckSize: null,
    maxSideboardSize: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  [MTGFormat.PAUPER]: {
    minDeckSize: 60,
    maxDeckSize: null,
    maxSideboardSize: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  [MTGFormat.DRAFT]: {
    minDeckSize: 40,
    maxDeckSize: null,
    maxSideboardSize: null,
    description: 'Minimum 40 cards in main deck'
  },
  [MTGFormat.SEALED]: {
    minDeckSize: 40,
    maxDeckSize: null,
    maxSideboardSize: null,
    description: 'Minimum 40 cards in main deck'
  }
};

/**
 * Calculate the number of cards in main deck and sideboard
 */
export function calculateDeckCounts(
  deckList: readonly { quantity: number; isSideboard?: boolean }[]
): { mainDeckCount: number; sideboardCount: number } {
  let mainDeckCount = 0;
  let sideboardCount = 0;

  for (const card of deckList) {
    if (card.isSideboard) {
      sideboardCount += card.quantity;
    } else {
      mainDeckCount += card.quantity;
    }
  }

  return { mainDeckCount, sideboardCount };
}

/**
 * Validate deck size according to format requirements
 */
export function validateDeckSize(input: DeckSizeValidationInput): DeckSizeValidationResult {
  const { deckList, format, includeSideboard = false } = input;

  // Get format requirements
  const requirements = FORMAT_REQUIREMENTS[format];
  if (!requirements) {
    return createInvalidResult(
      format,
      0,
      `Unsupported format: ${format}`,
      ValidationErrorCode.INVALID_FORMAT,
      'format',
      format
    );
  }

  // Calculate counts
  const { mainDeckCount, sideboardCount } = calculateDeckCounts(deckList);
  const totalCards = mainDeckCount + sideboardCount;

  // Validate main deck size
  const mainDeckErrors = validateMainDeckSize(mainDeckCount, requirements);
  if (mainDeckErrors.length > 0) {
    const firstError = mainDeckErrors[0]!;
    return createInvalidResult(
      format,
      mainDeckCount,
      firstError.message,
      firstError.code,
      'mainDeck',
      mainDeckCount,
      mainDeckErrors
    );
  }

  // Validate sideboard if requested
  if (includeSideboard && requirements.maxSideboardSize !== null) {
    if (sideboardCount > requirements.maxSideboardSize) {
      return createInvalidResult(
        format,
        mainDeckCount,
        `Sideboard exceeds maximum of ${requirements.maxSideboardSize} cards (${sideboardCount} provided)`,
        ValidationErrorCode.SIDEBBOARD_SIZE_INVALID,
        'sideboard',
        sideboardCount,
        [{
          code: ValidationErrorCode.SIDEBBOARD_SIZE_INVALID,
          message: `Sideboard exceeds maximum of ${requirements.maxSideboardSize} cards`,
          field: 'sideboard',
          value: sideboardCount
        }]
      );
    }
  }

  // Valid result
  return {
    isValid: true,
    currentCount: mainDeckCount,
    validRange: {
      min: requirements.minDeckSize,
      max: requirements.maxDeckSize
    },
    format,
    message: `Deck size is valid for ${format} format`,
    validationDetails: {
      mainDeckCount,
      sideboardCount,
      totalCards,
      formatRequirements: requirements.description
    },
    errors: []
  };
}

/**
 * Validate main deck size according to format rules
 */
function validateMainDeckSize(
  mainDeckCount: number,
  requirements: { minDeckSize: number; maxDeckSize: number | null }
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (mainDeckCount < requirements.minDeckSize) {
    errors.push({
      code: ValidationErrorCode.DECK_SIZE_TOO_SMALL,
      message: `Main deck must contain at least ${requirements.minDeckSize} cards (${mainDeckCount} provided)`,
      field: 'mainDeck',
      value: mainDeckCount
    });
  }

  if (requirements.maxDeckSize !== null && mainDeckCount > requirements.maxDeckSize) {
    errors.push({
      code: ValidationErrorCode.DECK_SIZE_TOO_LARGE,
      message: `Main deck must contain at most ${requirements.maxDeckSize} cards (${mainDeckCount} provided)`,
      field: 'mainDeck',
      value: mainDeckCount
    });
  }

  return errors;
}

/**
 * Create an invalid validation result
 */
function createInvalidResult(
  format: MTGFormat,
  currentCount: number,
  message: string,
  errorCode: ValidationErrorCode,
  field: string,
  value: unknown,
  additionalErrors: ValidationError[] = []
): DeckSizeValidationResult {
  const requirements = FORMAT_REQUIREMENTS[format];
  const primaryError: ValidationError = {
    code: errorCode,
    message,
    field,
    value
  };

  return {
    isValid: false,
    currentCount,
    validRange: {
      min: requirements.minDeckSize,
      max: requirements.maxDeckSize
    },
    format,
    message,
    validationDetails: {
      mainDeckCount: currentCount,
      sideboardCount: 0,
      totalCards: currentCount,
      formatRequirements: requirements.description
    },
    errors: [primaryError, ...additionalErrors]
  };
}
