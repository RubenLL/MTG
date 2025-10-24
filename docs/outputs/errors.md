# MTG Deck Analyzer Backend Errors and Solutions

This document logs errors encountered during development of the MTG Deck Analyzer backend, along with their causes and resolutions. Errors are listed chronologically based on conversation history.

## 1. PathError in Express Route Parsing
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
