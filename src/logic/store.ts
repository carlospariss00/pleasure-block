import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateInitialPieces, generateRandomPiece } from './pieces';
import type { PieceShape } from './pieces';
import type { GridCoordinate } from './gridUtils';
import { sounds } from './sounds';
import { BOARD_SIZE, POINTS_PER_BLOCK, LINES_PER_LEVEL } from './constants';

export type GameMode = 'classic' | 'zen' | 'missions';
type View = 'menu' | 'game';

interface Mission {
  type: 'lines' | 'combo' | 'score';
  target: number;
  current: number;
  description: string;
}

interface GameState {
  view: View;
  gameMode: GameMode;
  board: Record<string, string>;
  pieces: (PieceShape | null)[];
  score: number;
  highScore: Record<GameMode, number>;
  level: number;
  linesCleared: number;
  combo: number;
  missedTurns: number;
  lastLinesCleared: number;
  lastClearedLines: { rows: number[], cols: number[] };
  showCombo: boolean;
  showLevelUp: boolean;
  showFullClear: boolean;
  draggedPieceIndex: number | null;
  hoverGrid: GridCoordinate | null;
  gameOver: boolean;
  isMuted: boolean;
  isPaused: boolean;
  volume: number;
  currentMission: Mission | null;
  
  setView: (view: View) => void;
  setGameMode: (mode: GameMode) => void;
  toggleMute: () => void;
  setPaused: (paused: boolean) => void;
  setVolume: (volume: number) => void;
  setHoverGrid: (index: number | null, coords: GridCoordinate | null) => void;
  canPlacePiece: (pieceIndex: number, startX: number, startY: number) => boolean;
  placePiece: (pieceIndex: number, startX: number, startY: number) => boolean;
  clearLines: () => void;
  checkGameOver: () => void;
  resetGame: () => void;
  hideCombo: () => void;
  hideLevelUp: () => void;
  hideFullClear: () => void;
  generateNewMission: () => void;
  tickTime: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      view: 'menu',
      gameMode: 'classic',
      board: {},
      pieces: generateInitialPieces(),
      score: 0,
      highScore: { classic: 0, zen: 0, missions: 0 },
      level: 1,
      linesCleared: 0,
      combo: 0,
      missedTurns: 0,
      lastLinesCleared: 0,
      lastClearedLines: { rows: [], cols: [] },
      showCombo: false,
      showLevelUp: false,
      showFullClear: false,
      draggedPieceIndex: null,
      hoverGrid: null,
      gameOver: false,
      isMuted: false,
      isPaused: false,
      volume: 0.5,
      currentMission: null,

      setView: (view) => set({ view, isPaused: false }),
      setGameMode: (gameMode) => set({ gameMode }),

      toggleMute: () => {
        const newMuted = sounds.toggleMute();
        set({ isMuted: newMuted });
      },

      setPaused: (isPaused) => set({ isPaused }),
      
      setVolume: (volume) => {
        sounds.setVolume(volume);
        set({ volume });
      },

      hideCombo: () => set({ showCombo: false }),
      hideLevelUp: () => set({ showLevelUp: false }),
      hideFullClear: () => set({ showFullClear: false }),
      tickTime: () => {},

      generateNewMission: () => {
        const { level } = get();
        const types: Mission['type'][] = ['lines', 'combo', 'score'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let mission: Mission;
        switch(type) {
          case 'lines':
            const lineTarget = 2 + level;
            mission = { type, target: lineTarget, current: 0, description: `Limpia ${lineTarget} líneas` };
            break;
          case 'combo':
            const comboTarget = level > 5 ? 3 : 2;
            mission = { type, target: comboTarget, current: 0, description: `Llega a combo x${comboTarget}` };
            break;
          case 'score':
          default:
            const scoreTarget = 300 * level;
            mission = { type, target: scoreTarget, current: 0, description: `Gana ${scoreTarget} puntos` };
            break;
        }
        set({ currentMission: mission });
      },

      setHoverGrid: (index, coords) => {
        const state = get();
        if (state.gameOver || state.isPaused) return;

        // Si la posición es la misma que la anterior, no actualizar el estado
        const isSameX = state.hoverGrid?.x === coords?.x;
        const isSameY = state.hoverGrid?.y === coords?.y;
        const isSameIndex = state.draggedPieceIndex === index;

        if (isSameX && isSameY && isSameIndex) return;

        set({ draggedPieceIndex: index, hoverGrid: coords });
      },

      canPlacePiece: (pieceIndex, startX, startY) => {
        const { board, pieces, isPaused, gameOver } = get();
        if (isPaused || gameOver || pieceIndex === null) return false;
        const piece = pieces[pieceIndex];
        if (!piece) return false;

        for (const offset of piece.coords) {
          const x = startX + offset.x;
          const y = startY + offset.y;
          if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return false;
          if (board[`${x},${y}`]) return false;
        }
        return true;
      },

      placePiece: (pieceIndex, startX, startY) => {
        const state = get();
        if (state.gameOver || state.isPaused) return false;
        const piece = state.pieces[pieceIndex];
        if (!piece) return false;

        if (!get().canPlacePiece(pieceIndex, startX, startY)) return false;

        const newBoard = { ...state.board };
        for (const offset of piece.coords) {
          newBoard[`${startX + offset.x},${startY + offset.y}`] = piece.color;
        }

        let newPieces = [...state.pieces];
        newPieces[pieceIndex] = null;

        if (newPieces.every(p => p === null)) {
          newPieces = [generateRandomPiece(state.level), generateRandomPiece(state.level), generateRandomPiece(state.level)];
        }

        const addedScore = piece.coords.length * POINTS_PER_BLOCK;
        const newScore = state.score + addedScore;
        
        let updatedMission = state.currentMission;
        let missionCompleted = false;
        if (state.gameMode === 'missions' && updatedMission?.type === 'score') {
          updatedMission = { ...updatedMission, current: updatedMission.current + addedScore };
          if (updatedMission.current >= updatedMission.target) missionCompleted = true;
        }

        set({ 
          board: newBoard, 
          pieces: newPieces, 
          score: newScore,
          highScore: { ...state.highScore, [state.gameMode]: Math.max(newScore, state.highScore[state.gameMode]) },
          draggedPieceIndex: null,
          hoverGrid: null,
          currentMission: missionCompleted ? null : updatedMission
        });

        if (missionCompleted) {
          sounds.playLevelUp();
          setTimeout(() => get().generateNewMission(), 100);
        }

        sounds.playPlace();
        sounds.vibrate(10);
        get().clearLines();
        get().checkGameOver();
        return true;
      },

      clearLines: () => {
        const state = get();
        const { board, gameMode, currentMission } = state;
        const toClear = new Set<string>();
        const clearedRows: number[] = [];
        const clearedCols: number[] = [];

        for (let y = 0; y < BOARD_SIZE; y++) {
          let rowFull = true;
          for (let x = 0; x < BOARD_SIZE; x++) if (!board[`${x},${y}`]) { rowFull = false; break; }
          if (rowFull) {
            for (let x = 0; x < BOARD_SIZE; x++) toClear.add(`${x},${y}`);
            clearedRows.push(y);
          }
        }

        for (let x = 0; x < BOARD_SIZE; x++) {
          let colFull = true;
          for (let y = 0; y < BOARD_SIZE; y++) if (!board[`${x},${y}`]) { colFull = false; break; }
          if (colFull) {
            for (let y = 0; y < BOARD_SIZE; y++) toClear.add(`${x},${y}`);
            clearedCols.push(x);
          }
        }

        if (toClear.size > 0) {
          const newBoard = { ...board };
          toClear.forEach(key => delete newBoard[key]);
          
          const linesInThisTurn = clearedRows.length + clearedCols.length;
          const newCombo = state.combo + 1;
          const earned = Math.floor(((linesInThisTurn * (linesInThisTurn + 1) / 2) * 100) * state.level * (1 + newCombo * 0.1));
          const newScore = state.score + earned;
          const newTotalLines = state.linesCleared + linesInThisTurn;
          const newLevel = Math.floor(newTotalLines / LINES_PER_LEVEL) + 1;

          let updatedMission = currentMission;
          let missionCompleted = false;
          if (gameMode === 'missions' && updatedMission) {
            if (updatedMission.type === 'lines') {
              updatedMission = { ...updatedMission, current: updatedMission.current + linesInThisTurn };
              if (updatedMission.current >= updatedMission.target) missionCompleted = true;
            } else if (updatedMission.type === 'combo' && newCombo >= updatedMission.target) {
              missionCompleted = true;
            }
          }

          set({ 
            board: newBoard, 
            score: newScore,
            highScore: { ...state.highScore, [gameMode]: Math.max(newScore, state.highScore[gameMode]) },
            linesCleared: newTotalLines,
            combo: newCombo,
            missedTurns: 0,
            lastLinesCleared: linesInThisTurn,
            lastClearedLines: { rows: clearedRows, cols: clearedCols },
            showCombo: linesInThisTurn >= 2 || newCombo >= 3,
            level: newLevel,
            showLevelUp: newLevel > state.level,
            currentMission: missionCompleted ? null : updatedMission
          });

          if (missionCompleted) {
            sounds.playLevelUp();
            setTimeout(() => get().generateNewMission(), 100);
          }

          sounds.playClear();
          sounds.vibrate(25);
          if (linesInThisTurn >= 2) sounds.playVoice(linesInThisTurn >= 5 ? 'amazing' : linesInThisTurn === 4 ? 'perfect' : linesInThisTurn === 3 ? 'excellent' : 'great');
        } else {
          const newMissedTurns = state.missedTurns + 1;
          set({ 
            missedTurns: newMissedTurns, 
            showCombo: false, 
            combo: newMissedTurns >= 3 ? 0 : state.combo 
          });
        }
      },

      checkGameOver: () => {
        const { board, pieces, gameMode, isPaused, gameOver } = get();
        if (isPaused || gameOver) return;

        const remainingPieces = pieces.filter(p => p !== null) as PieceShape[];
        if (remainingPieces.length === 0) return;

        const canMove = remainingPieces.some(piece => {
          for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
              if (get().canPlacePiece(pieces.indexOf(piece), x, y)) return true;
            }
          }
          return false;
        });

        if (!canMove) {
          if (gameMode === 'zen') {
            const newBoard = { ...board };
            const c = Math.floor(BOARD_SIZE / 2);
            for (let y = c - 2; y <= c + 2; y++) for (let x = c - 2; x <= c + 2; x++) delete newBoard[`${x},${y}`];
            set({ board: newBoard });
            sounds.playClear();
          } else {
            set({ gameOver: true });
            sounds.playGameOver();
          }
        }
      },

      resetGame: () => {
        const mode = get().gameMode;
        set({
          board: {},
          pieces: generateInitialPieces(),
          score: 0,
          level: 1,
          linesCleared: 0,
          gameOver: false,
          combo: 0,
          missedTurns: 0,
          currentMission: null,
          isPaused: false
        });
        if (mode === 'missions') setTimeout(() => get().generateNewMission(), 50);
      }
    }),
    {
      name: 'pleasure-block-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
