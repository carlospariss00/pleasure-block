import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';
import type { PieceShape } from '../logic/types';
import { pixelToGrid } from '../logic/gridUtils';
import { useGameStore } from '../logic/store';
import { CELL_SIZE, DRAG_OFFSET_V } from '../logic/constants';

interface DraggablePieceProps {
  piece: PieceShape;
  index: number;
  cellSize?: number;
}

export function DraggablePiece({ piece, index, cellSize = 30 }: DraggablePieceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { placePiece, setHoverGrid } = useGameStore();
  const [activeCellSize, setActiveCellSize] = useState(CELL_SIZE);

  useEffect(() => {
    const updateCellSize = () => {
      const boardElement = document.getElementById('grid-board');
      if (boardElement) {
        const gridStyle = window.getComputedStyle(boardElement);
        const gridTemplateColumns = gridStyle.gridTemplateColumns;
        const cellSizeStr = gridTemplateColumns.split(' ')[0];
        const parsed = parseFloat(cellSizeStr);
        if (!isNaN(parsed) && parsed > 0) {
          setActiveCellSize(parsed);
        }
      }
    };
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  const { minX, minY, centerX, centerY, gridWidth, gridHeight } = useMemo(() => {
    const xs = piece.coords.map(c => c.x);
    const ys = piece.coords.map(c => c.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return {
      minX,
      minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      gridWidth: maxX - minX + 1,
      gridHeight: maxY - minY + 1,
    };
  }, [piece.coords]);

  const getTargetGrid = (info: PanInfo) => {
    const boardElement = document.getElementById('grid-board');
    if (!boardElement) return null;
    const boardRect = boardElement.getBoundingClientRect();
    const currentCellSize = activeCellSize || CELL_SIZE;
    return pixelToGrid(
      info.point.x - boardRect.left - centerX * currentCellSize,
      info.point.y - boardRect.top - DRAG_OFFSET_V - centerY * currentCellSize,
      currentCellSize
    );
  };

  const handleDragStart = () => {
    if (navigator.vibrate) navigator.vibrate(5);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      drag
      dragElastic={0}
      dragMomentum={false}
      dragSnapToOrigin={true}
      onDragStart={handleDragStart}
      onDrag={(_e, info) => setHoverGrid(index, getTargetGrid(info))}
      onDragEnd={(_e, info) => {
        const target = getTargetGrid(info);
        if (target) placePiece(index, target.x, target.y);
        setHoverGrid(null, null);
      }}
      whileDrag={{ scale: 1.18, zIndex: 50 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        width: '100%',
        height: '100%',
        touchAction: 'none',
        minWidth: 80,
        minHeight: 80,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridHeight}, ${cellSize}px)`,
          gap: '2px',
        }}
      >
        {Array.from({ length: gridHeight }).map((_, row) =>
          Array.from({ length: gridWidth }).map((_, col) => {
            const isPart = piece.coords.some(
              c => c.x === col + minX && c.y === row + minY
            );
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: isPart ? piece.color : 'transparent',
                  borderRadius: 4,
                  // Borde superior claro para sensación de volumen
                  borderTop: isPart ? '1px solid rgba(255,255,255,0.22)' : 'none',
                  // Sombra interna + glow exterior del color de la pieza
                  boxShadow: isPart
                    ? `inset 0 -2px 4px rgba(0,0,0,0.35), 0 0 10px ${piece.color}55`
                    : 'none',
                }}
              />
            );
          })
        )}
      </div>
    </motion.div>
  );
}