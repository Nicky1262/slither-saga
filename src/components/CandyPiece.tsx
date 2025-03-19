
import React from 'react';
import { Candy, Heart, Diamond, Star, Circle } from 'lucide-react';

type CandyType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

interface CandyPieceProps {
  type: CandyType;
  isSelected: boolean;
  onClick: () => void;
}

const CandyPiece: React.FC<CandyPieceProps> = ({ type, isSelected, onClick }) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'red':
        return { Icon: Heart, bgColor: 'bg-red-200', iconColor: 'text-red-500', borderColor: 'border-red-400' };
      case 'blue':
        return { Icon: Circle, bgColor: 'bg-blue-200', iconColor: 'text-blue-500', borderColor: 'border-blue-400' };
      case 'green':
        return { Icon: Candy, bgColor: 'bg-green-200', iconColor: 'text-green-500', borderColor: 'border-green-400' };
      case 'yellow':
        return { Icon: Star, bgColor: 'bg-yellow-200', iconColor: 'text-yellow-500', borderColor: 'border-yellow-400' };
      case 'purple':
        return { Icon: Diamond, bgColor: 'bg-purple-200', iconColor: 'text-purple-500', borderColor: 'border-purple-400' };
    }
  };

  const { Icon, bgColor, iconColor, borderColor } = getIconAndColor();

  return (
    <div 
      className={`aspect-square flex items-center justify-center rounded-lg shadow-md transition-all ${bgColor} ${
        isSelected ? `scale-110 ring-2 ring-offset-2 ring-offset-white ring-${iconColor} z-10` : 'scale-100'
      }`}
      onClick={onClick}
    >
      <Icon className={`${iconColor} ${isSelected ? 'animate-pulse' : ''}`} />
    </div>
  );
};

export default CandyPiece;
