import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';

export const ifIf = {
  requiredFields: ['if', 'then'],
  alternateFields: [],
  optionalFields: ['else'],
  startOp: (context: Context) => {
    if (!('then' in context.ifItem) || !('else' in context.ifItem)) {
      throw new Error('If statement requires a then and else statement');
    }
    const ifNext = context.ifItem.if;
    const operationType = getOperation(ifNext).operationType;
    return {
      type: 'if',
      previousContext: context,
      path: addPath(context.path, 'if'),
      modelItem: context.modelItem,
      ifItem: ifNext,
      bag: context.bag,
      operationType: 'if',
      nextOperation: operationType,
    };
  },
  revisitOp: (context: Context) => {
    if (context.localBag?.ifResult !== undefined) {
      // console.log('if if complete', context.localBag.ifResult);
      return {
        ...context,
        isComplete: true,
      };
    }

    if (context.bag.result === undefined) {
      throw new Error('If statement requires a result to work');
    }
    // console.log('revisiting if if', context.path, context.bag.result);
    const nextIfItem = context.bag.result ? context.previousContext.ifItem.then : context.previousContext.ifItem.else;
    const { operationType } = getOperation(nextIfItem);

    return {
      ...context,
      ifItem: nextIfItem,
      nextOperation: operationType,
      localBag: { ...context.localBag, ifResult: context.bag.result },
    };
  },
};
