
import { useState, useEffect } from 'react';

// Get high score from local storage
const getHighScore = () => {
  const storedScore = localStorage.getItem('candyCrushHighScore');
  return storedScore ? parseInt(storedScore, 10) : 0;
};

// Save high score to local storage
const saveHighScore = (score: number) => {
  localStorage.setItem('candyCrushHighScore', score.toString());
};

export const useGameState = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore());
  
  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  }, [score, highScore]);

  return {
    score,
    highScore,
    setScore
  };
};
