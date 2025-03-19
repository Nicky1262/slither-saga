
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ScoreBoard from '@/components/ScoreBoard';
import CandyBoard from '@/components/CandyBoard';
import { useGameState } from '@/hooks/useGameState';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const { highScore } = useGameState();

  const [currentScore, setCurrentScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const targetScore = 1000;

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-1">Candy Crush Saga</h1>
          <p className="text-purple-600">Match 3 or more candies in a row or column</p>
        </header>

        <ScoreBoard 
          score={currentScore} 
          highScore={highScore}
          moves={moves}
          targetScore={targetScore}
        />
        
        <CandyBoard 
          onScoreChange={setCurrentScore}
          onMovesChange={setMoves}
        />
        
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={handleRestart}
            variant="outline"
            className="flex items-center gap-2 bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <RefreshCw size={16} />
            Restart Game
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm text-purple-500">
          <p>Tap on a candy to select it, then tap an adjacent candy to swap.</p>
          <p className="mt-1">Match 3 or more candies to score points!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
