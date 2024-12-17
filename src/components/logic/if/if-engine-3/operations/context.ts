import { getNextOperation } from "../getNextOperation";
import { Context } from "./types";

export const context = {
    requiredFields: ['context'],
    op: (context: Context) => {
        if (!('context' in context.ifItem)) {
            throw new Error("Wrong value type for context operation");
        }
        const { operationType } = getNextOperation(context);
        const nextPath = context.path + '.' + operationType;
        // The whole action here is just loading the baseContext back onto modelItem, and setting the next ifitem to the context object
        return {
            previousContext: context,
            fields: [],
            path: nextPath,
            history: [...context.history, nextPath],
            contextModel: context.contextModel,
            modelItem: context.contextModel,
            ifItem: context.ifItem.context
        }
    },
}