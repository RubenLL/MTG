// Unit tests for deck size validation domain logic
import {
  validateDeckSize,
  calculateDeckCounts,
  FORMAT_REQUIREMENTS,
  MTGFormat,
  ValidationErrorCode
} from '../src/domain';

describe('Deck Size Validation Domain Logic', () => {
  describe('calculateDeckCounts', () => {
    it('should correctly calculate main deck and sideboard counts', () => {
      const deckList = [
        { cardName: 'Lightning Bolt', quantity: 4, isSideboard: false },
        { cardName: 'Island', quantity: 20, isSideboard: false },
        { cardName: 'Rest in Peace', quantity: 2, isSideboard: true },
        { cardName: 'Grafdigger\'s Cage', quantity: 1, isSideboard: true }
      ];

      const result = calculateDeckCounts(deckList);

      expect(result.mainDeckCount).toBe(24);
      expect(result.sideboardCount).toBe(3);
    });

    it('should handle empty deck list', () => {
      const result = calculateDeckCounts([]);

      expect(result.mainDeckCount).toBe(0);
      expect(result.sideboardCount).toBe(0);
    });

    it('should handle deck with no sideboard', () => {
      const deckList = [
        { cardName: 'Lightning Bolt', quantity: 4 },
        { cardName: 'Island', quantity: 20 }
      ];

      const result = calculateDeckCounts(deckList);

      expect(result.mainDeckCount).toBe(24);
      expect(result.sideboardCount).toBe(0);
    });

    it('should handle deck with only sideboard', () => {
      const deckList = [
        { cardName: 'Rest in Peace', quantity: 2, isSideboard: true },
        { cardName: 'Grafdigger\'s Cage', quantity: 1, isSideboard: true }
      ];

      const result = calculateDeckCounts(deckList);

      expect(result.mainDeckCount).toBe(0);
      expect(result.sideboardCount).toBe(3);
    });
  });

  describe('validateDeckSize', () => {
    describe('Modern format validation', () => {
      it('should validate correct 60-card Modern deck', () => {
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

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(true);
        expect(result.currentCount).toBe(60);
        expect(result.format).toBe(MTGFormat.MODERN);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject Modern deck with too few cards', () => {
        const input = {
          deckList: [
            { cardName: 'Lightning Bolt', quantity: 4 },
            { cardName: 'Island', quantity: 20 }
          ],
          format: MTGFormat.MODERN,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(false);
        expect(result.currentCount).toBe(24);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(ValidationErrorCode.DECK_SIZE_TOO_SMALL);
        expect(result.errors[0].message).toContain('at least 60 cards');
      });
    });

    describe('Commander format validation', () => {
      it('should validate correct 100-card Commander deck', () => {
        const input = {
          deckList: Array.from({ length: 100 }, (_, i) => ({
            cardName: `Card ${i + 1}`,
            quantity: 1
          })),
          format: MTGFormat.COMMANDER,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(true);
        expect(result.currentCount).toBe(100);
        expect(result.format).toBe(MTGFormat.COMMANDER);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject Commander deck with 99 cards', () => {
        const input = {
          deckList: Array.from({ length: 99 }, (_, i) => ({
            cardName: `Card ${i + 1}`,
            quantity: 1
          })),
          format: MTGFormat.COMMANDER,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(false);
        expect(result.currentCount).toBe(99);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(ValidationErrorCode.DECK_SIZE_TOO_SMALL);
      });

      it('should reject Commander deck with 101 cards', () => {
        const input = {
          deckList: Array.from({ length: 101 }, (_, i) => ({
            cardName: `Card ${i + 1}`,
            quantity: 1
          })),
          format: MTGFormat.COMMANDER,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(false);
        expect(result.currentCount).toBe(101);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(ValidationErrorCode.DECK_SIZE_TOO_LARGE);
      });

      it('should validate Commander deck with sideboard up to 10 cards', () => {
        const input = {
          deckList: [
            ...Array.from({ length: 100 }, (_, i) => ({
              cardName: `Main Card ${i + 1}`,
              quantity: 1,
              isSideboard: false
            })),
            ...Array.from({ length: 10 }, (_, i) => ({
              cardName: `Sideboard Card ${i + 1}`,
              quantity: 1,
              isSideboard: true
            }))
          ],
          format: MTGFormat.COMMANDER,
          includeSideboard: true
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(true);
        expect(result.currentCount).toBe(100);
        expect(result.validationDetails.sideboardCount).toBe(10);
      });

      it('should reject Commander deck with sideboard over 10 cards', () => {
        const input = {
          deckList: [
            ...Array.from({ length: 100 }, (_, i) => ({
              cardName: `Main Card ${i + 1}`,
              quantity: 1,
              isSideboard: false
            })),
            ...Array.from({ length: 11 }, (_, i) => ({
              cardName: `Sideboard Card ${i + 1}`,
              quantity: 1,
              isSideboard: true
            }))
          ],
          format: MTGFormat.COMMANDER,
          includeSideboard: true
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(ValidationErrorCode.SIDEBBOARD_SIZE_INVALID);
      });
    });

    describe('Limited format validation', () => {
      it('should validate correct 40-card Draft deck', () => {
        const input = {
          deckList: Array.from({ length: 40 }, (_, i) => ({
            cardName: `Draft Card ${i + 1}`,
            quantity: 1
          })),
          format: MTGFormat.DRAFT,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(true);
        expect(result.currentCount).toBe(40);
        expect(result.format).toBe(MTGFormat.DRAFT);
      });

      it('should reject Draft deck with too few cards', () => {
        const input = {
          deckList: [
            { cardName: 'Lightning Bolt', quantity: 4 },
            { cardName: 'Island', quantity: 20 }
          ],
          format: MTGFormat.DRAFT,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(false);
        expect(result.currentCount).toBe(24);
        expect(result.errors[0].code).toBe(ValidationErrorCode.DECK_SIZE_TOO_SMALL);
      });
    });

    describe('Invalid format handling', () => {
      it('should reject unsupported format', () => {
        const input = {
          deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
          format: 'invalid_format' as MTGFormat,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].code).toBe(ValidationErrorCode.INVALID_FORMAT);
      });
    });

    describe('Sideboard validation', () => {
      it('should validate Modern deck with sideboard when includeSideboard is true', () => {
        const input = {
          deckList: [
            ...Array.from({ length: 60 }, (_, i) => ({
              cardName: `Main Card ${i + 1}`,
              quantity: 1,
              isSideboard: false
            })),
            ...Array.from({ length: 15 }, (_, i) => ({
              cardName: `Sideboard Card ${i + 1}`,
              quantity: 1,
              isSideboard: true
            }))
          ],
          format: MTGFormat.MODERN,
          includeSideboard: true
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(true);
        expect(result.validationDetails.sideboardCount).toBe(15);
      });

      it('should reject Modern deck with sideboard over 15 cards', () => {
        const input = {
          deckList: [
            ...Array.from({ length: 60 }, (_, i) => ({
              cardName: `Main Card ${i + 1}`,
              quantity: 1,
              isSideboard: false
            })),
            ...Array.from({ length: 16 }, (_, i) => ({
              cardName: `Sideboard Card ${i + 1}`,
              quantity: 1,
              isSideboard: true
            }))
          ],
          format: MTGFormat.MODERN,
          includeSideboard: true
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(false);
        expect(result.errors[0].code).toBe(ValidationErrorCode.SIDEBBOARD_SIZE_INVALID);
      });

      it('should ignore sideboard when includeSideboard is false', () => {
        const input = {
          deckList: [
            ...Array.from({ length: 60 }, (_, i) => ({
              cardName: `Main Card ${i + 1}`,
              quantity: 1,
              isSideboard: false
            })),
            ...Array.from({ length: 20 }, (_, i) => ({
              cardName: `Sideboard Card ${i + 1}`,
              quantity: 1,
              isSideboard: true
            }))
          ],
          format: MTGFormat.MODERN,
          includeSideboard: false
        };

        const result = validateDeckSize(input);

        expect(result.isValid).toBe(true);
        expect(result.validationDetails.sideboardCount).toBe(20);
      });
    });

    describe('Format requirements configuration', () => {
      it('should have all required formats configured', () => {
        const expectedFormats = [
          MTGFormat.STANDARD,
          MTGFormat.MODERN,
          MTGFormat.PIONEER,
          MTGFormat.COMMANDER,
          MTGFormat.LEGACY,
          MTGFormat.VINTAGE,
          MTGFormat.PAUPER,
          MTGFormat.DRAFT,
          MTGFormat.SEALED
        ];

        expectedFormats.forEach(format => {
          expect(FORMAT_REQUIREMENTS[format]).toBeDefined();
          expect(FORMAT_REQUIREMENTS[format].minDeckSize).toBeGreaterThan(0);
          expect(FORMAT_REQUIREMENTS[format].description).toBeTruthy();
        });
      });

      it('should have correct requirements for each format', () => {
        expect(FORMAT_REQUIREMENTS[MTGFormat.COMMANDER].minDeckSize).toBe(100);
        expect(FORMAT_REQUIREMENTS[MTGFormat.COMMANDER].maxDeckSize).toBe(100);

        expect(FORMAT_REQUIREMENTS[MTGFormat.MODERN].minDeckSize).toBe(60);
        expect(FORMAT_REQUIREMENTS[MTGFormat.MODERN].maxDeckSize).toBe(null);

        expect(FORMAT_REQUIREMENTS[MTGFormat.DRAFT].minDeckSize).toBe(40);
        expect(FORMAT_REQUIREMENTS[MTGFormat.DRAFT].maxDeckSize).toBe(null);
      });
    });
  });
});
