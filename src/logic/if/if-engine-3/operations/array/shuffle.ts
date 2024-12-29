import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const shuffle = {
  requiredFields: ['shuffle'],
  alternateFields: [],
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
      operationType: 'shuffle',
    };
  },
  revisitOp: (context: Context) => {
    if (typeof context.modelItem !== 'object' || !Array.isArray(context.modelItem)) {
      throw new Error('Shuffle operation can only be used on arrays');
    }

    const copy = [...context.modelItem];

    if (context.previousContext.type == 'set') {
      context.bag.result = context.modelItem.sort(() => Math.random() - 0.5);
      if (context.bag.result.every((item, index) => item === copy[index])) {
        context.bag.result = context.modelItem.sort(() => Math.random() - 0.5);
      }

      return { ...context, isComplete: true };
    } else {
      context.bag.result = context.modelItem.toSorted(() => Math.random() - 0.5);
      if (context.bag.result.every((item, index) => item === copy[index])) {
        context.bag.result = context.modelItem.sort(() => Math.random() - 0.5);
      }
      return { ...context, isComplete: true };
    }
  },
};
