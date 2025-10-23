// HTTP handler for deck composition analysis endpoint
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middyfy from '@middy/core';
import { createAnalyzeDeckCompositionUseCase } from '../../application/useCases/analyzeDeckComposition';
import { RequestId } from '../../domain/valueObjects';

/**
 * Lambda handler for deck composition analysis
 * Analyzes deck structure, mana curve, and provides improvement suggestions
 */
const analyzeDeckCompositionHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestId = RequestId.create(event.headers?.['x-request-id']);

  try {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        component: 'AnalyzeDeckCompositionHandler',
        message: 'Processing deck composition analysis request',
        requestId: requestId.toString(),
        method: event.httpMethod,
        path: event.path,
      })
    );

    // TODO: Parse request body and validate input
    const requestBody = event.body ? JSON.parse(event.body) : {};

    // TODO: Create input DTO
    const input = {
      // Placeholder - implement proper input parsing
      deckList: requestBody.deckList || [],
      format: requestBody.format || 'standard',
      includeSideboard: requestBody.includeSideboard || false,
    };

    // Execute use case
    const useCase = createAnalyzeDeckCompositionUseCase();
    const result = await useCase.execute(input, requestId.toString());

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId.toString(),
      },
      body: JSON.stringify({
        success: true,
        data: result,
        requestId: requestId.toString(),
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        component: 'AnalyzeDeckCompositionHandler',
        message: 'Error processing deck composition analysis request',
        requestId: requestId.toString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      })
    );

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId.toString(),
      },
      body: JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while analyzing deck composition',
        },
        requestId: requestId.toString(),
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export const handler = middyfy(analyzeDeckCompositionHandler);
