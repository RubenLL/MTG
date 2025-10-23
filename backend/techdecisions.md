# Technical Decisions - MTG Deck Analyzer Backend

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [🔧 Development Guidelines](#-development-guidelines)
- [📊 Testing Strategy](#-testing-strategy)
- [🚀 Deployment Strategy](#-deployment-strategy)
- [📈 Monitoring & Observability](#-monitoring--observability)

---

## 🏗️ Architecture Overview

### **Clean Architecture Implementation**
**Decision:** Implement Clean Architecture (Hexagonal Architecture) with clear separation of concerns.

**Rationale:**
- Ensures maintainability and testability
- Allows easy replacement of infrastructure components
- Follows SOLID principles and Domain-Driven Design
- Enables independent development of business logic

**Layers (Inside-out):**
1. **Domain Layer** - Pure business logic, entities, value objects
2. **Application Layer** - Use cases, orchestration, validation
3. **Infrastructure Layer** - External services, repositories, adapters
4. **Interface Layer** - HTTP handlers, Lambda functions

---

## 📁 Project Structure

### **Directory Structure**
```
backend/
├── src/
│   ├── domain/              # Business entities and rules
│   │   ├── entities/        # Domain entities (Card, Deck, etc.)
│   │   └── valueObjects/    # Immutable value objects (CardId, etc.)
│   ├── application/         # Use cases and application logic
│   │   └── useCases/        # Business workflows (ValidateDeck, etc.)
│   ├── infrastructure/      # External dependencies
│   │   ├── dynamo/          # DynamoDB adapters
│   │   ├── s3/             # S3 adapters
│   │   ├── repositories/   # Repository implementations
│   │   └── adapters/       # External API adapters (Scryfall)
│   ├── interface/          # Entry points
│   │   └── handlers/       # Lambda handlers
│   └── shared/             # Cross-cutting concerns
│       └── utils/          # Utilities and helpers
├── tests/                  # Test suites
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
└── infrastructure/         # IaC and deployment
```

**Decision:** Follow standard Clean Architecture directory structure.

**Benefits:**
- Clear separation of concerns
- Easy to locate and modify specific functionality
- Scalable for team development
- Consistent with industry best practices

---

## 🛠️ Technology Stack

### **Core Technologies**
**Decision:** Use the following technology stack as specified in requirements:

| Component | Technology | Version | Rationale |
|-----------|------------|---------|-----------|
| **Runtime** | Node.js | 20+ LTS | Latest stable, excellent performance |
| **Language** | TypeScript | 5.0+ | Type safety, better developer experience |
| **Framework** | AWS Lambda | - | Serverless, cost-effective, scalable |
| **API Gateway** | AWS API Gateway | REST | Simple REST endpoints |
| **Database** | AWS DynamoDB | - | NoSQL, serverless, highly available |
| **Storage** | AWS S3 | - | File storage for deck lists and assets |
| **External APIs** | Scryfall API | - | Primary MTG card data source |

### **Development Dependencies**
**Decision:** Minimal dependencies to keep bundle size small:

| Package | Purpose | Rationale |
|---------|---------|-----------|
| **middy** | Lambda middleware | Lightweight, essential for serverless |
| **@aws-sdk/** | AWS services | Official AWS SDK v3, tree-shakable |
| **joi** | Input validation | Robust validation, TypeScript support |
| **esbuild** | Bundling | Fast bundling, small output size |

**Avoided:**
- ❌ Express/NestJS (too heavy for Lambda)
- ❌ Sequelize/TypeORM (unnecessary ORM complexity)
- ❌ Winston (use structured JSON logging instead)

---

## 🔧 Development Guidelines

### **TypeScript Configuration**
**Decision:** Strict TypeScript configuration for maximum type safety.

```typescript
// tsconfig.json key settings
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

**Benefits:**
- Catch errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types
- Easier refactoring and maintenance

### **Coding Standards**
**Decision:** Follow established coding patterns:

1. **Function over Classes:** Prefer pure functions and factories over classes
2. **Async/Await:** No callback-based code, consistent async patterns
3. **Error Handling:** Centralized error handling with custom error types
4. **Naming:** Clear, descriptive names in English only
5. **Documentation:** JSDoc comments for all public APIs

### **Dependency Injection**
**Decision:** Use dependency injection pattern for testability.

**Implementation:**
- Repository interfaces in domain layer
- Concrete implementations in infrastructure layer
- Dependency injection through constructor parameters
- Easy mocking for unit tests

---

## 📊 Testing Strategy

### **Testing Levels**
**Decision:** Multi-level testing strategy:

| Test Type | Scope | Tools | Coverage |
|-----------|-------|-------|----------|
| **Unit Tests** | Pure functions, use cases | Jest | > 90% |
| **Integration Tests** | External APIs, database | Jest + AWS mocks | > 80% |
| **E2E Tests** | Complete workflows | Postman/Newman | > 70% |

### **Mock Strategy**
**Decision:** Comprehensive mocking for reliable tests:

- **AWS SDK:** Use `aws-sdk-client-mock` for DynamoDB/S3
- **External APIs:** Mock Scryfall API responses
- **Environment:** Use test-specific environment variables
- **Time:** Mock dates and timers for deterministic tests

**Testing Principles:**
- Tests should run without AWS credentials
- Fast feedback (unit tests < 1s)
- No external dependencies in CI/CD
- Test business logic in isolation

---

## 🚀 Deployment Strategy

### **Infrastructure as Code**
**Decision:** Use AWS CDK for infrastructure management.

**Rationale:**
- Reproducible deployments
- Version control for infrastructure
- Type-safe infrastructure definitions
- Consistent environments across dev/staging/prod

### **Lambda Configuration**
**Decision:** Optimized Lambda settings:

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Runtime** | Node.js 20.x | Latest stable, performance optimized |
| **Memory** | 256MB-1GB | Sufficient for MTG data processing |
| **Timeout** | 30s | Adequate for API calls + processing |
| **Concurrency** | 1000 | High availability for multiple users |

### **Environment Management**
**Decision:** Multi-environment configuration:

```typescript
// Environment variables
AWS_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=mtg-  // Different for each environment
SCRYFALL_API_BASE=https://api.scryfall.com
LOG_LEVEL=info              // debug for dev, info for prod
CORS_ORIGIN=https://your-domain.com
```

---

## 📈 Monitoring & Observability

### **Structured Logging**
**Decision:** JSON structured logging from day one.

**Format:**
```json
{
  "timestamp": "2025-01-23T10:30:00.000Z",
  "level": "info",
  "component": "ValidateDeckUseCase",
  "requestId": "abc-123-def",
  "userId": "user-456",
  "duration": 150,
  "format": "modern",
  "deckSize": 60,
  "message": "Deck validation completed successfully"
}
```

**Implementation:**
- Use structured logging in all layers
- Include request correlation IDs
- Log performance metrics automatically
- Error context with stack traces

### **Tracing & Instrumentation**
**Decision:** AWS X-Ray integration for distributed tracing.

**Benefits:**
- End-to-end request tracing
- Performance bottleneck identification
- Error correlation across services
- Service dependency mapping

### **Metrics Collection**
**Decision:** Custom business metrics:

| Metric | Description | Collection Point |
|--------|-------------|------------------|
| **DeckValidationDuration** | Time to validate deck | Use case completion |
| **CardLookupTime** | External API response time | Repository layer |
| **ValidationAccuracy** | Success rate of validations | Error handler |
| **FormatDistribution** | Popular MTG formats | Analytics middleware |

---

## 🔄 API Design Decisions

### **REST API Structure**
**Decision:** Simple, consistent REST endpoints:

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/validate-deck-size` | POST | Basic deck validation | ✅ |
| `/api/validate-cards` | POST | Card existence check | ✅ |
| `/api/check-legality` | POST | Format legality | ✅ |
| `/api/analyze-mana-curve` | POST | Mana analysis | 🚧 |
| `/api/import/arena` | POST | MTG Arena import | 📋 |

### **Response Format**
**Decision:** Standardized JSON response structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;        // Business error code
    message: string;     // User-friendly message
    details?: any;       // Technical details
    retryable: boolean;  // Whether to retry
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    duration: number;
  };
}
```

### **Error Handling**
**Decision:** Centralized error handling with business codes:

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `CARD_NOT_FOUND` | 404 | Card doesn't exist |
| `FORMAT_NOT_SUPPORTED` | 400 | Invalid format |
| `EXTERNAL_API_ERROR` | 502 | Scryfall API failure |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## 📚 Future Guidelines

### **Adding New Features**
1. **Define use case** in application layer first
2. **Create domain entities** if new business concepts
3. **Implement repository interface** in domain
4. **Add concrete implementation** in infrastructure
5. **Wire up** in interface layer
6. **Add comprehensive tests** at each level

### **Performance Considerations**
- **DynamoDB:** Use single-table design for efficiency
- **Caching:** Implement Redis for frequently accessed data
- **Batch Operations:** Group multiple card lookups
- **Connection Pooling:** Reuse HTTP clients for external APIs

### **Security Guidelines**
- **Input Validation:** Validate all inputs with Joi schemas
- **CORS:** Restrict origins to known domains
- **Rate Limiting:** Implement per-user limits
- **IAM:** Least privilege principle for all roles
- **Secrets:** Use AWS Secrets Manager for sensitive data

---

## 🤝 Contributing Guidelines

### **Code Review Checklist**
- [ ] Follows Clean Architecture principles
- [ ] Has unit tests with > 90% coverage
- [ ] Includes TypeScript types for all public APIs
- [ ] Has structured logging implemented
- [ ] Follows naming conventions (English only)
- [ ] Includes JSDoc documentation
- [ ] Passes all linting rules

### **Before Merging**
- [ ] All tests pass in CI/CD
- [ ] No new technical debt introduced
- [ ] Documentation updated if needed
- [ ] Performance impact assessed
- [ ] Security implications reviewed

---

## 📝 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-01-23 | 1.0 | Initial architecture decisions | Tech Lead |
| 2025-01-23 | 1.1 | Added monitoring strategy | Tech Lead |

---

**This document serves as the single source of truth for backend architecture decisions and should be updated whenever architectural changes are made.**
