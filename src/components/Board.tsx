import { generateBoard } from '../logic/gridUtils';
import { useGameStore } from '../logic/store';
import { motion, AnimatePresence } from 'framer-motion';
import { BOARD_SIZE, CELL_SIZE, CELL_SIZE_MOBILE } from '../logic/constants';
import { ParticleBurst } from './ParticleBurst';
import { useEffect, useState, useMemo } from 'react';

interface BoardProps {
  size?: number;
  cellSize?: number;
}

export function Board({ size = BOARD_SIZE, cellSize }: BoardProps) {
  const cs = useMemo(() =>
    cellSize ?? (window.innerWidth < 400 ? CELL_SIZE_MOBILE : CELL_SIZE),
    [cellSize]
  );

  const boardCells = generateBoard(size);
  const { board: boardState, draggedPieceIndex, hoverGrid, pieces, canPlacePiece, lastClearedLines, combo } = useGameStore();
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    if (lastClearedLines.rows.length > 0 || lastClearedLines.cols.length > 0) {
      const newBursts: { id: number; x: number; y: number; color: string }[] = [];

      lastClearedLines.rows.forEach(row => {
        for (let x = 0; x < size; x++) {
          newBursts.push({ id: Math.random(), x: x * cs + cs / 2, y: row * cs + cs / 2, color: '#ff3b3b' });
        }
      });

      lastClearedLines.cols.forEach(col => {
        for (let y = 0; y < size; y++) {
          newBursts.push({ id: Math.random(), x: col * cs + cs / 2, y: y * cs + cs / 2, color: '#fbbf24' });
        }
      });

      setBursts(prev => [...prev, ...newBursts]);
      const timer = setTimeout(() => setBursts([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastClearedLines, size, cs]);

  const totalWidth = size * cs;

  const ghostCells: Record<string, { color: string; isValid: boolean }> = {};

  if (draggedPieceIndex !== null && hoverGrid) {
    const piece = pieces[draggedPieceIndex];
    if (piece) {
      const isValid = canPlacePiece(draggedPieceIndex, hoverGrid.x, hoverGrid.y);
      piece.coords.forEach(offset => {
        const x = hoverGrid.x + offset.x;
        const y = hoverGrid.y + offset.y;
        if (x >= 0 && x < size && y >= 0 && y < size) {
          ghostCells[`${x},${y}`] = { color: isValid ? piece.color : '#ef4444', isValid };
        }
      });
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative">

      {/* Halo de fondo debajo del tablero */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: totalWidth * 0.8,
          height: totalWidth * 0.4,
          background: '#c0392b',
          opacity: 0.08,
          filter: 'blur(40px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Particle Bursts */}
      {bursts.map(b => (
        <ParticleBurst key={b.id} x={b.x} y={b.y} color={b.color} />
      ))}

      <motion.div
        animate={combo > 1 ? {
          x: [0, -3, 3, -3, 3, 0],
          y: [0, 1, -1, 1, -1, 0],
        } : {}}
        transition={{ duration: 0.2 }}
        className="relative"
        id="grid-board"
        style={{
          width: totalWidth + 6,
          height: totalWidth + 6,
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cs}px)`,
          gridTemplateRows: `repeat(${size}, ${cs}px)`,
          background: '#0a0a1f',
          borderRadius: 14,
          padding: 3,
          // Borde rojo sutil + glow
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 0 0 1px #1e1e3a, 0 0 50px rgba(0, 0, 0, 0.12)',
        }}
      >
        {boardCells.map((cell) => {
          const key = `${cell.x},${cell.y}`;
          const filledColor = boardState[key];
          const ghost = ghostCells[key];

          return (
            <div
              key={key}
              className="relative flex items-center justify-center"
              style={{
                width: cs,
                height: cs,
                border: '0.5px solid rgba(255,255,255,0.03)',
                borderRadius: 3,
              }}
            >
              {/* Punto decorativo */}
              {!filledColor && !ghost && (
                <div
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                />
              )}

              {/* Bloque colocado */}
              <AnimatePresence mode="popLayout">
                {filledColor && (
                  <motion.div
                    key={`filled-${key}`}
                    initial={{ scale: 0, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      rotate: 90,
                      transition: { duration: 0.25 },
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="absolute z-10"
                    style={{
                      inset: 2,
                      borderRadius: 4,
                      backgroundColor: filledColor,
                      // Relieve superior
                      borderTop: '1px solid rgba(255,255,255,0.25)',
                      // Sombra interna + glow exterior
                      boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.4), 0 0 10px ${filledColor}55`,
                    }}
                  >
                    {/* Brillo interno diagonal */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pieza Fantasma */}
              <AnimatePresence mode="popLayout">
                {ghost && !filledColor && (
                  <motion.div
                    key={`ghost-${hoverGrid?.x}-${hoverGrid?.y}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{
                      opacity: ghost.isValid ? 0.45 : 0.22,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      position: 'absolute',
                      inset: 2,
                      borderRadius: 4,
                      backgroundColor: ghost.color,
                      border: `1px solid ${ghost.isValid ? 'rgba(255,255,255,0.3)' : 'rgba(239,68,68,0.5)'}`,
                      // Glow del fantasma
                      boxShadow: ghost.isValid
                        ? `0 0 8px ${ghost.color}44`
                        : '0 0 8px rgba(239,68,68,0.3)',
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}