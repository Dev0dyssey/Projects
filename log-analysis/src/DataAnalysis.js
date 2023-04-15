import React from 'react';

const DataAnalysis = ({ data }) => {
  // Create an object to store the counts of repeating values
  const repeats = {};

  // Loop through the data array and count the repeating values
  data.forEach(item => {
    for (const key in item) {
      const value = item[key];
      const keyValuePair = `${key}:${value}`;
      if (repeats.hasOwnProperty(keyValuePair)) {
        repeats[keyValuePair]++;
      } else {
        repeats[keyValuePair] = 1;
      }
    }
  });

  // Create an array to store the repeating values with counts
  const repeatingValues = [];

  for (const keyValuePair in repeats) {
    if (repeats[keyValuePair] > 1) {
      const [property, value] = keyValuePair.split(':');
      const repeatsCount = repeats[keyValuePair];
      repeatingValues.push({ property, value, repeats: repeatsCount });
    }
  }

  // Render the analysis results as a list
  return (
    <div>
      <h2>Data Analysis Results</h2>
      <ul>
        {repeatingValues.map((item, index) => (
          <li key={index}>
            Property: {item.property}, Value: {item.value}, Repeats: {item.repeats}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataAnalysis;