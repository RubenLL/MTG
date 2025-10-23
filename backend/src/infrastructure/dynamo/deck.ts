// Infrastructure repository for deck data using DynamoDB
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Deck } from '../../domain/entities';

/**
 * DynamoDB implementation for deck repository
 * Handles persistence of MTG deck data
 */
export class DynamoDeckRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName: string = 'mtg-decks') {
    const dynamoClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName = tableName;
  }

  /**
   * Save a new deck
   * @param deck Deck to save
   * @returns Promise that resolves when saved
   */
  async save(deck: Deck): Promise<void> {
    try {
      const deckId = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          ...deck,
          deckId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error saving deck:', error);
      throw error;
    }
  }

  /**
   * Find deck by ID
   * @param id Deck ID to search for
   * @returns Promise with deck or null if not found
   */
  async findById(id: string): Promise<Deck | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          deckId: id
        }
      });

      const response = await this.client.send(command);

      if (response.Item) {
        // Remove the deckId and timestamps from the returned object
        const { deckId, createdAt, updatedAt, ...deckData } = response.Item as any;
        return deckData as Deck;
      }

      return null;
    } catch (error) {
      console.error('Error finding deck by ID:', error);
      throw error;
    }
  }

  /**
   * Find decks by user ID
   * @param userId User ID to search for
   * @returns Promise with array of user's decks
   */
  async findByUserId(userId: string): Promise<Deck[]> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      });

      const response = await this.client.send(command);

      if (response.Items) {
        return response.Items.map(item => {
          const { deckId, createdAt, updatedAt, ...deckData } = item as any;
          return deckData as Deck;
        });
      }

      return [];
    } catch (error) {
      console.error('Error finding decks by user ID:', error);
      throw error;
    }
  }

  /**
   * Update an existing deck
   * @param deck Deck to update
   * @returns Promise that resolves when updated
   */
  async update(deck: Deck): Promise<void> {
    try {
      // For update, we need the deckId - this should be handled by the service layer
      const deckId = `deck_${Date.now()}`; // Placeholder - should come from service

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: {
          deckId
        },
        UpdateExpression: 'SET #cards = :cards, #format = :format, #mainDeck = :mainDeck, #sideboard = :sideboard, #totalCards = :totalCards, #isValid = :isValid, #validationErrors = :validationErrors, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#cards': 'cards',
          '#format': 'format',
          '#mainDeck': 'mainDeck',
          '#sideboard': 'sideboard',
          '#totalCards': 'totalCards',
          '#isValid': 'isValid',
          '#validationErrors': 'validationErrors',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':cards': deck.cards,
          ':format': deck.format,
          ':mainDeck': deck.mainDeck,
          ':sideboard': deck.sideboard,
          ':totalCards': deck.totalCards,
          ':isValid': deck.isValid,
          ':validationErrors': deck.validationErrors,
          ':updatedAt': new Date().toISOString()
        }
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error updating deck:', error);
      throw error;
    }
  }

  /**
   * Delete a deck by ID
   * @param id Deck ID to delete
   * @returns Promise that resolves when deleted
   */
  async delete(id: string): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: {
          deckId: id
        }
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error deleting deck:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create DynamoDB deck repository
 */
export function createDynamoDeckRepository(tableName?: string): DynamoDeckRepository {
  return new DynamoDeckRepository(tableName);
}
