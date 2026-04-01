import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../logic/store';

export function PauseMenu() {
  const { 
    isPaused, setPaused, resetGame, setView, 
    volume, setVolume, isMuted, toggleMute 
  } = useGameStore();

  if (!isPaused) return null;

  return (
    <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
      >
        <h2 className="text-4xl font-black text-pink-500 mb-8 uppercase italic tracking-tighter">
          Pausa
        </h2>

        <div className="space-y-6 mb-10">
          {/* Control de Volumen */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase text-slate-500 font-bold">Volumen</span>
              <span className="text-xs font-black text-slate-300">{Math.round(volume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Botón Mute */}
          <button 
            onClick={toggleMute}
            className="w-full flex justify-between items-center bg-slate-800/50 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 transition-colors"
          >
            <span className="text-sm font-bold text-slate-300">Sonido</span>
            <span className={`text-xs font-black uppercase ${isMuted ? 'text-red-500' : 'text-emerald-500'}`}>
              {isMuted ? 'Silenciado' : 'Activado'}
            </span>
          </button>
        </div>

        <div className="grid gap-3">
          <button 
            onClick={() => setPaused(false)}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-900/40 transition-all active:scale-95 uppercase tracking-widest"
          >
            Reanudar
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                resetGame();
                setPaused(false);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-2xl transition-all uppercase tracking-widest text-xs"
            >
              Reiniciar
            </button>
            <button 
              onClick={() => setView('menu')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-2xl transition-all uppercase tracking-widest text-xs"
            >
              Salir
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
