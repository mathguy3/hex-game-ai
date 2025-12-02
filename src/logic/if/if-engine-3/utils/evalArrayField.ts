import { getOperation } from '../getNextOperation';
import { Context } from '../operations/types';
import { addPath } from './addPath';
import { complete } from './complete';

export const evalArrayField = (context: Context, field?: string) => {
  const nextField = field ?? Object.keys(context.next.ifItem)[0];
  const nextPath = addPath(context.path, nextField);

  const initialIndex = 0;
  if ((context.next?.modelItem?.length ?? 0) === initialIndex) {
    return {
      previousContext: context,
      type: context.type,
      path: nextPath,
      operationType: context.next.operationType,
      localBag: { ...context.localBag, index: initialIndex },
      modelItem: context.next.modelItem,
      references: context.references,
      functions: context.functions,
      bag: context.bag,
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
    operationType: context.next.operationType,
    modelItem: context.next.modelItem,
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
  const nextIndex = context.localBag.index + 1;
  const array = context.modelItem;
  if (context.localBag?.itemResults?.length > 10) {
    throw new Error();
  }
  if (nextIndex >= (array?.length ?? 0)) {
    return complete(onComplete?.(context) ?? context);
  }
  const ifItem = context.previousContext.next.ifItem[field];

  const { operationType } = getOperation(ifItem, context.references, context.functions);
  return {
    ...context,
    next: {
      ifItem: ifItem,
      operationType: operationType,
      modelItem: array[nextIndex],
    },
    localBag: { ...context.localBag, index: nextIndex },
  };
};
