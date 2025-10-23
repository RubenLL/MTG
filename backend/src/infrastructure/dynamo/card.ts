// Infrastructure repository for card data using DynamoDB
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CardId, CardName } from '../../domain/valueObjects';
import { Card } from '../../domain/entities';

/**
 * DynamoDB implementation for card repository
 * Handles persistence of MTG card data
 */
export class DynamoCardRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName: string = 'mtg-cards') {
    const dynamoClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName = tableName;
  }

  /**
   * Find card by ID
   * @param id Card ID to search for
   * @returns Promise with card or null if not found
   */
  async findById(id: CardId): Promise<Card | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          cardId: id.toString()
        }
      });

      const response = await this.client.send(command);

      if (response.Item) {
        return response.Item as Card;
      }

      return null;
    } catch (error) {
      console.error('Error finding card by ID:', error);
      throw error;
    }
  }

  /**
   * Find cards by name
   * @param name Card name to search for
   * @returns Promise with array of matching cards
   */
  async findByName(name: CardName): Promise<Card[]> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'cardName-index',
        KeyConditionExpression: 'cardName = :name',
        ExpressionAttributeValues: {
          ':name': name.toString()
        }
      });

      const response = await this.client.send(command);

      if (response.Items) {
        return response.Items as Card[];
      }

      return [];
    } catch (error) {
      console.error('Error finding cards by name:', error);
      throw error;
    }
  }

  /**
   * Save or update a card
   * @param card Card to save
   * @returns Promise that resolves when saved
   */
  async save(card: Card): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          ...card,
          cardId: card.id,
          cardName: card.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error saving card:', error);
      throw error;
    }
  }

  /**
   * Update an existing card
   * @param card Card to update
   * @returns Promise that resolves when updated
   */
  async update(card: Card): Promise<void> {
    try {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: {
          cardId: card.id
        },
        UpdateExpression: 'SET #name = :name, #manaCost = :manaCost, #colors = :colors, #type = :type, #rarity = :rarity, #text = :text, #power = :power, #toughness = :toughness, #loyalty = :loyalty, #isLegalInFormats = :isLegalInFormats, #isBannedInFormats = :isBannedInFormats, #isRestrictedInFormats = :isRestrictedInFormats, #setCode = :setCode, #collectorNumber = :collectorNumber, #imageUrl = :imageUrl, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#manaCost': 'manaCost',
          '#colors': 'colors',
          '#type': 'type',
          '#rarity': 'rarity',
          '#text': 'text',
          '#power': 'power',
          '#toughness': 'toughness',
          '#loyalty': 'loyalty',
          '#isLegalInFormats': 'isLegalInFormats',
          '#isBannedInFormats': 'isBannedInFormats',
          '#isRestrictedInFormats': 'isRestrictedInFormats',
          '#setCode': 'setCode',
          '#collectorNumber': 'collectorNumber',
          '#imageUrl': 'imageUrl',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':name': card.name,
          ':manaCost': card.manaCost,
          ':colors': card.colors,
          ':type': card.type,
          ':rarity': card.rarity,
          ':text': card.text,
          ':power': card.power,
          ':toughness': card.toughness,
          ':loyalty': card.loyalty,
          ':isLegalInFormats': card.isLegalInFormats,
          ':isBannedInFormats': card.isBannedInFormats,
          ':isRestrictedInFormats': card.isRestrictedInFormats,
          ':setCode': card.setCode,
          ':collectorNumber': card.collectorNumber,
          ':imageUrl': card.imageUrl,
          ':updatedAt': new Date().toISOString()
        }
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }

  /**
   * Delete a card by ID
   * @param id Card ID to delete
   * @returns Promise that resolves when deleted
   */
  async delete(id: CardId): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: {
          cardId: id.toString()
        }
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create DynamoDB card repository
 */
export function createDynamoCardRepository(tableName?: string): DynamoCardRepository {
  return new DynamoCardRepository(tableName);
}
