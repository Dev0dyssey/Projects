import "./Styles/styling.css";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

import "./App.css";

function App() {
  const apiKey = process.env.REACT_APP_OPENAI_KEY;
  const [genrePrompt, setGenrePrompt] = useState("");
  const [story, setStory] = useState("Your journey is about to begin");
  const [options, setOptions] = useState([]);
  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const startAdventure = async () => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Start a adventure in a ${genrePrompt} setting. Give background of the world and explain how the adventurer found themselves at the crossroad. At least three paragraphs for the description. Present two options, marked as Option 1 Option 2 in this format. Each Option should be no more than three words. Ideally a simple one word or binary options. Always include the options at the end of the generated text.`,
      n: 1,
      max_tokens: 2048,
    });
    let storyText = response.data.choices[0].text.split("Option");
    let storyResponse = response.data.choices[0].text;
    setStory(storyText[0]);
    getOptions(storyResponse);
  };

  const updateAdventure = (newStory) => {
    setStory((story) => story + newStory);
  };

  const continueAdventure = async (prompt, option) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}. continue the story based on ${option} with the new story being a minimum of two paragraphs. Include two options at end of text in the format Option 1 and Option 2, each option should be no more than three words`,
      n: 1,
      max_tokens: 2048,
    });
    let storyText = response.data.choices[0].text.split("Option");
    let storyResponse = response.data.choices[0].text;
    updateAdventure(storyText[0]);
    getOptions(storyResponse);
  };

  const getOptions = (story) => {
    const options = story.split("Option");
    const optionsArray = options
      .slice(1)
      .map((option) => option.replace(/\d+: /, "").trim());
    setOptions(optionsArray);
    return optionsArray;
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
            onClick={() => continueAdventure(story, item)}
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
        <div>
          <button
            className="button"
            onClick={() => setGenrePrompt("Science Fiction")}
          >
            Science Fiction
          </button>
          <button
            className="button"
            onClick={() => setGenrePrompt("High Fantasy")}
          >
            High fantasy
          </button>
          <button
            className="button"
            onClick={() => setGenrePrompt("Dark Fantasy")}
          >
            Dark fantasy
          </button>
        </div>
        <div>
          <button className="button" onClick={startAdventure}>
            BEGIN ADVENTURE <span>&#9884;</span>
          </button>
        </div>
        <div style={{ width: "50%" }}>{TextWithLineBreaks(story)}</div>
        {options.length > 0 && <div>{choiceButtons(options)}</div>}
      </header>
    </div>
  );
}

export default App;
