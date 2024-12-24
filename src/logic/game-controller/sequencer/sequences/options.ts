import { Interaction } from '../../../../types/actions/interactions';
import { ActionState, Sequence } from '../../../../types/game';
import { ActionRequest } from '../doSequence';

export const options = (
  actionState: ActionState,
  stepId: string,
  action: Sequence | Interaction,
  request: ActionRequest
) => {
  if (action.type !== 'options') {
    throw new Error('Action is not an options');
  }

  if (actionState.gameState.actionContext.isComplete) {
    Object.values(action.interactions).forEach((option) => {
      if (option.type === 'hex') {
        actionState.localControl = { ...actionState.localControl, activeActions: {} };
      }
    });
  } else {
    Object.values(action.interactions).forEach((option) => {
      if (option.type === 'hex') {
        console.log('activating option', option);
        actionState.localControl = {
          ...actionState.localControl,
          activeActions: { ...actionState.localControl.activeActions, [option.kind]: option.targeting.tiles },
        };
      }
    });
  }
  return actionState;
};
