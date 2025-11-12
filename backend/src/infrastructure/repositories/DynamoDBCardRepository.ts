import { Card } from '../../domain/entities';
import { ICardRepository } from '../../domain/cardValidation';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

/**
 * Configuration options for DynamoDBCardRepository
 */
export interface DynamoDBCardRepositoryConfig {
  /**
   * Name of the DynamoDB table
   * @default 'mtg-cards'
   */
  tableName?: string;
  
  /**
   * Time to live for cached items in seconds
   * @default 604800 (7 days)
   */
  ttlSeconds?: number;
  
  /**
   * AWS region
   * @default process.env.AWS_REGION || 'us-east-1'
   */
  region?: string;
  
  /**
   * Custom DynamoDB client options
   */
  dynamoDbOptions?: ConstructorParameters<typeof DynamoDBClient>[0];
}

/**
 * Implementation of ICardRepository that uses DynamoDB for caching
 */
export class DynamoDBCardRepository implements ICardRepository {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;
  private readonly ttlSeconds: number;

  /**
   * Create a new DynamoDB repository
   * @param config - Configuration options
   */
  constructor(config: DynamoDBCardRepositoryConfig = {}) {
    this.tableName = config.tableName || 'mtg-cards';
    this.ttlSeconds = config.ttlSeconds || 86400; // 24 hours
    
    // Create DynamoDB client
    const client = new DynamoDBClient({
      region: config.region || 'us-east-1',
      ...(process.env.IS_OFFLINE && { 
        endpoint: 'http://localhost:8000',
        credentials: {
          accessKeyId: 'local',
          secretAccessKey: 'local'
        }
      })
    });
    
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  /**
   * Find a card by name in DynamoDB
   * @param name - Name of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  async findByName(name: string): Promise<Card | undefined> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `CARD#${name.toLowerCase()}`,
        SK: 'META'
      }
    });

    try {
      const response = await this.docClient.send(command);
      
      if (response.Item && !this.isItemExpired(response.Item)) {
        return this.mapDynamoItemToCard(response.Item);
      }
      
      return undefined;
    } catch (error) {
      console.error('Error fetching card from DynamoDB:', error);
      return undefined;
    }
  }

  /**
   * Search for cards by name with fuzzy matching in DynamoDB
   * @param name - Name or partial name of the card
   * @param limit - Maximum number of results to return (default: 5)
   * @returns Promise that resolves to an array of matching cards
   */
  /**
   * Find a card by its ID
   * @param id - The ID of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  async findById(id: string): Promise<Card | undefined> {
    // In DynamoDB, we need to scan to find by ID since our primary key is on name
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id
      },
      Limit: 1
    });

    try {
      const response = await this.docClient.send(command);
      
      if (response.Items?.[0]) {
        const item = response.Items[0];
        if (!this.isItemExpired(item)) {
          const card = this.mapDynamoItemToCard(item);
          return card || undefined;
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('Error finding card by ID in DynamoDB:', error);
      return undefined;
    }
  }

  /**
   * Search for cards by name with fuzzy matching
   */
  async searchByName(name: string, limit: number = 5): Promise<Card[]> {
    const normalizedSearch = name.toLowerCase().trim();
    
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'SearchIndex',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': 'SEARCH',
        ':sk': normalizedSearch
      },
      Limit: limit,
      ScanIndexForward: true
    });

    try {
      const response = await this.docClient.send(command);
      
      if (!response.Items || response.Items.length === 0) {
        return [];
      }
      
      // Filter out expired items and map to Card objects
      return response.Items
        .filter(item => !this.isItemExpired(item))
        .map(item => this.mapDynamoItemToCard(item))
        .filter((card): card is Card => card !== undefined);
    } catch (error) {
      console.error('Error searching cards in DynamoDB:', error);
      return [];
    }
  }

  /**
   * Save a card to DynamoDB
   * @param card - Card to save
   * @returns Promise that resolves when the card is saved
   */
  async saveCard(card: Card): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = now + this.ttlSeconds;
    
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `CARD#${card.name.toLowerCase()}`,
        SK: 'META',
        GSI1PK: 'SEARCH',
        GSI1SK: card.name.toLowerCase(),
        ...card,
        ttl,
        createdAt: now,
        updatedAt: now
      }
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      console.error('Error saving card to DynamoDB:', error);
      throw error;
    }
  }

  /**
   * Check if a DynamoDB item is expired based on its TTL
   * @param item - DynamoDB item
   * @returns True if the item is expired, false otherwise
   */
  private isItemExpired(item: Record<string, any>): boolean {
    if (!item.ttl) return false;
    const now = Math.floor(Date.now() / 1000);
    return item.ttl < now;
  }

  /**
   * Map a DynamoDB item to a Card object
   * @param item - DynamoDB item
   * @returns Card object or undefined if the item is invalid
   */
  private mapDynamoItemToCard(item: Record<string, any>): Card | undefined {
    try {
      // Skip the DynamoDB keys and metadata
      const { PK, SK, GSI1PK, GSI1SK, ttl, createdAt, updatedAt, ...cardData } = item;
      
      // Ensure required fields are present
      if (!cardData.id || !cardData.name) {
        return undefined;
      }
      
      return cardData as Card;
    } catch (error) {
      console.error('Error mapping DynamoDB item to Card:', error);
      return undefined;
    }
  }
}
