/**
 * Configuration utilities for the application
 */

export const CONFIG = {
  OPENAI: {
    API_KEY: process.env.REACT_APP_OPENAI_KEY,
    MODEL: 'gpt-4o-mini',
    IMAGE_SIZE: '512x512',
    TEMPERATURE: 0.8,
    MAX_TOKENS: 1000,
  },
  
  STORY: {
    MIN_PARAGRAPHS: 3,
    MAX_OPTION_WORDS: 3,
    RETRY_ATTEMPTS: 3,
  },
  
  IMAGE: {
    RETRY_ATTEMPTS: 2,
    TIMEOUT: 30000, // 30 seconds
  }
};

export const validateConfig = () => {
  const issues = [];
  
  if (!CONFIG.OPENAI.API_KEY) {
    issues.push('Missing REACT_APP_OPENAI_KEY environment variable');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};
