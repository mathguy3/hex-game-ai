import { CoordinateKey, Coordinates, Tile } from '../../../types';
import { TileSelect } from '../../../types/actions/tiles';
import { ActionState } from '../../../types/game';

export type TileGenerator<T extends TileSelect> = (
  tileSelect: T,
  target: Coordinates,
  actionState: ActionState,
  isValidTile: (tile: {
    key: CoordinateKey;
    coordinates: Coordinates;
  }) => boolean,
  initialSearch?: Record<string, Tile>
) => Record<string, Tile>;
