import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';
import { getProcedure } from '../../getProcedure';

export const and = {
  requiredFields: ['and'],
  alternateFields: ['&&'],
  optionalFields: [],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1 || keys[0] !== 'and') {
      throw new Error('Field operation requires exactly one field' + JSON.stringify(keys));
    }
    const andItem = context.ifItem.and;
    const firstItem = andItem[0];

    const { operationType } = getOperation(firstItem);
    const nextPath = addPath(context.path, 'and');
    return {
      previousContext: context,
      type: context.type,
      operationType: 'and',
      bag: context.bag,
      path: nextPath,
      localBag: { index: 0, andItems: andItem, result: true },

      nextOperation: operationType,
      modelItem: context.modelItem,
      ifItem: getProcedure(firstItem, context.procedures),
    };
  },
  revisitOp: (context: Context) => {
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
      ifItem: getProcedure(nextItem, context.procedures),
    };
  },
};
