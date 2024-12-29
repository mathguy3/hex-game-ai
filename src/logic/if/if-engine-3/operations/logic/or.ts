import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';

export const or = {
  requiredFields: ['or'],
  alternateFields: ['||'],
  optionalFields: [],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1 || keys[0] !== 'or') {
      throw new Error('Field operation requires exactly one field' + JSON.stringify(keys));
    }
    const orItem = context.ifItem.or;
    const firstItem = orItem[0];

    const { operationType } = getOperation(firstItem);
    const nextPath = addPath(context.path, 'or');
    return {
      previousContext: context,
      type: 'if',
      operationType: 'or',
      bag: context.bag,
      path: nextPath,
      localBag: { index: 0, orItems: orItem, result: false },

      nextOperation: operationType,
      modelItem: context.modelItem,
      ifItem: firstItem,
    };
  },
  revisitOp: (context: Context) => {
    if (context.previousContext.type == 'set') {
      throw new Error('Or operation cannot be used for a set operation');
    }
    if (context.localBag.index == context.localBag.orItems.length - 1) {
      console.log('or complete', context);
      context.bag.result = context.bag.result || context.localBag.result;
      return { ...context, isComplete: true };
    }
    const nextItem = context.localBag.orItems[++context.localBag.index];
    const { operationType } = getOperation(nextItem);
    return {
      ...context,
      localBag: { ...context.localBag, result: context.localBag.result || context.bag.result },
      nextOperation: operationType,
      ifItem: nextItem,
    };
  },
};
