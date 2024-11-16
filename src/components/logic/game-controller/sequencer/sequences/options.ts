import { Interaction } from "../../../../../types/actions/interactions";
import { ActionState, Sequence } from "../../../../../types/game";
import { isPlayerTurn } from "../../../util/isPlayerTurn";
import { ActionRequest } from "../doSequence";

export const options = (actionState: ActionState, stepId: string, action: Sequence | Interaction, request: ActionRequest) => {
    const { mapManager, cardManager } = actionState.localState;
    if (action.type !== 'options') {
        throw new Error('Action is not an options');
    }

    console.log('options', actionState.gameState.actionContext.isComplete);
    if (actionState.gameState.actionContext.isComplete) {
        Object.values(action.interactions).forEach((option) => {
            if (option.type === 'hex' && mapManager.state !== 'view') {
                actionState.localState = { ...actionState.localState, mapManager: { ...mapManager, state: 'view' } };
                actionState.shouldUpdateLocalState = true;
            }
            if (option.type === 'card' && cardManager.state !== 'view') {
                actionState.localState = { ...actionState.localState, cardManager: { ...cardManager, state: 'view' } };
                actionState.shouldUpdateLocalState = true;
            }
        });
    } else {
        if (isPlayerTurn(actionState.gameState, actionState.localState)) {
            Object.values(action.interactions).forEach((option) => {
                if (option.type === 'hex' && mapManager.state !== 'play') {
                    actionState.localState = { ...actionState.localState, mapManager: { ...mapManager, state: 'play' } };
                    actionState.shouldUpdateLocalState = true;
                }
                if (option.type === 'card' && cardManager.state !== 'play') {
                    actionState.localState = { ...actionState.localState, cardManager: { ...cardManager, state: 'play' } };
                    actionState.shouldUpdateLocalState = true;
                }
            });
        }
    }
    return actionState;
}