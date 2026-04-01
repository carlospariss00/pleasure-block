import { motion } from 'framer-motion';
import { useGameStore } from '../logic/store';

export function GameOverOverlay() {
  const { score, setView, resetGame } = useGameStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
    >
      <h2 className="text-5xl font-black text-red-500 mb-2 uppercase italic tracking-tighter">
        ¡Game Over!
      </h2>
      <p className="text-slate-400 mb-8 font-medium">
        No quedan más movimientos posibles en el tablero.
      </p>
      
      <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 mb-8 w-full">
        <span className="text-xs uppercase text-slate-500 font-bold">Puntaje Final</span>
        <div className="text-4xl font-black text-amber-400">{score}</div>
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={() => setView('menu')}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 px-4 rounded-2xl transition-all uppercase tracking-widest text-sm"
        >
          Menú
        </button>
        <button 
          onClick={resetGame}
          className="flex-2 bg-pink-600 hover:bg-pink-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-pink-900/40 transition-all active:scale-95 uppercase tracking-widest"
        >
          Reintentar
        </button>
      </div>
    </motion.div>
  );
}
