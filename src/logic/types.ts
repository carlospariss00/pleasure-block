export type GridCoordinate = { x: number; y: number };

export type PieceShape = {
  id: string;
  name: string;
  color: string;
  coords: GridCoordinate[];
};
