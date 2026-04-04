import { motion } from 'framer-motion';
import { useGameStore } from '../logic/store';

export function PauseMenu() {
  const {
    isPaused, setPaused, resetGame, setView,
    volume, setVolume, isMuted, toggleMute
  } = useGameStore();

  if (!isPaused) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden" style={{ background: '#050510' }}>

      {/* Halos — mismos que Game Over */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full pointer-events-none blur-3xl opacity-15" style={{ background: '#c0392b' }} />
      <div className="absolute bottom-0 left-1/4 w-48 h-32 rounded-full pointer-events-none blur-3xl opacity-10" style={{ background: '#8e44ad' }} />
      <div className="absolute top-2/5 right-0 w-32 h-32 rounded-full pointer-events-none blur-3xl opacity-8" style={{ background: '#e74c3c' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[300px] rounded-2xl p-8 border"
        style={{ background: '#0d0d1f', borderColor: '#1e1e3a' }}
      >
        {/* Icono pausa + título */}
        <div className="flex items-center justify-center gap-2.5 mb-1.5">
          <div className="flex-1 h-px" style={{ background: '#1e1e3a' }} />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="2" width="4" height="14" rx="1.5" fill="#ff3b3b"/>
            <rect x="11" y="2" width="4" height="14" rx="1.5" fill="#ff3b3b"/>
          </svg>
          <div className="flex-1 h-px" style={{ background: '#1e1e3a' }} />
        </div>

        <h2
          className="text-center font-black italic uppercase leading-none mb-1"
          style={{ fontSize: '2.6rem', color: '#ff3b3b', letterSpacing: '-0.03em' }}
        >
          Pausa
        </h2>
        <div className="w-9 h-0.5 mx-auto mb-6" style={{ background: '#c0392b' }} />

        {/* Volumen */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[10px] tracking-[.16em] font-bold uppercase" style={{ color: '#4a4a6a' }}>
              Volumen
            </span>
            <span className="text-xs font-black" style={{ color: '#fbbf24' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full appearance-none h-1 rounded-full cursor-pointer"
            style={{ background: '#1e1e3a', accentColor: '#ff3b3b' }}
          />
        </div>

        {/* Toggle sonido */}
        <button
          onClick={toggleMute}
          className="w-full flex justify-between items-center rounded-xl px-4 py-3.5 border mb-5 transition-colors active:scale-[.97]"
          style={{ background: '#0d0d1f', borderColor: '#1e1e3a' }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 5.5h2.5L8 2v12L4.5 10.5H2a.5.5 0 01-.5-.5v-4A.5.5 0 012 5.5z" fill="#6b7280"/>
              <path d="M10.5 5.5c1.1.7 1.8 1.9 1.8 3.3 0 1.3-.7 2.5-1.8 3.2" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-xs font-bold" style={{ color: '#9ca3af' }}>Sonido</span>
          </div>
          <span
            className="text-[11px] font-black tracking-[.1em] uppercase"
            style={{ color: isMuted ? '#ef4444' : '#10b981' }}
          >
            {isMuted ? 'Silenciado' : 'Activado'}
          </span>
        </button>

        {/* Reanudar */}
        <button
          onClick={() => setPaused(false)}
          className="w-full rounded-2xl py-4 text-white text-[13px] font-black tracking-[.14em] uppercase mb-2 transition-all active:scale-95"
          style={{ background: '#c0392b' }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#e74c3c')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#c0392b')}
        >
          Reanudar
        </button>

        {/* Reiniciar + Salir */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Reiniciar', action: () => { resetGame(); setPaused(false); } },
            { label: 'Salir', action: () => setView('menu') },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="rounded-xl py-3 border text-[11px] font-bold tracking-[.1em] uppercase transition-all active:scale-95"
              style={{ background: '#0d0d1f', borderColor: '#1e1e3a', color: '#6b7280' }}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <style>{`
        input[type=range] { -webkit-appearance: none; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: #ff3b3b; cursor: pointer;
        }
      `}</style>
    </div>
  );
}