# MTG Deck Analyzer API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
No authentication is required for the local development server.

## Endpoints

### 1. Health Check
Check if the API is running.

```http
GET /health
```

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-03T17:00:00.000Z",
  "service": "mtg-deck-analyzer-local-test",
  "version": "1.0.0"
}
```

### 2. Validate Deck Size
Validate a deck according to the specified format rules.

```http
POST /validate-deck-size
```

**Request Body**
```json
{
  "deckList": [
    {
      "cardName": "Lightning Bolt",
      "quantity": 4,
      "isSideboard": false
    }
  ],
  "format": "modern",
  "includeSideboard": true
}
```

**Field Descriptions**
- `deckList`: Array of card objects
  - `cardName`: Name of the card (string, required)
  - `quantity`: Number of copies (integer, min: 1, max: 100)
  - `isSideboard`: Whether the card is in the sideboard (boolean, optional, default: false)
- `format`: The format to validate against (string, required, one of: 'standard', 'modern', 'pioneer', 'commander', 'legacy', 'vintage', 'pauper', 'draft', 'sealed')
- `includeSideboard`: Whether to include sideboard in validation (boolean, optional, default: false)

**Success Response (200)**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "format": "modern",
    "validRange": {
      "min": 60,
      "max": null
    },
    "validationDetails": {
      "mainDeckCount": 60,
      "sideboardCount": 15,
      "totalCards": 75,
      "formatRequirements": "Minimum 60 cards in main deck, maximum 15 in sideboard"
    }
  },
  "requestId": "local_1234567890_abc123",
  "timestamp": "2025-11-03T17:00:00.000Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

**Error Response (422) - Validation Error**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "type": "VALIDATION",
    "message": "Validation failed",
    "details": "One or more validation errors occurred",
    "validationErrors": [
      {
        "field": "format",
        "code": "ANY_ONLY",
        "message": "\"format\" must be one of [standard, modern, pioneer, commander, legacy, vintage, pauper, draft, sealed]"
      }
    ],
    "retryable": false
  },
  "requestId": "local_1234567890_def456",
  "timestamp": "2025-11-03T17:00:00.000Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

**Error Response (500) - Server Error**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "type": "SYSTEM",
    "message": "Internal server error",
    "details": "Error details in development mode",
    "retryable": true
  },
  "requestId": "local_1234567890_ghi789",
  "timestamp": "2025-11-03T17:00:00.000Z",
  "path": "/api/validate-deck-size",
  "method": "POST"
}
```

## Running Tests

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Run tests in watch mode:
```bash
npm run test:watch
```

## Example Requests

See the `examples.http` file for example requests that can be used with REST clients like VS Code REST Client or Postman.

## Error Codes

| Code | Type | Description | HTTP Status |
|------|------|-------------|-------------|
| INVALID_INPUT | VALIDATION | Input validation failed | 422 |
| DECK_SIZE_TOO_SMALL | VALIDATION | Deck has fewer cards than required | 422 |
| DECK_SIZE_TOO_LARGE | VALIDATION | Deck has more cards than allowed | 422 |
| INVALID_FORMAT | VALIDATION | Invalid format specified | 422 |
| INTERNAL_SERVER_ERROR | SYSTEM | Unexpected server error | 500 |
