import { getOperation } from '../getNextOperation';
import { Context } from '../operations/types';
import { addPath } from './addPath';
import { complete } from './complete';

export const evalIfArrayField = (context: Context, field?: string) => {
  const nextField = field ?? Object.keys(context.next.ifItem)[0];
  const nextIfItem = context.next.ifItem[nextField];
  const nextPath = addPath(context.path, nextField);

  const initialIndex = 0;
  if (nextIfItem.length === initialIndex) {
    return {
      previousContext: context,
      type: context.type,
      bag: context.bag,
      modelItem: context.next.modelItem,
      operationType: context.next.operationType,
      references: context.references,
      functions: context.functions,
      path: nextPath,
    };
  }
  const firstItem = nextIfItem[initialIndex];
  const { operationType } = getOperation(firstItem, context.references, context.functions);
  return {
    previousContext: context,
    type: context.type,
    isArray: true,
    path: nextPath,
    next: {
      ifItem: firstItem,
      operationType: operationType,
      modelItem: context.next.modelItem,
    },
    localBag: { ...context.localBag, index: initialIndex },
    modelItem: context.next.modelItem,
    operationType: context.next.operationType,
    references: context.references,
    functions: context.functions,
    bag: context.bag,
  };
};

export const revisitIfArrayField = (
  context: Context,
  field?: string,
  onComplete?: (context: Context) => Context
): Context => {
  const nextField = field ?? Object.keys(context.previousContext.next.ifItem)[0];
  const nextIndex = context.localBag.index + 1;
  const array = context.previousContext.next.ifItem[nextField];
  if (nextIndex === array.length) {
    return complete(onComplete?.(context) ?? context);
  }
  const nextPath = addPath(context.previousContext.path, nextField);
  const nextIfItem = array[nextIndex];
  const { operationType } = getOperation(nextIfItem, context.references, context.functions);
  return {
    ...context,
    path: nextPath,
    next: {
      ifItem: nextIfItem,
      operationType: operationType,
      modelItem: context.modelItem,
    },
    localBag: { ...context.localBag, index: nextIndex },
  };
};
