import React, { useState, useEffect } from "react";
import "./App.css";
import GameBoard from "./GameBoard";

function App() {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = new Audio('/jingle-bells-xmas-background-music-60-second-for-short-video-vlog-178759.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.5;
    setAudio(audioElement);

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="App">
      <header>
      <div className="title">Joulupeli</div>
      </header>
      <GameBoard />
      <div className="music-player">
        <button className="button" onClick={togglePlay}>{isPlaying ? 'Stop music' : 'Play music'}</button>
      </div>
    </div>
  );
}

export default App;
