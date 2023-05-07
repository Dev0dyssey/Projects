// Add comments explaining the changes made to the code:

// Import styles at the beginning of the file for better organization
import "./Styles/styling.css";
import "./App.css";

// Import dependencies
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

// Import components
import CharacterCreation from "./Character/character_creation.js";

// Define the main function
function App() {
  // Get the API key from the environment variable
  const apiKey = process.env.REACT_APP_OPENAI_KEY;

  // Define states for the genre prompt, the story, the options, the selected genre index, and the image source
  const [genrePrompt, setGenrePrompt] = useState("");
  const [story, setStory] = useState("Your journey is about to begin");
  const [options, setOptions] = useState([]);
  const [selectedGenreIndex, setSelectedGenreIndex] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  // Create a configuration object for OpenAI with the API key
  const configuration = new Configuration({
    apiKey: apiKey,
  });

  // Create an instance of the OpenAI API with the configuration object
  const openai = new OpenAIApi(configuration);

  // Define a function to generate an image based on the genre prompt using the OpenAI API
  const generateImage = async () => {
    const response = await openai.createImage({
      prompt: `Background image for the story based on ${genrePrompt}. High detail digital art`,
      n: 1,
      size: "512x512",
    });
    let image_url = response.data.data[0].url;
    // Set the image source state with the URL of the generated image
    setImageSrc(image_url);
    console.log("Image URL:", image_url);
  };

  // Define a function to start the adventure story using the OpenAI API
  const startAdventure = async () => {
    // Generate the image for the story
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

    // Split the story text into the main story and the options
    let storyText = response.data.choices[0].message.content.split("Option");
    let storyResponse = response.data.choices[0].message.content;
    // Set the story state with the main story text and get the list of options based on the generated story
    setStory(storyText[0]);
    getOptions(storyResponse);
  };

  // Define a function to update the story based on new generated text
  const updateAdventure = (newStory) => {
    setStory((story) => story + newStory);
  };

  // Define a function to continue the adventure story based on user input
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
      temperature: 0.8,
      n: 1,
    });
    let storyText = response.data.choices[0].message.content.split("Option");
    let storyResponse = response.data.choices[0].message.content;
    // Add the new generated text to the existing story and get the list of options based on the new text
    updateAdventure(storyText[0]);
    getOptions(storyResponse);
  };

  // Define a function to set the genre prompt state based on user input
  const handleGenreClick = (index, genre) => {
    setSelectedGenreIndex(index);
    setGenrePrompt(genre);
  };

  // Define a function to get the list of options from a given story text
  const getOptions = (story) => {
    const options = story.split("Option");
    const optionsArray = options
      .slice(1)
      .map((option) => option.replace(/\d+: /, "").trim());
    setOptions(optionsArray);
    return optionsArray;
  };

  // Define a function to display the story with line breaks
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

  // Define a function to display the list of options as buttons
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

  // Render the app with the corresponding components and states
  return (
    <div className="App">
      <header className="App-header">
        <h3>Adventure Time</h3>
        <h5>Choose your adventure</h5>
        {imageSrc && <img src={imageSrc} alt="Background of the adventure" />}
        <CharacterCreation genrePrompt={genrePrompt} />
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

// Export the app as the default entry point of the module
export default App;
