import { Action, SystemAction } from '../../../types/actions/interactions';
import { ActionState } from '../../../types/game';
import { evalSet } from '../if/if-engine/eval-set';
import { asArray } from '../util/asArray';
import { getModel } from './getModel';

export const activateAction = (actionState: ActionState, action: Action | SystemAction): ActionState => {
  if ('set' in action) {
    const sets = asArray(action.set);
    for (const set of sets) {
      evalSet(set, getModel(actionState));
    }
    if (actionState.gameDefinition.game.events) {
      const event = actionState.gameDefinition.game.events[action.type];
      const eventActions = event ? asArray(event.actions) : [];
      for (const eventAction of eventActions) {
        const eventSets = asArray(eventAction.set);
        for (const set of eventSets) {
          evalSet(set, getModel(actionState));
        }
      }
    }
  }
  return actionState;
};
