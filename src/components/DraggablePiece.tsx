import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useRef } from 'react';
import type { PieceShape } from '../logic/pieces';
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

  // Bounding box pre-calculado
  const xs = piece.coords.map(c => c.x);
  const ys = piece.coords.map(c => c.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const gridWidth = maxX - minX + 1;
  const gridHeight = maxY - minY + 1;

  const getTargetGrid = (info: PanInfo) => {
    const boardElement = document.getElementById('grid-board');
    if (!boardElement) return null;
    const boardRect = boardElement.getBoundingClientRect();
    
    return pixelToGrid(
      info.point.x - boardRect.left - (centerX * CELL_SIZE), 
      info.point.y - boardRect.top - DRAG_OFFSET_V - (centerY * CELL_SIZE), 
      CELL_SIZE
    );
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      drag
      dragSnapToOrigin={true}
      onDrag={(_e, info) => setHoverGrid(index, getTargetGrid(info))}
      onDragEnd={(_e, info) => {
        const target = getTargetGrid(info);
        if (target) placePiece(index, target.x, target.y);
        setHoverGrid(null, null);
      }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      style={{ width: '100px', height: '100px', touchAction: 'none' }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridHeight}, ${cellSize}px)`,
        gap: '2px'
      }}>
        {Array.from({ length: gridHeight }).map((_, row) => 
          Array.from({ length: gridWidth }).map((_, col) => {
            const isPart = piece.coords.some(c => c.x === col + minX && c.y === row + minY);
            return (
              <div key={`${row}-${col}`} style={{
                width: cellSize, height: cellSize,
                backgroundColor: isPart ? piece.color : 'transparent',
                borderRadius: '2px'
              }} />
            );
          })
        )}
      </div>
    </motion.div>
  );
}
