# MTG Deck Analyzer Frontend - Setup Instructions

## Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   flutter pub get
   ```

3. **Generate necessary files:**
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

4. **Run the application:**
   ```bash
   flutter run
   ```

## Project Structure

The project follows Clean Architecture with Feature-first organization:

- **Core Layer**: Shared utilities, configuration, and reusable components
- **Feature Layers**: Self-contained features (Home, Deck Validation, etc.)
- **Clean Separation**: Presentation, Domain, and Data layers within each feature

## Architecture Benefits

1. **Maintainability**: Clear separation of concerns makes code easy to maintain
2. **Testability**: Each layer can be independently tested
3. **Scalability**: New features can be added without affecting existing code
4. **Developer Experience**: Feature-first organization makes navigation intuitive

## Key Features Implemented

- ✅ Home screen with navigation to features
- ✅ Deck validation with format selection
- ✅ Clean Architecture implementation
- ✅ Flutter Bloc state management
- ✅ Dependency injection with GetIt
- ✅ Comprehensive error handling
- ✅ Mobile-first responsive design

## Next Steps

1. **Code Generation**: Run build_runner to generate Freezed files
2. **Testing**: Add unit tests for all layers
3. **UI Polish**: Enhance the user interface with MTG-themed styling
4. **Backend Integration**: Connect to the backend API
5. **Additional Features**: Implement remaining features (card lookup, format analysis, etc.)

## Development Guidelines

- Follow the architecture patterns established
- Write tests for all new code
- Use the established error handling patterns
- Maintain the feature-first organization
- Follow the linting rules in analysis_options.yaml
