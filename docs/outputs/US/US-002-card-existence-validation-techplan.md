# US-002: Card Existence Validation - Technical Implementation Plan

## 📋 Overview

This document outlines the technical implementation plan for the Card Existence Validation feature, including architectural decisions, API design, and implementation details.

## 🎯 Business Requirements

- Validate if cards in a deck exist in the official MTG database
- Provide suggestions for misspelled card names
- Support different card printings and special card types
- Return clear validation results with error details

## 🏗️ Technical Design

### Architecture

```
src/
  domain/
    entities/
      Card.ts
      Deck.ts
      ValidationResult.ts
    repositories/
      ICardRepository.ts
    services/
      CardValidationService.ts
      FuzzyMatchService.ts
  infrastructure/
    repositories/
      ScryfallCardRepository.ts
      DynamoDBCardRepository.ts
    services/
      ScryfallAPIService.ts
      GathererAPIService.ts
  application/
    useCases/
      ValidateCardExistenceUseCase.ts
  interface/
    controllers/
      CardValidationController.ts
    lambda/
      handler.ts
```

### API Design

#### Request

```typescript
interface ValidateCardsRequest {
  cards: Array<{
    name: string;
    quantity: number;
    isSideboard?: boolean;
  }>;
  format?: string; // For future format-specific validation
}
```

#### Response

```typescript
interface ValidateCardsResponse {
  validCards: Array<{
    name: string;
    quantity: number;
    isSideboard: boolean;
    details: {
      id: string;
      name: string;
      set: string;
      collectorNumber: string;
      imageUri?: string;
    };
  }>;
  invalidCards: Array<{
    name: string;
    reason: "NOT_FOUND" | "INVALID_QUANTITY" | "FORMAT_RESTRICTED";
    suggestions?: Array<{
      name: string;
      set?: string;
      similarity: number;
    }>;
  }>;
  validationSummary: {
    totalCards: number;
    validCards: number;
    invalidCards: number;
    hasWarnings: boolean;
  };
}
```

## ❓ Technical Questions & Answers

### Caching Strategy

**Question:** Should we implement a local cache for frequently accessed cards to reduce API calls to Scryfall/Gatherer? What should be the TTL for cached card data?

**Tech Lead Response:**

- Yes, implement a two-level caching strategy:
  1. In-memory cache (5 minutes TTL) for high-frequency card lookups
  2. DynamoDB cache (24 hours TTL) for persistence between Lambda invocations
- Use a write-through cache pattern to ensure consistency
- Monitor cache hit/miss ratios to optimize TTL values

### Database Schema

**Question:** Should we store card data in DynamoDB with a TTL for automatic cleanup? What should be the partition key for the cards table?

**Tech Lead Response:**

- Yes, use DynamoDB with TTL (24 hours)
- Partition Key: `cardName` (lowercase, normalized)
- Sort Key: `setCode|collectorNumber` (for multiple printings)
- GSI for set-based queries if needed
- Enable Point-in-Time Recovery (PITR) for data protection

### Rate Limiting

**Question:** What should be our rate limiting strategy for Scryfall API (they have 50-100 requests per second limit)?

**Tech Lead Response:**

- Implement token bucket algorithm for rate limiting
- Set initial rate at 40 requests/second to stay under Scryfall's limits
- Use `bottleneck` or similar library for request throttling
- Implement exponential backoff for retries
- Consider batch API endpoints to reduce request count

### Fuzzy Search

**Question:** What's the preferred string similarity algorithm for card name matching?

**Tech Lead Response:**

- Use Jaro-Winkler distance for better handling of prefixes
- Set threshold at 0.85 similarity score
- Pre-process strings (lowercase, remove special chars)
- Consider using a trie data structure for efficient prefix matching
- Cache fuzzy match results for common typos

## ❓ Business Questions & Answers

### Card Uniqueness

**Question:** Should we consider cards with the same name but different printings as the same card for validation purposes?

**Business Owner Response:**

- Yes, treat cards with the same name as identical regardless of printing
- Store printing information for reference but don't fail validation based on specific printings
- Allow users to see different printings as suggestions

### Special Cards

**Question:** How should we handle split cards, double-faced cards, and other special card types?

**Business Owner Response:**

- Support all official card types and layouts
- For double-faced cards, validate both faces
- For split cards, validate both halves
- Include special handling for Meld cards and other complex types
- Document all supported card types in the API documentation

### Validation Feedback

**Question:** What's the maximum number of suggestions we should provide for misspelled cards?

**Business Owner Response:**

- Return up to 3 suggestions per misspelled card
- Sort by similarity score (highest first)
- Include set information if available
- Highlight the part of the name that matches the input

### Performance vs. Accuracy

**Question:** Is it acceptable to have a slight delay in validation for better accuracy with fuzzy matching?

**Business Owner Response:**

- Target <1s response time for typical deck sizes (60-100 cards)
- For larger decks, show partial results as they become available
- Optimize for accuracy over speed in the MVP
- We can add performance optimizations in future iterations

## 🚀 Implementation Plan

### Phase 1: Core Domain & Infrastructure (Week 1)

0. Pre-plan review current structure entities interfaces and services to follow DRY principe
1. Set up project structure and dependencies
2. Implement domain entities and interfaces
3. Create Scryfall API client with rate limiting
4. Implement basic card lookup functionality

### Phase 2: Validation Logic (Week 2)

1. Implement exact card matching
2. Add fuzzy matching for misspelled cards
3. Handle special card types
4. Implement basic caching

### Phase 3: API & Integration (Week 3)

1. Create Lambda handler
2. Set up API Gateway
3. Implement request/response validation
4. Add error handling and logging

### Phase 4: Testing & Optimization (Week 4)

1. Write unit and integration tests
2. Optimize performance
3. Set up monitoring and alerts
4. Document the API

### Phase 5: Create a simulation to run locally in a nodejs monotlith to test the validation logic

1. review current structure of already created proyect in folder localDev
2. implment same endpoint logic api calls and databese connection as we will use in lambda function
3. create a .env file with the same variables as we will use in lambda function

## 📊 Success Metrics

- 99.9% card validation accuracy
- <1s response time for 95% of requests
- <0.1% error rate
- 90%+ cache hit rate after warm-up

## 🔍 Open Questions

1. Should we implement a circuit breaker for Scryfall API?

   - **Tech Lead:** Yes, using AWS WAF or API Gateway for rate limiting

2. What's the maximum response time we should aim for?

   - **Business Owner:** <2s for 99% of requests

3. Should we implement a queue for large deck validations?

   - **Tech Lead:** Yes, for decks >200 cards, use SQS with async processing

4. Do we need to support partial validation results if some cards fail to validate?
   - **Business Owner:** Yes, return as much information as possible

## 📝 Next Steps

1. Review and approve the technical design
2. Set up the project structure
3. Begin implementation of Phase 1
4. Schedule regular check-ins to review progress
