import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const greaterThanEqual = {
    requiredFields: ["greaterThanEqual"],
    startOp: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1 || keys[0] !== 'greaterThanEqual') {
            throw new Error("Field operation requires exactly one field" + JSON.stringify(keys));
        }
        const nextContext = selectNext(context);
        return {
            ...nextContext,
            type: 'eval',
            modelItem: context.modelItem,
            operationType: 'greaterThanEqual',
        };
    },
    revisitOp: (context: Context) => {
        if (context.previousContext.type == 'set') {
            throw new Error("Greater than equal operation cannot be used for a set operation");
        }

        if (typeof context.modelItem !== 'number' || typeof context.bag.result !== 'number') {
            throw new Error("Greater than equal operation can only be used on numbers");
        }

        context.bag.result = context.modelItem >= context.bag.result;
        return { ...context, isComplete: true };
    }
};
