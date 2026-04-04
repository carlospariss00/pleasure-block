import { motion } from 'framer-motion';
import { useGameStore } from '../logic/store';

export function Header() {
  const {
    gameMode, score, highScore, level, linesCleared, setPaused, currentMission
  } = useGameStore();

  const progress = ((linesCleared % 10) / 10) * 100;

  return (
    <header className="mb-4 w-full max-w-md" style={{ position: 'relative' }}>

      {/* Halo de fondo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: '#c0392b' }}
      />

      {/* Fila superior: Récord | Logo | Nivel + Pausa */}
      <div className="flex justify-between items-center mb-3 relative z-10">

        {/* Récord */}
        <div className="text-left" style={{ minWidth: 64 }}>
          <span
            className="block font-bold uppercase"
            style={{ fontSize: 9, letterSpacing: '0.16em', color: '#4a4a6a', marginBottom: 2 }}
          >
            Récord
          </span>
          <span className="font-black" style={{ fontSize: 20, color: '#9ca3af', lineHeight: 1 }}>
            {highScore[gameMode]}
          </span>
        </div>

        {/* Logo + modo */}
        <div className="flex flex-col items-center gap-1">
          <img
            src="/logo3.svg"
            alt="Pleasure Blast"
            className="pointer-events-none select-none"
            style={{ width: 68 }}
          />
          <span
            className="font-bold uppercase"
            style={{ fontSize: 9, letterSpacing: '0.18em', color: '#4a4a6a' }}
          >
            {gameMode === 'zen' ? 'Modo Zen' : gameMode === 'missions' ? 'Misiones' : 'Clásico'}
          </span>
        </div>

        {/* Pausa + Nivel */}
        <div className="flex flex-col items-end gap-1.5" style={{ minWidth: 64 }}>
          <button
            onClick={() => setPaused(true)}
            className="transition-all active:scale-90"
            style={{
              background: '#0d0d1f',
              border: '1px solid #1e1e3a',
              borderRadius: 8,
              padding: '5px 7px',
              cursor: 'pointer',
              color: '#6b7280',
              lineHeight: 0,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#ff3b3b';
              e.currentTarget.style.color = '#ff3b3b';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#1e1e3a';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          </button>
          <div className="text-right">
            <span className="block font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#4a4a6a', lineHeight: 1, marginBottom: 2 }}>
              Nivel
            </span>
            <span className="font-black" style={{ fontSize: 20, color: '#ff3b3b', lineHeight: 1 }}>
              {level}
            </span>
          </div>
        </div>
      </div>

      {/* Panel inferior: stats */}
      <div
        className="relative z-10 rounded-2xl"
        style={{ background: '#0d0d1f', border: '1px solid #1e1e3a', padding: '1rem 1.25rem' }}
      >
        {gameMode === 'missions' && currentMission ? (
          <div className="flex flex-col items-center py-1 gap-2">
            <span className="font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.16em', color: '#4a4a6a' }}>
              Misión Actual
            </span>
            <span className="font-bold text-center" style={{ fontSize: 13, color: '#e2e8f0' }}>
              {currentMission.description}
            </span>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: '#1e1e3a' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentMission.current / currentMission.target) * 100}%` }}
                style={{ background: 'linear-gradient(to right, #ff3b3b, #fbbf24)' }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex-1 pr-4" style={{ borderRight: '1px solid #1e1e3a' }}>
              <span className="block font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#4a4a6a', marginBottom: 3 }}>
                Líneas
              </span>
              <span className="font-black" style={{ fontSize: 22, color: '#e2e8f0', lineHeight: 1 }}>
                {linesCleared}
              </span>
            </div>

            <div style={{ flex: '0 0 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1e1e3a' }} />
            </div>

            <div className="flex-[1.4] pl-4" style={{ borderLeft: '1px solid #1e1e3a' }}>
              <span className="block font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#4a4a6a', marginBottom: 3 }}>
                Puntaje
              </span>
              <span className="font-black" style={{ fontSize: 28, color: '#fbbf24', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {score}
              </span>
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: '#1e1e3a', marginTop: 14 }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            style={{ background: 'linear-gradient(to right, #ff3b3b, #fbbf24)' }}
          />
        </div>
      </div>
    </header>
  );
}