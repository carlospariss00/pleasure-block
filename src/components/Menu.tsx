import { motion } from 'framer-motion';
import { useGameStore } from '../logic/store';
import type { GameMode } from '../logic/store';

interface MenuProps {
  onStartGame: (mode: GameMode) => void;
}

const MODES = [
  {
    id: 'classic' as GameMode,
    label: 'Modo Clásico',
    desc: 'La experiencia original. Sin prisas, solo estrategia.',
    active: true,
  },
  {
    id: 'zen' as GameMode,
    label: 'Modo Zen',
    desc: 'Sin fin. Si te quedas sin movimientos, el tablero se libera.',
    active: false,
  },
  {
    id: 'missions' as GameMode,
    label: 'Modo Misiones',
    desc: 'Cumple objetivos dinámicos para avanzar y ganar bonos.',
    active: false,
  },
];

export function Menu({ onStartGame }: MenuProps) {
  const { highScore, isMuted, toggleMute } = useGameStore();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden select-none" style={{ background: '#050510' }}>

      {/* Halos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-56 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#c0392b' }} />
      <div className="absolute bottom-0 left-1/4 w-52 h-36 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: '#8e44ad' }} />
      <div className="absolute top-1/3 right-0 w-40 h-40 rounded-full blur-3xl opacity-7 pointer-events-none" style={{ background: '#e74c3c' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center w-full max-w-sm"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-7"
        >
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <div className="h-px w-10" style={{ background: '#1e1e3a' }} />
            <span className="text-[10px] tracking-[.2em] font-bold uppercase" style={{ color: '#4a4a6a' }}>puzzle game</span>
            <div className="h-px w-10" style={{ background: '#1e1e3a' }} />
          </div>
          <img src="/logo3.svg" alt="Pleasure Blast" className="w-72 mx-auto pointer-events-none select-none shadow-lg shadow-red-500/20" />
          <div className="w-12 h-0.5 mx-auto mt-3" style={{ background: '#c0392b' }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="text-[11px] tracking-[.14em] font-semibold uppercase mb-5"
          style={{ color: '#4a4a6a' }}
        >
          Selecciona tu modo
        </motion.p>

        {/* Modos */}
        <div className="w-full flex flex-col gap-2">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              {mode.active ? (
                <button
                  onClick={() => onStartGame(mode.id)}
                  className="w-full text-left rounded-2xl p-5 border relative overflow-hidden transition-all active:scale-[.97]"
                  style={{ background: '#0d0d1f', borderColor: '#2a1a1a' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#ff3b3b';
                    e.currentTarget.style.background = '#140808';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#2a1a1a';
                    e.currentTarget.style.background = '#0d0d1f';
                  }}
                >
                  <span className="absolute top-0 right-0 text-[9px] font-black text-white tracking-widest uppercase px-2.5 py-1 rounded-bl-xl" style={{ background: '#c0392b' }}>
                    Activo
                  </span>
                  <div className="flex justify-between items-start mb-1.5 pr-12">
                    <span className="text-sm font-black tracking-[.06em] uppercase" style={{ color: '#ff3b3b' }}>{mode.label}</span>
                    <span className="text-[10px] font-bold" style={{ color: '#fbbf24' }}>
                      Récord: {highScore[mode.id]}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed m-0" style={{ color: '#4a4a6a' }}>{mode.desc}</p>
                </button>
              ) : (
                <div
                  className="w-full text-left rounded-2xl p-5 border relative overflow-hidden"
                  style={{ background: '#080810', borderColor: '#12121e', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  <span className="absolute top-0 right-0 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-bl-xl" style={{ background: '#1e1e3a', color: '#3a3a5a' }}>
                    Próximamente
                  </span>
                  <div className="mb-1.5 pr-24">
                    <span className="text-sm font-black tracking-[.06em] uppercase" style={{ color: '#2a2a40' }}>{mode.label}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed m-0" style={{ color: '#1e1e30' }}>{mode.desc}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mute */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          onClick={toggleMute}
          className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: 'transparent' }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0d0d1f')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: isMuted ? 0.35 : 1 }}>
            <path d="M2 5.5h2.5L8 2v12L4.5 10.5H2a.5.5 0 01-.5-.5v-4A.5.5 0 012 5.5z" fill="#6b7280"/>
            <path d="M10.5 5.5c1.1.7 1.8 1.9 1.8 3.3 0 1.3-.7 2.5-1.8 3.2" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-[11px] font-semibold tracking-[.06em]" style={{ color: '#4a4a6a' }}>
            {isMuted ? 'Sonido desactivado' : 'Sonido activado'}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}