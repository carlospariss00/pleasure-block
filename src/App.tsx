import { Board } from './components/Board'
import { DraggablePiece } from './components/DraggablePiece'
import { PauseMenu } from './components/PauseMenu'
import { Menu } from './components/Menu'
import { Intro } from './components/Intro'
import { Header } from './components/Header'
import { GameOverOverlay } from './components/GameOverOverlay'
import { useGameStore } from './logic/store'
import type { GameMode } from './logic/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { sounds } from './logic/sounds'
import { CELL_SIZE, BOARD_SIZE, COMBO_TIMEOUT, LEVEL_UP_TIMEOUT, DOCK_CELL_SIZE } from './logic/constants'

function App() {
  const { 
    view, setView, setGameMode,
    level, combo, pieces, gameOver, resetGame, showCombo, hideCombo, 
    lastLinesCleared, showLevelUp, hideLevelUp, showFullClear, 
    hideFullClear, isPaused
  } = useGameStore();

  useEffect(() => {
    if (view === 'game') {
      sounds.startMusic();
    } else {
      sounds.stopMusic();
    }
  }, [view]);

  useEffect(() => {
    if (showCombo) {
      const timer = setTimeout(() => hideCombo(), COMBO_TIMEOUT); 
      return () => clearTimeout(timer);
    }
  }, [showCombo, hideCombo]);

  useEffect(() => {
    if (showLevelUp) {
      sounds.playLevelUp();
      const timer = setTimeout(() => hideLevelUp(), LEVEL_UP_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, hideLevelUp]);

  useEffect(() => {
    if (showFullClear) {
      const timer = setTimeout(() => hideFullClear(), 3000);
      return () => clearTimeout(timer);
    }
  }, [showFullClear, hideFullClear]);

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    setView('game');
  };

  return (
    <div className="min-h-screen w-full bg-[#050510] text-slate-100 font-sans overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <Intro />
          </motion.div>
        )}

        {view === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Menu onStartGame={handleStartGame} />
          </motion.div>
        )}

        {view === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4"
          >
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative">
              <PauseMenu />
              
              <div className="absolute -top-8 sm:-top-24 left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
                <AnimatePresence>
                  {showLevelUp && (
                    <motion.div
                      initial={{ opacity: 0, y: -50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 1.2 }}
                      className="flex flex-col items-center"
                    >
                      <div className="text-4xl sm:text-6xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] uppercase italic tracking-tighter">
                        ¡Level Up!
                      </div>
                      <div className="text-lg sm:text-2xl font-bold text-white bg-slate-900/90 px-3 sm:px-5 py-0.5 sm:py-1 rounded-full border border-amber-500/30 backdrop-blur-md -mt-1 sm:-mt-2">
                        Nivel {level}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={`w-full max-w-xs sm:max-w-md aspect-square bg-slate-900 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden relative mb-4 sm:mb-8 transition-opacity ${isPaused ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <Board size={BOARD_SIZE} cellSize={CELL_SIZE} />
                
                <AnimatePresence>
                  {showFullClear && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0, scale: 2 }}
                      className="absolute z-50 pointer-events-none flex flex-col items-center"
                    >
                      <div className="text-3xl sm:text-5xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] italic uppercase tracking-tighter text-center">
                        ¡TABLERO LIMPIO!
                      </div>
                      <div className="text-lg sm:text-2xl font-bold text-white bg-slate-900/80 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full mt-1 sm:mt-2 border border-amber-500/50 backdrop-blur-sm">
                        +1000 Puntos
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showCombo && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
                      exit={{ opacity: 0, scale: 2, rotate: 20 }}
                      className="absolute z-40 pointer-events-none flex flex-col items-center"
                    >
                      <div className="text-4xl sm:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] italic uppercase tracking-tighter text-center">
                        {lastLinesCleared >= 5 ? '¡Amazing!' : 
                         lastLinesCleared === 4 ? '¡Perfect!' : 
                         lastLinesCleared === 3 ? '¡Excellent!' : 
                         lastLinesCleared === 2 ? '¡Great!' : '¡Combo!'}
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-pink-500 drop-shadow-lg italic">
                        x{combo}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {gameOver && <GameOverOverlay />}
                </AnimatePresence>
              </div>

              <div className={`w-full max-w-xs sm:max-w-md h-24 sm:h-36 bg-slate-900/50 rounded-xl sm:rounded-2xl border-2 border-slate-800 flex justify-around items-center px-2 sm:px-4 gap-2 sm:gap-4 backdrop-blur-sm transition-opacity ${gameOver || isPaused ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                {pieces.map((piece, i) => (
                  <div key={piece?.id || `empty-${i}`} className="w-16 sm:w-24 h-16 sm:h-24 rounded-lg sm:rounded-xl flex items-center justify-center relative">
                    {piece ? (
                      <DraggablePiece piece={piece} index={i} cellSize={DOCK_CELL_SIZE} />
                    ) : (
                      <div className="w-2 h-2 bg-slate-700 rounded-full opacity-20" />
                    )}
                  </div>
                ))}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
