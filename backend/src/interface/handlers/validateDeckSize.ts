// HTTP handler for deck size validation endpoint
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Joi from 'joi';
import { RequestId } from '../../domain/valueObjects';
import {
  ValidateDeckSizeUseCase,
  createValidateDeckSizeUseCase,
  ValidateDeckSizeInputDto,
  ValidateDeckSizeOutputDto
} from '../../application';
import { MTGFormat, ValidationErrorCode } from '../../domain';

// Input validation schema using Joi
const deckSizeValidationSchema = Joi.object({
  deckList: Joi.array()
    .items(
      Joi.object({
        cardName: Joi.string().required().min(1).max(200),
        quantity: Joi.number().integer().min(1).max(100).required(),
        isSideboard: Joi.boolean().optional().default(false)
      })
    )
    .min(1)
    .required(),
  format: Joi.string()
    .valid(...Object.values(MTGFormat))
    .required(),
  includeSideboard: Joi.boolean().optional().default(false),
  requestId: Joi.string().optional()
});

/**
 * HTTP handler for POST /api/validate-deck-size
 * Validates deck size according to MTG format requirements
 */
export async function validateDeckSizeHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const requestId = RequestId.create(event.headers?.['x-request-id']);

  try {
    // Only allow POST method
    if (event.httpMethod !== 'POST') {
      return createErrorResponse(
        405,
        ValidationErrorCode.INVALID_INPUT,
        'Method not allowed. Use POST.',
        requestId.toString()
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      return createErrorResponse(
        400,
        ValidationErrorCode.INVALID_INPUT,
        'Invalid JSON in request body',
        requestId.toString()
      );
    }

    const { error: validationError, value: validatedInput } = deckSizeValidationSchema.validate(body);

    if (validationError) {
      return createErrorResponse(
        422,
        ValidationErrorCode.INVALID_INPUT,
        'Validation failed',
        requestId.toString(),
        {
          validationErrors: validationError.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }))
        }
      );
    }

    // Execute use case
    const useCase = createValidateDeckSizeUseCase();
    const domainResult = await useCase.execute(validatedInput, requestId.toString());

    // Create success response
    return createSuccessResponse(domainResult, requestId.toString());

  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      component: 'ValidateDeckSizeHandler',
      message: 'Unexpected error in validate deck size handler',
      requestId: requestId.toString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }));

    return createErrorResponse(
      500,
      ValidationErrorCode.INVALID_INPUT,
      'Internal server error',
      requestId.toString()
    );
  }
}

/**
 * Create a success response
 */
function createSuccessResponse(
  result: any,
  requestId: string
): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Request-ID': requestId
    },
    body: JSON.stringify({
      success: true,
      data: result,
      requestId,
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * Create an error response
 */
function createErrorResponse(
  statusCode: number,
  errorCode: ValidationErrorCode,
  message: string,
  requestId: string,
  details?: unknown
): APIGatewayProxyResult {
  const errorType = mapStatusCodeToErrorType(statusCode);

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Request-ID': requestId
    },
    body: JSON.stringify({
      success: false,
      error: {
        code: errorCode,
        type: errorType,
        message,
        details,
        retryable: statusCode >= 500
      },
      requestId,
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * Map HTTP status code to error type
 */
function mapStatusCodeToErrorType(statusCode: number): string {
  if (statusCode >= 400 && statusCode < 500) {
    return statusCode === 401 || statusCode === 403 ? 'AUTHENTICATION' :
           statusCode === 409 || statusCode === 422 ? 'BUSINESS' :
           'VALIDATION';
  }
  return 'SYSTEM';
}
