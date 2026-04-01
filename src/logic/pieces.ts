import type { GridCoordinate } from './gridUtils';
import { SHAPES } from './SHAPES';

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

export function generateRandomPiece(level: number = 1): PieceShape {
  let availableShapes = SHAPES;

  // Filtrado progresivo por nivel
  if (level === 1 || level === 2) {
    availableShapes = SHAPES.filter(s => [ "line-4v","line-4-h", "rect-3x2-h", "rect-2x3-v", "line-3-v", "line-3-h", "square-2x2", "big-square", "line-5-v" ,"line-5-h", "line-2-v","line-2-h"].includes(s.name));
  } else if (level === 3) {
    availableShapes = SHAPES.filter(s => [ "dot" ,"line-4-v","line-4-h", "rect-3x2-h", "rect-2x3-v", "line-3-v", "line-3-h", "square-2x2", "big-square", "l-shape", "j-shape", , "T-shape", "l-shape-r", "hueco-3", "hueco-3-2", "t-shape-up"].includes(s.name));
  } else if (level === 4) {
    availableShapes = SHAPES.filter(s => !['dot' ,"line-4-v","line-4-h", "rect-3x2-h", "rect-2x3-v", "line-3-v", "line-3-h", "line-2-v","line-2-h" ,"square-2x2", "big-square", "l-shape", "j-shape", "T-shape","z-shape", "s-shape" , "T-shape", "l-shape-r", "hueco-3", "hueco-3-2", "t-shape-up"].includes(s.name));
  } else if (level === 5) {
    availableShapes = SHAPES.filter(s => !['dot' ,"line-4-v","line-4-h", "rect-3x2-h", "rect-2x3-v", "line-3-v", "line-3-h", "line-2-v","line-2-h", "square-2x2", "big-square", "l-shape", "j-shape", "T-shape","z-shape", "s-shape", "t-shape-v", "line-5-h", "line-5-v" , "T-shape", "L-shape-r", "hueco-3", "hueco-3-2", "t-shape-up"].includes(s.name));
  } else if (level === 6) {
    availableShapes = SHAPES.filter(s => !['dot' ,"line-4-v","line-4-h", "rect-3x2-h", "rect-2x3-v", "line-3-v", "line-3-h", "square-2x2", "line-2-v","line-2-h", "big-square", "l-shape", "j-shape", "T-shape","z-shape", "s-shape", "t-shape-v", "line-5-h", "line-5-v","L-shape-r", "cross" , "l-shape-r", "hueco-3", "hueco-3-2", "t-shape-up"].includes(s.name));
  } else if (level === 7) {
    availableShapes = SHAPES.filter(s => !['dot' ,"line-4-v","line-4-h", "rect-3x2-h", "rect-2x3-v", "line-3-v", "line-3-h", "square-2x2", "big-square", "l-shape", "j-shape", "T-shape","z-shape", "s-shape", "t-shape-v", "line-5-h", "line-5-v","L-shape-r", "cross" , "L-shape-r", "hueco-3", "hueco-3-2", "t-shape-up" ].includes(s.name));
  } else if (level === 8) {
    availableShapes = SHAPES.filter(s => !['dot' ,"line-4-v","line-4-h", "rect-3x2-h", "rect-2x3-v", "line-3-v", "line-3-h", "square-2x2", "big-square", "l-shape", "j-shape", "T-shape","z-shape", "s-shape", "t-shape-v", "line-5-h", "line-5-v","L-shape-r", "cross" ,"L-shape-r", "hueco-3", "hueco-3-2", "t-shape-up" ].includes(s.name));
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
