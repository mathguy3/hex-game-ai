import { ActionState } from '../../../types/game';
import { showPreview } from '../../map/preview/showPreview';
import { selectHex } from '../../map/selectHex';
import { isPlayerTurn } from '../../util/isPlayerTurn';
import { DoAction } from '../GameControllerProvider';

export const pressHex = (actionState: ActionState, doAction: DoAction): ActionState => {
  const { targetHex, localState, gameState } = actionState;

  const canInteract = isPlayerTurn(gameState, localState) && localState.mapManager.state === 'play';

  if (localState.previewState[targetHex.key] && canInteract) {
    // This needs to trigger the interaction/next part of the sequence
    //actionState = activateHex(actionState, doAction);
  } else {
    // Local only
    actionState = selectHex(actionState);
    if (canInteract) {
      actionState = showPreview(actionState);
    }
  }
  console.timeEnd('pressHex');
  return actionState;
};
