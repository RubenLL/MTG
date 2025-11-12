import { Card, CardColor, CardRarity, MTGFormat } from '../../domain/entities';
import { ICardRepository } from '../../domain/cardValidation';
import axios, { AxiosRequestConfig } from 'axios';
import { URLSearchParams } from 'url';

/**
 * Configuration options for ScryfallCardRepository
 */
export interface ScryfallCardRepositoryConfig {
  /**
   * Base URL for the Scryfall API
   * @default 'https://api.scryfall.com'
   */
  baseUrl?: string;
  
  /**
   * Request timeout in milliseconds
   * @default 5000
   */
  timeout?: number;
  
  /**
   * Additional Axios request config
   */
  axiosConfig?: AxiosRequestConfig;
}

/**
 * Implementation of ICardRepository that uses Scryfall API
 */
export class ScryfallCardRepository implements ICardRepository {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly axiosConfig: AxiosRequestConfig;
  private readonly cache: Map<string, Card> = new Map();
  private readonly searchCache: Map<string, Card[]> = new Map();

  constructor(config: ScryfallCardRepositoryConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://api.scryfall.com';
    this.timeout = config.timeout || 5000; // 5 seconds default timeout
    this.axiosConfig = {
      timeout: this.timeout,
      ...(config.axiosConfig || {})
    };
  }

  /**
   * Find a card by name
   * @param name - Name of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  async findByName(name: string): Promise<Card | undefined> {
    // Check cache first
    const cacheKey = `name:${name.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Scryfall API endpoint for exact name search
      const response = await axios.get(`${this.baseUrl}/cards/named`, {
        params: { exact: name },
        timeout: this.timeout
      });

      if (response.data && response.data.object !== 'error') {
        const card = this.mapScryfallToDomain(response.data);
        this.cache.set(cacheKey, card);
        // Also cache by ID for faster lookups
        if (card?.id) {
          this.cache.set(`id:${card.id}`, card);
        }
        return card;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined; // Card not found
      }
      console.error('Error fetching card from Scryfall:', error);
      throw error; // Re-throw for the caller to handle
    }

    return undefined;
  }

  /**
   * Find a card by its ID
   * @param id - The ID of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  async findById(id: string): Promise<Card | undefined> {
    // Check cache first
    const cacheKey = `id:${id.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Scryfall API endpoint for card by ID
      const response = await axios.get(`${this.baseUrl}/cards/${id}`, {
        timeout: this.timeout
      });

      if (response.data && response.data.object !== 'error') {
        const card = this.mapScryfallToDomain(response.data);
        // Cache by both ID and name for faster lookups
        this.cache.set(`id:${card.id}`, card);
        this.cache.set(`name:${card.name.toLowerCase()}`, card);
        return card;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined; // Card not found
      }
      console.error('Error fetching card by ID from Scryfall:', error);
      throw error; // Re-throw for the caller to handle
    }

    return undefined;
  }

  /**
   * Search for cards by name with fuzzy matching
   * @param name - Name or partial name of the card
   * @param limit - Maximum number of results to return (default: 5)
   * @returns Promise that resolves to an array of matching cards
   */
  async searchByName(name: string, limit: number = 5): Promise<Card[]> {
    const searchKey = `${name.toLowerCase().trim()}:${limit}`;
    
    // Check cache first
    if (this.searchCache.has(searchKey)) {
      return this.searchCache.get(searchKey)!;
    }

    try {
      // Scryfall API endpoint for fuzzy search
      const params = new URLSearchParams({
        q: `name:${name}`,
        order: 'released',
        dir: 'desc',
        unique: 'cards',
        include_extras: 'false',
        include_multilingual: 'false',
        include_variations: 'false',
        page: '1',
        format: 'json',
        pretty: 'false'
      });

      const response = await axios.get(`${this.baseUrl}/cards/search`, {
        params,
        timeout: 5000 // 5 second timeout
      });

      if (response.data && response.data.data) {
        const cards = response.data.data
          .slice(0, limit)
          .map((cardData: any) => this.mapScryfallToDomain(cardData));
        
        this.searchCache.set(searchKey, cards);
        return cards;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return []; // No cards found
      }
      console.error('Error searching cards from Scryfall:', error);
      throw error; // Re-throw for the caller to handle
    }

    return [];
  }

  /**
   * Map Scryfall API response to our domain model
   * @param scryfallCard - Card data from Scryfall API
   * @returns Domain Card object
   */
  private mapScryfallToDomain(scryfallCard: any): Card {
    // Extract legalities
    const legalInFormats: MTGFormat[] = [];
    const bannedInFormats: MTGFormat[] = [];
    const restrictedInFormats: MTGFormat[] = [];

    if (scryfallCard.legalities) {
      Object.entries(scryfallCard.legalities).forEach(([format, status]) => {
        if (status === 'legal') {
          legalInFormats.push(format as MTGFormat);
        } else if (status === 'banned') {
          bannedInFormats.push(format as MTGFormat);
        } else if (status === 'restricted') {
          restrictedInFormats.push(format as MTGFormat);
        }
      });
    }

    // Map card faces for double-faced cards
    let name = scryfallCard.name || '';
    let type = scryfallCard.type_line || '';
    let text = scryfallCard.oracle_text || '';
    let power = scryfallCard.power;
    let toughness = scryfallCard.toughness;
    let loyalty = scryfallCard.loyalty;
    let imageUrl = scryfallCard.image_uris?.normal;

    // Handle double-faced cards
    if (scryfallCard.card_faces && scryfallCard.card_faces.length > 0) {
      const face = scryfallCard.card_faces[0]; // Use the first face for basic info
      name = face.name || name;
      type = face.type_line || type;
      text = face.oracle_text || text;
      power = face.power;
      toughness = face.toughness;
      loyalty = face.loyalty;
      
      // Try to get image for the front face
      if (face.image_uris?.normal) {
        imageUrl = face.image_uris.normal;
      } else if (scryfallCard.image_uris?.normal) {
        imageUrl = scryfallCard.image_uris.normal;
      }
    }

    // Map colors
    const colors: CardColor[] = [];
    if (scryfallCard.colors) {
      scryfallCard.colors.forEach((color: string) => {
        switch (color.toUpperCase()) {
          case 'W': colors.push(CardColor.WHITE); break;
          case 'U': colors.push(CardColor.BLUE); break;
          case 'B': colors.push(CardColor.BLACK); break;
          case 'R': colors.push(CardColor.RED); break;
          case 'G': colors.push(CardColor.GREEN); break;
        }
      });
    }

    // Map rarity - default to COMMON for any unknown rarities
    let rarity: CardRarity;
    switch (scryfallCard.rarity?.toLowerCase()) {
      case 'uncommon': 
        rarity = CardRarity.UNCOMMON; 
        break;
      case 'rare': 
      case 'mythic': // Treat mythic as rare since our CardRarity enum doesn't have a mythic value
        rarity = CardRarity.RARE; 
        break;
      case 'common':
      default: 
        rarity = CardRarity.COMMON;
    }

    return {
      id: scryfallCard.id,
      name,
      manaCost: scryfallCard.mana_cost,
      convertedManaCost: scryfallCard.cmc || 0,
      colors,
      type,
      rarity,
      text,
      power,
      toughness,
      loyalty,
      isLegalInFormats: legalInFormats,
      isBannedInFormats: bannedInFormats,
      isRestrictedInFormats: restrictedInFormats,
      setCode: scryfallCard.set,
      collectorNumber: scryfallCard.collector_number,
      imageUrl
    };
  }
}
