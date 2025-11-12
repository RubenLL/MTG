import { Card, DeckListCard, MTGFormat, ValidationError } from './entities';

/**
 * Result of card existence validation
 */
export interface CardValidationResult {
  /**
   * List of valid cards with their details
   */
  readonly validCards: Array<{
    readonly name: string;
    readonly quantity: number;
    readonly isSideboard: boolean;
    readonly details: {
      readonly id: string;
      readonly name: string;
      readonly set: string;
      readonly collectorNumber: string;
      readonly imageUri: string | undefined;  // Explicitly mark as possibly undefined
    };
  }>;

  /**
   * List of invalid cards with error details
   */
  readonly invalidCards: Array<{
    readonly name: string;
    readonly reason: 'NOT_FOUND' | 'INVALID_QUANTITY' | 'FORMAT_RESTRICTED';
    readonly suggestions?: Array<{
      readonly name: string;
      readonly set?: string;
      readonly similarity: number;
    }>;
  }>;

  /**
   * Summary of the validation
   */
  readonly validationSummary: {
    readonly totalCards: number;
    readonly validCards: number;
    readonly invalidCards: number;
    readonly hasWarnings: boolean;
  };
}

/**
 * Interface for card repository
 */
export interface ICardRepository {
  /**
   * Find a card by name
   * @param name - Name of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  findByName(name: string): Promise<Card | undefined>;

  /**
   * Find a card by ID
   * @param id - ID of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  findById(id: string): Promise<Card | undefined>;

  /**
   * Find cards by name with fuzzy matching
   * @param name - Name or partial name of the card
   * @param limit - Maximum number of results to return
   * @returns Promise that resolves to an array of matching cards
   */
  searchByName(name: string, limit?: number): Promise<Card[]>;
}

/**
 * Input for card existence validation
 */
export interface CardValidationInput {
  /**
   * List of cards to validate
   */
  readonly deckList: readonly DeckListCard[];
  
  /**
   * Format to validate against (for format-specific rules)
   */
  readonly format: MTGFormat;
}

/**
 * Validates if cards in a deck exist and are valid for the specified format
 * @param input - Validation input
 * @param repository - Card repository to use for lookups
 * @returns Promise that resolves to the validation result
 */
export async function validateCardExistence(
  input: CardValidationInput,
  repository: ICardRepository
): Promise<CardValidationResult> {
  const validCards: CardValidationResult['validCards'] = [];
  const invalidCards: CardValidationResult['invalidCards'] = [];
  let totalCards = 0;
  let validCount = 0;
  let invalidCount = 0;

  // Process each card in the deck list
  for (const card of input.deckList) {
    totalCards += card.quantity;
    
    try {
      // Look up the card by name
      const foundCard = await repository.findByName(card.cardName);
      
      if (!foundCard) {
        // If card not found, try fuzzy search for suggestions
        const suggestions = await repository.searchByName(card.cardName, 3);
        
        invalidCards.push({
          name: card.cardName,
          reason: 'NOT_FOUND',
          suggestions: suggestions.map(s => ({
            name: s.name,
            set: s.setCode,
            similarity: calculateSimilarity(card.cardName, s.name)
          }))
        });
        invalidCount += card.quantity;
        continue;
      }

      // Check if card is legal in the specified format
      if (!foundCard.isLegalInFormats.includes(input.format)) {
        invalidCards.push({
          name: card.cardName,
          reason: 'FORMAT_RESTRICTED'
        });
        invalidCount += card.quantity;
        continue;
      }

      // If we get here, the card is valid
      validCards.push({
        name: card.cardName,
        quantity: card.quantity,
        isSideboard: card.isSideboard ?? false,
        details: {
          id: foundCard.id,
          name: foundCard.name,
          set: foundCard.setCode,
          collectorNumber: foundCard.collectorNumber,
          imageUri: foundCard.imageUrl
        }
      });
      validCount += card.quantity;
      
    } catch (error) {
      console.error(`Error validating card ${card.cardName}:`, error);
      invalidCards.push({
        name: card.cardName,
        reason: 'NOT_FOUND'
      });
      invalidCount += card.quantity;
    }
  }

  return {
    validCards,
    invalidCards,
    validationSummary: {
      totalCards,
      validCards: validCount,
      invalidCards: invalidCount,
      hasWarnings: invalidCount > 0
    }
  };
}

/**
 * Calculate similarity between two strings using Jaro-Winkler distance
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity score between 0 and 1
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Convert to lowercase and remove non-alphanumeric characters
  const cleanStr1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanStr2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Jaro-Winkler distance implementation
  const jaroWinkler = (s1: string, s2: string): number => {
    // Implementation of Jaro-Winkler distance algorithm
    // This is a simplified version - consider using a library for production
    
    // If the strings are equal, return 1.0
    if (s1 === s2) return 1.0;

    // Length of the strings
    const len1 = s1.length;
    const len2 = s2.length;

    // Maximum distance for matching characters
    const maxDist = Math.floor(Math.max(len1, len2) / 2) - 1;

    // Flags for matches
    let matches = 0;
    const s1Matches = new Array(len1).fill(false);
    const s2Matches = new Array(len2).fill(false);

    // Find matching characters
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - maxDist);
      const end = Math.min(i + maxDist + 1, len2);
      
      for (let j = start; j < end; j++) {
        if (!s2Matches[j] && s1[i] === s2[j]) {
          s1Matches[i] = true;
          s2Matches[j] = true;
          matches++;
          break;
        }
      }
    }

    // If no matches, return 0
    if (matches === 0) return 0;

    // Count transpositions
    let k = 0;
    let transpositions = 0;
    
    for (let i = 0; i < len1; i++) {
      if (s1Matches[i]) {
        while (!s2Matches[k]) k++;
        if (s1[i] !== s2[k]) transpositions++;
        k++;
      }
    }

    // Calculate Jaro distance
    const jaro = (
      (matches / len1) + 
      (matches / len2) + 
      ((matches - transpositions / 2) / matches)
    ) / 3;

    // Calculate common prefix length (max 4)
    let prefix = 0;
    const maxPrefix = Math.min(4, Math.min(len1, len2));
    
    for (let i = 0; i < maxPrefix; i++) {
      if (s1[i] === s2[i]) prefix++;
      else break;
    }

    // Calculate Jaro-Winkler distance
    return jaro + (prefix * 0.1 * (1 - jaro));
  };

  return jaroWinkler(cleanStr1, cleanStr2);
}

// Export types for external use
export type { CardValidationResult as CardExistenceValidationResult };
