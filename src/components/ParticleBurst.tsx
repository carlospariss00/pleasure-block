import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ParticleBurstProps {
  x: number;
  y: number;
  color: string;
}

export function ParticleBurst({ x, y, color }: ParticleBurstProps) {
  const [isVisible, setIsVisible] = useState(true);

  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      color
    }));
  }, [color]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
        />
      ))}
    </div>
  );
}
