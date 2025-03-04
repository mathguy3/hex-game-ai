import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';
import { getProcedure } from '../../getProcedure';

export const max = {
  requiredFields: ['max'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1) {
      throw new Error('Field operation requires exactly one field' + JSON.stringify(keys));
    }
    const evalItem = context.ifItem.max;
    const { operationType } = getOperation(evalItem);
    const index = 0;
    const nextPath = addPath(context.path, 'max');

    //console.log('max start', context.modelItem, 'max');

    return {
      previousContext: context,
      type: 'eval',
      modelItem: context.modelItem[index],
      operationType: 'max',
      path: nextPath,
      localBag: { index, itemResults: [], result: undefined },
      nextOperation: operationType,
      ifItem: getProcedure(evalItem, context.procedures),
      bag: context.bag,
    };
  },
  revisitOp: (context: Context) => {
    const arrayContext = context.previousContext;
    if (typeof arrayContext.modelItem !== 'object' || !Array.isArray(arrayContext.modelItem)) {
      throw new Error('Max operation can only be used on arrays');
    }

    if (context.localBag.index >= arrayContext.modelItem.length) {
      console.log('max complete', context.localBag.itemResults);
      context.bag.result = Math.max(...context.localBag.itemResults);

      return { ...context, isComplete: true };
    }

    context.localBag.index++;
    context.modelItem = arrayContext.modelItem[context.localBag.index];
    console.log('max revisit', context.bag.result, context.localBag.index, context.modelItem);
    context.localBag.itemResults.push(context.bag.result);
    context.path = addPath(arrayContext.path, 'max');
    const evalItem = arrayContext.ifItem.max;
    const { operationType } = getOperation(evalItem);
    context.nextOperation = operationType;

    return { ...context };
  },
};
