import React from "react";
import "./character_creation.css";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";

const CharacterCreation = (props) => {
  const { genrePrompt } = props;
  const apiKey = process.env.REACT_APP_OPENAI_KEY;
  const [characterName, setCharacterName] = useState("Nox");
  const [characterAge, setCharacterAge] = useState(0);
  const [characterGender, setCharacterGender] = useState("Male");

  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const createCharacter = async () => {
    // Console log out the character details
    console.log("Character Name:", characterName);
    console.log("Character Age:", characterAge);
    console.log("Character Gender:", characterGender);
    console.log("Genre Prompt:", genrePrompt);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a narrator of an adventure, describing a new hero",
        },
        {
          role: "user",
          content: `The setting is ${genrePrompt}. Describe the character ${characterName} who is ${characterAge} years old and is a ${characterGender}.`,
        },
      ],
      n: 1,
    });

    let characterDescription = response.data.choices[0].message.content;
    console.log("Character Description:", characterDescription);
  };

  // Return a form to create a character
  return (
    <>
      <div style={{ border: "1px solid white", marginBottom: "3rem" }}>
        <div>Who are you</div>
        <form>
          <div>
            <input
              placeholder="Name"
              type="text"
              onChange={(e) => setCharacterName(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Age"
              type="number"
              onChange={(e) => setCharacterAge(parseInt(e.target.value))}
            />
          </div>
          <div>
            <select
              placeholder="Gender"
              onChange={(e) => setCharacterGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </form>
        <div>
          <button onClick={createCharacter}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default CharacterCreation;
