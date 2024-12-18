
import { addPath } from '../utils/addPath';
import { Context } from './types';

export const equals = {
    requiredFields: ["equals"],
    startOp: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1 || keys[0] !== 'equals') {
            throw new Error("Field operation requires exactly one field" + JSON.stringify(keys));
        }
        const field = keys[0];
        const nextPath = addPath(context.path, field);
        return {
            type: 'eval',
            previousContext: context,
            path: nextPath, // selectNext
            modelItem: context.modelItem,
            ifItem: context.ifItem[field], // selectNext
            isComplete: true,
            bag: context.bag,
            operationType: 'equals',
        };
    },
    endOp: (context: Context) => {
        context.bag.result = context.modelItem == context.bag.result;
        return { ...context.previousContext, bag: context.bag };
    }
};
