import { addPath } from '../../utils/addPath';
import { complete } from '../../utils/complete';
import { evalIfField, revisitIfField } from '../../utils/evalIfField';
import { getOperation } from '../../getNextOperation';
import { Context } from '../types';

export const functionOp = {
  requiredFields: [],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    const functionName = Object.keys(context.next.ifItem)[0];
    const functionItem = context.next.ifItem[functionName];
    const params = Object.keys(functionItem);
    const nextIfItem = functionItem[params[0]];
    const { operationType } = getOperation(nextIfItem, context.references, context.functions);
    const nextPath = addPath(context.path, functionName);
    return {
      previousContext: context,
      type: 'eval',
      path: nextPath,
      next: {
        ifItem: nextIfItem,
        operationType: operationType,
        modelItem: context.next.modelItem,
      },
      localBag: { isFunctionRun: false, functionName, functionItem, params, paramIndex: 0 },
      operationType: 'functionOp',
      modelItem: context.next.modelItem,
      references: context.references,
      functions: context.functions,
      bag: context.bag,
    };
  },
  revisitOp: (context: Context) => {
    if (context.localBag.isFunctionRun) {
      return complete(context);
    }
    context.bag.references = {
      ...context.bag.references,
      [context.localBag.params[context.localBag.paramIndex]]: context.bag.result,
    };
    context.localBag.paramIndex++;
    if (context.localBag.paramIndex >= context.localBag.params.length) {
      console.log('function complete', context.localBag.functionItem);
      const nextPath = addPath(context.previousContext.path, context.localBag.functionName);
      const functionItem = context.functions[context.localBag.functionName];
      const { operationType } = getOperation(functionItem, context.references, context.functions);
      return {
        ...context,
        type: context.previousContext.type,
        path: nextPath,
        next: {
          ifItem: functionItem,
          operationType: operationType,
          modelItem: context.modelItem,
        },
        localBag: { ...context.localBag, isFunctionRun: true },
      };
    }
    const nextIfItem = context.localBag.functionItem[context.localBag.params[context.localBag.paramIndex]];
    const { operationType } = getOperation(nextIfItem, context.references, context.functions);
    return {
      ...context,
      next: {
        ifItem: nextIfItem,
        operationType: operationType,
        modelItem: context.modelItem,
      },
    };
  },
};
