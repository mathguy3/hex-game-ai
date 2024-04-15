import { gameDefinition } from '../../../configuration/gameDefinition';
import { Tile } from '../../../types';
import { ActionState } from '../../../types/game';
import { AspectTileSelect } from '../../../types/interactions';

function areEqualShallow(a, b) {
  for (var key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

export function aspect(
  tileSelect: AspectTileSelect,
  actionState: ActionState,
  tile: Tile
) {
  const hex = actionState.mapState[tile.key];
  const unit = hex?.contains[0];
  const unitDefinition = gameDefinition.unit[unit?.kind];
  const target = tileSelect.target === 'hex' ? hex : unitDefinition;
  const targetAspect = target?.aspects[tileSelect.aspect.type];
  const stateAspect = unit?.aspects[tileSelect.aspect.type];
  return (
    (stateAspect && areEqualShallow(stateAspect, tileSelect.aspect)) ||
    (targetAspect && areEqualShallow(targetAspect, tileSelect.aspect))
  );
}
