// HTTP handler for card validation endpoint
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middyfy from '@middy/core';
import { createValidateCardsUseCase } from '../../application/useCases/validateCards';
import { RequestId } from '../../domain/valueObjects';

/**
 * Lambda handler for card validation
 * Validates individual cards or card lists against MTG rules
 */
const validateCardsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestId = RequestId.create(event.headers?.['x-request-id']);

  try {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        component: 'ValidateCardsHandler',
        message: 'Processing card validation request',
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
      cards: requestBody.cards || [],
      format: requestBody.format || 'standard',
    };

    // Execute use case
    const useCase = createValidateCardsUseCase();
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
        component: 'ValidateCardsHandler',
        message: 'Error processing card validation request',
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
          message: 'An unexpected error occurred while validating cards',
        },
        requestId: requestId.toString(),
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export const handler = middyfy(validateCardsHandler);
