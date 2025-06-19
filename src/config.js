import dotenv from 'dotenv';

dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.3
  },
  browserbase: {
    apiKey: process.env.BROWSERBASE_API_KEY,
    apiUrl: process.env.BROWSERBASE_API_URL || 'https://api.browserbase.com/v1',
    projectId: process.env.BROWSERBASE_PROJECT_ID || 'default',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3
  }
};

export function validateConfig() {
  const errors = [];
  
  if (!config.openai.apiKey) {
    errors.push('OPENAI_API_KEY is required');
  }
  
  if (!config.browserbase.apiKey) {
    errors.push('BROWSERBASE_API_KEY is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(', ')}`);
  }
} 