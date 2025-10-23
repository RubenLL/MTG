// Test setup file for Jest
import { jest } from '@jest/globals';

// Mock console methods to reduce noise in tests
const originalConsole = global.console;
(global as any).console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.AWS_REGION = 'us-east-1';
process.env.DYNAMODB_TABLE_PREFIX = 'test-';
process.env.LOG_LEVEL = 'error';
process.env.SCRYFALL_API_BASE = 'https://api.scryfall.com';
