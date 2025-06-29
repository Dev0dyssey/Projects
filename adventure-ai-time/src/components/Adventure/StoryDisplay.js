import React from 'react';

const StoryDisplay = ({ story }) => {
  const TextWithLineBreaks = (storyText) => {
    const lines = storyText.split("\n");

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

  return (
    <div style={{ width: "50%" }}>
      {TextWithLineBreaks(story)}
    </div>
  );
};

export default StoryDisplay;
