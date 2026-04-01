import { motion } from 'framer-motion';
import { useGameStore } from '../logic/store';
import type { GameMode } from '../logic/store';

interface MenuProps {
  onStartGame: (mode: GameMode) => void;
}

export function Menu({ onStartGame }: MenuProps) {
  const { highScore, isMuted, toggleMute } = useGameStore();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500 uppercase tracking-tighter mb-2">
          <img 
            src="/logo3.svg" 
            alt="Pleasure Blast" 
            className="w-80 mb-2 mx-auto pointer-events-none select-none shadow-lg shadow-pink-900/40 glowing"
          />
        </h1>
        <p className="text-slate-400 mb-12 font-medium">Selecciona tu modo de desafío</p>

        <div className="grid gap-4 w-full">
          <button 
            onClick={() => onStartGame('classic')}
            className="group relative bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-pink-500/50 p-6 rounded-3xl transition-all text-left"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xl font-black text-white">MODO CLÁSICO</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Récord: {highScore.classic}</span>
            </div>
            <p className="text-sm text-slate-500">La experiencia original. Sin prisas, solo estrategia.</p>
            <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
          </button>

          <button 
            onClick={() => onStartGame('zen')}
            className="group relative bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl transition-all text-left"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xl font-black text-white">MODO ZEN</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Récord: {highScore.zen}</span>
            </div>
            <p className="text-sm text-slate-500">Sin fin. Si te quedas sin movimientos, el tablero se libera.</p>
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
          </button>

          <button 
            onClick={() => onStartGame('missions')}
            className="group relative bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl transition-all text-left"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xl font-black text-white">MODO MISIONES</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Récord: {highScore.missions}</span>
            </div>
            <p className="text-sm text-slate-500">Cumple objetivos dinámicos para avanzar y ganar bonos.</p>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
          </button>
        </div>

        <button 
          onClick={toggleMute}
          className="mt-12 text-slate-500 hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          {isMuted ? 'Sonido Desactivado' : 'Sonido Activado'}
        </button>
      </motion.div>
    </div>
  );
}
