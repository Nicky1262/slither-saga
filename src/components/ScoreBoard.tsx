
import React from 'react';
import { Target, Star } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  moves: number;
  targetScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore, moves, targetScore }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-sm">
        <p className="text-xs text-purple-700 font-medium uppercase tracking-wide flex items-center gap-1">
          <Star size={14} className="text-yellow-500" />
          Score
        </p>
        <p className="text-xl font-bold text-purple-900">{score}</p>
      </div>
      <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-sm">
        <p className="text-xs text-purple-700 font-medium uppercase tracking-wide flex items-center gap-1">
          <Target size={14} className="text-purple-500" />
          Target
        </p>
        <p className="text-xl font-bold text-purple-900">{targetScore}</p>
      </div>
      <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-sm">
        <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">High Score</p>
        <p className="text-xl font-bold text-purple-900">{highScore}</p>
      </div>
      <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-sm">
        <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Moves</p>
        <p className="text-xl font-bold text-purple-900">{moves}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;
