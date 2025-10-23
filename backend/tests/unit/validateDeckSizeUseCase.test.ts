// Unit tests for ValidateDeckSizeUseCase
import { beforeEach, afterEach, describe, it, expect, jest } from '@jest/globals';
import { ValidateDeckSizeUseCase, createValidateDeckSizeUseCase } from '../src/application/useCases/validateDeckSize';
import { MTGFormat, ValidationErrorCode } from '../src/domain';

describe('ValidateDeckSizeUseCase', () => {
  let useCase: ValidateDeckSizeUseCase;

  beforeEach(() => {
    useCase = createValidateDeckSizeUseCase();
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should validate a correct Modern deck successfully', async () => {
      const input = {
        deckList: [
          { cardName: 'Lightning Bolt', quantity: 4 },
          { cardName: 'Island', quantity: 20 },
          { cardName: 'Opt', quantity: 4 },
          { cardName: 'Delver of Secrets', quantity: 4 },
          { cardName: 'Monastery Swiftspear', quantity: 4 },
          { cardName: 'Treasure Cruise', quantity: 4 },
          { cardName: 'Spell Pierce', quantity: 4 },
          { cardName: 'Daze', quantity: 4 },
          { cardName: 'Wasteland', quantity: 4 }
        ],
        format: MTGFormat.MODERN,
        includeSideboard: false
      };

      const result = await useCase.execute(input);

      expect(result.isValid).toBe(true);
      expect(result.currentCount).toBe(60);
      expect(result.format).toBe(MTGFormat.MODERN);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject a deck with too few cards', async () => {
      const input = {
        deckList: [
          { cardName: 'Lightning Bolt', quantity: 4 },
          { cardName: 'Island', quantity: 20 }
        ],
        format: MTGFormat.MODERN,
        includeSideboard: false
      };

      const result = await useCase.execute(input);

      expect(result.isValid).toBe(false);
      expect(result.currentCount).toBe(24);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe(ValidationErrorCode.DECK_SIZE_TOO_SMALL);
    });

    it('should validate Commander deck correctly', async () => {
      const input = {
        deckList: Array.from({ length: 100 }, (_, i) => ({
          cardName: `Card ${i + 1}`,
          quantity: 1
        })),
        format: MTGFormat.COMMANDER,
        includeSideboard: false
      };

      const result = await useCase.execute(input);

      expect(result.isValid).toBe(true);
      expect(result.currentCount).toBe(100);
      expect(result.format).toBe(MTGFormat.COMMANDER);
    });

    it('should handle request ID for tracing', async () => {
      const input = {
        deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
        format: MTGFormat.MODERN,
        includeSideboard: false
      };
      const requestId = 'test-request-123';

      const result = await useCase.execute(input, requestId);

      // Should not throw and should return a result
      expect(result).toBeDefined();
      expect(result.isValid).toBe(false); // 4 cards is less than 60 for Modern
    });

    it('should handle errors gracefully', async () => {
      // Test with invalid format to trigger error handling
      const input = {
        deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
        format: 'invalid_format' as MTGFormat,
        includeSideboard: false
      };

      const result = await useCase.execute(input);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ValidationErrorCode.INVALID_FORMAT);
    });

    it('should log validation events', async () => {
      const input = {
        deckList: [
          { cardName: 'Lightning Bolt', quantity: 4 },
          { cardName: 'Island', quantity: 20 }
        ],
        format: MTGFormat.MODERN,
        includeSideboard: false
      };

      await useCase.execute(input);

      // Verify console.log was called for start and result
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Starting deck size validation')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Deck validation failed')
      );
    });

    it('should handle console.error for unexpected errors', async () => {
      // Test error handling by providing invalid data that will cause domain validation to fail
      const input = {
        deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
        format: 'invalid_format' as any,
        includeSideboard: false
      };

      // Should handle the error gracefully
      const result = await useCase.execute(input);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe(ValidationErrorCode.INVALID_FORMAT);
    });
  });

  describe('factory function', () => {
    it('should create a new use case instance', () => {
      const instance1 = createValidateDeckSizeUseCase();
      const instance2 = createValidateDeckSizeUseCase();

      expect(instance1).toBeInstanceOf(ValidateDeckSizeUseCase);
      expect(instance2).toBeInstanceOf(ValidateDeckSizeUseCase);
      expect(instance1).not.toBe(instance2); // Different instances
    });
  });
});
