import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const subtract = {
    requiredFields: ["subtract"],
    startOp: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1 || keys[0] !== 'subtract') {
            throw new Error("Field operation requires exactly one field" + JSON.stringify(keys));
        }

        const nextContext = selectNext(context);
        return {
            ...nextContext,
            type: 'eval',
            modelItem: context.modelItem,
            operationType: 'subtract',
        };
    },
    endOp: (context: Context) => {
        if (context.previousContext.type == 'set') {
            throw new Error("Subtract operation cannot be used for a set operation");
        }

        if ((typeof context.modelItem !== 'number' || typeof context.bag.result !== 'number')) {
            throw new Error("Subtract operation can only be used on numbers");
        }

        context.bag.result = context.modelItem - context.bag.result;
        return { ...context, isComplete: true };
    }
};
