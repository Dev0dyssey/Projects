import { useState } from 'react';
import OpenAIService from '../Services/OpenAIService';

const useImageGeneration = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState(null);

  const generateImage = async (genrePrompt) => {
    if (!genrePrompt) {
      setImageError("Genre prompt is required for image generation");
      return { success: false, error: "Genre prompt is required" };
    }

    setIsGeneratingImage(true);
    setImageError(null);
    
    try {
      const imageUrl = await OpenAIService.generateImage(genrePrompt);
      setImageSrc(imageUrl);
      setIsGeneratingImage(false);
      
      console.log("Image URL:", imageUrl);
      return { success: true, imageUrl };
    } catch (error) {
      console.error("Error generating image:", error);
      setImageError(error.message);
      setIsGeneratingImage(false);
      return { success: false, error: error.message };
    }
  };

  const clearImage = () => {
    setImageSrc(null);
    setImageError(null);
  };

  const resetImageState = () => {
    setImageSrc(null);
    setIsGeneratingImage(false);
    setImageError(null);
  };

  return {
    imageSrc,
    isGeneratingImage,
    imageError,
    generateImage,
    clearImage,
    resetImageState
  };
};

export default useImageGeneration;
