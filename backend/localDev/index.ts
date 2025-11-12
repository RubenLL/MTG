import express from 'express';
import Joi from 'joi';
import dotenv from 'dotenv';
import { getErrorMessage } from '../src/utils/errorUtils';
import { MongoDBCardRepository } from '../src/infrastructure/repositories/MongoDBCardRepository';

// Type guard to check if the error is an instance of Error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}
import {
  getCardRepository,
  closeDatabaseConnections,
} from '../src/infrastructure/repositories/repositoryFactory';
import { validateDeckSize } from '../src/domain/deckSizeValidation';
import { MTGFormat, ValidationErrorCode } from '../src/domain/entities';
import { Card } from '../src/domain/entities';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Initialize the card repository
const cardRepository = getCardRepository();

// Handle application shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  try {
    await closeDatabaseConnections();
    console.log('Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Log MongoDB connection status
if (cardRepository instanceof MongoDBCardRepository) {
  console.log('Using MongoDB repository for local development');

  // Initialize indexes on startup
  cardRepository.createIndexes().catch(error => {
    console.error('Failed to create MongoDB indexes:', error);
  });
} else {
  console.log('Using default repository configuration');
}

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

// Validate a single card
app.post('/dev/validateCard', async (req, res) => {
  const requestId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    if (!req.body || !req.body.cardName) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'MISSING_CARD_NAME',
          type: 'VALIDATION',
          message: 'Card name is required',
          details: 'Please provide a cardName in the request body',
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    const { cardName, format } = req.body;
    const card = await cardRepository.findByName(cardName);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CARD_NOT_FOUND',
          type: 'VALIDATION',
          message: 'Card not found',
          details: `Could not find card with name: ${cardName}`,
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // Check format legality if format is provided
    const formatLegality = format
      ? {
          legalInFormat: card.isLegalInFormats.includes(format as MTGFormat),
          legalFormats: [...card.isLegalInFormats],
        }
      : {};

    return res.json({
      success: true,
      data: {
        card: {
          id: card.id,
          name: card.name,
          type: card.type,
          manaCost: card.manaCost,
          ...formatLegality,
          imageUri: card.imageUrl,
        },
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error validating card:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        type: 'SERVER',
        message: 'An error occurred while validating the card',
        details: errorMessage,
        retryable: true,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
});

// Search for cards by name
app.get('/dev/cards/search', async (req, res) => {
  const requestId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const { q: query, limit = 5 } = req.query;

  try {
    if (!query) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_QUERY',
          type: 'VALIDATION',
          message: 'Search query is required',
          details: 'Please provide a search query using the "q" parameter',
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    const cards = await cardRepository.searchByName(query.toString(), Number(limit));

    return res.json({
      success: true,
      data: {
        cards: cards.map(card => ({
          id: card.id,
          name: card.name,
          type: card.type,
          manaCost: card.manaCost,
          imageUrl: card.imageUrl,
        })),
        total: cards.length,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error searching cards:', error);
    const errorMessage = getErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        type: 'SERVER',
        message: 'An error occurred while searching for cards',
        details: errorMessage,
        retryable: true,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
});

// Get card details by ID
app.get('/dev/cards/:id', async (req, res) => {
  const requestId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const { id } = req.params;
  const { format } = req.query;

  try {
    const card = await cardRepository.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CARD_NOT_FOUND',
          type: 'NOT_FOUND',
          message: 'Card not found',
          details: `Could not find card with ID: ${id}`,
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // Check format legality if format is provided
    const formatLegality = format
      ? {
          legalInFormat: card.legalities?.[format.toString()] === 'legal',
          legalFormats: Object.entries(card.legalities || {})
            .filter(([_, status]) => status === 'legal')
            .map(([fmt]) => fmt),
        }
      : {};

    return res.json({
      success: true,
      data: {
        card: {
          ...card,
          ...formatLegality,
        },
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching card details:', error);
    const errorMessage = getErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        type: 'SERVER',
        message: 'An error occurred while fetching card details',
        details: errorMessage,
        retryable: true,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
});

// Batch validate multiple cards
app.post('/dev/validateCards', async (req, res) => {
  const requestId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    if (!req.body || !Array.isArray(req.body.cards)) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          type: 'VALIDATION',
          message: 'Invalid input',
          details: 'Request body must contain a "cards" array',
          retryable: false,
        },
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    const { cards: cardRequests, format } = req.body;
    const results = [];

    for (const cardReq of cardRequests) {
      try {
        const card = await cardRepository.findByName(cardReq.name);

        if (!card) {
          results.push({
            name: cardReq.name,
            valid: false,
            error: {
              code: 'CARD_NOT_FOUND',
              message: `Card not found: ${cardReq.name}`,
            },
          });
          continue;
        }

        // Check format legality if format is provided
        const legalInFormat = format ? card.legalities?.[format] === 'legal' : undefined;

        results.push({
          name: card.name,
          valid: true,
          card: {
            id: card.id,
            name: card.name,
            type: card.type,
            manaCost: card.manaCost,
            legalInFormat,
            imageUri: card.imageUrl,
          },
        });
      } catch (error) {
        const errorMessage = isError(error) ? error.message : 'An unknown error occurred';
        results.push({
          name: cardReq.name,
          valid: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Error validating card: ${errorMessage}`,
          },
        });
      }
    }

    return res.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          valid: results.filter(r => r.valid).length,
          invalid: results.filter(r => !r.valid).length,
        },
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error validating cards:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        type: 'SERVER',
        message: 'An error occurred while validating cards',
        details: errorMessage,
        retryable: true,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
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
