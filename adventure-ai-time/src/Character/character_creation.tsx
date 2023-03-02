import { useState } from "react";
export const CharacterCreation = () => {
  const [characterName, setCharacterName] = useState("Nox");
  const [characterAge, setCharacterAge] = useState(0);
  const [characterGender, setCharacterGender] = useState("Male");

  const nameCharacter = () => {
    setCharacterName("Nox");
  };
};
