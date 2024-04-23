import { Tile } from '../coordinates';

export type Preview =
  | {
      type: 'none';
      color: string;
      tile: Tile;
    }
  | {
      type: 'movement';
      color: string;
      tile: Tile;
    }
  | {
      type: 'attack';
      color: string;
      tile: Tile;
    };
