import express from 'express';
import Joi from 'joi';

// Import the domain logic from the main project

import { validateDeckSize } from '../src/domain/deckSizeValidation.js';
import { MTGFormat, ValidationErrorCode } from '../src/domain/entities/index.js';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Input validation schema using Joi (matching the domain requirements)
const deckSizeValidationSchema = Joi.object({
  deckList: Joi.array()
    .items(
      Joi.object({
        cardName: Joi.string().required().min(1).max(200),
        quantity: Joi.number().integer().min(1).max(100).required(),
        isSideboard: Joi.boolean().optional().default(false),
      })
    )
    .min(1)
    .required(),
  format: Joi.string()
    .valid(...Object.values(MTGFormat))
    .required(),
  includeSideboard: Joi.boolean().optional().default(false),
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'mtg-deck-analyzer-local-test',
    version: '1.0.0',
  });
});

// Main validation endpoint
app.post('/dev/validateDeckSize', async (req, res) => {
  const requestId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    if (req.body === undefined) {
      const errorResponse = {
        success: false,
        error: {
          code: ValidationErrorCode.INVALID_INPUT,
          type: 'VALIDATION',
          message: 'Validation failed',
          details: 'No body provided',
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      };

      return res.status(422).json(errorResponse);
    }
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        component: 'LocalTestServer',
        message: 'Starting deck size validation',
        requestId,
        format: req.body.format || undefined,
        deckListSize: req.body.deckList?.length || undefined,
        includeSideboard: req.body.includeSideboard || undefined,
      })
    );
    if (req.body === undefined) {
      const errorResponse = {
        success: false,
        error: {
          code: ValidationErrorCode.INVALID_INPUT,
          type: 'VALIDATION',
          message: 'Validation failed',
          details: 'No body provided',
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      };

      return res.status(422).json(errorResponse);
    }

    // Validate input
    const { error: validationError, value: validatedInput } = deckSizeValidationSchema.validate(
      req.body
    );

    if (validationError) {
      const errorResponse = {
        success: false,
        error: {
          code: ValidationErrorCode.INVALID_INPUT,
          type: 'VALIDATION',
          message: 'Validation failed',
          details: validationError.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value,
          })),
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      };

      return res.status(422).json(errorResponse);
    }

    // Execute domain validation
    const result = validateDeckSize(validatedInput);

    // Create success response
    const successResponse = {
      success: true,
      data: result,
      requestId,
      timestamp: new Date().toISOString(),
    };

    // Log result
    const logLevel = result.isValid ? 'info' : 'warn';
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: logLevel,
        component: 'LocalTestServer',
        message: result.isValid
          ? 'Deck validation completed successfully'
          : 'Deck validation failed',
        requestId,
        format: validatedInput.format,
        isValid: result.isValid,
        mainDeckCount: result.validationDetails.mainDeckCount,
        sideboardCount: result.validationDetails.sideboardCount,
      })
    );

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        component: 'LocalTestServer',
        message: 'Unexpected error during deck size validation',
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        format: req.body.format,
      })
    );

    const errorResponse = {
      success: false,
      error: {
        code: ValidationErrorCode.INVALID_INPUT,
        type: 'SYSTEM',
        message: 'Internal server error',
        retryable: true,
      },
      requestId,
      timestamp: new Date().toISOString(),
    };

    return res.status(500).json(errorResponse);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      type: 'VALIDATION',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      retryable: false,
    },
    requestId: `local_${Date.now()}`,
    timestamp: new Date().toISOString(),
    availableEndpoints: ['GET /health', 'POST /dev/validateDeckSize'],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MTG Deck Analyzer Local Test Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Validation endpoint: http://localhost:${PORT}/dev/validateDeckSize`);
  console.log(
    `📝 Expected payload format: ${JSON.stringify(
      {
        deckList: [
          { cardName: 'Lightning Bolt', quantity: 4 },
          { cardName: 'Island', quantity: 20, isSideboard: false },
        ],
        format: 'modern',
        includeSideboard: false,
      },
      null,
      2
    )}`
  );
});
