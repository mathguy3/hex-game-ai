import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const field = {
    requiredFields: [],
    startOp: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1) {
            throw new Error("Field operation requires exactly one field");
        }
        const updatedContext = selectNext(context);
        return {
            ...updatedContext,
            operationType: 'field',
            field: keys[0],
        }
    },
    revisitOp: (context: Context) => {
        return { ...context, isComplete: true };
    }
};
