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

  const BOARD_CELL_SIZE = CELL_SIZE; 

  const getTargetGrid = (info: PanInfo) => {
    const boardElement = document.getElementById('grid-board');
    if (!boardElement) return null;
    
    const boardRect = boardElement.getBoundingClientRect();
    
    // Calculamos el centro de la pieza en términos de grid para que el "agarre" sea natural
    const xs = piece.coords.map(c => c.x);
    const ys = piece.coords.map(c => c.y);
    const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;

    const offsetX = info.point.x - boardRect.left;
    const offsetY = info.point.y - boardRect.top;

    // Ajuste de "vuelo": la pieza se desplaza un poco hacia arriba para no taparla con el dedo
    const dragOffsetV = DRAG_OFFSET_V; 
    
    // Restamos el centro de la pieza para que el cursor apunte al medio de la forma
    return pixelToGrid(
      offsetX - (centerX * BOARD_CELL_SIZE), 
      offsetY - dragOffsetV - (centerY * BOARD_CELL_SIZE), 
      BOARD_CELL_SIZE
    );
  };

  const handleDragStart = () => {
    // Ya disparamos el sonido en el store vía setHoverGrid,
    // pero podemos asegurar que el estado sea correcto aquí
    setHoverGrid(index, null);
  };

  const handleDrag = (_event: any, info: PanInfo) => {
    const targetGrid = getTargetGrid(info);
    setHoverGrid(index, targetGrid);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const targetGrid = getTargetGrid(info);
    if (targetGrid) {
      placePiece(index, targetGrid.x, targetGrid.y);
    }
    setHoverGrid(null, null);
  };

  // Encontrar bounding box de la pieza para dimensionar el contenedor
  const xs = piece.coords.map(c => c.x);
  const ys = piece.coords.map(c => c.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const gridWidth = maxX - minX + 1;
  const gridHeight = maxY - minY + 1;

  return (
    <motion.div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      drag
      dragSnapToOrigin={true}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 1.2, 
        zIndex: 50 
      }}
      style={{ 
        width: '100px', 
        height: '100px',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridHeight}, ${cellSize}px)`,
          gap: '2px'
        }}
      >
        {/* Renderizar los bloques de la pieza */}
        {/* Usamos un sistema de coordenadas relativo al minX, minY */}
        {Array.from({ length: gridHeight }).map((_, row) => 
          Array.from({ length: gridWidth }).map((_, col) => {
            const currentX = col + minX;
            const currentY = row + minY;
            const isPart = piece.coords.some(c => c.x === currentX && c.y === currentY);
            
            return (
              <div 
                key={`${row}-${col}`}
                className="rounded-sm shadow-sm"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: isPart ? piece.color : 'transparent',
                  border: isPart ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}
              />
            );
          })
        )}
      </div>
    </motion.div>
  );
}
