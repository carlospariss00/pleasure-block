import type { PieceShape } from './types';


export const SHAPES: Omit<PieceShape, 'id' | 'color'>[] = [
  // NIVEL 1: Básicas
  { name: 'dot', coords: [{ x: 0, y: 0 }] },
  { name: 'line-2-h', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }] },
  { name: 'line-2-v', coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }] },
  { name: 'diagonal-2', coords: [{ x: 0, y: 0 }, { x: 1, y: 1 }] },
  { name: 'hueco-2', coords: [{ x: 0, y: 0 }, { x: 1, y: 1 }] },

  // NIVEL 2: Intermedias
  { name: 'line-3-h', coords: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }] },
  { name: 'line-3-v', coords: [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }] },
  { name: 'square-2x2', coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },
  { name: 'diagonal-3', coords: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }] },
  { name: "hueco-3", coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }] },
  { name: "hueco-3-2", coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },

  // NIVEL 3: Formas Clásicas
  { name: 'l-shape', coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
  { name: 'j-shape', coords: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 2 }] },
  { name: 'T-shape', coords: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] },
  { name: "t-shape-up", coords: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }] },
  

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
