import { Interaction } from "../../../../../types/actions/interactions";
import { ActionState, Sequence } from "../../../../../types/game";
import { ActionRequest } from "../doSequence";
import { isInteractionSequence } from "../utils/isInteractionSequence";

export const sequence = (actionState: ActionState, stepId: string, action: Sequence | Interaction, request: ActionRequest) => {
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
            context.currentIndex = null;
            //console.log('sequence complete', actionState.gameState.activePlayerId);
            // I really want to be able to cycle through the activePlayerId, but I'm not sure how to do that here sure okay
            actionState.gameState.activePlayerId = actionState.gameState.activePlayerId === 'team1' ? 'team2' : 'team1';
            //console.log('sequence complete teams have changed??', actionState.gameState.activePlayerId);
        }
    }

    return { ...actionState, gameState: { ...actionState.gameState, actionContext: { ...context } } };
}   