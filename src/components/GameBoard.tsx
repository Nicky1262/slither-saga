
import React, { useRef, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';

interface GameBoardProps {
  onScoreChange: (score: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    snake, 
    food, 
    score, 
    gameOver, 
    isPaused,
    gridSize, 
    direction, 
    setDirection, 
    resetGame, 
    togglePause 
  } = useGameState();
  
  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the background
    ctx.fillStyle = '#F1F0FB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gridlines (subtle)
    ctx.strokeStyle = '#E5DEFF';
    ctx.lineWidth = 0.5;
    
    const cellSize = canvas.width / gridSize;
    
    // Horizontal lines
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
    }

    // Draw snake body
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#7E69AB';
      } else {
        // Body
        ctx.fillStyle = '#8B5CF6';
      }
      
      // Draw rounded rectangle for snake segments
      const padding = 1; // Small gap between segments
      roundedRect(
        ctx, 
        segment.x * cellSize + padding, 
        segment.y * cellSize + padding, 
        cellSize - padding * 2, 
        cellSize - padding * 2, 
        5
      );
    });

    // Draw food
    ctx.fillStyle = '#D946EF';
    const foodPadding = 2;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      (cellSize / 2) - foodPadding,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Add a subtle glow to the food
    ctx.shadowColor = '#D946EF';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food, gridSize, gameOver]);

  // Helper function to draw rounded rectangles
  const roundedRect = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  const handleCanvasClick = () => {
    if (gameOver) {
      resetGame();
    } else {
      togglePause();
    }
  };

  // Handle touch events for mobile swipe controls
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Determine the direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 20 && direction !== 'LEFT') {
        setDirection('RIGHT');
      } else if (deltaX < -20 && direction !== 'RIGHT') {
        setDirection('LEFT');
      }
    } else {
      // Vertical swipe
      if (deltaY > 20 && direction !== 'UP') {
        setDirection('DOWN');
      } else if (deltaY < -20 && direction !== 'DOWN') {
        setDirection('UP');
      }
    }
    
    touchStartRef.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg bg-white border border-purple-100">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="touch-none"
      />
      
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-6">Score: {score}</p>
          <button 
            onClick={resetGame} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      
      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          <p className="text-2xl font-bold">Paused</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
