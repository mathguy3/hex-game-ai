import { TileSelect, TileSet } from '../../../types/actions/tiles';

export const asTileSet = (tiles: TileSelect | TileSet): TileSet => ('type' in tiles ? { add: [tiles] } : tiles);
