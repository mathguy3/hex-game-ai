import { Interaction } from '../../../../types/actions/interactions';
import { ActionState, Sequence } from '../../../../types/game';
import { doIf } from '../../../if/if-engine-3/doIf';
import { ActionRequest } from '../doSequence';
import { isInteractionSequence } from '../utils/isInteractionSequence';

export const sequence = (
  actionState: ActionState,
  stepId: string,
  action: Sequence | Interaction,
  request: ActionRequest
) => {
  if (!('actions' in action)) {
    throw new Error('Invalid action, expected sequence');
  }

  const context = actionState.gameState.actionContext;

  // If the sequence index is null do start of sequence actions
  if (context.currentIndex == null) {
    // Do start of sequence actions
  }

  // If the sequence index is the last index do end of sequence actions
  if (context.currentIndex === action.actions.length - 1) {
    if (isInteractionSequence(action)) {
      context.isComplete = true;
    } else {
      if (action.type == 'repeating' && action.breakOn) {
        const shouldBreak = doIf({ ifItem: action.breakOn, model: { context: actionState.gameState } });
        console.log('shouldBreak', shouldBreak, action.breakOn, actionState.gameState);
        if (shouldBreak) {
          context.isComplete = true;
          return actionState;
        }
      }
      context.currentIndex = null;
      const playerIds = Object.keys(actionState.gameState.players);
      const currentPlayerId = actionState.gameState.activePlayerId;
      const nextPlayerId = playerIds[(playerIds.indexOf(currentPlayerId) + 1) % playerIds.length];
      console.log('sequence complete, selecting next player', actionState.gameState.activePlayerId, nextPlayerId);
      actionState.gameState.activePlayerId = nextPlayerId;
    }
  }

  return { ...actionState, gameState: { ...actionState.gameState, actionContext: { ...context } } };
};
