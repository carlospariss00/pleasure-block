import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateInitialPieces, generateRandomPiece } from './pieces';
import type { PieceShape } from './pieces';
import type { GridCoordinate } from './gridUtils';
import { sounds } from './sounds';

const BOARD_SIZE = 8;
interface GameState {
  board: Record<string, string>;
  pieces: (PieceShape | null)[];
  score: number;
  highScore: number;
  level: number;
  linesCleared: number;
  combo: number;
  missedTurns: number;
  lastLinesCleared: number;
  lastClearedLines: { rows: number[], cols: number[] };
  showCombo: boolean;
  showLevelUp: boolean;
  draggedPieceIndex: number | null;
  hoverGrid: GridCoordinate | null;
  gameOver: boolean;
  setHoverGrid: (index: number | null, coords: GridCoordinate | null) => void;
  canPlacePiece: (pieceIndex: number, startX: number, startY: number) => boolean;
  placePiece: (pieceIndex: number, startX: number, startY: number) => boolean;
  clearLines: () => void;
  checkGameOver: () => void;
  resetGame: () => void;
  hideCombo: () => void;
  hideLevelUp: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      board: {},
      pieces: generateInitialPieces(),
      score: 0,
      highScore: 0,
      level: 1,
      linesCleared: 0,
      combo: 0,
      missedTurns: 0,
      lastLinesCleared: 0,
      lastClearedLines: { rows: [], cols: [] },
      showCombo: false,
      showLevelUp: false,
      draggedPieceIndex: null,
      hoverGrid: null,
      gameOver: false,

      hideCombo: () => set({ showCombo: false }),
      hideLevelUp: () => set({ showLevelUp: false }),

      setHoverGrid: (index, coords) => {
        // ... (resto igual)

        if (get().gameOver) return;
        const current = get();
        
        if (index !== null && current.draggedPieceIndex === null) {
          sounds.playPickup();
        }

        const isSameCoords = current.hoverGrid && coords && 
                            current.hoverGrid.x === coords.x && 
                            current.hoverGrid.y === coords.y;
        const isSameIndex = current.draggedPieceIndex === index;

        if (isSameCoords && isSameIndex) return;

        set({ draggedPieceIndex: index, hoverGrid: coords });
      },

      canPlacePiece: (pieceIndex, startX, startY) => {
        const { board, pieces } = get();
        if (pieceIndex === null) return false;
        const piece = pieces[pieceIndex];
        if (!piece) return false;

        for (const offset of piece.coords) {
          const x = startX + offset.x;
          const y = startY + offset.y;
          const key = `${x},${y}`;

          if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return false;
          if (board[key]) return false;
        }
        return true;
      },

      placePiece: (pieceIndex, startX, startY) => {
        if (get().gameOver) return false;
        const { board, pieces } = get();
        const piece = pieces[pieceIndex];
        if (!piece) return false;

        if (!get().canPlacePiece(pieceIndex, startX, startY)) return false;

        const newBoard = { ...board };
        for (const offset of piece.coords) {
          const x = startX + offset.x;
          const y = startY + offset.y;
          const key = `${x},${y}`;
          newBoard[key] = piece.color;
        }

        let newPieces: (PieceShape | null)[] = [...pieces];
        newPieces[pieceIndex] = null;
        
        if (newPieces.every(p => p === null)) {
          const currentLevel = get().level;
          newPieces = [
            generateRandomPiece(currentLevel), 
            generateRandomPiece(currentLevel), 
            generateRandomPiece(currentLevel)
          ];
        }

        const addedScore = piece.coords.length * 10;
        const newScore = get().score + addedScore;
        const currentHighScore = get().highScore;
        
        set({ 
          board: newBoard, 
          pieces: newPieces, 
          score: newScore,
          highScore: Math.max(newScore, currentHighScore),
          draggedPieceIndex: null,
          hoverGrid: null
        });
        
        sounds.playPlace();
        get().clearLines();
        get().checkGameOver();
        return true;
      },

      clearLines: () => {
        const { board, score, linesCleared, combo, level, missedTurns } = get();
        const newBoard = { ...board };
        const toClear = new Set<string>();
        let linesInThisTurn = 0;
        const clearedRows: number[] = [];
        const clearedCols: number[] = [];

        for (let y = 0; y < BOARD_SIZE; y++) {
          let rowFull = true;
          const rowKeys: string[] = [];
          for (let x = 0; x < BOARD_SIZE; x++) {
            const key = `${x},${y}`;
            rowKeys.push(key);
            if (!board[key]) {
              rowFull = false;
              break;
            }
          }
          if (rowFull) {
            rowKeys.forEach(k => toClear.add(k));
            linesInThisTurn++;
            clearedRows.push(y);
          }
        }

        for (let x = 0; x < BOARD_SIZE; x++) {
          let colFull = true;
          const colKeys: string[] = [];
          for (let y = 0; y < BOARD_SIZE; y++) {
            const key = `${x},${y}`;
            colKeys.push(key);
            if (!board[key]) {
              colFull = false;
              break;
            }
          }
          if (colFull) {
            colKeys.forEach(k => toClear.add(k));
            linesInThisTurn++;
            clearedCols.push(x);
          }
        }

        if (toClear.size > 0) {
          toClear.forEach(key => delete newBoard[key]);
          
          const newCombo = combo + 1;
          const basePoints = (linesInThisTurn * (linesInThisTurn + 1) / 2) * 100;
          const earned = basePoints * level * (1 + newCombo * 0.1);

          const newScore = score + Math.floor(earned);
          const currentHighScore = get().highScore;
          const newTotalLines = linesCleared + linesInThisTurn;
          const newLevel = Math.floor(newTotalLines / 10) + 1;
          const levelUp = newLevel > level;

          set({ 
            board: newBoard, 
            score: newScore,
            highScore: Math.max(newScore, currentHighScore),
            linesCleared: newTotalLines,
            combo: newCombo,
            missedTurns: 0,
            lastLinesCleared: linesInThisTurn,
            lastClearedLines: { rows: clearedRows, cols: clearedCols },
            showCombo: linesInThisTurn >= 2 || newCombo >= 3,
            level: newLevel,
            showLevelUp: levelUp
          });

          // Siempre reproducir el sonido de limpieza de bloques
          sounds.playClear();

          // Y ADEMÁS reproducir sonidos de voz según líneas eliminadas
          if (linesInThisTurn === 2) {
            sounds.playVoice('great');
          } else if (linesInThisTurn === 3) {
            sounds.playVoice('excellent');
          } else if (linesInThisTurn === 4) {
            sounds.playVoice('perfect');
          } else if (linesInThisTurn >= 5) {
            sounds.playVoice('amazing');
          }
        } else {
          const newMissedTurns = missedTurns + 1;
          if (newMissedTurns >= 3) {
            set({ combo: 0, missedTurns: 0, showCombo: false, lastClearedLines: { rows: [], cols: [] } });
          } else {
            set({ missedTurns: newMissedTurns, showCombo: false, lastClearedLines: { rows: [], cols: [] } });
          }
        }
      },

      checkGameOver: () => {
        const { board, pieces } = get();
        const remainingPieces = pieces.filter(p => p !== null) as PieceShape[];
        
        if (remainingPieces.length === 0) return;

        const canMove = remainingPieces.some((piece) => {
          const pieceIndexInState = pieces.indexOf(piece);
          for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
              if (get().canPlacePiece(pieceIndexInState, x, y)) {
                return true;
              }
            }
          }
          return false;
        });

        if (!canMove) {
          set({ gameOver: true });
          sounds.playGameOver();
        }
      },

      resetGame: () => {
        set({
          board: {},
          pieces: generateInitialPieces(),
          score: 0,
          level: 1,
          linesCleared: 0,
          draggedPieceIndex: null,
          hoverGrid: null,
          gameOver: false,
          combo: 0,
          missedTurns: 0,
          showCombo: false
        });
      }
    }),
    {
      name: 'pleasure-block-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistir lo necesario para retomar la partida
      partialize: (state) => ({
        board: state.board,
        pieces: state.pieces,
        score: state.score,
        highScore: state.highScore,
        level: state.level,
        linesCleared: state.linesCleared,
        combo: state.combo,
        missedTurns: state.missedTurns,
      }),
    }
  )
);