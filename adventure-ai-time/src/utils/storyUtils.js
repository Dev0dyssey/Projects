export const extractOptionsFromStory = (storyContent) => {
  if (!storyContent) return [];
  
  const optionRegex = /Option\s+\d+[:\-\s]*([^\n\r]+)/gi;
  const matches = [...storyContent.matchAll(optionRegex)];
  
  return matches.map(match => match[1].trim()).filter(option => option.length > 0);
};

export const buildStartPrompt = (genrePrompt) => {
  return `Start a adventure in a ${genrePrompt} setting. Give background of the world and explain how the adventurer found themselves at the crossroad. At least three paragraphs for the description. Present two options, marked as Option 1 Option 2 in this format. Each Option should be no more than three words. Ideally a simple one word or binary options. Always include the options at the end of the generated text.`;
};

export const buildContinuePrompt = (currentStory, option) => {
  return `${currentStory}. continue the story based on ${option}. Expand the story by several paragraphs. Include two options at end of text in the format Option 1 and Option 2, each option should be no more than three words`;
};

export const buildImagePrompt = (prompt) => {
  return `Background image for the story based on ${prompt}. High detail digital art`;
};

export const validateStoryContent = (content) => {
  if (!content || content.trim().length === 0) {
    throw new Error('Story content is empty');
  }
  
  const options = extractOptionsFromStory(content);
  if (options.length === 0) {
    console.warn('No options found in story content');
  }
  
  return {
    isValid: true,
    content: content.trim(),
    options
  };
};
