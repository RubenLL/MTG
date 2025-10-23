// Main entry point for MTG Deck Analyzer Backend
// This file serves as the Lambda handler entry point

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Import handlers when implemented
import { validateDeckSizeHandler } from './handlers/validateDeckSize';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Route to appropriate handler based on path
    const path = event.path;
    const method = event.httpMethod;

    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'mtg-deck-analyzer-backend',
          version: '1.0.0',
        }),
      };
    }

    // API endpoints routing
    switch (path) {
      case '/api/validate-deck-size':
        return await validateDeckSizeHandler(event);
      case '/api/validate-cards':
        return {
          statusCode: 501,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Not Implemented',
            message: 'Validate cards endpoint not yet implemented',
          }),
        };
      case '/api/analyze-deck-composition':
        return {
          statusCode: 501,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Not Implemented',
            message: 'Analyze deck composition endpoint not yet implemented',
          }),
        };
      default:
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'Not Found',
            message: `Route ${method} ${path} not found`,
            availableEndpoints: [
              'GET /health',
              'POST /api/validate-deck-size',
              // Add more endpoints as implemented
            ],
          }),
        };
    }
  } catch (error) {
    console.error('Unhandled error in Lambda handler:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        requestId: event.headers?.['x-request-id'] || 'unknown',
      }),
    };
  }
};
