import { Configuration, OpenAIApi } from "openai";

class OpenAIService {
    constructor() {
      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_KEY,
      });
      this.openai = new OpenAIApi(configuration);
    }
  
    async generateImage(prompt) {
      const response = await this.openai.createImage({
        prompt: `Background image for the story based on ${prompt}. High detail digital art`,
        n: 1,
        size: "512x512",
      });
      return response.data.data[0].url;
    }
  
    async generateStory(genrePrompt, isStart = true, currentStory = "", option = "") {
      const messages = isStart ? [
        { role: "system", content: "You are a narrator of an epic adventure story. As a narrator you are an omnipotent being" },
        {
          role: "user",
          content: `Start a adventure in a ${genrePrompt} setting. Give background of the world and explain how the adventurer found themselves at the crossroad. At least three paragraphs for the description. Present two options, marked as Option 1 Option 2 in this format. Each Option should be no more than three words. Ideally a simple one word or binary options. Always include the options at the end of the generated text.`,
        },
      ] : [
        { role: "system", content: "You are a narrator of an adventure story" },
        {
          role: "user",
          content: `${currentStory}. continue the story based on ${option}. Expand the story by several paragraphs. Include two options at end of text in the format Option 1 and Option 2, each option should be no more than three words`,
        },
      ];
  
      const response = await this.openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.8,
        n: 1,
      });
  
      return response.data.choices[0].message.content;
    }
  }
  
  export default new OpenAIService();