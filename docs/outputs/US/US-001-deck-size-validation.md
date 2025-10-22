# US-001: Total Card Count Validation

## Objective

Validate that the deck contains the correct number of cards according to the selected format.

## Functional Description

As an MTG player, I want the system to automatically verify if my deck has the correct number of cards according to the rules of the format I'm playing, to avoid basic errors that would invalidate my deck.

## Detailed Inputs and Outputs (API/JSON)

**Input JSON Format:**
```json
{
  "deckList": [
    {
      "cardName": "Lightning Bolt",
      "quantity": 4
    },
    {
      "cardName": "Island",
      "quantity": 20
    },
    {
      "cardName": "Opt",
      "quantity": 3
    }
  ],
  "format": "modern",
  "includeSideboard": false,
  "mainDeckOnly": true
}
```

**Output JSON Format:**
```json
{
  "isValid": true,
  "currentCount": 60,
  "validRange": {
    "min": 60,
    "max": null
  },
  "format": "modern",
  "message": "Deck size is valid for Modern format",
  "validationDetails": {
    "mainDeckCount": 60,
    "sideboardCount": 15,
    "totalCards": 75,
    "formatRequirements": "Minimum 60 cards in main deck"
  },
  "errors": []
}
```

**Invalid Input JSON - Error Example:**
```json
{
  "isValid": false,
  "currentCount": 45,
  "validRange": {
    "min": 60,
    "max": null
  },
  "format": "modern",
  "message": "Invalid deck size: 45 cards. Modern requires minimum 60 cards in main deck.",
  "validationDetails": {
    "mainDeckCount": 45,
    "sideboardCount": 0,
    "totalCards": 45,
    "formatRequirements": "Minimum 60 cards in main deck"
  },
  "errors": [
    {
      "type": "DECK_SIZE_TOO_SMALL",
      "field": "mainDeck",
      "expected": 60,
      "actual": 45
    }
  ]
}
```

## Validation Logic

1. Count the total number of cards in the list
2. Compare against format requirements:
   - **Standard/Modern/Pioneer:** 60 cards minimum (main deck)
   - **Commander:** 100 cards exactly (including commander)
   - **Legacy/Vintage:** 60 cards minimum
   - **Pauper:** 60 cards minimum
   - **Limited (Draft/Sealed):** 40 cards minimum
3. Verify that it doesn't exceed maximum limits where applicable
4. Exclude sideboard from main deck count (15 cards maximum)

## Technical Data Formats

### **Input Format (JSON)**
The system expects to receive the card list in JSON format with the following structure:

```json
{
  "deckList": [
    {
      "cardName": "string",     // Exact card name
      "quantity": "number",     // Number of copies (1-4 for constructed)
      "isSideboard": "boolean"  // Optional, false by default
    }
  ],
  "format": "string",           // Format: "standard", "modern", "commander", etc.
  "includeSideboard": "boolean", // Whether to validate sideboard as well
  "analysisId": "string"        // Optional, for tracking
}
```

**Input Example:**
```json
{
  "deckList": [
    {"cardName": "Lightning Bolt", "quantity": 4},
    {"cardName": "Island", "quantity": 20, "isSideboard": false},
    {"cardName": "Opt", "quantity": 3}
  ],
  "format": "modern",
  "includeSideboard": true
}
```

### **Output Format (JSON)**
The validation response follows this structured format:

```json
{
  "isValid": "boolean",         // true if the deck meets requirements
  "currentCount": "number",     // Total number of cards in main deck
  "validRange": {
    "min": "number",            // Minimum required for the format
    "max": "number | null"      // Maximum allowed (null if no limit)
  },
  "format": "string",           // Analyzed format
  "message": "string",          // Descriptive result message
  "validationDetails": {
    "mainDeckCount": "number",  // Cards in main deck
    "sideboardCount": "number", // Cards in sideboard
    "totalCards": "number",     // Total including sideboard
    "formatRequirements": "string" // Format requirements description
  },
  "errors": [
    {
      "type": "string",         // Error type: DECK_SIZE_TOO_SMALL, DECK_SIZE_TOO_LARGE
      "field": "string",        // Field that failed: mainDeck, sideboard
      "expected": "number",     // Expected value
      "actual": "number"        // Actual value
    }
  ]
}
```

**Valid Output Example:**
```json
{
  "isValid": true,
  "currentCount": 60,
  "validRange": {"min": 60, "max": null},
  "format": "modern",
  "message": "Deck size is valid for Modern format",
  "validationDetails": {
    "mainDeckCount": 60,
    "sideboardCount": 15,
    "totalCards": 75,
    "formatRequirements": "Minimum 60 cards in main deck, maximum 15 in sideboard"
  },
  "errors": []
}
```

**Output Example with Error:**
```json
{
  "isValid": false,
  "currentCount": 45,
  "validRange": {"min": 60, "max": null},
  "format": "modern",
  "message": "Invalid deck size: 45 cards. Modern requires minimum 60 cards in main deck.",
  "validationDetails": {
    "mainDeckCount": 45,
    "sideboardCount": 0,
    "totalCards": 45,
    "formatRequirements": "Minimum 60 cards in main deck, maximum 15 in sideboard"
  },
  "errors": [
    {
      "type": "DECK_SIZE_TOO_SMALL",
      "field": "mainDeck",
      "expected": 60,
      "actual": 45
    }
  ]
}
```

### **Input Validation**
- **deckList**: Required array, minimum 1 card
- **format**: Required string, must be a valid format
- **cardName**: Required string, validated against card database
- **quantity**: Required number (1-4 for constructed, 1-100 for commander)
- **isSideboard**: Optional boolean, default false

### **Supported Formats**
- `"standard"`, `"modern"`, `"pioneer"`: 60 cards minimum
- `"commander"`: 100 cards exactly (including commander)
- `"legacy"`, `"vintage"`: 60 cards minimum
- `"pauper"`: 60 cards minimum
- `"draft"`, `"sealed"`: 40 cards minimum

## Priority

High - Fundamental feature for any deck analysis.

## Implementation Considerations

### **Backend (TypeScript/AWS Lambda)**
- **Endpoint:** `POST /api/validate-deck-size`
- **Validation:** Use libraries like Joi or Zod to validate JSON input
- **Error Handling:** Handle JSON parsing errors and invalid data
- **Performance:** O(n) operation where n is number of cards in deck
- **Caching:** Not necessary for this simple validation

### **HTTP Status Codes and Error Response Format**

#### **Standard HTTP Codes**

```typescript
// TypeScript - HTTP Status Codes
enum HttpStatusCode {
  // Success
  OK = 200,
  CREATED = 201,

  // Client Errors (4xx)
  BAD_REQUEST = 400,           // Invalid request format/syntax
  UNAUTHORIZED = 401,          // Authentication required
  FORBIDDEN = 403,             // Access denied
  NOT_FOUND = 404,             // Resource not found
  METHOD_NOT_ALLOWED = 405,    // HTTP method not supported
  CONFLICT = 409,              // Business rule violation
  UNPROCESSABLE_ENTITY = 422,  // Validation failed
  TOO_MANY_REQUESTS = 429,     // Rate limiting

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 500,     // Unexpected server error
  NOT_IMPLEMENTED = 501,           // Feature not implemented
  BAD_GATEWAY = 502,               // External service error
  SERVICE_UNAVAILABLE = 503,       // Service temporarily unavailable
  GATEWAY_TIMEOUT = 504            // External service timeout
}
```

#### **General Error Response Format**

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
    ]
  },
  "requestId": "req_abc123def456",
  "timestamp": "2024-01-15T10:35:22.456Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

#### **Detailed Error Structure**

```typescript
// TypeScript - Error Response Interface
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;              // Business error code (e.g., "DECK_SIZE_TOO_SMALL")
    type: ErrorType;           // Category: VALIDATION, BUSINESS, SYSTEM
    message: string;           // User-friendly message
    details: Record<string, any>; // Specific error details
    validationErrors?: ValidationError[]; // Field-level validation errors
    retryable: boolean;        // Whether client should retry
    retryAfter?: number;       // Seconds to wait before retry (for 429, 503)
  };
  requestId: string;           // Request correlation ID
  timestamp: string;           // ISO 8601 timestamp
  path: string;                // API endpoint
  method: string;              // HTTP method
}
```

#### **Specific Business Error Codes**

```typescript
// TypeScript - Business Error Codes
enum BusinessErrorCode {
  // Validation Errors (400)
  DECK_SIZE_TOO_SMALL = 'DECK_SIZE_TOO_SMALL',
  DECK_SIZE_TOO_LARGE = 'DECK_SIZE_TOO_LARGE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_CARD_NAME = 'INVALID_CARD_NAME',
  INVALID_QUANTITY = 'INVALID_QUANTITY',
  DUPLICATE_CARDS_EXCEEDED = 'DUPLICATE_CARDS_EXCEEDED',

  // Business Logic Errors (409, 422)
  FORMAT_NOT_SUPPORTED = 'FORMAT_NOT_SUPPORTED',
  CARDS_NOT_LEGAL = 'CARDS_NOT_LEGAL',
  BANNED_CARDS_DETECTED = 'BANNED_CARDS_DETECTED',
  RESTRICTED_CARDS_VIOLATION = 'RESTRICTED_CARDS_VIOLATION',

  // System Errors (500)
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  CARDS_DATABASE_UNAVAILABLE = 'CARDS_DATABASE_UNAVAILABLE',

  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Service Unavailable (503)
  SERVICE_TEMPORARILY_UNAVAILABLE = 'SERVICE_TEMPORARILY_UNAVAILABLE'
}
```

#### **Backend Error Handling Implementation**

```typescript
// TypeScript - Error Handling Implementation
class DeckValidationController {
  async validateDeckSize(request: ApiRequest): Promise<ApiResponse> {
    const requestId = generateRequestId();

    try {
      // Validate input format
      const validationResult = await this.validateInput(request.body);

      if (!validationResult.isValid) {
        return this.createErrorResponse(
          HttpStatusCode.BAD_REQUEST,
          BusinessErrorCode.INVALID_REQUEST_FORMAT,
          'Invalid request format',
          { validationErrors: validationResult.errors },
          requestId,
          false
        );
      }

      // Business logic validation
      const deckAnalysis = await this.analyzeDeck(request.body);

      if (!deckAnalysis.isValid) {
        return this.createErrorResponse(
          HttpStatusCode.UNPROCESSABLE_ENTITY,
          deckAnalysis.errorCode,
          deckAnalysis.message,
          deckAnalysis.details,
          requestId,
          false
        );
      }

      // Success response
      return this.createSuccessResponse(deckAnalysis, requestId);

    } catch (error) {
      return this.handleUnexpectedError(error, requestId);
    }
  }

  private createErrorResponse(
    statusCode: HttpStatusCode,
    errorCode: BusinessErrorCode,
    message: string,
    details: any,
    requestId: string,
    retryable: boolean
  ): ApiErrorResponse {
    const errorType = this.mapStatusCodeToErrorType(statusCode);

    return {
      success: false,
      error: {
        code: errorCode,
        type: errorType,
        message,
        details,
        retryable,
        retryAfter: this.getRetryAfter(statusCode)
      },
      requestId,
      timestamp: new Date().toISOString(),
      path: '/api/validate-deck-size',
      method: 'POST'
    };
  }

  private mapStatusCodeToErrorType(statusCode: HttpStatusCode): ErrorType {
    if (statusCode >= 400 && statusCode < 500) {
      return statusCode === 401 || statusCode === 403 ? ErrorType.AUTHENTICATION :
             statusCode === 409 || statusCode === 422 ? ErrorType.BUSINESS :
             ErrorType.VALIDATION;
    }
    return ErrorType.SYSTEM;
  }
}
```

#### **Error Response Examples by Scenario**

**1. Deck Size Too Small (422):**
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
  "requestId": "req_abc123def456",
  "timestamp": "2024-01-15T10:35:22.456Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

**2. Invalid Format (400):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FORMAT",
    "type": "VALIDATION_ERROR",
    "message": "Unsupported format specified",
    "details": {
      "providedFormat": "invalid_format",
      "supportedFormats": ["standard", "modern", "commander", "legacy", "vintage", "pauper"]
    },
    "validationErrors": [
      {
        "field": "format",
        "code": "ENUM_VIOLATION",
        "message": "Format must be one of: standard, modern, commander, legacy, vintage, pauper"
      }
    ],
    "retryable": false
  },
  "requestId": "req_xyz789ghi012",
  "timestamp": "2024-01-15T10:36:15.789Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

**3. External API Error (503):**
```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_API_ERROR",
    "type": "SYSTEM_ERROR",
    "message": "Card database temporarily unavailable",
    "details": {
      "service": "Scryfall API",
      "error": "Service timeout after 30 seconds"
    },
    "retryable": true,
    "retryAfter": 30
  },
  "requestId": "req_def456jkl789",
  "timestamp": "2024-01-15T10:37:45.123Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

**4. Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "type": "BUSINESS_ERROR",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 100,
      "window": 3600,
      "currentUsage": 100,
      "resetTime": "2024-01-15T11:30:00.000Z"
    },
    "retryable": true,
    "retryAfter": 1800
  },
  "requestId": "req_mno345pqr678",
  "timestamp": "2024-01-15T10:40:22.456Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

#### **Error Handling Middleware**

```typescript
// TypeScript - Global Error Middleware
class ErrorMiddleware {
  static handleError(error: Error, request: ApiRequest, response: ApiResponse): void {
    const requestId = request.headers['x-request-id'] || generateRequestId();

    // Log error with context
    logger.error('API Error occurred', {
      requestId,
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      body: request.body,
      timestamp: new Date().toISOString()
    });

    // Determine error type and status code
    const errorInfo = this.categorizeError(error);

    // Create standardized error response
    const errorResponse = this.createErrorResponse(
      errorInfo.statusCode,
      errorInfo.errorCode,
      errorInfo.message,
      errorInfo.details,
      requestId,
      errorInfo.retryable
    );

    response.status(errorInfo.statusCode).json(errorResponse);
  }

  private categorizeError(error: Error): ErrorInfo {
    // Custom business logic errors
    if (error instanceof ValidationError) {
      return {
        statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
        errorCode: BusinessErrorCode[error.code] || BusinessErrorCode.VALIDATION_ERROR,
        message: error.userMessage,
        details: error.details,
        retryable: false
      };
    }

    // Network/API errors
    if (error instanceof ExternalApiError) {
      return {
        statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
        errorCode: BusinessErrorCode.EXTERNAL_API_ERROR,
        message: 'External service temporarily unavailable',
        details: { service: error.serviceName },
        retryable: true,
        retryAfter: 30
      };
    }

    // Default server error
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      errorCode: BusinessErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      details: {},
      retryable: true
    };
  }
}
```

#### **Error Types and Code Mappings**

```typescript
// TypeScript - Error Type Mappings
const ERROR_MAPPINGS = {
  [BusinessErrorCode.DECK_SIZE_TOO_SMALL]: {
    statusCode: 422,
    type: ErrorType.VALIDATION,
    retryable: false,
    userMessage: 'Deck size is below the minimum required for this format'
  },
  [BusinessErrorCode.DECK_SIZE_TOO_LARGE]: {
    statusCode: 422,
    type: ErrorType.VALIDATION,
    retryable: false,
    userMessage: 'Deck size exceeds the maximum allowed for this format'
  },
  [BusinessErrorCode.INVALID_FORMAT]: {
    statusCode: 400,
    type: ErrorType.VALIDATION,
    retryable: false,
    userMessage: 'The specified format is not supported'
  },
  [BusinessErrorCode.EXTERNAL_API_ERROR]: {
    statusCode: 503,
    type: ErrorType.SYSTEM,
    retryable: true,
    retryAfter: 30,
    userMessage: 'Card database is temporarily unavailable. Please try again in a moment.'
  },
  [BusinessErrorCode.RATE_LIMIT_EXCEEDED]: {
    statusCode: 429,
    type: ErrorType.BUSINESS,
    retryable: true,
    retryAfter: 3600,
    userMessage: 'Too many requests. Please try again later.'
  }
};
