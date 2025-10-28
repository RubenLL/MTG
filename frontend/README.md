# MTG Deck Analyzer Frontend

A Flutter application for analyzing and validating Magic: The Gathering decks, built with Clean Architecture and Feature-first organization.

## Architecture Overview

This project follows the **Clean Architecture** principles with a **Feature-first** organization pattern, ensuring separation of concerns, testability, and maintainability.

### Core Principles

- **Clean Architecture**: Strict separation of concerns with Presentation, Domain, and Data layers
- **Feature-first Organization**: Code organized by features rather than technical layers
- **Dependency Inversion**: Dependencies point inward towards the domain layer
- **SOLID Principles**: Applied throughout the codebase for maintainable code

### Project Structure

```
lib/
├── core/                          # Shared/common code
│   ├── config/                    # App configuration, DI, routing
│   ├── error/                     # Error handling and failures
│   ├── network/                   # Network utilities and interceptors
│   ├── routes/                    # Navigation and routing
│   ├── utils/                     # Utility functions and extensions
│   └── widgets/                   # Reusable widgets
└── features/                      # All app features
    ├── home/                      # Home/landing feature
    │   ├── data/                  # Data layer
    │   │   ├── datasources/       # Remote and local data sources
    │   │   ├── models/            # DTOs and data models
    │   │   └── repositories/      # Repository implementations
    │   ├── domain/                # Domain layer
    │   │   ├── entities/          # Business objects
    │   │   ├── repositories/      # Repository interfaces
    │   │   └── usecases/          # Business logic use cases
    │   └── presentation/          # Presentation layer
    │       ├── bloc/              # Bloc/Cubit state management
    │       ├── pages/             # Screen widgets
    │       └── widgets/           # Feature-specific widgets
    └── deck_validation/           # Deck validation feature
        ├── data/
        ├── domain/
        └── presentation/
```

## Technology Stack

- **Framework**: Flutter 3.0+
- **State Management**: flutter_bloc with Freezed for immutable states
- **Dependency Injection**: GetIt service locator
- **Functional Programming**: Dartz for Either types and error handling
- **Network**: HTTP client with connectivity checking
- **Storage**: SharedPreferences for local caching

## Getting Started

### Prerequisites

- Flutter SDK 3.0+
- Dart SDK 3.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mtg-deck-analyzer/frontend
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Code Generation**
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

4. **Run the app**
   ```bash
   flutter run
   ```

## Features

### Home
- Welcome screen with feature navigation
- App overview and quick access to tools

### Deck Validation
- Input deck lists in various formats (MTG Arena, MTGO, standard)
- Select from multiple MTG formats
- Real-time validation with detailed feedback
- Error and warning reporting

## Development Guidelines

### State Management
- Use Bloc for complex event-driven logic
- Implement immutable states with Freezed
- Handle loading, error, and success states explicitly
- Use proper error mapping and user-friendly messages

### Error Handling
- Use Either<Failure, Success> pattern from Dartz
- Create specific Failure types for different error scenarios
- Implement proper error mapping between layers
- Provide meaningful error messages to users

### Testing
- Unit tests for domain logic and use cases
- Widget tests for UI components
- Integration tests for features
- Mock dependencies using mockito/mocktail

### Code Quality
- Follow flutter_lints rules
- Keep functions small and focused (under 30 lines)
- Use meaningful naming conventions
- Document public APIs and complex logic
- Implement proper null safety

## Building for Production

```bash
# Generate production build
flutter build apk --release
flutter build ios --release

# For web
flutter build web --release
```

## Contributing

1. Follow the established architecture patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure code passes all linting rules
5. Use conventional commits for git messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
