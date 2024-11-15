import { Interaction } from "../../../../../types/actions/interactions";
import { ActionState, Sequence } from "../../../../../types/game";
import { evalSet } from "../../../if/if-engine/eval-set";
import { asArray } from "../../../util/asArray";
import { getModel } from "../../getModel";
import { ActionRequest } from "../doSequence";
import { isAction } from "../utils/isAction";

export const action = (actionState: ActionState, stepId: string, action: Sequence | Interaction, request: ActionRequest): ActionState => {
    if (!isAction(action)) {
        throw new Error('Invalid action');
    }
    if ('set' in action) {
        const sets = asArray(action.set);
        for (const set of sets) {
            evalSet(set, getModel(actionState));
        }
        // Handle events?
    }
    return actionState;
};
