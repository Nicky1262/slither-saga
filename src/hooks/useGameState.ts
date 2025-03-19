
import { useState, useEffect, useCallback } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

// Get high score from local storage
const getHighScore = () => {
  const storedScore = localStorage.getItem('snakeHighScore');
  return storedScore ? parseInt(storedScore, 10) : 0;
};

// Save high score to local storage
const saveHighScore = (score: number) => {
  localStorage.setItem('snakeHighScore', score.toString());
};

export const useGameState = () => {
  const gridSize = 15; // 15x15 grid
  const initialSpeed = 200; // milliseconds
  const minSpeed = 80; // fastest speed
  const speedDecrement = 5; // how much to speed up by

  const [snake, setSnake] = useState<Position[]>([
    { x: 7, y: 7 }, // Head
    { x: 6, y: 7 }, // Body segment
  ]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore());
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  // Generate new food position
  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      // Ensure food doesn't spawn on snake
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, [snake, gridSize]);

  // Initialize game
  useEffect(() => {
    setFood(generateFood());
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        // Get current head
        const head = { ...prevSnake[0] };
        
        // Apply next direction
        switch (nextDirection) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }
        
        // Update current direction
        setDirection(nextDirection);
        
        // Check for collisions
        // Wall collision
        if (
          head.x < 0 || 
          head.x >= gridSize || 
          head.y < 0 || 
          head.y >= gridSize
        ) {
          setGameOver(true);
          // Update high score if needed
          if (score > highScore) {
            setHighScore(score);
            saveHighScore(score);
          }
          return prevSnake;
        }
        
        // Self collision
        if (prevSnake.some((segment, index) => 
          index !== 0 && segment.x === head.x && segment.y === head.y
        )) {
          setGameOver(true);
          // Update high score if needed
          if (score > highScore) {
            setHighScore(score);
            saveHighScore(score);
          }
          return prevSnake;
        }
        
        // Create new snake
        const newSnake = [head, ...prevSnake];
        
        // Food collision
        if (head.x === food.x && head.y === food.y) {
          // Snake grows (don't remove tail)
          setScore(prevScore => prevScore + 1);
          setFood(generateFood());
          
          // Speed up the game as score increases
          if (speed > minSpeed) {
            setSpeed(prevSpeed => Math.max(prevSpeed - speedDecrement, minSpeed));
          }
        } else {
          // Remove tail if no food was eaten
          newSnake.pop();
        }
        
        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [food, gameOver, isPaused, nextDirection, generateFood, gridSize, score, highScore, speed, minSpeed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') {
            setNextDirection('UP');
          }
          break;
        case 'ArrowDown':
          if (direction !== 'UP') {
            setNextDirection('DOWN');
          }
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') {
            setNextDirection('LEFT');
          }
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') {
            setNextDirection('RIGHT');
          }
          break;
        case ' ':
          // Space bar toggles pause
          togglePause();
          break;
        case 'r':
        case 'R':
          // R key resets game
          resetGame();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // Set direction safely (prevent 180 degree turns)
  const safeSetDirection = (newDirection: Direction) => {
    if (
      (newDirection === 'UP' && direction !== 'DOWN') ||
      (newDirection === 'DOWN' && direction !== 'UP') ||
      (newDirection === 'LEFT' && direction !== 'RIGHT') ||
      (newDirection === 'RIGHT' && direction !== 'LEFT')
    ) {
      setNextDirection(newDirection);
    }
  };

  // Reset game
  const resetGame = () => {
    setSnake([
      { x: 7, y: 7 }, // Head
      { x: 6, y: 7 }, // Body segment
    ]);
    setFood(generateFood());
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(initialSpeed);
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return {
    snake,
    food,
    direction,
    score,
    highScore,
    gameOver,
    isPaused,
    gridSize,
    setDirection: safeSetDirection,
    resetGame,
    togglePause
  };
};
