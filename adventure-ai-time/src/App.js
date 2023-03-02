import "./Styles/styling.css";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

import "./App.css";

function App() {
  const apiKey = process.env.REACT_APP_OPENAI_KEY;
  const [genrePrompt, setGenrePrompt] = useState("");
  const [story, setStory] = useState("Your journey is about to begin");
  const [options, setOptions] = useState([]);
  const [selectedGenreIndex, setSelectedGenreIndex] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    const response = await openai.createImage({
      prompt: `Background image for the story based on ${genrePrompt}. High detail digital art`,
      n: 1,
      size: "512x512",
    });
    let image_url = response.data.data[0].url;
    setImageSrc(image_url);
    console.log("Image URL:", image_url);
  };

  const startAdventure = async () => {
    generateImage();

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a narrator of an adventure story" },
        {
          role: "user",
          content: `Start a adventure in a ${genrePrompt} setting. Give background of the world and explain how the adventurer found themselves at the crossroad. At least three paragraphs for the description. Present two options, marked as Option 1 Option 2 in this format. Each Option should be no more than three words. Ideally a simple one word or binary options. Always include the options at the end of the generated text.`,
        },
      ],
      n: 1,
    });

    let storyText = response.data.choices[0].message.content.split("Option");
    let storyResponse = response.data.choices[0].message.content;
    setStory(storyText[0]);
    getOptions(storyResponse);
  };

  const updateAdventure = (newStory) => {
    setStory((story) => story + newStory);
  };

  const continueAdventure = async (prompt, option) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a narrator of an adventure story" },
        {
          role: "user",
          content: `${prompt}. continue the story based on ${option}. Expand the story by several paragraphs. Include two options at end of text in the format Option 1 and Option 2, each option should be no more than three words`,
        },
      ],
      n: 1,
    });
    let storyText = response.data.choices[0].message.content.split("Option");
    let storyResponse = response.data.choices[0].message.content;
    updateAdventure(storyText[0]);
    getOptions(storyResponse);
  };

  const handleGenreClick = (index, genre) => {
    setSelectedGenreIndex(index);
    setGenrePrompt(genre);
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
        {imageSrc && <img src={imageSrc} alt="Background of the adventure" />}
        {!options.length && (
          <>
            <div>
              <button
                className={`button ${
                  selectedGenreIndex === 0 ? "selected" : ""
                }`}
                onClick={() => handleGenreClick(0, "Science Fiction")}
              >
                Science Fiction
              </button>
              <button
                className={`button ${
                  selectedGenreIndex === 1 ? "selected" : ""
                }`}
                onClick={() => handleGenreClick(1, "High Fantasy")}
              >
                High fantasy
              </button>
              <button
                className={`button ${
                  selectedGenreIndex === 2 ? "selected" : ""
                }`}
                onClick={() => handleGenreClick(2, "Dark Fantasy")}
              >
                Dark fantasy
              </button>
            </div>
            <div>
              <button className="button" onClick={startAdventure}>
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
