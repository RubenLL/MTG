# MTG Deck Analyzer - Development Errors and Solutions

This document logs errors encountered during development of the MTG Deck Analyzer, along with their causes and resolutions. Errors are listed chronologically based on conversation history.

## 4. TypeScript Error: 'error' is of type 'unknown'

- **Error Description**: `'error' is of type 'unknown'` in `localDev/index.ts` when trying to access `error.message` in a catch block.
- **Cause**: TypeScript 4.0+ treats caught errors as `unknown` by default for better type safety, requiring explicit type checking before accessing properties.
- **Solution**:
  1. Added a type guard to safely access the error message:
     ```typescript
     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
     ```
  2. Used the safe `errorMessage` variable in the response instead of directly accessing `error.message`
- **Files Affected**:
  - `/backend/localDev/index.ts`
- **Status**: Resolved by implementing proper type checking for caught errors.
- **Verification**: The code now compiles without TypeScript errors and safely handles both Error objects and unknown error types.

## 3. Missing Import for DeckListChanged Event

- **Error Description**: `The method 'DeckListChanged' isn't defined for the type 'DeckInputField'` in `deck_input_field.dart`
- **Cause**: The `DeckListChanged` event class was being used in the `onChanged` callback of a `TextField`, but the file was missing the required import for the event class.
- **Solution**:
  1. Added the missing import at the top of `deck_input_field.dart`:
     ```dart
     import '../bloc/deck_validation_event.dart';
     ```
  2. This makes the `DeckListChanged` event class available for use in the widget.
- **Files Affected**:
  - `lib/src/features/deck_validation/presentation/widgets/deck_input_field.dart`
- **Status**: Resolved by adding the missing import.
- **Verification**: The code should now compile without errors, and the text field should properly dispatch `DeckListChanged` events when the content changes.

## 1. Flutter Project Setup - Missing Platform Configurations

- **Error Description**: `No devices found yet. Checking for wireless devices... No supported devices connected.` when running `flutter run`.
- **Cause**: The Flutter project was missing platform-specific configurations and files needed to run on any platform (iOS, Android, web, desktop).
- **Solution**:
  1. Run `flutter create .` in the project root directory to generate all missing platform configurations.
  2. This command created/updated:
     - iOS project files and configurations
     - Android project files and configurations
     - Web configuration and assets
     - macOS, Windows, and Linux desktop support
     - Basic test files
     - IDE configurations
- **Status**: Resolved after running `flutter create .` which set up all necessary platform configurations.
- **Verification**: After running the command, `flutter devices` should list available devices/emulators.

## 2. PathError in Express Route Parsing

- **Error Description**: `PathError [TypeError]: Missing parameter name at index 1: *` (or similar for `'/*'`). Occurred in the bundled `dist/localDev/index.js` when defining the 404 handler in Express.
- **Cause**: The `path-to-regexp` library (used by Express) failed to parse wildcard routes like `'*'` or `'/*'` in the minified bundle, expecting a parameter name instead of a simple wildcard.
- **Solution**:
  - Change the 404 handler from `app.use('/*', ...)` or `app.use('*', ...)` to `app.use((req, res) => { ... })` (no path for global catch-all).
  - This avoids `path-to-regexp` parsing. Place the handler at the end of all routes.
  - Additionally, consider refactoring away from Express to a serverless setup (e.g., using Node.js `http` module) to align with project rules (Clean Architecture for AWS Lambda, avoiding Express).
- **Status**: Resolved after update; server runs without crashes.

## 2. TypeError: Cannot read properties of undefined (reading 'format')

- **Error Description**: `TypeError: Cannot read properties of undefined (reading 'format')` at line 67148 in `dist/localDev/index.js`. Triggered when making a POST request to `/dev/validateDeckSize` without a JSON payload.
- **Cause**: `req.body` was `undefined` when no body was sent, and the code attempted to access `req.body.format` in logging or validation without checking if `req.body` exists.
- **Solution**:
  - Add a guard check at the start of the endpoint: `if (!req.body || typeof req.body !== 'object') { return res.status(422).json({ error: 'Request body is required' }); }`.
  - Update logging to use safe access: `format: req.body.format || undefined`.
  - Ensure `express.json()` middleware is properly configured.
  - For long-term, refactor to serverless (e.g., manual body parsing in `http` server) to avoid middleware dependencies.
- **Status**: Resolved; validation endpoint now handles missing payloads gracefully and returns 422 error.

## Additional Notes

- **Architectural Reminder**: The project follows Clean Architecture for AWS Lambda. Using Express is discouraged—local dev servers should mimic Lambda handlers for consistency.
- **Testing**: After fixes, test with valid and invalid requests (e.g., no payload, invalid JSON) to ensure robustness.
- **Bundle Issues**: Errors in `dist/` files are due to minification—use source maps (`--sourcemap` in esbuild) or test with `ts-node` for unbundled debugging.
- **Next Steps**: Monitor for new errors and update this file. Focus on migrating to a fully serverless setup to prevent framework-related issues.

This document was generated on Oct 24, 2025, based on development logs.
