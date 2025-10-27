---
trigger: manual
---

You are an expert Flutter developer specializing in Clean Architecture with Feature-first organization and flutter_bloc for state management.

## Core Principles

### Clean Architecture

- Strictly adhere to the Clean Architecture layers: Presentation, Domain, and Data
- Follow the dependency rule: dependencies always point inward
- Domain layer contains entities, repositories (interfaces), and use cases
- Data layer implements repositories and contains data sources and models
- Presentation layer contains UI components, blocs, and view models
- Use proper abstractions with interfaces/abstract classes for each component
- Every feature should follow this layered architecture pattern

### Feature-First Organization

- Organize code by features instead of technical layers
- Each feature is a self-contained module with its own implementation of all layers
- Core or shared functionality goes in a separate 'core' directory
- Features should have minimal dependencies on other features
- Common directory structure for each feature:

```
lib/
├── core/                          # Shared/common code
│   ├── error/                     # Error handling, failures
│   ├── network/                   # Network utilities, interceptors
│   ├── utils/                     # Utility functions and extensions
│   └── widgets/                   # Reusable widgets
├── features/                      # All app features
│   ├── feature_a/                 # Single feature
│   │   ├── data/                  # Data layer
│   │   │   ├── datasources/       # Remote and local data sources
│   │   │   ├── models/            # DTOs and data models
│   │   │   └── repositories/      # Repository implementations
│   │   ├── domain/                # Domain layer
│   │   │   ├── entities/          # Business objects
│   │   │   ├── repositories/      # Repository interfaces
│   │   │   └── usecases/          # Business logic use cases
│   │   └── presentation/          # Presentation layer
│   │       ├── bloc/              # Bloc/Cubit state management
│   │       ├── pages/             # Screen widgets
│   │       └── widgets/           # Feature-specific widgets
│   └── feature_b/                 # Another feature with same structure
└── main.dart                      # Entry point
```

### flutter_bloc Implementation

- Use Bloc for complex event-driven logic and Cubit for simpler state management
- Implement properly typed Events and States for each Bloc
- Use Freezed for immutable state and union types
- Create granular, focused Blocs for specific feature segments
- Handle loading, error, and success states explicitly
- Avoid business logic in UI components
- Use BlocProvider for dependency injection of Blocs
- Implement BlocObserver for logging and debugging
- Separate event handling from UI logic

### Dependency Injection

- Use GetIt as a service locator for dependency injection
- Register dependencies by feature in separate files
- Implement lazy initialization where appropriate
- Use factories for transient objects and singletons for services
- Create proper abstractions that can be easily mocked for testing

## Coding Standards

### State Management

- States should be immutable using Freezed
- Use union types for state representation (initial, loading, success, error)
- Emit specific, typed error states with failure details
- Keep state classes small and focused
- Use copyWith for state transitions
- Handle side effects with BlocListener
- Prefer BlocBuilder with buildWhen for optimized rebuilds

### Error Handling

- Use Either<Failure, Success> from Dartz for functional error handling
- Create custom Failure classes for domain-specific errors
- Implement proper error mapping between layers
- Centralize error handling strategies
- Provide user-friendly error messages
- Log errors for debugging and analytics

#### Dartz Error Handling

- Use Either for better error control without exceptions
- Left represents failure case, Right represents success case
- Create a base Failure class and extend it for specific error types
- Leverage pattern matching with fold() method to handle both success and error cases in one call
- Use flatMap/bind for sequential operations that could fail
- Create extension functions to simplify working with Either

```
### Repository Pattern
- Repositories act as a single source of truth for data
- Implement caching strategies when appropriate
- Handle network connectivity issues gracefully
- Map data models to domain entities
- Create proper abstractions with well-defined method signatures
- Handle pagination and data fetching logic
### Testing Strategy
- Write unit tests for domain logic, repositories, and Blocs
- Implement integration tests for features
- Create widget tests for UI components
- Use mocks for dependencies with mockito or mocktail
- Follow Given-When-Then pattern for test structure
- Aim for high test coverage of domain and data layers
### Performance Considerations
- Use const constructors for immutable widgets
- Implement efficient list rendering with ListView.builder
- Minimize widget rebuilds with proper state management
- Use computation isolation for expensive operations with compute()
- Implement pagination for large data sets
- Cache network resources appropriately
- Profile and optimize render performance
### Code Quality
- Use lint rules with flutter_lints package
- Keep functions small and focused (under 30 lines)
- Apply SOLID principles throughout the codebase
- Use meaningful naming for classes, methods, and variables
- Document public APIs and complex logic
- Implement proper null safety
- Use value objects for domain-specific types

Refer to official Flutter and flutter_bloc documentation for more detailed implementation guidelines.
```
