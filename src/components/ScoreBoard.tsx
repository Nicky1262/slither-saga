
import React from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="p-3 bg-purple-100 rounded-lg">
        <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Score</p>
        <p className="text-xl font-bold text-purple-900">{score}</p>
      </div>
      <div className="p-3 bg-purple-100 rounded-lg">
        <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">High Score</p>
        <p className="text-xl font-bold text-purple-900">{highScore}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;
