import { MongoDBCardRepository } from './MongoDBCardRepository';
import { CompositeCardRepository } from './CompositeCardRepository';
import { DynamoDBCardRepository } from './DynamoDBCardRepository';
import { ScryfallCardRepository } from './ScryfallCardRepository';
import { ICardRepository } from '../../domain/cardValidation';

/**
 * Create the appropriate card repository based on environment
 */
export function createCardRepository(): ICardRepository {
  const isLocalDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  const useMongoDB = isLocalDevelopment && process.env.USE_MONGODB !== 'false';

  if (useMongoDB) {
    console.log('Using MongoDB repository for local development');
    return new MongoDBCardRepository({
      connectionString: process.env.MONGO_URI || 'mongodb://localhost:27017',
      dbName: process.env.MONGO_DB_NAME || 'mtg-local',
      collectionName: process.env.MONGO_COLLECTION || 'cards',
      clientOptions: {
        // Recommended options for MongoDB Atlas
        retryWrites: true,
        w: 'majority',
        appName: 'mtg-deck-analyzer',
      },
    });
  }

  console.log('Using Composite repository with DynamoDB cache and Scryfall API');
  // Build config objects with proper handling of undefined values
  const dynamoConfig: {
    tableName?: string;
    ttlSeconds?: number;
    region?: string;
  } = {
    tableName: process.env.DYNAMODB_TABLE || 'mtg-cards',
    ttlSeconds: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 604800, // 7 days
  };
  
  // Only add region if it's defined
  if (process.env.AWS_REGION) {
    dynamoConfig.region = process.env.AWS_REGION;
  }

  const scryfallConfig: {
    baseUrl?: string;
    timeout?: number;
  } = {
    timeout: process.env.SCRYFALL_TIMEOUT ? parseInt(process.env.SCRYFALL_TIMEOUT, 10) : 5000,
  };
  
  // Only add baseUrl if it's defined
  if (process.env.SCRYFALL_API_URL) {
    scryfallConfig.baseUrl = process.env.SCRYFALL_API_URL;
  }

  return new CompositeCardRepository({
    enableCache: true,
    dynamoConfig,
    scryfallConfig,
  });
}

/**
 * Get a singleton instance of the card repository
 */
let cardRepositoryInstance: ICardRepository | null = null;

export function getCardRepository(): ICardRepository {
  if (!cardRepositoryInstance) {
    cardRepositoryInstance = createCardRepository();
  }
  return cardRepositoryInstance;
}

/**
 * Close any active database connections
 */
export async function closeDatabaseConnections(): Promise<void> {
  if (cardRepositoryInstance && 'disconnect' in cardRepositoryInstance) {
    await (cardRepositoryInstance as any).disconnect();
  }
  cardRepositoryInstance = null;
}
