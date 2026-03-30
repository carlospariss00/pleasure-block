import { generateBoard } from '../logic/gridUtils';
import { useGameStore } from '../logic/store';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardProps {
  size?: number;
  cellSize?: number;
}

export function Board({ size = 8, cellSize = 40 }: BoardProps) {
  const boardCells = generateBoard(size);
  const { board: boardState, draggedPieceIndex, hoverGrid, pieces, canPlacePiece, lastClearedLines = { rows: [], cols: [] } } = useGameStore();

  const totalWidth = size * cellSize;

  // Calcular las coordenadas de la sombra si hay algo arrastrándose
  const ghostCells: Record<string, { color: string, isValid: boolean }> = {};
  
  if (draggedPieceIndex !== null && hoverGrid) {
    const piece = pieces[draggedPieceIndex];
    if (piece) {
      const isValid = canPlacePiece(draggedPieceIndex, hoverGrid.x, hoverGrid.y);
      piece.coords.forEach(offset => {
        const x = hoverGrid.x + offset.x;
        const y = hoverGrid.y + offset.y;
        if (x >= 0 && x < size && y >= 0 && y < size) {
          ghostCells[`${x},${y}`] = {
            color: isValid ? piece.color : '#ef4444', // Color de la pieza o rojo si es inválido
            isValid
          };
        }
      });
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div 
        className="relative bg-slate-900/40 rounded-lg p-0.5 border-4 border-slate-800 shadow-2xl"
        style={{ 
          width: totalWidth + 4, 
          height: totalWidth + 4,
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        }}
        id="grid-board"
      >
        {boardCells.map((cell) => {
          const key = `${cell.x},${cell.y}`;
          const filledColor = boardState[key];
          const ghost = ghostCells[key];

          return (
            <div
              key={key}
              className="relative border border-slate-700/10 bg-slate-800/10 flex items-center justify-center"
              style={{
                width: cellSize,
                height: cellSize,
              }}
            >
              {/* Fondo base / Punto decorativo */}
              {!filledColor && !ghost && (
                <div className="w-1 h-1 bg-slate-700/30 rounded-full" />
              )}

              {/* Bloque colocado con animación de entrada y SALIDA (Explosión) */}
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
                      filter: 'brightness(2) blur(2px)',
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      exit: { duration: 0.3 } 
                    }}
                    className="absolute inset-0.5 rounded-[4px] shadow-lg border-t border-white/30 z-10"
                    style={{ 
                      backgroundColor: filledColor,
                      boxShadow: `0 0 10px ${filledColor}44`
                    }}
                  >
                    {/* Brillo interno del bloque */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[4px]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pieza Fantasma (Ghost) */}
              <AnimatePresence mode="popLayout">
                {ghost && !filledColor && (
                  <motion.div
                    key={`ghost-${hoverGrid?.x}-${hoverGrid?.y}`} // Clave única por posición para disparar la animación
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: ghost.isValid ? 0.4 : 0.25,
                      scale: 1
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }} // Animación rápida y limpia
                    className="absolute inset-0 rounded-[2px] border"
                    style={{ 
                      backgroundColor: ghost.color,
                      borderColor: ghost.isValid ? 'rgba(255,255,255,0.4)' : 'rgba(239, 68, 68, 0.6)'
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
