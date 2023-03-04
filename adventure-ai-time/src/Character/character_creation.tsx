import React from "react";
import "./character_creation.css";
import { useState } from "react";

const CharacterCreation = () => {
  const [characterName, setCharacterName] = useState("Nox");
  const [characterAge, setCharacterAge] = useState(0);
  const [characterGender, setCharacterGender] = useState("Male");

  const nameCharacter = () => {
    setCharacterName("Nox");
  };

  const ageCharacter = (age) => {
    setCharacterAge(age);
  };

  const genderCharacter = (choice) => {
    setCharacterGender(choice);
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
      </div>
    </>
  );
};

export default CharacterCreation;
