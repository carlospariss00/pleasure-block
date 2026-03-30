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

export const SHAPES: Omit<PieceShape, 'id' | 'color'>[] = [
  // NIVEL 1: Básicas
  { name: 'dot', coords: [{ x: 0, y: 0 }] },
  { name: 'line-2-h', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }] },
  { name: 'line-2-v', coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }] },
  { name: 'diagonal-2', coords: [{ x: 0, y: 0 }, { x: 1, y: 1 }] },

  // NIVEL 2: Intermedias
  { name: 'line-3-h', coords: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }] },
  { name: 'line-3-v', coords: [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }] },
  { name: 'square-2x2', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },
  { name: 'diagonal-3', coords: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }] },

  // NIVEL 3: Formas Clásicas
  { name: 'l-shape', coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
  { name: 'j-shape', coords: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 2 }] },
  { name: 'T-shape', coords: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] },

  // NIVEL 4: Líneas Largas y Z
  { name: 'line-4-h', coords: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: 'line-4-v', coords: [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }] },
  { name: 'z-shape', coords: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },
  { name: 's-shape', coords: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }] },

  // NIVEL 5: T-Vertical y Line-5
  { name: 't-shape-v', coords: [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }] },
  { name: 'line-5-h', coords: [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: 'line-5-v', coords: [{ x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }] },

  // NIVEL 6: Rectángulos 3x2 (6 piezas)
  { name: 'rect-3x2-h', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { name: 'rect-2x3-v', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },

  // NIVEL 7: L-Shape Reflejada y Cruz
  { name: 'L-shape-r', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }] },
  { name: 'cross', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }] },

  // NIVEL 8: El Cuadrado Grande y Formas Complejas
  { name: 'big-square', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
  { name: 'C-shape', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
];

export function generateRandomPiece(level: number = 1): PieceShape {
  let availableShapes = SHAPES;

  // Filtrado progresivo por nivel
  if (level === 1) {
    availableShapes = SHAPES.filter(s => ['dot', 'line-2-h', 'line-2-v', 'diagonal-2', "rect-3x2-h", "rect-2x3-v"].includes(s.name));
  } else if (level === 2) {
    availableShapes = SHAPES.filter(s => ['dot', 'line-2-h', 'line-2-v', 'line-3-h', 'line-3-v', 'square-2x2', 'diagonal-3'].includes(s.name));
  } else if (level === 3) {
    availableShapes = SHAPES.filter(s => !['line-4-h', 'line-4-v', 'z-shape', 's-shape', 't-shape-v', 'line-5-h', 'line-5-v', 'rect-3x2-h', 'rect-2x3-v', 'L-shape-r', 'cross', 'big-square', 'C-shape'].includes(s.name));
  } else if (level === 4) {
    availableShapes = SHAPES.filter(s => !['t-shape-v', 'line-5-h', 'line-5-v', 'rect-3x2-h', 'rect-2x3-v', 'L-shape-r', 'cross', 'big-square', 'C-shape'].includes(s.name));
  } else if (level === 5) {
    availableShapes = SHAPES.filter(s => !['rect-3x2-h', 'rect-2x3-v', 'L-shape-r', 'cross', 'big-square', 'C-shape'].includes(s.name));
  } else if (level === 6) {
    availableShapes = SHAPES.filter(s => !['L-shape-r', 'cross', 'big-square', 'C-shape'].includes(s.name));
  } else if (level === 7) {
    availableShapes = SHAPES.filter(s => !['big-square', 'C-shape'].includes(s.name));
  }
  // Nivel 8+: Todo disponible

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
