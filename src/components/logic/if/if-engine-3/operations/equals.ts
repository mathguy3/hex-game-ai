
import { Context } from './types';

export const equals = {
    requiredFields: ["equals"],
    op: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1) {
            throw new Error("Field operation requires exactly one field");
        }
        const field = keys[0];
        const nextPath = context.path + '.' + field;
        return {
            type: 'eval',
            previousContext: context,
            path: nextPath, // selectNext
            modelItem: context.modelItem[field],
            ifItem: context.ifItem[field], // selectNext
            isComplete: true,
            bag: context.bag,
            operationType: 'equals',
        };
    },
    postOp: (context: Context) => {
        console.log("---equals", context.modelItem, context.bag.result);
        return { ...context.previousContext, bag: context.bag };
    }
};
