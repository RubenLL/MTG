import { Card } from '../../domain/entities';
import { ICardRepository } from '../../domain/cardValidation';
import { ScryfallCardRepository, ScryfallCardRepositoryConfig } from './ScryfallCardRepository';
import { DynamoDBCardRepository, DynamoDBCardRepositoryConfig } from './DynamoDBCardRepository';

/**
 * Configuration for the composite repository
 */
interface CompositeCardRepositoryConfig {
  /**
   * Whether to enable DynamoDB caching
   * @default true
   */
  enableCache?: boolean;
  
  /**
   * Configuration for the DynamoDB repository
   */
  dynamoConfig?: {
    tableName?: string;
    ttlSeconds?: number;
    region?: string;
  };
  
  /**
   * Configuration for the Scryfall repository
   */
  scryfallConfig?: {
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
  };
}

/**
 * A composite repository that first checks the cache (DynamoDB) and falls back to Scryfall API
 */
export class CompositeCardRepository implements ICardRepository {
  private readonly cache?: DynamoDBCardRepository;
  private readonly scryfall: ScryfallCardRepository;
  private readonly enableCache: boolean;

  /**
   * Create a new composite repository
   * @param config - Configuration options
   */
  constructor(config: CompositeCardRepositoryConfig = {}) {
    this.enableCache = config.enableCache !== false; // Enable cache by default
    
    // Initialize Scryfall repository with explicit undefined handling
    const scryfallConfig: ScryfallCardRepositoryConfig = {};
    if (config.scryfallConfig?.baseUrl !== undefined) {
      scryfallConfig.baseUrl = config.scryfallConfig.baseUrl;
    }
    if (config.scryfallConfig?.timeout !== undefined) {
      scryfallConfig.timeout = config.scryfallConfig.timeout;
    }
    this.scryfall = new ScryfallCardRepository(scryfallConfig);
    
    // Initialize DynamoDB cache if enabled
    if (this.enableCache && config.dynamoConfig) {
      const dynamoConfig: DynamoDBCardRepositoryConfig = {};
      
      if (config.dynamoConfig.tableName !== undefined) {
        dynamoConfig.tableName = config.dynamoConfig.tableName;
      }
      if (config.dynamoConfig.ttlSeconds !== undefined) {
        dynamoConfig.ttlSeconds = config.dynamoConfig.ttlSeconds;
      }
      if (config.dynamoConfig.region !== undefined) {
        dynamoConfig.region = config.dynamoConfig.region;
      }
      
      this.cache = new DynamoDBCardRepository(dynamoConfig);
    }
  }

  /**
   * Find a card by name, first checking the cache and falling back to Scryfall
   * @param name - Name of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  async findByName(name: string): Promise<Card | undefined> {
    // Try cache first if enabled
    if (this.enableCache && this.cache) {
      try {
        const cachedCard = await this.cache.findByName(name);
        if (cachedCard) {
          return cachedCard;
        }
      } catch (error) {
        console.warn('Cache lookup failed, falling back to Scryfall:', error);
      }
    }

    // If not in cache or cache is disabled, try Scryfall
    try {
      const card = await this.scryfall.findByName(name);
      
      // If found, save to cache for future lookups
      if (card && this.enableCache && this.cache) {
        try {
          await this.cache.saveCard(card);
        } catch (cacheError) {
          console.warn('Failed to save card to cache:', cacheError);
        }
      }
      
      return card;
    } catch (error) {
      console.error('Error fetching card from Scryfall:', error);
      throw error;
    }
  }

  /**
   * Search for cards by name with fuzzy matching
   * @param name - Name or partial name of the card
   * @param limit - Maximum number of results to return (default: 5)
   * @returns Promise that resolves to an array of matching cards
   */
  async searchByName(name: string, limit: number = 5): Promise<Card[]> {
    // For search, we'll always go to Scryfall for the most up-to-date results
    try {
      const cards = await this.scryfall.searchByName(name, limit);
      
      // Cache the results for future individual lookups
      if (this.enableCache && this.cache) {
        await Promise.all(
          cards.map(card => 
            this.cache!.saveCard(card).catch(err => 
              console.warn(`Failed to cache card ${card.name}:`, err)
            )
          )
        );
      }
      
      return cards;
    } catch (error) {
      console.error('Error searching cards from Scryfall:', error);
      
      // If there's an error with Scryfall, try the cache as a fallback
      if (this.enableCache && this.cache) {
        try {
          return this.cache.searchByName(name, limit);
        } catch (cacheError) {
          console.warn('Cache fallback for search failed:', cacheError);
        }
      }
      
      throw error;
    }
  }

  /**
   * Find a card by its ID, first checking the cache and falling back to Scryfall
   * @param id - The ID of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  async findById(id: string): Promise<Card | undefined> {
    // Try cache first if enabled
    if (this.enableCache && this.cache) {
      try {
        const cachedCard = await this.cache.findById(id);
        if (cachedCard) {
          return cachedCard;
        }
      } catch (error) {
        console.warn('Cache lookup by ID failed, falling back to Scryfall:', error);
      }
    }

    // If not in cache or cache is disabled, try Scryfall
    try {
      const card = await this.scryfall.findById(id);
      
      // If found, save to cache for future lookups
      if (card && this.enableCache && this.cache) {
        try {
          await this.cache.saveCard(card);
        } catch (cacheError) {
          console.warn('Failed to save card to cache:', cacheError);
        }
      }
      
      return card;
    } catch (error) {
      console.error('Error fetching card by ID from Scryfall:', error);
      throw error;
    }
  }
}
