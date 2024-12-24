import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const add = {
    requiredFields: ["add"],
    startOp: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1 || keys[0] !== 'add') {
            throw new Error("Field operation requires exactly one field" + JSON.stringify(keys));
        }

        const nextContext = selectNext(context);
        return {
            ...nextContext,
            type: 'eval',
            modelItem: context.modelItem,
            operationType: 'add',
        };
    },
    revisitOp: (context: Context) => {
        if (context.previousContext.type == 'set') {
            throw new Error("Add operation cannot be used for a set operation");
        }

        if ((typeof context.modelItem !== 'number' || typeof context.bag.result !== 'number') && (typeof context.bag.result !== 'string' || typeof context.bag.result !== 'boolean')) {
            throw new Error("Add operation can only be used on numbers");
        }

        context.bag.result = context.modelItem + context.bag.result;
        return { ...context, isComplete: true };
    }
};
