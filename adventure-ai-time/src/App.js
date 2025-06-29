import "./Styles/styling.css";
import "./App.css";

import React from "react";
import useStoryManager from "./hooks/useStoryManager";
import useImageGeneration from "./hooks/useImageGeneration";
import useGenreSelection from "./hooks/useGenreSelection";
import CharacterCreation from "./Character/character_creation.js";

// Import new components
import AdventureHeader from "./components/Adventure/AdventureHeader";
import GenreSelector from "./components/Adventure/GenreSelector";
import StoryDisplay from "./components/Adventure/StoryDisplay";
import ChoiceButtons from "./components/Adventure/ChoiceButtons";
import StoryImage from "./components/UI/StoryImage";

function App() {
  const { story, options, startAdventure, continueAdventure } = useStoryManager();
  const { imageSrc, generateImage, isGeneratingImage } = useImageGeneration();
  const { genrePrompt, selectedGenreIndex, genreOptions, handleGenreClick, hasGenreSelected } = useGenreSelection();
  
  const handleStartAdventure = async () => {
    if (!hasGenreSelected()) {
      alert("Please select a genre first!");
      return;
    }
    
    await Promise.all([
      generateImage(genrePrompt),
      startAdventure(genrePrompt)
    ]);
  };

  const handleContinueAdventure = async (option) => {
    await continueAdventure(story, option);
  };

  return (
    <div className="App">
      <header className="App-header">
        <AdventureHeader />
        <StoryImage imageSrc={imageSrc} isGeneratingImage={isGeneratingImage} />
        <CharacterCreation genrePrompt={genrePrompt} />
        
        {!options.length && (
          <GenreSelector
            genreOptions={genreOptions}
            selectedGenreIndex={selectedGenreIndex}
            handleGenreClick={handleGenreClick}
            hasGenreSelected={hasGenreSelected}
            onStartAdventure={handleStartAdventure}
          />
        )}
        
        <StoryDisplay story={story} />
        <ChoiceButtons options={options} onContinueAdventure={handleContinueAdventure} />
      </header>
    </div>
  );
}

export default App;
