export const BOARD_SIZE = 8;
export const CELL_SIZE = 44;
export const CELL_SIZE_MOBILE = 38;
export const DOCK_CELL_SIZE = 18;
export const POINTS_PER_BLOCK = 10;
export const LINES_PER_LEVEL = 10;
export const COMBO_TIMEOUT = 1500;
export const LEVEL_UP_TIMEOUT = 2000;
export const DRAG_OFFSET_V = 80;

export function getCellSize(): number {
  return window.innerWidth < 400 ? CELL_SIZE_MOBILE : CELL_SIZE;
}
