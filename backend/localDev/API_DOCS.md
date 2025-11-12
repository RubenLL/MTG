# MTG Deck Analyzer - API Documentation

## Table of Contents
- [Health Check](#health-check)
- [Card Validation](#card-validation)
- [Card Search](#card-search)
- [Get Card by ID](#get-card-by-id)
- [Batch Validate Cards](#batch-validate-cards)
- [Validate Deck Size](#validate-deck-size)

## Base URL
All endpoints are relative to: `http://localhost:3000`

## Common Response Headers
- `Content-Type: application/json`
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization`

## Common Response Format
All responses follow this structure:

```typescript
{
  "success": boolean,      // Indicates if the request was successful
  "data"?: object,         // Response data (on success)
  "error"?: {             // Error details (on failure)
    "code": string,       // Error code
    "type": string,       // Error type (VALIDATION, NOT_FOUND, SERVER, etc.)
    "message": string,    // Human-readable error message
    "details": any,       // Additional error details
    "retryable": boolean  // Whether the request can be retried
  },
  "requestId": string,    // Unique request identifier
  "timestamp": string     // ISO 8601 timestamp
}
```

## Health Check

### GET /health

Check if the service is running.

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-12T17:12:00.000Z",
  "service": "mtg-deck-analyzer-local-test",
  "version": "1.0.0"
}
```

## Card Validation

### POST /dev/validateCard

Validate a single Magic: The Gathering card.

**Request Body**
```typescript
{
  "cardName": string,  // Name of the card to validate
  "format"?: string    // Optional format to check legality (e.g., "modern", "commander")
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": string,          // Card ID
      "name": string,        // Card name
      "type": string,        // Card type
      "manaCost": string,    // Mana cost
      "legalInFormat"?: boolean,  // Whether the card is legal in the specified format
      "legalFormats"?: string[],  // List of formats where the card is legal
      "imageUri": string     // URL to the card image
    }
  },
  "requestId": string,
  "timestamp": string
}
```

**Error Responses**
- `400 Bad Request`: Missing or invalid parameters
- `404 Not Found`: Card not found
- `500 Internal Server Error`: Server error

## Card Search

### GET /dev/cards/search

Search for cards by name.

**Query Parameters**
- `q` (required): Search query string
- `limit` (optional, default=5): Maximum number of results to return

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": string,      // Card ID
        "name": string,    // Card name
        "type": string,    // Card type
        "manaCost": string,// Mana cost
        "imageUrl": string // URL to the card image
      }
    ],
    "total": number       // Total number of matching cards
  },
  "requestId": string,
  "timestamp": string
}
```

**Error Responses**
- `400 Bad Request`: Missing search query
- `500 Internal Server Error`: Server error

## Get Card by ID

### GET /dev/cards/:id

Get detailed information about a specific card by its ID.

**Path Parameters**
- `id` (required): The ID of the card to retrieve

**Query Parameters**
- `format` (optional): Format to check card legality

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": string,          // Card ID
      "name": string,        // Card name
      "type": string,        // Card type
      "manaCost": string,    // Mana cost
      "legalInFormat"?: boolean,  // Whether the card is legal in the specified format
      "legalFormats"?: string[],  // List of formats where the card is legal
      "imageUrl": string,    // URL to the card image
      // ... other card properties
    }
  },
  "requestId": string,
  "timestamp": string
}
```

**Error Responses**
- `404 Not Found`: Card with the specified ID not found
- `500 Internal Server Error`: Server error

## Batch Validate Cards

### POST /dev/validateCards

Validate multiple cards in a single request.

**Request Body**
```typescript
{
  "cards": [
    {
      "name": string  // Name of the card to validate
    }
  ],
  "format"?: string  // Optional format to check legality
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "name": string,    // Card name
        "valid": boolean,  // Whether the card is valid
        "error"?: {        // Present if valid is false
          "code": string,  // Error code
          "message": string // Error message
        },
        "card"?: {         // Present if valid is true
          "id": string,    // Card ID
          "name": string,  // Card name
          "type": string,  // Card type
          "manaCost": string, // Mana cost
          "legalInFormat"?: boolean, // Whether the card is legal in the specified format
          "imageUri": string // URL to the card image
        }
      }
    ],
    "summary": {
      "total": number,     // Total number of cards validated
      "valid": number,     // Number of valid cards
      "invalid": number    // Number of invalid cards
    }
  },
  "requestId": string,
  "timestamp": string
}
```

**Error Responses**
- `422 Unprocessable Entity`: Invalid input format
- `500 Internal Server Error`: Server error

## Validate Deck Size

### POST /dev/validateDeckSize

Validate a deck's size and composition according to the specified format.

**Request Body**
```typescript
{
  "deckList": [
    {
      "cardName": string,  // Name of the card
      "quantity": number,  // Number of copies (1-100)
      "isSideboard"?: boolean // Whether the card is in the sideboard (default: false)
    }
  ],
  "format": string,       // Format to validate against (e.g., "modern", "commander")
  "includeSideboard"?: boolean // Whether to include sideboard in validation (default: false)
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "isValid": boolean,  // Whether the deck is valid
    "currentCount": number, // Total number of cards in the deck
    "validRange": {
      "min": number,     // Minimum allowed cards
      "max": number | null // Maximum allowed cards (null for no maximum)
    },
    "format": string,    // The format that was validated against
    "validationDetails": {
      "mainDeckCount": number,   // Number of cards in the main deck
      "sideboardCount": number,  // Number of cards in the sideboard
      "errors": [                // Array of validation errors (if any)
        {
          "code": string,        // Error code
          "message": string,     // Human-readable error message
          "details": any         // Additional error details
        }
      ]
    }
  },
  "requestId": string,
  "timestamp": string
}
```

**Error Responses**
- `422 Unprocessable Entity`: Invalid input format or validation failed
- `500 Internal Server Error`: Server error

## Error Codes

| Code | Description |
|------|-------------|
| MISSING_CARD_NAME | Required card name is missing |
| CARD_NOT_FOUND | The specified card was not found |
| INVALID_INPUT | The request body is invalid or missing required fields |
| DECK_SIZE_TOO_SMALL | The deck contains too few cards |
| DECK_SIZE_TOO_LARGE | The deck contains too many cards |
| INVALID_FORMAT | The specified format is not valid |
| EXTERNAL_API_ERROR | Error communicating with external API |
| RATE_LIMIT_EXCEEDED | Rate limit exceeded for external API |
| INTERNAL_SERVER_ERROR | An unexpected error occurred |

## Rate Limiting

- All endpoints are rate limited to 100 requests per minute per IP address.
- Exceeding the rate limit will result in a `429 Too Many Requests` response.

## Authentication

No authentication is required for the local development server.

## Versioning

API versioning is not yet implemented in the local development server.
