import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { complete } from '../../utils/complete';
import { Context } from '../types';

export const referenceOp = {
  requiredFields: [],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    const nextField = Object.keys(context.next.ifItem)[0];
    const referenceIfItem = context.references[nextField];
    const { operationType } = getOperation(referenceIfItem, context.references, context.functions);
    const nextPath = addPath(context.path, nextField);
    return {
      previousContext: context,
      type: 'eval',
      path: nextPath,
      next: {
        ifItem: referenceIfItem,
        operationType: operationType,
        modelItem: context.bag.model,
      },
      localBag: { ...context.localBag, isReferenceRun: false, reference: referenceIfItem },
      operationType: 'referenceOp',
      modelItem: context.bag.model,
      references: context.references,
      functions: context.functions,
      bag: context.bag,
    };
  },
  revisitOp: (context: Context) => {
    if (context.localBag.isReferenceRun) {
      return complete(context);
    }
    const referenceField = Object.keys(context.previousContext.next.ifItem)[0];
    const nextIfItem = context.previousContext.next.ifItem[referenceField];
    const { operationType } = getOperation(nextIfItem, context.references, context.functions);
    return {
      ...context,
      type: context.previousContext.type,
      next: {
        ifItem: nextIfItem,
        operationType: operationType,
        modelItem: context.bag.result,
      },
      localBag: { ...context.localBag, isReferenceRun: true },
    };
  },
};
