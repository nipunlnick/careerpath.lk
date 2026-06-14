export const logger = {
  formatMessage(level: 'INFO' | 'WARN' | 'ERROR', message: string, meta?: any) {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta && { meta })
    };
    return JSON.stringify(logData);
  },

  info(message: string, meta?: any) {
    console.log(this.formatMessage('INFO', message, meta));
  },

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage('WARN', message, meta));
  },

  error(message: string, error?: any, path?: string) {
    const meta = {
      path,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
    console.error(this.formatMessage('ERROR', message, meta));
  }
};
