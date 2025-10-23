// Utility functions
// TODO: Implement when needed

/**
 * Logger utility for structured logging
 */
export class Logger {
  static info(message: string, meta?: Record<string, any>): void {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...meta,
    }));
  }

  static error(message: string, error?: Error, meta?: Record<string, any>): void {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      ...meta,
    }));
  }

  static warn(message: string, meta?: Record<string, any>): void {
    console.warn(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      ...meta,
    }));
  }

  static debug(message: string, meta?: Record<string, any>): void {
    console.debug(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      ...meta,
    }));
  }
}
