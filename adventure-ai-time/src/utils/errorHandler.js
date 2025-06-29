/**
 * Error handling utilities for API calls and application errors
 */

export class APIError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export const handleAPIError = (error, context = 'API call') => {
  console.error(`Error in ${context}:`, error);

  // OpenAI specific error handling
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        throw new APIError('Invalid API key. Please check your OpenAI API key.', status, error);
      case 429:
        throw new APIError('Rate limit exceeded. Please try again later.', status, error);
      case 500:
        throw new APIError('OpenAI service is temporarily unavailable.', status, error);
      default:
        throw new APIError(`API error: ${data?.error?.message || 'Unknown error'}`, status, error);
    }
  }

  // Network or other errors
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    throw new APIError('Network error. Please check your internet connection.', null, error);
  }

  // Generic error
  throw new APIError(`Unexpected error: ${error.message}`, null, error);
};

export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
