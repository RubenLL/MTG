import { CompositeCardRepository } from '../../../../src/infrastructure/repositories/CompositeCardRepository';
import { ScryfallCardRepository } from '../../../../src/infrastructure/repositories/ScryfallCardRepository';
import { DynamoDBCardRepository } from '../../../../src/infrastructure/repositories/DynamoDBCardRepository';
import { Card } from '../../../../src/domain/entities';

// Mock the dependencies
jest.mock('../../../../src/infrastructure/repositories/ScryfallCardRepository');
jest.mock('../../../../src/infrastructure/repositories/DynamoDBCardRepository');

const MockScryfallCardRepository = ScryfallCardRepository as jest.MockedClass<typeof ScryfallCardRepository>;
const MockDynamoDBCardRepository = DynamoDBCardRepository as jest.MockedClass<typeof DynamoDBCardRepository>;

describe('CompositeCardRepository', () => {
  let scryfallMock: jest.Mocked<ScryfallCardRepository>;
  let dynamoDbMock: jest.Mocked<DynamoDBCardRepository>;
  let repository: CompositeCardRepository;

  const mockCard: Card = {
    id: '123',
    name: 'Lightning Bolt',
    // Add other required Card properties
  } as Card;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create fresh mock instances
    scryfallMock = new MockScryfallCardRepository() as jest.Mocked<ScryfallCardRepository>;
    dynamoDbMock = new MockDynamoDBCardRepository() as jest.Mocked<DynamoDBCardRepository>;
    
    // Set up default mock implementations
    scryfallMock.findByName.mockResolvedValue(undefined);
    dynamoDbMock.findByName.mockResolvedValue(undefined);
    dynamoDbMock.saveCard.mockResolvedValue();
  });

  describe('with cache enabled', () => {
    beforeEach(() => {
      repository = new CompositeCardRepository({
        enableCache: true,
        dynamoConfig: {
          tableName: 'test-table',
          ttlSeconds: 3600,
        },
      });
      
      // Replace the private properties with our mocks for testing
      (repository as any).scryfall = scryfallMock;
      (repository as any).cache = dynamoDbMock;
    });

    it('should return card from cache if available', async () => {
      // Arrange
      dynamoDbMock.findByName.mockResolvedValueOnce(mockCard);

      // Act
      const result = await repository.findByName('Lightning Bolt');

      // Assert
      expect(result).toEqual(mockCard);
      expect(dynamoDbMock.findByName).toHaveBeenCalledWith('Lightning Bolt');
      expect(scryfallMock.findByName).not.toHaveBeenCalled();
    });

    it('should fall back to Scryfall if not in cache', async () => {
      // Arrange
      scryfallMock.findByName.mockResolvedValueOnce(mockCard);

      // Act
      const result = await repository.findByName('Lightning Bolt');

      // Assert
      expect(result).toEqual(mockCard);
      expect(dynamoDbMock.findByName).toHaveBeenCalledWith('Lightning Bolt');
      expect(scryfallMock.findByName).toHaveBeenCalledWith('Lightning Bolt');
    });

    it('should save Scryfall result to cache', async () => {
      // Arrange
      scryfallMock.findByName.mockResolvedValueOnce(mockCard);

      // Act
      await repository.findByName('Lightning Bolt');

      // Assert
      expect(dynamoDbMock.saveCard).toHaveBeenCalledWith(mockCard);
    });

    it('should handle cache errors gracefully', async () => {
      // Arrange
      const error = new Error('Cache error');
      dynamoDbMock.findByName.mockRejectedValueOnce(error);
      scryfallMock.findByName.mockResolvedValueOnce(mockCard);

      // Act & Assert
      await expect(repository.findByName('Lightning Bolt')).resolves.toEqual(mockCard);
      expect(console.warn).toHaveBeenCalledWith('Cache lookup failed, falling back to Scryfall:', expect.any(Error));
    });
  });

  describe('with cache disabled', () => {
    beforeEach(() => {
      repository = new CompositeCardRepository({
        enableCache: false,
      });
      
      // Replace the private property with our mock for testing
      (repository as any).scryfall = scryfallMock;
    });

    it('should not use cache when disabled', async () => {
      // Arrange
      scryfallMock.findByName.mockResolvedValueOnce(mockCard);

      // Act
      await repository.findByName('Lightning Bolt');

      // Assert
      expect(dynamoDbMock.findByName).not.toHaveBeenCalled();
      expect(scryfallMock.findByName).toHaveBeenCalledWith('Lightning Bolt');
    });
  });

  describe('searchByName', () => {
    beforeEach(() => {
      repository = new CompositeCardRepository({
        enableCache: true,
        dynamoConfig: {
          tableName: 'test-table',
        },
      });
      
      // Replace the private properties with our mocks for testing
      (repository as any).scryfall = scryfallMock;
      (repository as any).cache = dynamoDbMock;
    });

    it('should search Scryfall and cache results', async () => {
      // Arrange
      const mockResults = [mockCard];
      scryfallMock.searchByName.mockResolvedValueOnce(mockResults);

      // Act
      const results = await repository.searchByName('Lightning', 5);

      // Assert
      expect(results).toEqual(mockResults);
      expect(scryfallMock.searchByName).toHaveBeenCalledWith('Lightning', 5);
      expect(dynamoDbMock.saveCard).toHaveBeenCalledWith(mockCard);
    });

    it('should fall back to cache if Scryfall search fails', async () => {
      // Arrange
      const mockResults = [mockCard];
      const error = new Error('Scryfall error');
      scryfallMock.searchByName.mockRejectedValueOnce(error);
      dynamoDbMock.searchByName.mockResolvedValueOnce(mockResults);

      // Act
      const results = await repository.searchByName('Lightning', 5);

      // Assert
      expect(results).toEqual(mockResults);
      expect(console.warn).toHaveBeenCalledWith('Cache fallback for search failed:', expect.any(Error));
    });
  });
});
