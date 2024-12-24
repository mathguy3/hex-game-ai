import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';

export const and = {
    requiredFields: ["and"],
    startOp: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1 || keys[0] !== 'and') {
            throw new Error("Field operation requires exactly one field" + JSON.stringify(keys));
        }
        const andItem = context.ifItem.and;
        const firstItem = andItem[0];

        const { operationType } = getOperation(firstItem);
        const nextPath = addPath(context.path, 'and');
        return {
            previousContext: context,
            type: 'if',
            operationType: 'and',
            bag: context.bag,
            path: nextPath,
            localBag: { index: 0, andItems: andItem, result: true },

            nextOperation: operationType,
            modelItem: context.modelItem,
            ifItem: firstItem,
        };
    },
    revisitOp: (context: Context) => {
        if (context.previousContext.type == 'set') {
            throw new Error("And operation cannot be used for a set operation");
        }
        if (context.localBag.index == context.localBag.andItems.length - 1) {
            context.bag.result = context.bag.result && context.localBag.result;
            return { ...context, isComplete: true };
        }
        const nextItem = context.localBag.andItems[++context.localBag.index];
        const { operationType } = getOperation(nextItem);
        return {
            ...context,
            localBag: { ...context.localBag, result: context.localBag.result && context.bag.result },
            nextOperation: operationType,
            ifItem: nextItem,
        };
    }
};
