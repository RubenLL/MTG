# MTG Deck Analyzer Backend

Backend API for Magic: The Gathering deck analysis and validation, built with Clean Architecture, TypeScript, and AWS Lambda.

## 🏗️ Architecture

This backend follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/           # Business logic (entities, value objects)
├── application/      # Use cases and application services
├── infrastructure/   # External services and adapters
├── interface/        # HTTP handlers and entry points
└── shared/          # Cross-cutting utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- AWS CLI configured
- AWS SAM CLI (for local development)

### Installation

```bash
cd backend
npm install
```

### Development

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Local development with SAM
npm run local
```

## 📁 Project Structure

### Domain Layer (`src/domain/`)
- **entities/** - Core business entities (Card, Deck, etc.)
- **valueObjects/** - Immutable value objects (CardId, CardName, etc.)
- Pure business logic with no external dependencies

### Application Layer (`src/application/`)
- **useCases/** - Business workflows and orchestration
- Coordinates between domain and infrastructure layers

### Infrastructure Layer (`src/infrastructure/`)
- **dynamo/** - DynamoDB adapters and repositories
- **s3/** - S3 storage adapters
- **adapters/** - External API integrations (Scryfall)
- **repositories/** - Repository implementations

### Interface Layer (`src/interface/`)
- **handlers/** - AWS Lambda handlers
- Entry points for HTTP requests

## 🧪 Testing

Comprehensive testing strategy with high coverage requirements:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Testing Principles:**
- Unit tests for pure functions (> 90% coverage)
- Integration tests for external APIs (> 80% coverage)
- Tests run without AWS credentials (mocked)
- Fast feedback (< 1s for unit tests)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_REGION` | AWS region | Yes |
| `DYNAMODB_TABLE_PREFIX` | DynamoDB table prefix | Yes |
| `SCRYFALL_API_BASE` | Scryfall API base URL | No (default provided) |
| `LOG_LEVEL` | Logging level | No (default: info) |
| `CORS_ORIGIN` | CORS allowed origins | Yes |

### AWS Resources Required

- **DynamoDB Tables:**
  - `mtg-cards` - Card data and metadata
  - `mtg-decks` - User deck storage
  - `mtg-analysis` - Analysis results cache

- **S3 Buckets:**
  - `mtg-deck-lists` - Deck list uploads
  - `mtg-analysis-reports` - Generated reports

- **API Gateway:** REST API with configured routes

## 📊 Monitoring

### Structured Logging
All logs follow JSON format for easy parsing:

```json
{
  "timestamp": "2025-01-23T10:30:00.000Z",
  "level": "info",
  "component": "ValidateDeckUseCase",
  "requestId": "abc-123-def",
  "duration": 150,
  "message": "Deck validation completed"
}
```

### AWS X-Ray Tracing
Automatic tracing for performance monitoring and debugging.

### Custom Metrics
Business metrics collected automatically:
- Deck validation duration
- Card lookup response times
- Validation accuracy rates
- Popular format usage

## 🚀 Deployment

### AWS SAM (Recommended)

```bash
# Build and deploy
npm run build
sam deploy --guided

# Local testing
sam local start-api
```

### Manual Deployment

```bash
# Build
npm run build

# Deploy function
aws lambda update-function-code \
  --function-name mtg-deck-analyzer \
  --zip-file fileb://dist/index.js
```

## 🔍 API Endpoints

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/health` | GET | ✅ | Health check |
| `/api/validate-deck-size` | POST | 🚧 | Deck size validation |
| `/api/validate-cards` | POST | 🚧 | Card existence check |
| `/api/check-legality` | POST | 🚧 | Format legality analysis |

## 📚 Documentation

- **[Technical Decisions](./techdecisions.md)** - Architecture and implementation guidelines
- **[API Specification](../../docs/api-specification.md)** - Complete API documentation
- **[Domain Models](./src/domain/)** - Business logic documentation

## 🤝 Contributing

### Development Workflow

1. **Create feature branch:** `git checkout -b feature/amazing-feature`
2. **Implement with tests:** Follow TDD approach
3. **Run full test suite:** `npm test && npm run test:coverage`
4. **Code review:** Ensure all guidelines are followed
5. **Deploy and test:** Verify in staging environment

### Code Standards

- ✅ **TypeScript strict mode** enabled
- ✅ **ESLint + Prettier** for code quality
- ✅ **90%+ test coverage** required
- ✅ **Clean Architecture** principles
- ✅ **English-only** code and comments
- ✅ **Structured logging** implemented
- ✅ **Error handling** with business codes

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Code coverage > 90% (`npm run test:coverage`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Documentation updated if needed
- [ ] Technical decisions documented

## 📄 License

MIT License - see [LICENSE](../../../LICENSE) for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/mtg-deck-analyzer/issues)
- **Documentation:** See techdecisions.md for technical details
- **Architecture:** Follow Clean Architecture principles documented here
