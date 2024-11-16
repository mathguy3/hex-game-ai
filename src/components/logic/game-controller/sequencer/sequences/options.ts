import { Interaction } from "../../../../../types/actions/interactions";
import { ActionState, Sequence } from "../../../../../types/game";
import { isPlayerTurn } from "../../../util/isPlayerTurn";
import { ActionRequest } from "../doSequence";

export const options = (actionState: ActionState, stepId: string, action: Sequence | Interaction, request: ActionRequest) => {
    if (action.type !== 'options') {
        throw new Error('Action is not an options');
    }

    console.log('options', actionState.gameState.actionContext.isComplete);
    if (actionState.gameState.actionContext.isComplete) {
        Object.values(action.interactions).forEach((option) => {
            if (option.type === 'hex') {
                actionState.localState.mapManager.state = 'view';
            }
            if (option.type === 'card') {
                actionState.localState.cardManager.state = 'view';
            }
        });
    } else {
        if (isPlayerTurn(actionState.gameState, actionState.localState)) {
            Object.values(action.interactions).forEach((option) => {
                if (option.type === 'hex') {
                    actionState.localState.mapManager.state = 'play';
                }
                if (option.type === 'card') {
                    actionState.localState.cardManager.state = 'play';
                }
            });
        }
    }
    return actionState;
}