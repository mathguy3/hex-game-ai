import { Tile } from '../../types';
import { ActionState } from '../../types/game';

export const isBlocking = (actionState: ActionState, tile: Tile) => {
  const hex = actionState.mapState[tile.key];
  return !!hex;
};
