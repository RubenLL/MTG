// Infrastructure adapter for Gatherer API (fallback)
// Note: Gatherer API is less reliable than Scryfall, kept for redundancy
import axios, { AxiosInstance } from 'axios';
import { CardId, CardName } from '../../domain/valueObjects';
import { ScryfallCardResponse } from '../../domain/entities';

/**
 * Fallback adapter for Gatherer MTG card database
 * Used when Scryfall is unavailable or for additional validation
 */
export class GathererAdapter {
  private readonly client: AxiosInstance;
  private readonly baseUrl = 'https://gatherer.wizards.com';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000, // Longer timeout for fallback
      headers: {
        'User-Agent': 'MTG-Deck-Analyzer/1.0'
      }
    });
  }

  /**
   * Search for a card by name (basic implementation)
   * @param cardName The card name to search for
   * @returns Promise with card response (simplified format)
   */
  async findCardByName(cardName: CardName): Promise<ScryfallCardResponse | null> {
    try {
      // Note: This is a simplified implementation
      // Gatherer's API is not as well documented as Scryfall
      const response = await this.client.get('/Pages/Search/Default.aspx', {
        params: {
          output: 'json',
          method: 'text',
          text: cardName.toString()
        }
      });

      // Parse response and convert to Scryfall format
      // This would need proper implementation based on actual Gatherer API
      console.log('Gatherer API response:', response.data);
      return null; // Placeholder - needs proper implementation
    } catch (error) {
      console.error('Gatherer API error:', error);
      return null;
    }
  }

  /**
   * Get card by ID (placeholder implementation)
   * @param cardId The card ID
   * @returns Promise with card response
   */
  async findCardById(cardId: CardId): Promise<ScryfallCardResponse | null> {
    // Placeholder implementation
    console.log('Gatherer findCardById not implemented yet');
    return null;
  }

  /**
   * Get multiple cards by name (placeholder implementation)
   * @param cardNames Array of card names
   * @returns Promise with array of card responses
   */
  async findCardsByNames(cardNames: CardName[]): Promise<ScryfallCardResponse[]> {
    // Placeholder implementation
    console.log('Gatherer findCardsByNames not implemented yet');
    return [];
  }
}

/**
 * Factory function to create Gatherer adapter instance
 */
export function createGathererAdapter(): GathererAdapter {
  return new GathererAdapter();
}
