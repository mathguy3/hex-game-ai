import { Tile } from '../../../types';
import { ActionState } from '../../../types/game';
import { KindTileSelect } from '../../../types/interactions';

export function kind(
  tileSelect: KindTileSelect,
  actionState: ActionState,
  tile: Tile
) {
  const hex = actionState.mapState[tile.key];
  const target = tileSelect.target === 'hex' ? hex : hex?.contains[0];
  return target && target.kind === tileSelect.kind;
}
