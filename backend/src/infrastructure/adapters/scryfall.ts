// Infrastructure adapter for Scryfall API
import axios, { AxiosInstance } from 'axios';
import { CardId, CardName } from '../../domain/valueObjects';
import { ScryfallCardResponse } from '../../domain/entities';

/**
 * External API adapter for Scryfall MTG card database
 * Handles card lookup and validation against official card data
 */
export class ScryfallAdapter {
  private readonly client: AxiosInstance;
  private readonly baseUrl = 'https://api.scryfall.com';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'User-Agent': 'MTG-Deck-Analyzer/1.0'
      }
    });
  }

  /**
   * Search for a card by name
   * @param cardName The card name to search for
   * @returns Promise with Scryfall card response
   */
  async findCardByName(cardName: CardName): Promise<ScryfallCardResponse | null> {
    try {
      const response = await this.client.get('/cards/search', {
        params: {
          q: cardName.toString(),
          unique: 'cards',
          order: 'name'
        }
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0] as ScryfallCardResponse;
      }

      return null;
    } catch (error) {
      console.error('Scryfall API error:', error);
      return null;
    }
  }

  /**
   * Get card by Scryfall ID
   * @param cardId The Scryfall card ID
   * @returns Promise with Scryfall card response
   */
  async findCardById(cardId: CardId): Promise<ScryfallCardResponse | null> {
    try {
      const response = await this.client.get(`/cards/${cardId.toString()}`);
      return response.data as ScryfallCardResponse;
    } catch (error) {
      console.error('Scryfall API error:', error);
      return null;
    }
  }

  /**
   * Get multiple cards by name (bulk lookup)
   * @param cardNames Array of card names to search for
   * @returns Promise with array of Scryfall card responses
   */
  async findCardsByNames(cardNames: CardName[]): Promise<ScryfallCardResponse[]> {
    const results: ScryfallCardResponse[] = [];

    // Scryfall has rate limits, so we need to be careful with bulk requests
    // For now, implement sequential requests with delays
    for (const cardName of cardNames) {
      const card = await this.findCardByName(cardName);
      if (card) {
        results.push(card);
      }

      // Add small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }
}

/**
 * Factory function to create Scryfall adapter instance
 */
export function createScryfallAdapter(): ScryfallAdapter {
  return new ScryfallAdapter();
}
