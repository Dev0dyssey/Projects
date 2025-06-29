import React from 'react';

const GenreSelector = ({ 
  genreOptions, 
  selectedGenreIndex, 
  handleGenreClick, 
  hasGenreSelected, 
  onStartAdventure 
}) => {
  return (
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
          onClick={onStartAdventure}
          disabled={!hasGenreSelected()}
        >
          BEGIN ADVENTURE <span>&#9884;</span>
        </button>
      </div>
    </>
  );
};

export default GenreSelector;
