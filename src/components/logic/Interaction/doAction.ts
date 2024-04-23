import { ActionState } from '../../../types/game';
import { unselectCoordinates } from '../Map/unselectCoordinates';
import { moveUnit } from './move/moveUnit';

export const doAction = (actionState: ActionState): ActionState => {
  const { targetHex } = actionState;
  const { preview } = targetHex;
  const actionType = preview.movement ?? preview.attack;

  if (actionType.type === 'movement') {
    actionState = moveUnit(actionState);
  } else if (actionType.type === 'attack') {
    actionState.mapState = unselectCoordinates(
      actionState.mapState,
      actionState.selectionState
    );
  }

  return actionState;
};
