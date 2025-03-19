
import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, RefreshCw } from 'lucide-react';

interface ControlPanelProps {
  direction: string;
  isPaused: boolean;
  isGameOver: boolean;
  onDirectionChange: (newDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onReset: () => void;
  onTogglePause: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  direction,
  isPaused,
  isGameOver,
  onDirectionChange,
  onReset,
  onTogglePause
}) => {
  const handleKeyClick = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!isPaused && !isGameOver) {
      onDirectionChange(dir);
    }
  };

  const buttonClass = "w-14 h-14 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95 transition-all";
  const activeButtonClass = "w-14 h-14 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all";

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between">
        <button 
          onClick={onReset} 
          className="flex items-center gap-2 py-2 px-4 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          <RefreshCw size={18} />
          <span>Reset</span>
        </button>
        
        <button 
          onClick={onTogglePause} 
          className="flex items-center gap-2 py-2 px-4 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          {isPaused ? (
            <>
              <Play size={18} />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause size={18} />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        {/* Top row - Up arrow */}
        <div className="col-start-2">
          <button 
            onClick={() => handleKeyClick('UP')}
            className={direction === 'UP' ? activeButtonClass : buttonClass}
            aria-label="Move Up"
          >
            <ArrowUp size={24} />
          </button>
        </div>
        
        {/* Middle row - Left, Reset, Right */}
        <button 
          onClick={() => handleKeyClick('LEFT')}
          className={direction === 'LEFT' ? activeButtonClass : buttonClass}
          aria-label="Move Left"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center justify-center">
          {/* Empty center space */}
        </div>
        <button 
          onClick={() => handleKeyClick('RIGHT')}
          className={direction === 'RIGHT' ? activeButtonClass : buttonClass}
          aria-label="Move Right"
        >
          <ArrowRight size={24} />
        </button>
        
        {/* Bottom row - Down arrow */}
        <div className="col-start-2">
          <button 
            onClick={() => handleKeyClick('DOWN')}
            className={direction === 'DOWN' ? activeButtonClass : buttonClass}
            aria-label="Move Down"
          >
            <ArrowDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
