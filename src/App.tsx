import { Board } from './components/Board'
import { DraggablePiece } from './components/DraggablePiece'
import { useGameStore } from './logic/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { sounds } from './logic/sounds'

function App() {
  const { 
    score, highScore, level, linesCleared, combo, pieces, 
    gameOver, resetGame, showCombo, hideCombo, lastLinesCleared,
    showLevelUp, hideLevelUp
  } = useGameStore();

  useEffect(() => {
    if (showCombo) {
      const timer = setTimeout(() => {
        hideCombo();
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [showCombo, hideCombo, combo]);

  useEffect(() => {
    if (showLevelUp) {
      sounds.playLevelUp();
      const timer = setTimeout(() => {
        hideLevelUp();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, hideLevelUp]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <header className="mb-6 text-center w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <span className="text-xs uppercase opacity-50 font-bold block">Récord</span>
            <span className="text-xl font-black text-slate-300">{highScore}</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500 uppercase tracking-tighter">
          Pleasure Blast
          </h1>
          <div className="text-right">
            <span className="text-xs uppercase opacity-50 font-bold block">Nivel</span>
            <span className="text-xl font-black text-pink-500">{level}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col flex-1 border-r border-slate-800">
            <span className="text-[10px] uppercase opacity-50 font-bold">Líneas</span>
            <span className="text-xl font-bold">{linesCleared}</span>
          </div>
          <div className="flex flex-col flex-2 relative">
            <span className="text-[10px] uppercase opacity-50 font-bold">Puntaje</span>
            <span className="text-3xl leading-none font-black text-amber-400">{score}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl relative">
        {/* Animación de Level Up - Ahora arriba del tablero */}
        <div className="absolute top-[-80px] left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
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
          <Board size={8} cellSize={44} />
          
          {/* Gran Animación de Combo - Se mantiene en el centro */}
          <AnimatePresence>
            {showCombo && (
              <motion.div 
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
                exit={{ opacity: 0, scale: 2, rotate: 20 }}
                className="absolute z-40 pointer-events-none flex flex-col items-center"
              >
                <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] italic uppercase tracking-tighter">
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
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 uppercase tracking-widest"
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
                <DraggablePiece piece={piece} index={i} cellSize={20} />
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
