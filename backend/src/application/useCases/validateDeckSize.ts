// Application use case for deck size validation
import { RequestId } from '../../domain/valueObjects';
import {
  validateDeckSize as validateDeckSizeDomain,
  DeckSizeValidationInput,
  DeckSizeValidationResult
} from '../../domain';

/**
 * Use case for validating deck size according to format requirements
 * Follows Clean Architecture principles - orchestration layer between interface and domain
 */
export class ValidateDeckSizeUseCase {
  /**
   * Execute deck size validation
   * @param input Validation input including deck list and format
   * @param requestId Optional request correlation ID for tracing
   * @returns Validation result with detailed information
   */
  async execute(
    input: DeckSizeValidationInput,
    requestId?: string
  ): Promise<DeckSizeValidationResult> {
    const correlationId = RequestId.create(requestId);

    try {
      // Log validation start
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        component: 'ValidateDeckSizeUseCase',
        message: 'Starting deck size validation',
        requestId: correlationId.toString(),
        format: input.format,
        deckListSize: input.deckList.length,
        includeSideboard: input.includeSideboard
      }));

      // Execute domain validation
      const result = validateDeckSizeDomain(input);

      // Log validation result
      const logLevel = result.isValid ? 'info' : 'warn';
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: logLevel,
        component: 'ValidateDeckSizeUseCase',
        message: result.isValid ? 'Deck validation completed successfully' : 'Deck validation failed',
        requestId: correlationId.toString(),
        format: input.format,
        isValid: result.isValid,
        mainDeckCount: result.validationDetails.mainDeckCount,
        sideboardCount: result.validationDetails.sideboardCount,
        includeSideboard: input.includeSideboard,
        durationMs: Date.now() // This would be better with proper timing in a real implementation
      }));

      return result;

    } catch (error) {
      // Log unexpected errors
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        component: 'ValidateDeckSizeUseCase',
        message: 'Unexpected error during deck size validation',
        requestId: correlationId.toString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        format: input.format
      }));

      // Re-throw the error for the interface layer to handle
      throw error;
    }
  }
}

/**
 * Factory function to create use case instance
 * Allows for dependency injection if needed in the future
 */
export function createValidateDeckSizeUseCase(): ValidateDeckSizeUseCase {
  return new ValidateDeckSizeUseCase();
}
