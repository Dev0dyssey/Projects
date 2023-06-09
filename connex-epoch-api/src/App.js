import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [serverTime, setServerTime] = useState(null);
  const [clientTime, setClientTime] = useState(null);
  const [serverStandardTime, setServerStandardTime] = useState(null);
  const [loadingTime, setLoadingTime] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    // Load initial data on component mount
    loadTime();
    loadMetrics();

    // Start interval to update time difference every second
    const intervalId = setInterval(() => {
      if (serverTime) {
        setClientTime(Date.now() / 1000);
        console.log('Setting client time');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Start interval to load latest data every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadTime();
      loadMetrics();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Format the epoch time to a standard time format
  const formatEpochTime = (epochTime) => {
    const date = new Date(epochTime * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const loadTime = () => {
    setLoadingTime(true);
    fetch('http://localhost:3000/time', {
      headers: {
        'Authorization': 'mysecrettoken'
      }
    })
    .then(response => response.json())
    .then(data => {
      const formattedEpochTime = formatEpochTime(data[0].epoch);
      
      setServerStandardTime(formattedEpochTime);
      setServerTime(data[0].epoch);
      setLoadingTime(false);
      
      console.log('TIME: ', data[0].epoch);
    })
    .catch(error => console.error(error));
  };

  const loadMetrics = () => {
    setLoadingMetrics(true);
    fetch('http://localhost:3000/metrics', {
      headers: {
        'Authorization': 'mysecrettoken'
      }
    })
    .then(response => response.text())
    .then(data => {
      setMetrics(data);
      setLoadingMetrics(false);
    })
    .catch(error => console.error(error));
  };

  // Format the time difference between the server and client in hours, minutes, and seconds
  const formatTimeDifference = () => {
    if (serverTime && clientTime) {
      console.log('Server Time: ', serverTime)
      console.log('Client Time: ', clientTime)
      const difference = Math.round(clientTime - serverTime);
      const hours = Math.floor(difference / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((difference % 3600) / 60).toString().padStart(2, '0');
      const seconds = (difference % 60).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } else {
      return '00:00:00';
    }
  };

  return (
    <div className="App">
      <div className="App-left">
        <div className="App-time">
          <div className="App-time-label">Server Time:</div>
          {loadingTime ? (
            <div className="App-time-value">Loading...</div>
          ) : (
            <div className="App-time-value">{serverStandardTime}</div>
          )}
        </div>
        <div className="App-time">
          <div className="App-time-label">Time Difference:</div>
          {loadingTime ? (
            <div className="App-time-value">Loading...</div>
          ) : (
            <div className="App-time-value">{formatTimeDifference()}</div>
          )}
        </div>
      </div>
      <div className="App-right">
        {loadingMetrics ? (
          <div className="App-metrics">Loading...</div>
        ) : (
          <pre className="App-metrics">{metrics}</pre>
        )}
      </div>
    </div>
  );
};

export default App;