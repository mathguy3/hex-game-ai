import { ActionState, GameDefinition } from '../../../../types/game';
import { showPreview } from '../../map/preview/showPreview';
import { selectHex } from '../../map/selectHex';
import { isPlayerTurn } from '../../util/isPlayerTurn';
import { activateHex } from './activateHex';

export const pressHex = (actionState: ActionState, gameDefinition: GameDefinition): ActionState => {
  const { targetHex, previewState } = actionState;
  console.time('pressHex');
  if (previewState[targetHex.key] && isPlayerTurn(actionState.gameState)) {
    console.log('Activating interactions');
    actionState = activateHex(actionState, gameDefinition);
  } else {
    console.log('Selecting hex');
    actionState = selectHex(actionState);
    if (isPlayerTurn(actionState.gameState)) {
      console.log('Previewing ');
      actionState = showPreview(actionState, gameDefinition);
    }
  }
  console.timeEnd('pressHex');
  return actionState;
};
