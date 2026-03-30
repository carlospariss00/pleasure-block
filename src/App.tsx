import { Board } from './components/Board'
import { DraggablePiece } from './components/DraggablePiece'
import { useGameStore } from './logic/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { sounds } from './logic/sounds'
import { CELL_SIZE, BOARD_SIZE, LINES_PER_LEVEL, COMBO_TIMEOUT, LEVEL_UP_TIMEOUT, DOCK_CELL_SIZE } from './logic/constants'

function App() {
  const { 
    score, highScore, level, linesCleared, combo, pieces, 
    gameOver, resetGame, showCombo, hideCombo, lastLinesCleared,
    showLevelUp, hideLevelUp, isMuted, toggleMute,
    showFullClear, hideFullClear
  } = useGameStore();

  const progress = ((linesCleared % LINES_PER_LEVEL) / LINES_PER_LEVEL) * 100;

  useEffect(() => {
    if (showCombo) {
      const timer = setTimeout(() => {
        hideCombo();
      }, COMBO_TIMEOUT); 
      return () => clearTimeout(timer);
    }
  }, [showCombo, hideCombo, combo]);

  useEffect(() => {
    if (showLevelUp) {
      sounds.playLevelUp();
      const timer = setTimeout(() => {
        hideLevelUp();
      }, LEVEL_UP_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, hideLevelUp]);

  useEffect(() => {
    if (showFullClear) {
      const timer = setTimeout(() => {
        hideFullClear();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFullClear, hideFullClear]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      <header className="mb-6 text-center w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left w-20">
            <span className="text-[10px] uppercase opacity-50 font-bold block">Récord</span>
            <span className="text-xl font-black text-slate-300">{highScore}</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500 uppercase tracking-tighter">
          Pleasure Blast
          </h1>
          <div className="text-right w-20 flex flex-col items-end">
            <button 
              onClick={toggleMute}
              className="mb-1 p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L5.413 8.587A2 2 0 0 1 4 9.122H2V15h2a2 2 0 0 1 1.414.586l4.384 4.384A.705.705 0 0 0 11 19.473V4.702Z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L5.413 8.587A2 2 0 0 1 4 9.122H2V15h2a2 2 0 0 1 1.414.586l4.384 4.384A.705.705 0 0 0 11 19.473V4.702Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              )}
            </button>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase opacity-50 font-bold block leading-none">Nivel</span>
              <span className="text-xl font-black text-pink-500 leading-none">{level}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="flex gap-4 justify-center items-center relative z-10">
            <div className="flex flex-col flex-1 border-r border-slate-800">
              <span className="text-[10px] uppercase opacity-50 font-bold">Líneas</span>
              <span className="text-xl font-bold">{linesCleared}</span>
            </div>
            <div className="flex flex-col flex-2">
              <span className="text-[10px] uppercase opacity-50 font-bold">Puntaje</span>
              <span className="text-3xl leading-none font-black text-amber-400">{score}</span>
            </div>
          </div>
          
          {/* Barra de Progreso de Nivel */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl relative">
        {/* Animación de Level Up */}
        <div className="absolute top-[-100px] left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
          <AnimatePresence>
            {showLevelUp && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.2 }}
                className="flex flex-col items-center"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-6xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] uppercase italic tracking-tighter"
                >
                  ¡Level Up!
                </motion.div>
                <div className="text-2xl font-bold text-white bg-slate-900/90 px-5 py-1 rounded-full border border-amber-500/30 backdrop-blur-md -mt-2">
                  Nivel {level}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full max-w-md aspect-square bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden relative mb-12">
          <Board size={BOARD_SIZE} cellSize={CELL_SIZE} />
          
          {/* Animación de Limpieza Total */}
          <AnimatePresence>
            {showFullClear && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 2 }}
                className="absolute z-50 pointer-events-none flex flex-col items-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-5xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] italic uppercase tracking-tighter text-center"
                >
                  ¡TABLERO LIMPIO!
                </motion.div>
                <div className="text-2xl font-bold text-white bg-slate-900/80 px-4 py-1 rounded-full mt-2 border border-amber-500/50 backdrop-blur-sm">
                  +1000 Puntos
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gran Animación de Combo */}
          <AnimatePresence>
            {showCombo && (
              <motion.div 
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
                exit={{ opacity: 0, scale: 2, rotate: 20 }}
                className="absolute z-40 pointer-events-none flex flex-col items-center"
              >
                <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] italic uppercase tracking-tighter text-center">
                  {lastLinesCleared >= 5 ? '¡Amazing!' : 
                   lastLinesCleared === 4 ? '¡Perfect!' : 
                   lastLinesCleared === 3 ? '¡Excellent!' : 
                   lastLinesCleared === 2 ? '¡Great!' : '¡Combo!'}
                </div>
                <div className="text-4xl font-black text-pink-500 drop-shadow-lg italic">
                  x{combo}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {gameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
              >
                <h2 className="text-5xl font-black text-red-500 mb-2 uppercase italic tracking-tighter">
                  ¡Game Over!
                </h2>
                <p className="text-slate-400 mb-8 font-medium">No quedan más movimientos posibles.</p>
                
                <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 mb-8 w-full">
                  <span className="text-xs uppercase text-slate-500 font-bold">Puntaje Final</span>
                  <div className="text-4xl font-black text-amber-400">{score}</div>
                </div>

                <button 
                  onClick={resetGame}
                  className="bg-pink-600 hover:bg-pink-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-pink-900/40 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Jugar de Nuevo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dock de piezas */}
        <div className={`w-full max-w-md h-36 bg-slate-900/50 rounded-2xl border-2 border-slate-800 flex justify-around items-center px-4 gap-4 backdrop-blur-sm transition-opacity ${gameOver ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          {pieces.map((piece, i) => (
            <div key={piece?.id || `empty-${i}`} className="w-24 h-24 rounded-xl flex items-center justify-center relative">
              {piece ? (
                <DraggablePiece piece={piece} index={i} cellSize={DOCK_CELL_SIZE} />
              ) : (
                <div className="w-2 h-2 bg-slate-700 rounded-full opacity-20" />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
