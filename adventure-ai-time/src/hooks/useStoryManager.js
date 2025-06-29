import { useState } from 'react';
import OpenAIService from '../Services/OpenAIService';

const useStoryManager = () => {
  const [story, setStory] = useState("Your journey is about to begin");
  const [options, setOptions] = useState([]);

  const getOptions = (storyText) => {
    const options = storyText.split("Option");
    const optionsArray = options
      .slice(1)
      .map((option) => option.replace(/\d+: /, "").trim());
    setOptions(optionsArray);
    return optionsArray;
  };

  const startAdventure = async (genrePrompt) => {
    try {
      const storyResponse = await OpenAIService.generateStory(genrePrompt, true);
      
      const storyText = storyResponse.split("Option");
      setStory(storyText[0]);
      getOptions(storyResponse);
      
      return { success: true, story: storyText[0] };
    } catch (error) {
      console.error("Error starting adventure:", error);
      return { success: false, error: error.message };
    }
  };

  const continueAdventure = async (currentStory, selectedOption) => {
    try {
      const storyResponse = await OpenAIService.generateStory(
        "", 
        false, 
        currentStory,
        selectedOption
      );

      const storyText = storyResponse.split("Option");
      const newStoryPart = storyText[0];
      
      setStory(prevStory => prevStory + newStoryPart);
      getOptions(storyResponse);
      
      return { success: true, newStory: newStoryPart };
    } catch (error) {
      console.error("Error continuing adventure:", error);
      return { success: false, error: error.message };
    }
  };

  const updateStory = (newStory) => {
    setStory(prevStory => prevStory + newStory);
  };

  return {
    story,
    options,
    startAdventure,
    continueAdventure,
    updateStory,
    setStory,
    setOptions
  };
};

export default useStoryManager;
