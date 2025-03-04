import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';
import { getProcedure } from '../../getProcedure';

export const key = {
  requiredFields: ['key', 'value'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    if (!('key' in context.ifItem) || !('value' in context.ifItem)) {
      throw new Error('If statement requires a key and value statement');
    }
    const ifNext = context.ifItem.key;
    const operationType = getOperation(ifNext).operationType;
    return {
      previousContext: context,
      type: 'eval',
      path: addPath(context.path, 'key'),
      modelItem: context.modelItem,
      ifItem: getProcedure(ifNext, context.procedures),
      bag: context.bag,
      operationType: 'key',
      nextOperation: operationType,
    };
  },
  revisitOp: (context: Context) => {
    if (context.localBag?.key !== undefined) {
      return {
        ...context,
        isComplete: true,
      };
    }

    if (context.bag.result === undefined) {
      throw new Error('Key statement requires a string result to work');
    }
    const nextKey = context.bag.result;
    const ifNext = context.previousContext.ifItem.value;
    const { operationType } = getOperation(ifNext);

    return {
      ...context,
      type: context.previousContext.type,
      ifItem: getProcedure(ifNext, context.procedures),
      modelItem: context.modelItem[nextKey],
      nextOperation: operationType,
      localBag: { key: nextKey },
    };
  },
};
