import { Configuration, OpenAIApi } from "openai";
import { CONFIG, validateConfig } from "../utils/config";
import { handleAPIError, retryWithBackoff } from "../utils/errorHandler";
import { 
  buildStartPrompt, 
  buildContinuePrompt, 
  buildImagePrompt, 
  validateStoryContent 
} from "../utils/storyUtils";

/**
 * Enhanced OpenAI Service with improved error handling, configuration management,
 * and utility integration for better maintainability and reliability.
 */
class OpenAIService {
    constructor() {
      // Validate configuration on initialization
      const configValidation = validateConfig();
      if (!configValidation.isValid) {
        console.error('Configuration issues:', configValidation.issues);
        throw new Error(`Configuration Error: ${configValidation.issues.join(', ')}`);
      }

      const configuration = new Configuration({
        apiKey: CONFIG.OPENAI.API_KEY,
      });
      this.openai = new OpenAIApi(configuration);
    }
  
    /**
     * Generates an image based on the provided prompt with retry logic and error handling
     * @param {string} prompt - The story context for image generation
     * @returns {Promise<string>} - URL of the generated image
     */
    async generateImage(prompt) {
      try {
        return await retryWithBackoff(async () => {
          const response = await this.openai.createImage({
            prompt: buildImagePrompt(prompt),
            n: 1,
            size: CONFIG.OPENAI.IMAGE_SIZE,
          });
          
          const imageUrl = response.data.data[0]?.url;
          if (!imageUrl) {
            throw new Error('No image URL received from OpenAI');
          }
          
          return imageUrl;
        }, CONFIG.IMAGE.RETRY_ATTEMPTS);
      } catch (error) {
        handleAPIError(error, 'image generation');
      }
    }
  
    /**
     * Generates story content with enhanced prompts and validation
     * @param {string} genrePrompt - The genre/setting for the story
     * @param {boolean} isStart - Whether this is the start of the adventure
     * @param {string} currentStory - The current story content (for continuation)
     * @param {string} option - The selected option (for continuation)
     * @returns {Promise<string>} - The generated story content
     */
    async generateStory(genrePrompt, isStart = true, currentStory = "", option = "") {
      try {
        return await retryWithBackoff(async () => {
          const messages = this._buildMessages(genrePrompt, isStart, currentStory, option);
          
          const response = await this.openai.createChatCompletion({
            model: CONFIG.OPENAI.MODEL,
            messages,
            temperature: CONFIG.OPENAI.TEMPERATURE,
            max_tokens: CONFIG.OPENAI.MAX_TOKENS,
            n: 1,
          });
          
          const content = response.data.choices[0]?.message?.content;
          if (!content) {
            throw new Error('No content received from OpenAI');
          }
          
          // Validate the generated story content
          const validation = validateStoryContent(content);
          return validation.content;
        }, CONFIG.STORY.RETRY_ATTEMPTS);
      } catch (error) {
        handleAPIError(error, 'story generation');
      }
    }
    
    /**
     * Private method to build message arrays for different story contexts
     * @private
     */
    _buildMessages(genrePrompt, isStart, currentStory, option) {
      const systemMessage = isStart 
        ? { role: "system", content: "You are a narrator of an epic adventure story. As a narrator you are an omnipotent being" }
        : { role: "system", content: "You are a narrator of an adventure story" };
      
      const userPrompt = isStart 
        ? buildStartPrompt(genrePrompt)
        : buildContinuePrompt(currentStory, option);
      
      return [
        systemMessage,
        { role: "user", content: userPrompt }
      ];
    }
    
    /**
     * Health check method to verify service availability
     * @returns {Promise<boolean>} - Service health status
     */
    async healthCheck() {
      try {
        // Simple test call to verify API connectivity
        await this.openai.listModels();
        return true;
      } catch (error) {
        console.warn('OpenAI service health check failed:', error.message);
        return false;
      }
    }
  }
  
  export default new OpenAIService();