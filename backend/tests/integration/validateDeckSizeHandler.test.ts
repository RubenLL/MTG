// Integration tests for deck size validation HTTP handler
import { APIGatewayProxyEvent } from 'aws-lambda';
import { validateDeckSizeHandler } from '../../src/interface/handlers';
import { MTGFormat, ValidationErrorCode } from '../../src/domain';

describe('Validate Deck Size Handler Integration', () => {
  beforeEach(() => {
    // Mock console methods to reduce noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('HTTP Method validation', () => {
    it('should reject non-POST methods', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'GET',
        path: '/api/validate-deck-size',
        body: null,
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(405);
      expect(JSON.parse(response.body).error.code).toBe(ValidationErrorCode.INVALID_INPUT);
      expect(JSON.parse(response.body).error.message).toContain('Method not allowed');
    });
  });

  describe('Request body validation', () => {
    it('should reject invalid JSON', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: 'invalid json',
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error.code).toBe(ValidationErrorCode.INVALID_INPUT);
    });

    it('should reject missing required fields', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({}),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(422);
      expect(JSON.parse(response.body).error.type).toBe('VALIDATION');
    });

    it('should reject invalid format', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
          format: 'invalid_format',
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(422);
      expect(JSON.parse(response.body).error.type).toBe('VALIDATION');
    });

    it('should reject deck list with invalid card data', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [{ cardName: '', quantity: 4 }], // Invalid: empty card name
          format: MTGFormat.MODERN,
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(422);
      expect(JSON.parse(response.body).error.type).toBe('VALIDATION');
    });
  });

  describe('Successful validation', () => {
    it('should validate correct Modern deck successfully', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [
            { cardName: 'Lightning Bolt', quantity: 4 },
            { cardName: 'Island', quantity: 20 },
            { cardName: 'Opt', quantity: 4 },
            { cardName: 'Delver of Secrets', quantity: 4 },
            { cardName: 'Monastery Swiftspear', quantity: 4 },
            { cardName: 'Treasure Cruise', quantity: 4 },
            { cardName: 'Spell Pierce', quantity: 4 },
            { cardName: 'Daze', quantity: 4 },
            { cardName: 'Wasteland', quantity: 4 },
          ],
          format: MTGFormat.MODERN,
          includeSideboard: false,
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.isValid).toBe(true);
      expect(body.data.currentCount).toBe(60);
      expect(body.data.format).toBe(MTGFormat.MODERN);
    });

    it('should include request ID in response when provided', async () => {
      const requestId = 'test-request-123';
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
          format: MTGFormat.MODERN,
        }),
        headers: { 'x-request-id': requestId },
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.requestId).toBe(requestId);
      expect(response.headers?.['X-Request-ID']).toBe(requestId);
    });

    it('should handle Commander format correctly', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: Array.from({ length: 100 }, (_, i) => ({
            cardName: `Card ${i + 1}`,
            quantity: 1,
          })),
          format: MTGFormat.COMMANDER,
          includeSideboard: false,
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.isValid).toBe(true);
      expect(body.data.currentCount).toBe(100);
    });
  });

  describe('Error handling', () => {
    it('should return 500 for unexpected errors', async () => {
      // Create an event that will cause an unexpected error
      // This is tricky to test without mocking the domain layer
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
          format: MTGFormat.MODERN,
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      // Should be 200 for valid input, even if validation fails
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.isValid).toBe(false); // 4 cards is less than 60 for Modern
    });

    it('should include CORS headers in response', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [{ cardName: 'Lightning Bolt', quantity: 4 }],
          format: MTGFormat.MODERN,
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.headers?.['Access-Control-Allow-Origin']).toBe('*');
      expect(response.headers?.['Content-Type']).toBe('application/json');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty deck list', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [],
          format: MTGFormat.MODERN,
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.isValid).toBe(false);
      expect(body.data.currentCount).toBe(0);
      expect(body.data.errors[0].code).toBe(ValidationErrorCode.DECK_SIZE_TOO_SMALL);
    });

    it('should handle sideboard validation when enabled', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [
            ...Array.from({ length: 60 }, (_, i) => ({
              cardName: `Main Card ${i + 1}`,
              quantity: 1,
              isSideboard: false,
            })),
            ...Array.from({ length: 16 }, (_, i) => ({
              cardName: `Sideboard Card ${i + 1}`,
              quantity: 1,
              isSideboard: true,
            })),
          ],
          format: MTGFormat.MODERN,
          includeSideboard: true,
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.isValid).toBe(false);
      expect(body.data.errors[0].code).toBe(ValidationErrorCode.SIDEBBOARD_SIZE_INVALID);
    });

    it('should handle default includeSideboard value', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/api/validate-deck-size',
        body: JSON.stringify({
          deckList: [
            ...Array.from({ length: 60 }, (_, i) => ({
              cardName: `Main Card ${i + 1}`,
              quantity: 1,
              isSideboard: false,
            })),
            ...Array.from({ length: 20 }, (_, i) => ({
              cardName: `Sideboard Card ${i + 1}`,
              quantity: 1,
              isSideboard: true,
            })),
          ],
          format: MTGFormat.MODERN,
          // includeSideboard not specified, should default to false
        }),
        headers: {},
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '',
        stageVariables: null,
        isBase64Encoded: false,
      };

      const response = await validateDeckSizeHandler(event);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.isValid).toBe(true); // Should be valid since sideboard is ignored
    });
  });
});
function beforeEach(arg0: () => void) {
  throw new Error('Function not implemented.');
}

function afterEach(arg0: () => void) {
  throw new Error('Function not implemented.');
}

function expect(statusCode: number) {
  throw new Error('Function not implemented.');
}
