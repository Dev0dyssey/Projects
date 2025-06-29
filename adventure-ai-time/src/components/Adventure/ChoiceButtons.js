import React from 'react';

const ChoiceButtons = ({ options, onContinueAdventure }) => {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div>
      {options.map((item, index) => (
        <button
          className="button"
          key={index}
          onClick={() => onContinueAdventure(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default ChoiceButtons;
