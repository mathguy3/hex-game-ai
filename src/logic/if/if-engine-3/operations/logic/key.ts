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
      type: 'eval',
      previousContext: context,
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
      // console.log('key complete', context.localBag.key);
      return {
        ...context,
        isComplete: true,
      };
    }

    if (context.bag.result === undefined) {
      throw new Error('Key statement requires a string result to work');
    }
    // console.log('revisiting key', context.path, context.bag.result);
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
