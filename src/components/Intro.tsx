import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '../logic/store';

export function Intro() {
  const { setView } = useGameStore();

  useEffect(() => {
    // La intro dura 3 segundos antes de pasar al menú
    const timer = setTimeout(() => {
      setView('menu');
    }, 3000);
    return () => clearTimeout(timer);
  }, [setView]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050510] relative overflow-hidden">
      {/* Efectos de luces de fondo */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute w-96 h-96 rounded-full blur-[100px] bg-red-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1.2,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.img 
          src="/logo3.svg" 
          alt="Logo" 
          className="w-64 sm:w-80 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="h-0.5 bg-gradient-to-right from-transparent via-red-500 to-transparent mt-8"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-slate-500 text-[10px] tracking-[.4em] uppercase mt-4 font-bold"
        >
          Cargando experiencia...
        </motion.p>
      </motion.div>

      {/* Marca de agua inferior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-12 flex flex-col items-center"
      >
        <span className="text-slate-600 text-[9px] tracking-widest uppercase font-black">Powered by</span>
        <span className="text-slate-400 text-xs font-black tracking-tight mt-1">PLEASURE STUDIO</span>
      </motion.div>
    </div>
  );
}
