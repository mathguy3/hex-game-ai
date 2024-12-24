import { Interaction } from '../../../../types/actions/interactions';
import { ActionState, Sequence } from '../../../../types/game';

export const resolveAction = (
  actionState: ActionState,
  action: string | Sequence | Interaction
): Sequence | Interaction => {
  if (typeof action === 'string') {
    const resolvedAction = actionState.gameDefinition.actions[action];
    if (!resolvedAction) {
      throw new Error(`Could not resolve action: ${action}`);
    }
    return resolvedAction;
  }
  return action;
};
