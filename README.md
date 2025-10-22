# MTG Deck Analyzer 🎴

[![Flutter](https://img.shields.io/badge/Flutter-3.24.0-blue.svg)](https://flutter.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-Node.js-orange.svg)](https://aws.amazon.com/lambda)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Sistema completo para análisis y validación de decks de Magic: The Gathering con validación automática de legalidad por formato, análisis de estructura y recomendaciones de mejora.

## ✨ Características Principales

### 🔍 Validación Completa de Decks
- **Validación por formato:** Standard, Modern, Pioneer, Commander, Legacy, Vintage, Pauper, Draft, Sealed
- **Verificación de copias:** Control automático del número máximo de copias por carta
- **Cartas prohibidas/restringidas:** Detección automática según listas oficiales de cada formato
- **Análisis de legalidad:** Validación por fecha de impresión y sets legales

### 📊 Análisis Avanzado
- **Curva de maná:** Análisis visual de distribución de costos
- **Base de maná:** Evaluación de consistencia de colores y tierras
- **Agrupación por tipo:** Organización automática de cartas por categorías
- **Sugerencias de mejora:** Recomendaciones específicas para optimización

### 📤 Importación y Exportación
- **MTG Arena:** Importación directa desde formato estándar de Arena
- **Magic Online (MTGO):** Soporte completo para formato MTGO
- **Exportación múltiple:** Varios formatos de exportación disponibles
- **Copy to clipboard:** Funcionalidad integrada para compartir

## 🏗️ Arquitectura

### Frontend (Flutter)
- **Framework:** Flutter 3.24.0 con Dart
- **UI/UX:** Mobile-first responsive design
- **Accessibility:** WCAG 2.1 AA compliance
- **State Management:** Provider pattern
- **Performance:** < 100ms response time objetivo

### Backend (TypeScript/AWS Lambda)
- **Runtime:** Node.js 20+ en AWS Lambda
- **API:** RESTful con OpenAPI 3.0 specification
- **Validation:** Joi schema validation
- **Error Handling:** Middleware global con business error codes
- **Performance:** < 100ms response time, 99.9% uptime objetivo

### Base de Datos
- **Primary:** DynamoDB para almacenamiento de cartas y caching
- **External APIs:** Scryfall API (principal), Gatherer API (fallback)
- **Caching Strategy:** Multi-level caching con invalidation automática

### Instrumentación (FOSS)
- **Analytics:** PostHog self-hosted
- **Error Tracking:** Sentry open source
- **Performance Monitoring:** Web Vitals + custom traces
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Dashboards:** Grafana con alertas automáticas

## 🚀 Instalación

### Prerrequisitos
- Node.js 20+
- Flutter 3.24.0+
- AWS CLI configurado
- Docker (para desarrollo local)

### Setup del Proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/mtg-deck-analyzer.git
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

4. **Instrumentación (Opcional)**
```bash
cd infrastructure
docker-compose up -d
```

## 📖 Uso

### Validación Básica de Deck

```typescript
// Ejemplo de uso de la API
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

### Frontend Flutter

```dart
// Ejemplo de uso en Flutter
final validator = DeckValidationService();
final result = await validator.validateDeck(
  deckList: deckText,
  format: selectedFormat,
);

if (result.isValid) {
  // Mostrar resultado válido
} else {
  // Mostrar errores específicos
}
```

## 📋 User Stories Implementadas

### Sprint 1 - MVP Core ✅
- **US-001a:** Frontend Requirements - UI responsiva y accesible
- **US-001b:** Backend Requirements - API RESTful con validación
- **US-001c:** Instrumentation & Monitoring - Stack FOSS completo
- **US-002:** Card Existence Validation - Verificación de cartas válidas
- **US-003:** Card Copies & Restrictions - Control de copias y banned cards
- **US-004:** Format Legality Analysis - Análisis de legalidad por formato

### Sprint 2 - Performance Analysis (Planificado)
- **US-005:** Mana Curve Analysis - Análisis visual de curva de maná
- **US-006:** Mana Base Analysis - Evaluación de base de maná
- **US-007:** Mana Base Improvements - Sugerencias de optimización
- **US-008:** Card Grouping by Type - Organización por categorías

### Sprint 3 - Import/Export (Planificado)
- **US-009:** MTG Arena Import - Importación desde Arena
- **US-010:** MTGO Import - Importación desde MTGO
- **US-011:** Deck Export - Exportación múltiple de formatos

## 🧪 Testing

### Estrategia de Testing
- **Unit Tests:** Lógica de negocio y utilidades
- **Integration Tests:** API endpoints y servicios externos
- **E2E Tests:** Flujos completos de usuario
- **Performance Tests:** Load testing y benchmarks

```bash
# Ejecutar tests
npm test                    # Backend tests
flutter test               # Frontend tests
npm run test:e2e          # End-to-end tests
npm run test:performance  # Performance benchmarks
```

## 📊 Métricas de Performance

### Objetivos de Calidad
- **Response Time:** < 100ms (API), < 100ms (UI updates)
- **Uptime:** 99.9% availability
- **Accuracy:** 100% precisión en validación de cartas existentes
- **Accessibility:** WCAG 2.1 AA compliance
- **Mobile Performance:** 60fps en dispositivos móviles

### Monitoreo
- **Real-time Dashboards:** Kibana y Grafana
- **Error Tracking:** Sentry con context completo
- **Performance Monitoring:** Web Vitals automáticos
- **User Analytics:** PostHog para comportamiento de usuario

## 🤝 Contribución

### Como Contribuir
1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- **TypeScript:** ESLint + Prettier
- **Flutter:** Dart analyzer + Flutter linting rules
- **Commits:** Conventional commits
- **Testing:** 80% code coverage mínimo

## 📝 Documentación

### Documentación Técnica
- [API Specification](./docs/api-specification.md)
- [Architecture Guide](./docs/architecture.md)
- [Deployment Guide](./docs/deployment.md)
- [User Stories](./docs/US/)

### Recursos de MTG
- [Scryfall API Documentation](https://scryfall.com/docs/api)
- [MTG Format Rules](https://magic.wizards.com/en/game-info/gameplay/formats)
- [Banned & Restricted Lists](https://magic.wizards.com/en/game-info/gameplay/formats/banned-restricted)

## 🐛 Reportar Issues

Si encuentras un bug o tienes una sugerencia, por favor crea un issue en GitHub con:
- Descripción detallada del problema
- Pasos para reproducir
- Deck list de ejemplo (si aplica)
- Formato y resultado esperado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Acknowledgments

- **Scryfall** por su excelente API de cartas de MTG
- **Magic: The Gathering** por el juego que inspiró este proyecto
- **Flutter Team** por el framework móvil excepcional
- **AWS** por la infraestructura cloud confiable

## 🏃‍♂️ Inicio Rápido (Quick Start)

### Para Desarrolladores

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

### Para Usuarios Finales

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

## 📊 Estado del Proyecto

### ✅ Completado (Sprint 1 - MVP Core)
- [x] API de validación de deck size
- [x] UI responsiva en Flutter
- [x] Sistema de instrumentación FOSS
- [x] Validación de cartas existentes
- [x] Control de copias y cartas banned/restricted
- [x] Análisis de legalidad por formato

### 🚧 En Desarrollo (Sprint 2 - Analysis Features)
- [ ] Análisis de curva de maná
- [ ] Evaluación de base de maná
- [ ] Sugerencias de optimización
- [ ] Agrupación de cartas por tipo

### 📋 Planificado (Sprint 3 - Import/Export)
- [ ] Importación desde MTG Arena
- [ ] Importación desde MTGO
- [ ] Exportación múltiple de formatos

## 🎯 Ejemplos de Uso

### Validación de Deck Modern

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

## 🔧 Configuración de Desarrollo

### Variables de Entorno

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

### Scripts Disponibles

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

### Métricas Clave
- **API Response Time:** < 100ms P95
- **UI Response Time:** < 100ms para updates
- **Uptime:** 99.9% monthly
- **Error Rate:** < 0.1%
- **Mobile Performance:** 60fps consistent

### Dashboards Disponibles
- **Kibana:** Logging y error analysis
- **Grafana:** Performance metrics y alertas
- **PostHog:** User behavior y conversion funnels
- **Sentry:** Error tracking y performance monitoring

## 🤖 API Endpoints

| Endpoint | Method | Descripción | Status |
|----------|--------|-------------|---------|
| `/api/validate-deck-size` | POST | Validar tamaño de deck | ✅ |
| `/api/validate-cards` | POST | Verificar cartas existentes | ✅ |
| `/api/check-legality` | POST | Análisis de legalidad | ✅ |
| `/api/analyze-mana-curve` | POST | Curva de maná | 🚧 |
| `/api/analyze-mana-base` | POST | Base de maná | 🚧 |
| `/api/import/arena` | POST | Importar desde Arena | 📋 |
| `/api/import/mtgo` | POST | Importar desde MTGO | 📋 |

## 📚 Documentación Adicional

- [📖 API Documentation](./docs/api-specification.md) - OpenAPI 3.0 completa
- [🏗️ Architecture Guide](./docs/architecture.md) - Diagramas y decisiones técnicas
- [🚀 Deployment Guide](./docs/deployment.md) - Setup de producción paso a paso
- [📋 User Stories](./docs/US/) - Especificaciones funcionales detalladas
- [🧪 Testing Guide](./docs/testing.md) - Estrategia y ejemplos de testing

## 🛡️ Seguridad

- **CORS:** Configuración estricta de origenes permitidos
- **Rate Limiting:** Límite de requests por IP/usuario
- **Input Validation:** Sanitización completa de inputs
- **Error Handling:** No exposición de información sensible
- **Privacy:** GDPR compliance y data minimization

## 📄 Formatos de MTG Soportados

| Formato | Min Cards | Max Cards | Sideboard | Status |
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

## 🎮 Ejemplos de Decks

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

## 🌟 Características Destacadas

- **🔍 Validación 100% precisa** con datos actualizados de Scryfall
- **📱 Mobile-first design** optimizado para análisis en cualquier dispositivo
- **⚡ Performance excepcional** con respuestas en milisegundos
- **🛡️ Privacy-first** con control total sobre datos de usuario
- **🔧 Self-hosted** completo con Docker para deployment fácil
- **📊 Analytics completo** para entender comportamiento de usuarios

---

## 📞 Soporte

- **Issues:** [GitHub Issues](https://github.com/tu-usuario/mtg-deck-analyzer/issues)
- **Discussions:** [GitHub Discussions](https://github.com/tu-usuario/mtg-deck-analyzer/discussions)
- **Documentation:** [Wiki](https://github.com/tu-usuario/mtg-deck-analyzer/wiki)

**¿Tienes un deck que quieres validar? ¡Prueba la aplicación y ayúdanos a mejorarla!** 🚀
