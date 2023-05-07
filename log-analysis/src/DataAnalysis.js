import React from 'react';
import * as d3 from 'd3';

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

  const csvData = repeatingValues.map(({ key, value, count }) => `${key},${value},${count}`).join('\n');
  console.log("CSV DATA <<<<<<",  csvData);
  // fs.writeFile('data.csv', csvData, err => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log('Data saved to data.csv');
  //   }
  // });


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