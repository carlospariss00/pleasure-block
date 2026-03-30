import type { GridCoordinate } from './gridUtils';

export type PieceShape = {
  id: string;
  name: string;
  color: string;
  coords: GridCoordinate[];
};

const colors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

// Definición de las formas de piezas (offsets relativos al punto central)
export const SHAPES: Omit<PieceShape, 'id' | 'color'>[] = [
  // Básicas (Nivel 1+)
  { name: 'dot', coords: [{ x: 0, y: 0 }] },
  { name: 'line-2-h', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }] },
  { name: 'line-2-v', coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }] },
  
  // Intermedias (Nivel 2+)
  { name: 'line-3-h', coords: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }] },
  { name: 'line-3-v', coords: [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }] },
  { name: 'square-2x2', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },
  { name: 'T-shape', coords: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] },
  
  // Avanzadas (Nivel 4+)
  { name: 'line-4-h', coords: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: 'line-4-v', coords: [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }] },
  { name: 'L-shape-big', coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
  { name: 'S-shape', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }] },
  
  // Expertas (Nivel 7+)
  { name: 'line-5-h', coords: [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: 'big-square', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
  { name: 'cross', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }] },

  // Nuevas Piezas Pedidas
  { name: 'hueco', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] },
  { name: 'puente', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 2, y: 1 }] },
  { name: 'C-shape', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
];

export function generateRandomPiece(level: number = 1): PieceShape {
  let availableShapes = SHAPES;

  // Filtrado progresivo por nivel
  if (level < 3) {
    // Niveles 1-2: Sin L, T, S, Cruz, Hueco, Puente, C
    availableShapes = availableShapes.filter(s => 
      !s.name.includes('L-shape') && 
      s.name !== 'T-shape' && 
      s.name !== 'S-shape' && 
      s.name !== 'cross' &&
      s.name !== 'hueco' &&
      s.name !== 'puente' &&
      s.name !== 'C-shape'
    );
  } else if (level === 3) {
    // Nivel 3: Desbloquea L, pero sin T, S, Cruz, Hueco, Puente, C
    availableShapes = availableShapes.filter(s => 
      s.name !== 'T-shape' && 
      s.name !== 'S-shape' && 
      s.name !== 'cross' &&
      s.name !== 'hueco' &&
      s.name !== 'puente' &&
      s.name !== 'C-shape'
    );
  } else if (level === 4) {
    // Nivel 4: Desbloquea T y Hueco, sin Puente, S, Cruz, C
    availableShapes = availableShapes.filter(s => 
      s.name !== 'puente' && 
      s.name !== 'S-shape' && 
      s.name !== 'cross' &&
      s.name !== 'C-shape'
    );
  } else if (level === 5) {
    // Nivel 5: Desbloquea Puente, sin S, Cruz, C
    availableShapes = availableShapes.filter(s => 
      s.name !== 'S-shape' && 
      s.name !== 'cross' &&
      s.name !== 'C-shape'
    );
  } else if (level < 8) {
    // Niveles 6-7: Desbloquea S y Cruz, sin C
    availableShapes = availableShapes.filter(s => 
      s.name !== 'C-shape'
    );
  }
  // A partir de Nivel 8: Todo disponible (incluyendo la C)

  // Favorecer piezas grandes en niveles 1 y 2
  if (level <= 2) {
    const isBigPiece = Math.random() < 0.7;
    if (isBigPiece) {
      const bigShapes = availableShapes.filter(s => 
        s.name.includes('line-4') || 
        s.name.includes('line-5') || 
        s.name.includes('big-square')
      );
      if (bigShapes.length > 0) {
        availableShapes = bigShapes;
      }
    }
  }

  const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return {
    ...shape,
    id: Math.random().toString(36).substr(2, 9),
    color,
  };
}

export function generateInitialPieces(): PieceShape[] {
  return [generateRandomPiece(1), generateRandomPiece(1), generateRandomPiece(1)];
}
