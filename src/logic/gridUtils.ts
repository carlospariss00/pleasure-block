import type { GridCoordinate } from './types';

// Convertir coordenadas de red a píxeles para el renderizado
export function gridToPixel(x: number, y: number, size: number) {
  return {
    px: x * size,
    py: y * size
  };
}

// Convertir píxeles de vuelta a coordenadas de red
export function pixelToGrid(px: number, py: number, size: number): GridCoordinate {
  return {
    x: Math.floor(px / size),
    y: Math.floor(py / size)
  };
}

// Genera todas las casillas del tablero (un cuadrado de size x size)
export function generateBoard(size: number): GridCoordinate[] {
  const cells: GridCoordinate[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells.push({ x, y });
    }
  }
  return cells;
}
