import { Interaction } from "../../../../../types/actions/interactions";
import { ActionState, Sequence } from "../../../../../types/game";
import { ActionRequest } from "../doSequence";

export const start = (actionState: ActionState, stepId: string, action: Sequence | Interaction, request: ActionRequest) => {
    actionState.gameState.hasStarted = true;
    actionState.gameState.activeAction = actionState.gameDefinition.sequencing;
    actionState.gameState.activeStep = 'start';
    actionState.gameState.actionContext = {
        id: 'start',
        action: actionState.gameDefinition.sequencing,
        previousContext: null
    };
    return actionState;
}