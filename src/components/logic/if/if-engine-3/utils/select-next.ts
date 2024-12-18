import { getNextOperation } from "../getNextOperation";
import { Context } from "../operations/types";

export const selectNext = (context: Context) => {
    const { fields } = getNextOperation(context);
    const nextPath = context.path + '.' + fields[0];
    return {
        previousContext: context,
        path: nextPath,
        modelItem: context.modelItem?.[fields[0]],
        ifItem: context.ifItem[fields[0]],
        isComplete: true,
        bag: context.bag
    }
}