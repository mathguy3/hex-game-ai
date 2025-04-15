import { getOperation } from '../getNextOperation';
import { Context } from '../operations/types';
import { addPath } from './addPath';

export const evalIfField = (context: Context, field?: string) => {
  console.log('evalIfField', context.next.ifItem, field);
  const nextField = field ?? Object.keys(context.next.ifItem)[0];
  const nextIfItem = context.next.ifItem[nextField];
  //console.log('evalIfField', nextIfItem, context.functions);
  const { operationType } = getOperation(nextIfItem, context.references, context.functions);
  const nextPath = addPath(context.path, nextField);
  return {
    previousContext: context,
    type: context.type,
    path: nextPath,
    next: {
      ifItem: nextIfItem,
      operationType: operationType,
      modelItem: context.next.modelItem,
    },
    operationType: context.next.operationType,
    modelItem: context.next.modelItem,
    references: context.references,
    functions: context.functions,
    bag: context.bag,
  };
};

export const revisitIfField = (context: Context, field?: string) => {
  const nextField = field ?? Object.keys(context.previousContext.next.ifItem)[0];
  const nextIfItem = context.previousContext.next.ifItem[nextField];
  const { operationType } = getOperation(nextIfItem, context.references, context.functions);
  //const nextPath = addPath(context.previousContext.path, nextField);
  return {
    ...context,
    //path: nextPath,
    next: {
      ifItem: nextIfItem,
      operationType: operationType,
      modelItem: context.modelItem,
    },
  };
};
