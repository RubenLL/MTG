# MTG Deck Analyzer 🎴

[![Flutter](https://img.shields.io/badge/Flutter-3.24.0-blue.svg)](https://flutter.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-Node.js-orange.svg)](https://aws.amazon.com/lambda)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Complete system for Magic: The Gathering deck analysis and validation with automatic format legality verification, structure analysis, and improvement recommendations.

## ✨ Main Features

### 🔍 Complete Deck Validation
- **Format validation:** Standard, Modern, Pioneer, Commander, Legacy, Vintage, Pauper, Draft, Sealed
- **Copy verification:** Automatic control of maximum copies per card
- **Banned/restricted cards:** Automatic detection according to official format lists
- **Legality analysis:** Validation by print date and legal sets

### 📊 Advanced Analysis
- **Mana curve:** Visual analysis of cost distribution
- **Mana base:** Evaluation of color consistency and lands
- **Type grouping:** Automatic card organization by categories
- **Improvement suggestions:** Specific recommendations for optimization

### 📤 Import and Export
- **MTG Arena:** Direct import from standard Arena format
- **Magic Online (MTGO):** Complete support for MTGO format
- **Multiple export:** Various export formats available
- **Copy to clipboard:** Integrated functionality for sharing

## 🏗️ Architecture

### Frontend (Flutter)
- **Framework:** Flutter 3.24.0 with Dart
- **UI/UX:** Mobile-first responsive design
- **Accessibility:** WCAG 2.1 AA compliance
- **State Management:** Provider pattern
- **Performance:** < 100ms response time target

### Backend (TypeScript/AWS Lambda)
- **Runtime:** Node.js 20+ on AWS Lambda
- **API:** RESTful with OpenAPI 3.0 specification
- **Validation:** Joi schema validation
- **Error Handling:** Global middleware with business error codes
- **Performance:** < 100ms response time, 99.9% uptime target

### Database
- **Primary:** DynamoDB for card storage and caching
- **External APIs:** Scryfall API (primary), Gatherer API (fallback)
- **Caching Strategy:** Multi-level caching with automatic invalidation

### Instrumentation (FOSS)
- **Analytics:** PostHog self-hosted
- **Error Tracking:** Sentry open source
- **Performance Monitoring:** Web Vitals + custom traces
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Dashboards:** Grafana with automatic alerts

## 🚀 Installation

### Prerequisites
- Node.js 20+
- Flutter 3.24.0+
- AWS CLI configured
- Docker (for local development)

### Project Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/mtg-deck-analyzer.git
cd mtg-deck-analyzer
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run build
npm run deploy
```

3. **Frontend Setup**
```bash
cd frontend
flutter pub get
flutter run
```

4. **Instrumentation (Optional)**
```bash
cd infrastructure
docker-compose up -d
```

## 📖 Usage

### Basic Deck Validation

```typescript
// API usage example
const response = await fetch('/api/validate-deck-size', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    deckList: [
      { cardName: "Lightning Bolt", quantity: 4 },
      { cardName: "Island", quantity: 20 }
    ],
    format: "modern",
    includeSideboard: true
  })
});

const result = await response.json();
// Result: { isValid: true, currentCount: 60, format: "modern", ... }
```

### Flutter Frontend

```dart
// Flutter usage example
final validator = DeckValidationService();
final result = await validator.validateDeck(
  deckList: deckText,
  format: selectedFormat,
);

if (result.isValid) {
  // Show valid result
} else {
  // Show specific errors
}
```

## 📋 Implemented User Stories

### Sprint 1 - MVP Core ✅
- **US-001a:** Frontend Requirements - Responsive and accessible UI
- **US-001b:** Backend Requirements - RESTful API with validation
- **US-001c:** Instrumentation & Monitoring - Complete FOSS stack
- **US-002:** Card Existence Validation - Verification of valid cards
- **US-003:** Card Copies & Restrictions - Copy control and banned cards
- **US-004:** Format Legality Analysis - Legality analysis by format

### Sprint 2 - Performance Analysis (Planned)
- **US-005:** Mana Curve Analysis - Visual mana curve analysis
- **US-006:** Mana Base Analysis - Mana base evaluation
- **US-007:** Mana Base Improvements - Optimization suggestions
- **US-008:** Card Grouping by Type - Organization by categories

### Sprint 3 - Import/Export (Planned)
- **US-009:** MTG Arena Import - Import from Arena
- **US-010:** MTGO Import - Import from MTGO
- **US-011:** Deck Export - Multiple export formats

## 🧪 Testing

### Testing Strategy
- **Unit Tests:** Business logic and utilities
- **Integration Tests:** API endpoints and external services
- **E2E Tests:** Complete user flows
- **Performance Tests:** Load testing and benchmarks

```bash
# Run tests
npm test                    # Backend tests
flutter test               # Frontend tests
npm run test:e2e          # End-to-end tests
npm run test:performance  # Performance benchmarks
```

## 📊 Performance Metrics

### Quality Objectives
- **Response Time:** < 100ms (API), < 100ms (UI updates)
- **Uptime:** 99.9% availability
- **Accuracy:** 100% accuracy in validating existing cards
- **Accessibility:** WCAG 2.1 AA compliance
- **Mobile Performance:** 60fps on mobile devices

### Monitoring
- **Real-time Dashboards:** Kibana and Grafana
- **Error Tracking:** Sentry with complete context
- **Performance Monitoring:** Automatic Web Vitals
- **User Analytics:** PostHog for user behavior

## 🤝 Contributing

### How to Contribute
1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- **TypeScript:** ESLint + Prettier
- **Flutter:** Dart analyzer + Flutter linting rules
- **Commits:** Conventional commits
- **Testing:** Minimum 80% code coverage

## 📝 Documentation

### Technical Documentation
- [API Specification](./docs/api-specification.md)
- [Architecture Guide](./docs/architecture.md)
- [Deployment Guide](./docs/deployment.md)
- [User Stories (US)](https://github.com/RubenLL/MTG/tree/main/docs/US)


### MTG Resources
- [Scryfall API Documentation](https://scryfall.com/docs/api)
- [MTG Format Rules](https://magic.wizards.com/en/game-info/gameplay/formats)
- [Banned & Restricted Lists](https://magic.wizards.com/en/game-info/gameplay/formats/banned-restricted)

## 🐛 Reporting Issues

If you find a bug or have a suggestion, please create a GitHub issue with:
- Detailed problem description
- Steps to reproduce
- Example deck list (if applicable)
- Format and expected result

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- **Scryfall** for their excellent MTG card API
- **Magic: The Gathering** for the game that inspired this project
- **Flutter Team** for the exceptional mobile framework
- **AWS** for reliable cloud infrastructure

## 🏃‍♂️ Quick Start

### For Developers

1. **Backend Development:**
```bash
cd backend
npm install
npm run dev        # Development mode
npm run test       # Run tests
npm run deploy     # Deploy to AWS Lambda
```

2. **Frontend Development:**
```bash
cd frontend
flutter pub get
flutter run        # Run on device/emulator
flutter test       # Run tests
flutter build web  # Build for web
```

3. **Infrastructure Setup:**
```bash
cd infrastructure
docker-compose up  # Start monitoring stack
```

### For End Users

1. **Deploy to Production:**
```bash
npm run deploy:all    # Deploy frontend + backend + infrastructure
```

2. **Environment Variables:**
```bash
# .env file
AWS_REGION=us-east-1
SCRYFALL_API_KEY=your_key
POSTHOG_API_KEY=your_key
SENTRY_DSN=your_dsn
```

## 📊 Project Status

### ✅ Completed (Sprint 1 - MVP Core)
- [x] Deck size validation API
- [x] Responsive UI in Flutter
- [x] FOSS instrumentation system
- [x] Card existence validation
- [x] Copy control and banned/restricted cards
- [x] Format legality analysis

### 🚧 In Development (Sprint 2 - Analysis Features)
- [ ] Mana curve analysis
- [ ] Mana base evaluation
- [ ] Optimization suggestions
- [ ] Card grouping by type

### 📋 Planned (Sprint 3 - Import/Export)
- [ ] Import from MTG Arena
- [ ] Import from MTGO
- [ ] Multiple export formats

## 🎯 Usage Examples

### Modern Deck Validation

```json
// Request
POST /api/validate-deck-size
{
  "deckList": [
    {"cardName": "Lightning Bolt", "quantity": 4},
    {"cardName": "Island", "quantity": 20},
    {"cardName": "Opt", "quantity": 4}
  ],
  "format": "modern",
  "includeSideboard": true
}

// Response
{
  "isValid": true,
  "currentCount": 60,
  "validRange": {"min": 60, "max": null},
  "format": "modern",
  "validationDetails": {
    "mainDeckCount": 60,
    "sideboardCount": 15,
    "totalCards": 75
  }
}
```

### Frontend Integration

```dart
// Flutter example
class DeckValidatorScreen extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('MTG Deck Validator'),
        actions: [
          IconButton(
            icon: Icon(Icons.analytics),
            onPressed: _showAnalytics,
          ),
        ],
      ),
      body: Column(
        children: [
          FormatSelector(
            formats: ['standard', 'modern', 'commander'],
            onFormatChanged: _onFormatChanged,
          ),
          DeckInputArea(
            onDeckChanged: _onDeckChanged,
            placeholder: 'Paste your deck list here...',
          ),
          ValidationButton(
            onPressed: _validateDeck,
            isLoading: _isValidating,
          ),
          ValidationResults(
            result: _validationResult,
          ),
        ],
      ),
    );
  }
}
```

## 🔧 Development Configuration

### Environment Variables

```bash
# Backend (.env)
AWS_REGION=us-east-1
DYNAMODB_TABLE=mtg-cards
SCRYFALL_API_BASE=https://api.scryfall.com
LOG_LEVEL=debug
CORS_ORIGIN=https://your-domain.com

# Frontend (.env)
API_BASE_URL=https://api.your-domain.com
POSTHOG_API_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn
```

### Available Scripts

```bash
# Backend
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run all tests
npm run test:watch   # Watch mode tests
npm run lint         # Code linting
npm run deploy       # Deploy to AWS

# Frontend
flutter run          # Run on device
flutter test         # Run tests
flutter build web    # Build for web
flutter analyze      # Code analysis

# Infrastructure
docker-compose up    # Start services
docker-compose logs  # View logs
```

## 🌐 Deployment

### AWS Lambda (Backend)
```yaml
# serverless.yml
service: mtg-deck-analyzer

functions:
  validateDeckSize:
    handler: dist/handlers/validateDeckSize.handler
    events:
      - http:
          path: /api/validate-deck-size
          method: post
          cors: true
```

### Docker (Infrastructure)
```yaml
# docker-compose.yml
version: '3.8'
services:
  posthog:
    image: posthog/posthog:latest
    environment:
      SECRET_KEY: ${POSTHOG_SECRET_KEY}
      DATABASE_URL: postgres://posthog:password@posthog-db:5432/posthog

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.6
    environment:
      - discovery.type=single-node

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.6
    ports:
      - "5601:5601"
```

## 📈 Performance & Monitoring

### Key Metrics
- **API Response Time:** < 100ms P95
- **UI Response Time:** < 100ms for updates
- **Uptime:** 99.9% monthly
- **Error Rate:** < 0.1%
- **Mobile Performance:** Consistent 60fps

### Available Dashboards
- **Kibana:** Logging and error analysis
- **Grafana:** Performance metrics and alerts
- **PostHog:** User behavior and conversion funnels
- **Sentry:** Error tracking and performance monitoring

## 🤖 API Endpoints

| Endpoint | Method | Description | Status |
|----------|--------|-------------|---------|
| `/api/validate-deck-size` | POST | Validate deck size | ✅ |
| `/api/validate-cards` | POST | Verify existing cards | ✅ |
| `/api/check-legality` | POST | Legality analysis | ✅ |
| `/api/analyze-mana-curve` | POST | Mana curve | 🚧 |
| `/api/analyze-mana-base` | POST | Mana base | 🚧 |
| `/api/import/arena` | POST | Import from Arena | 📋 |
| `/api/import/mtgo` | POST | Import from MTGO | 📋 |

## 📚 Additional Documentation

- [📖 API Documentation](./docs/api-specification.md) - Complete OpenAPI 3.0
- [🏗️ Architecture Guide](./docs/architecture.md) - Diagrams and technical decisions
- [🚀 Deployment Guide](./docs/deployment.md) - Step-by-step production setup
- [📋 User Stories](./docs/US/) - Detailed functional specifications
- [🧪 Testing Guide](./docs/testing.md) - Strategy and testing examples

## 🛡️ Security

- **CORS:** Strict origin configuration
- **Rate Limiting:** Request limits per IP/user
- **Input Validation:** Complete input sanitization
- **Error Handling:** No sensitive information exposure
- **Privacy:** GDPR compliance and data minimization

## 📄 Supported MTG Formats

| Format | Min Cards | Max Cards | Sideboard | Status |
|---------|-----------|-----------|-----------|---------|
| Standard | 60 | - | 15 | ✅ |
| Modern | 60 | - | 15 | ✅ |
| Pioneer | 60 | - | 15 | ✅ |
| Commander | 100 | 100 | 10 | ✅ |
| Legacy | 60 | - | 15 | ✅ |
| Vintage | 60 | - | 15 | ✅ |
| Pauper | 60 | - | 15 | ✅ |
| Draft | 40 | - | 0 | ✅ |
| Sealed | 40 | - | 0 | ✅ |

## 🎮 Deck Examples

### Modern Burn
```json
{
  "deckList": [
    {"cardName": "Lightning Bolt", "quantity": 4},
    {"cardName": "Lava Spike", "quantity": 4},
    {"cardName": "Mountain", "quantity": 20}
  ],
  "format": "modern"
}
```

### Commander Deck
```json
{
  "deckList": [
    {"cardName": "Krenko, Mob Boss", "quantity": 1},
    {"cardName": "Goblin Warchief", "quantity": 1},
    {"cardName": "Mountain", "quantity": 38}
  ],
  "format": "commander"
}
```

## 🌟 Highlighted Features

- **🔍 100% accurate validation** with updated data from Scryfall
- **📱 Mobile-first design** optimized for analysis on any device
- **⚡ Exceptional performance** with millisecond responses
- **🛡️ Privacy-first** with full user data control
- **🔧 Complete self-hosted** with Docker for easy deployment
- **📊 Complete analytics** to understand user behavior

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/mtg-deck-analyzer/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/mtg-deck-analyzer/discussions)
- **Documentation:** [Wiki](https://github.com/your-username/mtg-deck-analyzer/wiki)

**Do you have a deck you want to validate? Try the application and help us improve it!** 🚀
