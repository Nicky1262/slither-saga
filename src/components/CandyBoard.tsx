
import React, { useState, useEffect } from 'react';
import CandyPiece from './CandyPiece';

type CandyType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

interface CandyBoardProps {
  onScoreChange: (score: number) => void;
  onMovesChange: (moves: number) => void;
}

const BOARD_SIZE = 8;
const CANDY_TYPES: CandyType[] = ['red', 'blue', 'green', 'yellow', 'purple'];

const CandyBoard: React.FC<CandyBoardProps> = ({ onScoreChange, onMovesChange }) => {
  const [board, setBoard] = useState<CandyType[][]>([]);
  const [selectedCandy, setSelectedCandy] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  
  // Initialize board
  useEffect(() => {
    initializeBoard();
  }, []);

  // Watch score changes
  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  // Watch moves changes
  useEffect(() => {
    onMovesChange(moves);
  }, [moves, onMovesChange]);

  const initializeBoard = () => {
    const newBoard: CandyType[][] = [];
    
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: CandyType[] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const randomIndex = Math.floor(Math.random() * CANDY_TYPES.length);
        row.push(CANDY_TYPES[randomIndex]);
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
  };

  const handleCandyClick = (row: number, col: number) => {
    if (selectedCandy === null) {
      // First selection
      setSelectedCandy({ row, col });
    } else {
      // Second selection - check if it's adjacent
      const isAdjacent = 
        (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) || 
        (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row);
      
      if (isAdjacent) {
        // Swap candies
        swapCandies(selectedCandy.row, selectedCandy.col, row, col);
        // Decrement moves
        setMoves(prevMoves => prevMoves - 1);
      }
      
      setSelectedCandy(null);
    }
  };

  const swapCandies = (row1: number, col1: number, row2: number, col2: number) => {
    const newBoard = [...board];
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;
    
    setBoard(newBoard);
    
    // Check for matches after swap
    setTimeout(() => {
      checkForMatches();
    }, 300);
  };

  const checkForMatches = () => {
    let matchFound = false;
    const newBoard = [...board];
    const markedForRemoval: boolean[][] = Array(BOARD_SIZE).fill(false).map(() => Array(BOARD_SIZE).fill(false));
    
    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        const candyType = newBoard[row][col];
        if (
          candyType === newBoard[row][col + 1] && 
          candyType === newBoard[row][col + 2]
        ) {
          matchFound = true;
          markedForRemoval[row][col] = true;
          markedForRemoval[row][col + 1] = true;
          markedForRemoval[row][col + 2] = true;
          
          // Check if the match extends
          if (col + 3 < BOARD_SIZE && candyType === newBoard[row][col + 3]) {
            markedForRemoval[row][col + 3] = true;
            if (col + 4 < BOARD_SIZE && candyType === newBoard[row][col + 4]) {
              markedForRemoval[row][col + 4] = true;
            }
          }
        }
      }
    }
    
    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        const candyType = newBoard[row][col];
        if (
          candyType === newBoard[row + 1][col] && 
          candyType === newBoard[row + 2][col]
        ) {
          matchFound = true;
          markedForRemoval[row][col] = true;
          markedForRemoval[row + 1][col] = true;
          markedForRemoval[row + 2][col] = true;
          
          // Check if the match extends
          if (row + 3 < BOARD_SIZE && candyType === newBoard[row + 3][col]) {
            markedForRemoval[row + 3][col] = true;
            if (row + 4 < BOARD_SIZE && candyType === newBoard[row + 4][col]) {
              markedForRemoval[row + 4][col] = true;
            }
          }
        }
      }
    }
    
    // Remove matched candies and update score
    if (matchFound) {
      let matchCount = 0;
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (markedForRemoval[row][col]) {
            matchCount++;
            // Replace with a null placeholder temporarily
            newBoard[row][col] = null as any;
          }
        }
      }
      
      // Update score based on matches
      setScore(prevScore => prevScore + matchCount * 10);
      
      // Drop candies and fill empty spaces
      setTimeout(() => {
        dropCandies();
      }, 300);
    }
  };

  const dropCandies = () => {
    const newBoard = [...board];
    
    // Column by column, drop candies down
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0;
      
      // Move from bottom to top
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          // Move candy down by empty spaces count
          newBoard[row + emptySpaces][col] = newBoard[row][col];
          newBoard[row][col] = null as any;
        }
      }
      
      // Fill top empty spaces with new candies
      for (let row = 0; row < emptySpaces; row++) {
        const randomIndex = Math.floor(Math.random() * CANDY_TYPES.length);
        newBoard[row][col] = CANDY_TYPES[randomIndex];
      }
    }
    
    setBoard(newBoard);
    
    // Check for new matches after dropping
    setTimeout(() => {
      checkForMatches();
    }, 500);
  };

  return (
    <div className="w-full aspect-square bg-white rounded-lg shadow-md p-2">
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
        {board.map((row, rowIndex) =>
          row.map((candyType, colIndex) => (
            <CandyPiece
              key={`${rowIndex}-${colIndex}`}
              type={candyType}
              isSelected={selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex}
              onClick={() => handleCandyClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CandyBoard;
