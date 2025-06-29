import React from 'react';

const StoryImage = ({ imageSrc, isGeneratingImage }) => {
  return (
    <>
      {imageSrc && <img src={imageSrc} alt="Background of the adventure" />}
      {isGeneratingImage && <div>Generating image...</div>}
    </>
  );
};

export default StoryImage;
