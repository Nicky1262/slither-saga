
import React, { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import ControlPanel from '@/components/ControlPanel';
import ScoreBoard from '@/components/ScoreBoard';
import { useGameState } from '@/hooks/useGameState';

const Index = () => {
  const {
    direction,
    score,
    highScore,
    gameOver,
    isPaused,
    setDirection,
    resetGame,
    togglePause
  } = useGameState();

  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-1">Slither Saga</h1>
          <p className="text-purple-600">Swipe or use controls to move the snake</p>
        </header>

        <ScoreBoard score={currentScore} highScore={highScore} />
        
        <GameBoard onScoreChange={setCurrentScore} />
        
        <ControlPanel
          direction={direction}
          isPaused={isPaused}
          isGameOver={gameOver}
          onDirectionChange={setDirection}
          onReset={resetGame}
          onTogglePause={togglePause}
        />
        
        <div className="mt-8 text-center text-sm text-purple-500">
          <p>Swipe on the game board or use the directional buttons to control the snake.</p>
          <p className="mt-1">Eat the purple dots to grow and increase your score!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
