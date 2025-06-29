import "./Styles/styling.css";
import "./App.css";

import React from "react";
import useStoryManager from "./hooks/useStoryManager";
import useImageGeneration from "./hooks/useImageGeneration";
import useGenreSelection from "./hooks/useGenreSelection";
import CharacterCreation from "./Character/character_creation.js";

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



  const TextWithLineBreaks = (story) => {
    const lines = story.split("\n");

    return (
      <>
        {lines.map((line, index) => (
          <p
            key={index}
            style={{
              textAlign: "justify",
              fontSize: "0.75em",
              display: "grid",
              justifyItems: "center",
            }}
          >
            {line}
          </p>
        ))}
      </>
    );
  };

  const choiceButtons = (optionChoices) => {
    return (
      <div>
        {optionChoices.map((item, index) => (
          <button
            className="button"
            key={index}
            onClick={() => handleContinueAdventure(item)}
          >
            {item}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Adventure Time</h3>
        <h5>Choose your adventure</h5>
        {imageSrc && <img src={imageSrc} alt="Background of the adventure" />}
        {isGeneratingImage && <div>Generating image...</div>}
        <CharacterCreation genrePrompt={genrePrompt} />
        {!options.length && (
          <>
            <div>
              {genreOptions.map((genre) => (
                <button
                  key={genre.id}
                  className={`button ${
                    selectedGenreIndex === genre.id ? "selected" : ""
                  }`}
                  onClick={() => handleGenreClick(genre.id, genre.value)}
                >
                  {genre.label}
                </button>
              ))}
            </div>
            <div>
              <button 
                className="button" 
                onClick={handleStartAdventure}
                disabled={!hasGenreSelected()}
              >
                BEGIN ADVENTURE <span>&#9884;</span>
              </button>
            </div>
          </>
        )}
        <div style={{ width: "50%" }}>{TextWithLineBreaks(story)}</div>
        {options.length > 0 && <div>{choiceButtons(options)}</div>}
      </header>
    </div>
  );
}

export default App;
