import { getOperation } from '../getNextOperation';
import { Context } from '../operations/types';
import { addPath } from './addPath';
import { complete } from './complete';

export const evalArrayField = (context: Context, field?: string) => {
  const nextField = field ?? Object.keys(context.next.ifItem)[0];
  const nextPath = addPath(context.path, nextField);

  const initialIndex = 0;
  if (context.next.modelItem.length === initialIndex) {
    return {
      previousContext: context,
      type: context.type,
      bag: context.bag,
      path: nextPath,
    };
  }
  const ifItem = context.next.ifItem[field];
  const firstItem = context.next.modelItem[initialIndex];
  const { operationType } = getOperation(ifItem, context.references, context.functions);
  return {
    previousContext: context,
    type: context.type,
    isArray: true,
    path: nextPath,
    next: {
      ifItem: ifItem,
      operationType: operationType,
      modelItem: firstItem,
    },
    localBag: { ...context.localBag, index: initialIndex },
    references: context.references,
    functions: context.functions,
    bag: context.bag,
  };
};

export const revisitArrayField = (
  context: Context,
  field?: string,
  onComplete?: (context: Context) => Context
): Context => {
  const nextField = field ?? Object.keys(context.previousContext.next.ifItem)[0];
  const nextIndex = context.localBag.index + 1;
  const array = context.modelItem[nextField];
  if (nextIndex === array.length) {
    return complete(onComplete?.(context) ?? context);
  }
  const nextPath = addPath(context.previousContext.path, nextField);
  const ifItem = context.previousContext.next.ifItem[field];

  const { operationType } = getOperation(ifItem, context.references, context.functions);
  return {
    ...context,
    path: nextPath,
    next: {
      ifItem: ifItem,
      operationType: operationType,
      modelItem: array[nextIndex],
    },
    localBag: { ...context.localBag, index: nextIndex },
  };
};
