import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

import "./App.css";

function App() {
  const [genrePrompt, setGenrePrompt] = useState("");
  const [story, setStory] = useState("Your journey is about to begin");
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  const startAdventure = async () => {
    const start = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Start a adventure in a ${genrePrompt} setting. Give background of the world and explain how the adventurer found themselves at the crossroad`,
      n: 1,
      max_tokens: 4000,
    });
    console.log(start);
    setStory(start.data.choices[0].text);
  };

  const goOnAdventure = async (prompt) => {
    console.log("Going on an adventure!");

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Adventurer standing at a crossroad, and looks ${prompt}. Describe what they are seeing`,
      n: 2,
      max_tokens: 4000,
    });
    console.log(response);
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
            }}
          >
            {line}
          </p>
        ))}
      </>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Adventure Time</h3>
        <h5>Choose your adventure</h5>
        <div>
          <button onClick={() => setGenrePrompt("Science Fiction")}>
            Science Fiction
          </button>
          <button onClick={() => setGenrePrompt("High Fantasy")}>
            High fantasy
          </button>
          <button onClick={() => setGenrePrompt("Dark Fantasy")}>
            Dark fantasy
          </button>
        </div>
        <div>
          <button onClick={startAdventure}>BEGIN ADVENTURE</button>
        </div>
        <div>{TextWithLineBreaks(story)}</div>
        <div>
          <button onClick={() => goOnAdventure("left")}>Left</button>
          <button onClick={() => goOnAdventure("right")}>Right</button>
        </div>
      </header>
    </div>
  );
}

export default App;
