import type {  PieceShape } from './types';
import { SHAPES } from './SHAPES';
import { BOARD_SIZE } from './constants';

export { type PieceShape };

const colors = [
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

export const SIZE_BONUS: Record<number, number> = {
  1: 1.2,
  2: 1.2,
  3: 1.5,
  4: 1.8,
  5: 2.0,
  6: 2.5,
  9: 3.5,
};

export function getBoardEmptyPercentage(board: Record<string, string>): number {
  const filledCells = Object.keys(board).length;
  return 1 - (filledCells / (BOARD_SIZE * BOARD_SIZE));
}

export function generateRandomPiece(level: number = 1, board: Record<string, string> = {}): PieceShape {
  const emptyPercentage = getBoardEmptyPercentage(board);

  interface ShapeOption {
    name: string;
    weight: number;
  }

  const tinyShapes: ShapeOption[] = [
    { name: 'dot', weight: 1 },
    { name: 'line-2-h', weight: 1 },
    { name: 'line-2-v', weight: 1 },
    { name: 'rect-3x2-h', weight: 3 },
    { name: 'rect-2x3-v', weight: 3 },
    
  ];
  const mediumShapes: ShapeOption[] = [
    { name: 'line-3-h', weight: 5 },
    { name: 'line-3-v', weight: 5 },
    { name: 'square-2x2', weight: 5 },
    { name: 'l-shape', weight: 5 },
    { name: 'j-shape', weight: 5 },
    
  ];
  const largeShapes: ShapeOption[] = [
    { name: 'line-4-h', weight: 4 },
    { name: 'line-4-v', weight: 4 },
    { name: 'line-5-h', weight: 3 },
    { name: 'line-5-v', weight: 3 },
    { name: 'big-square', weight: 2 },
    { name: 'L-shape-r', weight: 3 },
  ];
  const mediumLargeShapes: ShapeOption[] = [
    { name: 'diagonal-2', weight: 3 },
    { name: 'diagonal-3', weight: 4 },
    { name: 'hueco-2', weight: 3 },
    { name: 'hueco-2-2', weight: 3 },
    { name: 'hueco-2-3', weight: 3 },
    { name: 't-shape-up', weight: 5 },
    { name: 'z-shape', weight: 4 },
    { name: 's-shape', weight: 4 },
    { name: 'T-shape', weight: 5 },
    { name: 't-shape-v', weight: 4 },
    ];
  const extraLargeShapes: ShapeOption[] = [
    
    
    { name: 'cross', weight: 3 },
    { name: 'C-shape', weight: 2 },
  ];
  

  let pool: ShapeOption[] = [];

  if (level <= 3) {
    pool = [...mediumShapes, ...largeShapes, ...tinyShapes];
  } else if (level <= 5) {
    pool = [...mediumShapes, ...largeShapes, ...extraLargeShapes, ...tinyShapes];
  } else if (level <= 7) {
    pool = [...mediumShapes, ...largeShapes, ...extraLargeShapes, ...tinyShapes, ...mediumLargeShapes];
  } else {
    pool = [...mediumShapes, ...largeShapes, ...extraLargeShapes, ...tinyShapes, ...mediumLargeShapes];
  }

  if (emptyPercentage < 0.5) {
    pool = pool.filter(s => !largeShapes.some(ls => ls.name === s.name) && !extraLargeShapes.some(es => es.name === s.name));
    pool = pool.map(s => ({ ...s, weight: tinyShapes.some(ts => ts.name === s.name) ? 5 : 3 }));
  } else if (emptyPercentage < 0.7) {
    pool = pool.filter(s => !extraLargeShapes.some(es => es.name === s.name));
  }

  const availableNames = pool.map(s => s.name);
  const filtered = SHAPES.filter(s => availableNames.includes(s.name));
  
  const weightedPool: Omit<typeof filtered[number], 'id' | 'color'>[] = [];
  pool.forEach((option) => {
    const shape = filtered.find(s => s.name === option.name);
    if (shape) {
      for (let i = 0; i < option.weight; i++) {
        weightedPool.push(shape);
      }
    }
  });

  const shape = weightedPool[Math.floor(Math.random() * weightedPool.length)];
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
