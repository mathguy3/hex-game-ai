import { getNextOperation } from '../getNextOperation';

import { Context } from './types';
export const field = {
    requiredFields: [],
    op: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1) {
            throw new Error("Field operation requires exactly one field");
        }
        const field = keys[0];
        const { operationType } = getNextOperation(context);
        const nextPath = context.path + '.' + operationType;
        return {
            previousContext: context,
            path: nextPath, // selectNext
            history: [...context.history, nextPath], // selectNext
            contextModel: context.contextModel,
            modelItem: context.modelItem[field],
            ifItem: context.ifItem[field], // selectNext
        };
    },
};
