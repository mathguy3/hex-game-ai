import { selectNext } from '../utils/select-next';
import { Context } from './types';

export const field = {
    requiredFields: [],
    op: (context: Context) => {
        const keys = Object.keys(context.ifItem);
        if (keys.length !== 1) {
            throw new Error("Field operation requires exactly one field");
        }
        return selectNext(context);
    },
};
