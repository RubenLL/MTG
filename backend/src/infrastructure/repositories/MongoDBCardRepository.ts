import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { Card, CardColor, CardRarity } from '../../domain/entities';
import { ICardRepository } from '../../domain/cardValidation';

export interface MongoDBCardRepositoryConfig {
  /**
   * MongoDB connection string
   * @default 'mongodb://localhost:27017'
   */
  connectionString?: string;
  
  /**
   * Database name
   * @default 'mtgdb'
   */
  dbName?: string;
  
  /**
   * Collection name for cards
   * @default 'cards'
   */
  collectionName?: string;
  
  /**
   * Additional MongoDB client options
   */
  clientOptions?: MongoClientOptions;
}

/**
 * MongoDB implementation of ICardRepository for local development
 */
export class MongoDBCardRepository implements ICardRepository {
  private client: MongoClient;
  private collection: Collection<Card>;
  private dbName: string;
  private collectionName: string;
  private isConnected: boolean = false;

  constructor(config: MongoDBCardRepositoryConfig = {}) {
    const {
      connectionString = 'mongodb://localhost:27017',
      dbName = 'mtgdb',
      collectionName = 'cards',
      clientOptions = {}
    } = config;

    this.client = new MongoClient(connectionString, {
      ...clientOptions,
      // Recommended connection settings
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.collection = this.client.db(this.dbName).collection(this.collectionName);
    
    // Set up connection handling
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers(): void {
    this.client.on('connectionReady', () => {
      this.isConnected = true;
      console.log('MongoDB connection established');
    });

    this.client.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      console.log('MongoDB connection closed');
      this.isConnected = false;
    });
  }

  /**
   * Ensure connection to MongoDB
   */
  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.collection = this.client.db(this.dbName).collection(this.collectionName);
        this.isConnected = true;
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Database connection failed');
      }
    }
  }

  /**
   * Find a card by exact name match (case insensitive)
   */
  async findByName(name: string): Promise<Card | undefined> {
    try {
      await this.ensureConnected();
      
      const result = await this.collection.findOne<Card>(
        { name: { $regex: `^${name}$`, $options: 'i' } },
        { projection: { _id: 0 } } // Exclude MongoDB's _id from results
      );
      
      return result || undefined;
    } catch (error) {
      console.error('Error finding card by name:', error);
      throw error;
    }
  }

  /**
   * Search for cards by name with fuzzy matching
   */
  /**
   * Find a card by its ID
   * @param id - The ID of the card to find
   * @returns Promise that resolves to the card if found, or undefined if not found
   */
  async findById(id: string): Promise<Card | undefined> {
    try {
      await this.ensureConnected();
      
      const result = await this.collection.findOne<Card>(
        { id },
        { projection: { _id: 0 } } // Exclude MongoDB's _id from results
      );
      
      return result || undefined;
    } catch (error) {
      console.error('Error finding card by ID:', error);
      throw error;
    }
  }

  /**
   * Search for cards by name with fuzzy matching
   */
  async searchByName(query: string, limit: number = 5): Promise<Card[]> {
    try {
      await this.ensureConnected();
      
      // Define the projection to explicitly include all Card properties
      const projection = {
        _id: 0, // Exclude MongoDB's _id
        id: 1,
        name: 1,
        // Include all other Card properties
        convertedManaCost: 1,
        colors: 1,
        type: 1,
        rarity: 1,
        set: 1,
        imageUri: 1,
        isSideboard: 1,
        // Add other Card properties as needed
      } as const;
      
      const results = await this.collection
        .find<Card>({ 
          name: { $regex: query, $options: 'i' } 
        })
        .project<Card>(projection)
        .limit(limit)
        .toArray();
        
      // Cast the results to Card[] since we've ensured the shape matches
      return results as Card[];
    } catch (error) {
      console.error('Error searching cards:', error);
      throw error;
    }
  }

  /**
   * Save or update a card in the database
   */
  async saveCard(card: Card): Promise<void> {
    try {
      await this.ensureConnected();
      
      await this.collection.updateOne(
        { id: card.id },
        { $set: card },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error saving card:', error);
      throw error;
    }
  }

  /**
   * Close the MongoDB connection
   */
  async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.client.close();
        this.isConnected = false;
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Create necessary indexes for better query performance
   */
  async createIndexes(): Promise<void> {
    try {
      await this.ensureConnected();
      
      await this.collection.createIndex(
        { name: 'text' }, // Text index for text search
        { default_language: 'english' }
      );
      
      await this.collection.createIndex(
        { id: 1 }, // Unique index on card ID
        { unique: true }
      );
      
      await this.collection.createIndex(
        { name: 1 } // Index for case-insensitive search
      );
      
      console.log('MongoDB indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw error;
    }
  }
}
