import { motion } from 'framer-motion';
import { useGameStore } from '../logic/store';

export function Header() {
  const { 
    gameMode, score, highScore, level, linesCleared, setPaused, currentMission 
  } = useGameStore();

  const progress = ((linesCleared % 10) / 10) * 100;

  return (
    <header className="mb-6 text-center w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-left w-20">
          <span className="text-[10px] uppercase opacity-50 font-bold block">Récord</span>
          <span className="text-xl font-black text-slate-300">{highScore[gameMode]}</span>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500 uppercase tracking-tighter">
            <img 
            src="/logo3.svg" 
            alt="Pleasure Block" 
            className="w-17 mb-2 mx-auto "
          />
          </h1>
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
            {gameMode === 'zen' ? 'Modo Zen' : gameMode === 'missions' ? 'Misiones' : 'Clásico'}
          </span>
        </div>
        <div className="text-right w-20 flex flex-col items-end">
          <div className="flex gap-1 mb-1">
            <button 
              onClick={() => setPaused(true)}
              className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
              title="Pausar Juego"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            </button>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase opacity-50 font-bold block leading-none">Nivel</span>
            <span className="text-xl font-black text-pink-500 leading-none">{level}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
        {gameMode === 'missions' && currentMission ? (
          <div className="flex flex-col items-center py-1">
            <span className="text-[10px] uppercase text-blue-400 font-bold tracking-widest mb-1">Misión Actual</span>
            <span className="text-sm font-bold text-white mb-2">{currentMission.description}</span>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentMission.current / currentMission.target) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center items-center relative z-10">
            <div className="flex flex-col flex-1 border-r border-slate-800">
              <span className="text-[10px] uppercase opacity-50 font-bold">Líneas</span>
              <span className="text-xl font-bold">{linesCleared}</span>
            </div>
            
            <div className="flex flex-col flex-1 px-2 items-center justify-center">
               <div className="w-10 h-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
               </div>
            </div>

            <div className="flex flex-col flex-2 border-l border-slate-100 pl-4">
              <span className="text-[10px] uppercase opacity-50 font-bold">Puntaje</span>
              <span className="text-3xl leading-none font-black text-amber-400">{score}</span>
            </div>
          </div>
        )}
        
        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden opacity-50">
          <motion.div 
            className="h-full bg-gradient-to-r from-pink-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
