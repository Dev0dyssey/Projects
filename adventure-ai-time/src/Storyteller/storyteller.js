import React, { useState } from "react";
import axios from "axios";

const TextToSpeech = () => {
  const [text, setText] = useState('Hello, I am your Storyteller!');
  const [audioUrl, setAudioUrl] = useState("");

    const handleTextToSpeech = async (text) => {
      try {
        const response = await fetch('https://api.elevenlabs.io/text-to-speech/pNInz6obpgDQGcFmaJgB', {
          method: 'POST',
          headers: {
              'accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'Authorization': 'YOUR_API_KEY',
          },
          body: JSON.stringify({ text }),
        });
  
        if (!response.ok) {
          throw new Error('Text-to-speech API request failed');
        }
  
        const audioData = await response.blob();
        const audioUrl = URL.createObjectURL(audioData);
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    return (
      <div>
        <button onClick={handleTextToSpeech}>Convert to Speech</button>
        {audioUrl && (
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        )}
      </div>
    );
  };