import { getNextOperation } from "../getNextOperation";
import { Context } from "../operations/types";

export const selectNext = (context: Context) => {
    const { operationType } = getNextOperation(context);
    const nextPath = context.path + '.' + operationType;
    return {
        previousContext: context,
        fields: [],
        path: nextPath,
        history: [...context.history, nextPath],
        contextModel: context.contextModel,
        modelItem: context.contextModel,
        ifItem: context.ifItem.context
    }
}