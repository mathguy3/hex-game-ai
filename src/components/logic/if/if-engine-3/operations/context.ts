import { selectNext } from "../utils/select-next";
import { Context } from "./types";

export const context = {
    requiredFields: ['context'],
    op: (context: Context) => {
        if (!('context' in context.ifItem)) {
            throw new Error("Wrong value type for context operation");
        }
        const updatedContext = selectNext(context);
        return {
            ...updatedContext,
            modelItem: context.bag.contextModel,
            isComplete: true,
            operationType: 'context',
        }
    },
}