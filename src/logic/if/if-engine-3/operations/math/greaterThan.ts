import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const greaterThan = {
  requiredFields: ['greaterThan'],
  alternateFields: ['>'],
  optionalFields: [],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1) {
      throw new Error('Field operation requires exactly one field' + JSON.stringify(keys));
    }

    const nextContext = selectNext(context);
    return {
      ...nextContext,
      type: 'eval',
      modelItem: context.modelItem,
      operationType: 'greaterThan',
    };
  },
  revisitOp: (context: Context) => {
    if (context.previousContext.type == 'set') {
      throw new Error('Greater than operation cannot be used for a set operation');
    }

    if (typeof context.modelItem !== 'number' || typeof context.bag.result !== 'number') {
      throw new Error('Greater than operation can only be used on numbers');
    }

    context.bag.result = context.modelItem > context.bag.result;
    return { ...context, isComplete: true };
  },
};
