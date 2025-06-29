import { useState } from 'react';

const useGenreSelection = () => {
  const [genrePrompt, setGenrePrompt] = useState("");
  const [selectedGenreIndex, setSelectedGenreIndex] = useState(null);

  const genreOptions = [
    { id: 0, label: "Science Fiction", value: "Science Fiction" },
    { id: 1, label: "High fantasy", value: "High Fantasy" },
    { id: 2, label: "Dark fantasy", value: "Dark Fantasy" }
  ];

  const handleGenreClick = (index, genre) => {
    setSelectedGenreIndex(index);
    setGenrePrompt(genre);
  };

  const resetGenreSelection = () => {
    setSelectedGenreIndex(null);
    setGenrePrompt("");
  };
  const isGenreSelected = (index) => {
    return selectedGenreIndex === index;
  };

  const hasGenreSelected = () => {
    return selectedGenreIndex !== null && genrePrompt !== "";
  };

  return {
    genrePrompt,
    selectedGenreIndex,
    genreOptions,
    handleGenreClick,
    resetGenreSelection,
    isGenreSelected,
    hasGenreSelected
  };
};

export default useGenreSelection;
