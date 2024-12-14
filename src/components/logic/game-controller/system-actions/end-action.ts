import { ActionState } from '../../../../types/game';
import { deselect } from '../interactions/deselect';
import { deactivateOptions } from '../options/deactivateOptions';
//import { updateStepPath } from '../updateStepPath';

export const endInteraction = (actionState: ActionState) => {
  const { activeStep: path } = actionState.gameState;
  const pathUp = path.slice(0, path.lastIndexOf('.'));
  //actionState = updateStepPath(actionState, pathUp);
  actionState = deselect(actionState);
  //console.log('deselect', actionState);
  actionState = deactivateOptions(actionState);
  return actionState;
};
