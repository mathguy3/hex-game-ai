import { Action, SystemAction } from '../../../types/actions/interactions';
import { ActionState } from '../../../types/game';
import { evalSet } from '../if/if-engine/eval-set';
import { getModel } from './getModel';

export const activateAction = (actionState: ActionState, action: Action | SystemAction): ActionState => {
  if ('set' in action) {
    for (const set of action.set) {
      evalSet(set, getModel(actionState));
    }
  }
  return actionState;
};
