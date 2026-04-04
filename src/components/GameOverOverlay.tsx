import { motion } from 'framer-motion';
import { useGameStore } from '../logic/store';

export function GameOverOverlay() {
  const { score, setView, resetGame } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden"
      style={{ background: '#050510' }}
    >
      {/* Halos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: '#c0392b' }} />
      <div className="absolute bottom-0 left-1/4 w-48 h-32 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#8e44ad' }} />

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">

        <div className="w-12 h-0.5 mb-4" style={{ background: '#c0392b' }} />

        {/* Título con parpadeo */}
        <h2
          className="font-black italic uppercase leading-none mb-1"
          style={{
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            color: '#ff3b3b',
            letterSpacing: '-0.03em',
            animation: 'flicker 3.5s infinite 0.8s',
          }}
        >
          GAME<br />OVER
        </h2>

        <div className="w-10 h-0.5 mt-3 mb-7" style={{ background: '#c0392b' }} />

        {/* Puntaje */}
        <div
          className="w-full rounded-2xl px-4 py-1 mb-1 border"
          style={{ background: '#0d0d1f', borderColor: '#1e1e3a' }}
        >
          <p className="text-[5px] tracking-[.10em] font-semibold uppercase mb-1" style={{ color: '#4a4a6a' }}>
            Puntaje Final
          </p>
          <p className="text-2xl font-black leading-none tracking-tight" style={{ color: '#fbbf24' }}>
            {score.toLocaleString()}
          </p>
          <div className="flex justify-center gap-1.5 mt-2.5">
            {[0.9, 0.5, 0.3].map((o, i) => (
              <span key={i} className="w-2 h-2 rounded-full" style={{ background: '#ff3b3b', opacity: o }} />
            ))}
          </div>
        </div>

        {/* Botón ver anuncio */}
        <button
          onClick={() => {/* lógica anuncio */}}
          className="w-full flex items-center justify-center gap-3 rounded-2xl p-4 mb-2.5 border transition-colors"
          style={{ background: '#0d0d1f', borderColor: '#2a1a2e' }}
        >
          <div className="relative w-9 h-9 flex-shrink-0">
            <span
              className="absolute inset-0 rounded-full border border-purple-500 animate-ping"
              style={{ opacity: 0.6 }}
            />
            <span
              className="absolute inset-0 rounded-full border flex items-center justify-center"
              style={{ borderColor: '#5b2c6f', background: '#12001f' }}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M1 1.5L11 7L1 12.5V1.5Z" fill="#9b59b6" />
              </svg>
            </span>
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#c39bd3' }}>
              Ver anuncio
            </p>
            <p className="text-[10px]" style={{ color: '#5b2c6f' }}>para continuar jugando</p>
          </div>
        </button>

        {/* Menú + Reintentar */}
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setView('menu')}
            className="flex-1 rounded-xl py-3 border text-[11px] font-bold tracking-widest uppercase transition-all active:scale-95"
            style={{ background: '#0d0d1f', borderColor: '#1e1e3a', color: '#4a4a6a' }}
          >
            Menú
          </button>
          <button
            onClick={resetGame}
            className="flex-[2] rounded-xl py-3 px-6 text-[12px] font-extrabold tracking-widest uppercase text-white transition-all active:scale-95"
            style={{ background: '#c0392b' }}
          >
            Reintentar
          </button>
        </div>
      </div>

      {/* Keyframes para el parpadeo */}
      <style>{`
        @keyframes flicker {
          0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.3} 95%{opacity:1} 97%{opacity:.5} 98%{opacity:1}
        }
      `}</style>
    </motion.div>
  );
}