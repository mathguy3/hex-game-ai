import { getNextOperation, getOperation } from "../getNextOperation";
import { Context } from "../operations/types";
import { addPath } from "./addPath";

export const selectNext = (context: Context) => {
    const { fields } = getNextOperation(context);
    const nextIfItem = context.ifItem[fields[0]];
    const operationType = getOperation(nextIfItem).operationType;
    console.log("selecting next", context.path, fields, operationType)
    const nextPath = addPath(context.path, fields[0]);
    return {
        type: context.type,
        previousContext: context,
        path: nextPath,
        modelItem: context.modelItem?.[fields[0]],
        ifItem: nextIfItem,
        bag: context.bag,
        nextOperation: operationType
    }
}

export const select = (context: Context) => {
    const { fields, operationType } = getOperation(context.ifItem);
    console.log("selecting next", context.path, fields, operationType)
    const nextPath = addPath(context.path, fields[0]);
    return {
        type: context.type,
        previousContext: context,
        path: nextPath,
        modelItem: context.modelItem?.[fields[0]],
        ifItem: context.ifItem[fields[0]],
        bag: context.bag,
        nextOperation: operationType
    }
}