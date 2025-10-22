# US-001b: Backend Requirements - Deck Size Validation

## Objetivo
Implementar la API backend para validación de tamaño de deck con manejo robusto de errores y logging completo.

## Descripción Funcional
Como desarrollador backend, necesito crear un servicio API que valide el tamaño de decks de MTG según las reglas de cada formato, con respuestas consistentes y logging detallado para debugging y monitoreo.

## API Specification

### **Endpoint**
```
POST /api/validate-deck-size
Content-Type: application/json
```

### **Request Format**
```json
{
  "deckList": [
    {
      "cardName": "Lightning Bolt",
      "quantity": 4,
      "isSideboard": false
    },
    {
      "cardName": "Island",
      "quantity": 20,
      "isSideboard": false
    }
  ],
  "format": "modern",
  "includeSideboard": true,
  "analysisId": "optional-tracking-id"
}
```

### **Response Formats**

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "currentCount": 60,
    "validRange": {
      "min": 60,
      "max": null
    },
    "format": "modern",
    "validationDetails": {
      "mainDeckCount": 60,
      "sideboardCount": 15,
      "totalCards": 75,
      "formatRequirements": "Minimum 60 cards in main deck, maximum 15 in sideboard"
    }
  },
  "requestId": "req_abc123def456",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": {
    "code": "DECK_SIZE_TOO_SMALL",
    "type": "VALIDATION_ERROR",
    "message": "Invalid deck size for Modern format",
    "details": {
      "format": "modern",
      "expectedMin": 60,
      "expectedMax": null,
      "actual": 45,
      "field": "mainDeck"
    },
    "validationErrors": [
      {
        "field": "deckSize",
        "code": "MIN_SIZE_VIOLATION",
        "message": "Deck must contain at least 60 cards in Modern format"
      }
    ],
    "retryable": false
  },
  "requestId": "req_xyz789ghi012",
  "timestamp": "2024-01-15T10:35:22.456Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

## Backend Implementation

### **TypeScript Service Class**
```typescript
// TypeScript - Deck Validation Service
export class DeckValidationService {
  async validateDeckSize(request: ValidationRequest): Promise<ValidationResponse> {
    const requestId = this.generateRequestId();

    try {
      // Input validation
      const inputValidation = await this.validateInput(request);
      if (!inputValidation.isValid) {
        return this.createErrorResponse(
          HttpStatusCode.BAD_REQUEST,
          BusinessErrorCode.INVALID_REQUEST_FORMAT,
          'Invalid request format',
          { validationErrors: inputValidation.errors },
          requestId,
          false
        );
      }

      // Parse deck list
      const deckAnalysis = await this.analyzeDeckList(request.body.deckList);

      // Format-specific validation
      const formatRules = this.getFormatRules(request.body.format);
      const validationResult = this.validateAgainstRules(deckAnalysis, formatRules);

      if (!validationResult.isValid) {
        return this.createErrorResponse(
          HttpStatusCode.UNPROCESSABLE_ENTITY,
          validationResult.errorCode,
          validationResult.message,
          validationResult.details,
          requestId,
          false
        );
      }

      // Success response
      return this.createSuccessResponse(validationResult, requestId);

    } catch (error) {
      return this.handleUnexpectedError(error, requestId);
    }
  }

  private async analyzeDeckList(deckList: CardEntry[]): Promise<DeckAnalysis> {
    const mainDeck = deckList.filter(card => !card.isSideboard);
    const sideboard = deckList.filter(card => card.isSideboard);

    return {
      mainDeckCount: mainDeck.reduce((sum, card) => sum + card.quantity, 0),
      sideboardCount: sideboard.reduce((sum, card) => sum + card.quantity, 0),
      uniqueCards: [...new Set(deckList.map(card => card.cardName))].length,
      cardsByType: this.categorizeCards(deckList),
    };
  }

  private validateAgainstRules(analysis: DeckAnalysis, rules: FormatRules): ValidationResult {
    const errors: ValidationError[] = [];

    // Main deck validation
    if (analysis.mainDeckCount < rules.minMainDeck) {
      errors.push({
        field: 'mainDeck',
        code: 'DECK_SIZE_TOO_SMALL',
        message: `Main deck must contain at least ${rules.minMainDeck} cards`,
        expected: rules.minMainDeck,
        actual: analysis.mainDeckCount,
      });
    }

    if (rules.maxMainDeck && analysis.mainDeckCount > rules.maxMainDeck) {
      errors.push({
        field: 'mainDeck',
        code: 'DECK_SIZE_TOO_LARGE',
        message: `Main deck cannot exceed ${rules.maxMainDeck} cards`,
        expected: rules.maxMainDeck,
        actual: analysis.mainDeckCount,
      });
    }

    // Sideboard validation
    if (analysis.sideboardCount > rules.maxSideboard) {
      errors.push({
        field: 'sideboard',
        code: 'SIDEBOARD_TOO_LARGE',
        message: `Sideboard cannot exceed ${rules.maxSideboard} cards`,
        expected: rules.maxSideboard,
        actual: analysis.sideboardCount,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      errorCode: errors.length > 0 ? this.getPrimaryErrorCode(errors) : null,
      message: errors.length > 0 ? this.formatErrorMessage(errors) : 'Deck size is valid',
      details: {
        mainDeckCount: analysis.mainDeckCount,
        sideboardCount: analysis.sideboardCount,
        format: rules.name,
        requirements: rules.description,
      }
    };
  }
}
```

### **Format Rules Configuration**
```typescript
// TypeScript - Format rules definition
interface FormatRules {
  name: string;
  minMainDeck: number;
  maxMainDeck: number | null;
  maxSideboard: number;
  description: string;
}

const FORMAT_RULES: Record<string, FormatRules> = {
  'standard': {
    name: 'Standard',
    minMainDeck: 60,
    maxMainDeck: null,
    maxSideboard: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  'modern': {
    name: 'Modern',
    minMainDeck: 60,
    maxMainDeck: null,
    maxSideboard: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  'commander': {
    name: 'Commander',
    minMainDeck: 100,
    maxMainDeck: 100,
    maxSideboard: 10,
    description: 'Exactly 100 cards including commander, maximum 10 in sideboard'
  },
  'legacy': {
    name: 'Legacy',
    minMainDeck: 60,
    maxMainDeck: null,
    maxSideboard: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  'vintage': {
    name: 'Vintage',
    minMainDeck: 60,
    maxMainDeck: null,
    maxSideboard: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  'pauper': {
    name: 'Pauper',
    minMainDeck: 60,
    maxMainDeck: null,
    maxSideboard: 15,
    description: 'Minimum 60 cards in main deck, maximum 15 in sideboard'
  },
  'draft': {
    name: 'Draft',
    minMainDeck: 40,
    maxMainDeck: null,
    maxSideboard: 0,
    description: 'Minimum 40 cards in main deck, no sideboard'
  },
  'sealed': {
    name: 'Sealed',
    minMainDeck: 40,
    maxMainDeck: null,
    maxSideboard: 0,
    description: 'Minimum 40 cards in main deck, no sideboard'
  }
};
```

### **Input Validation**
```typescript
// TypeScript - Input validation schemas
const validationSchemas = {
  deckList: Joi.array().items(
    Joi.object({
      cardName: Joi.string().required().min(1).max(200),
      quantity: Joi.number().integer().min(1).max(4).default(1),
      isSideboard: Joi.boolean().default(false),
    })
  ).min(1).required(),

  format: Joi.string().valid(
    'standard', 'modern', 'commander', 'legacy', 'vintage', 'pauper', 'draft', 'sealed'
  ).required(),

  includeSideboard: Joi.boolean().default(true),
  analysisId: Joi.string().optional(),
};
```

### **Error Handling & Logging**
```typescript
// TypeScript - Comprehensive error handling
export class ApiError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public errorCode: BusinessErrorCode,
    public message: string,
    public details: any = {},
    public retryable: boolean = false,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class DeckValidationError extends ApiError {
  constructor(code: BusinessErrorCode, format: string, expected: number, actual: number) {
    const messages = {
      [BusinessErrorCode.DECK_SIZE_TOO_SMALL]: `Deck size (${actual}) is below minimum (${expected}) for ${format}`,
      [BusinessErrorCode.DECK_SIZE_TOO_LARGE]: `Deck size (${actual}) exceeds maximum (${expected}) for ${format}`,
      [BusinessErrorCode.INVALID_FORMAT]: `Format '${format}' is not supported`,
    };

    super(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      code,
      messages[code],
      { format, expected, actual },
      false
    );
  }
}
```

## Criterios de Aceptación Backend

- [ ] API endpoint responde correctamente a requests válidos
- [ ] Validación precisa para todos los formatos soportados
- [ ] Manejo robusto de errores con códigos HTTP apropiados
- [ ] Logging estructurado para todas las operaciones
- [ ] Request correlation IDs para debugging
- [ ] Performance: < 100ms para validaciones simples
- [ ] Input validation y sanitization
- [ ] Response format consistente

## Testing Requirements

### **Unit Tests**
- Deck parsing logic
- Format validation rules
- Error response generation
- Input sanitization

### **Integration Tests**
- API endpoint functionality
- Database interactions (si aplica)
- External API calls (si aplica)

### **Performance Tests**
- Load testing con múltiples requests simultáneos
- Memory usage validation
- Response time benchmarks

### **Error Scenario Tests**
- Invalid input formats
- Network failures
- Database timeouts
- External API failures
