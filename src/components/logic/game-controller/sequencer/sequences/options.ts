import { Interaction } from "../../../../../types/actions/interactions";
import { ActionState, Sequence } from "../../../../../types/game";
import { ActionRequest } from "../doSequence";

export const options = (actionState: ActionState, stepId: string, action: Sequence | Interaction, request: ActionRequest) => {
    if (action.type !== 'options') {
        throw new Error('Action is not an options');
    }

    if (actionState.gameState.actionContext.isComplete) {
        Object.values(action.interactions).forEach((option) => {
            if (option.type === 'hex') {
                actionState.localControl = { ...actionState.localControl, mapSelector: null };
            }
        });
    } else {
        Object.values(action.interactions).forEach((option) => {
            if (option.type === 'hex') {
                actionState.localControl = { ...actionState.localControl, mapSelector: option.targeting.tiles };
            }
        });
    }
    return actionState;
}