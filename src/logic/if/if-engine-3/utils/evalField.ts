import { getOperation } from '../getNextOperation';
import { Context } from '../operations/types';
import { addPath } from './addPath';

export const evalField = (context: Context, field?: string, modelField?: string) => {
  const nextField = field ?? Object.keys(context.next.ifItem)[0];
  const nextIfItem = context.next.ifItem[nextField];
  const { operationType } = getOperation(nextIfItem, context.references, context.functions);
  const nextPath = addPath(context.path, nextField);

  return {
    previousContext: context,
    type: context.type,
    path: nextPath,
    next: {
      ifItem: nextIfItem,
      operationType: operationType,
      modelItem: context.next.modelItem?.[modelField ?? nextField],
    },
    operationType: context.next.operationType,
    modelItem: context.next.modelItem,
    references: context.references,
    functions: context.functions,
    bag: context.bag,
  };
};

export const revisitField = (context: Context, field?: string, modelField?: string) => {
  const nextField = field ?? Object.keys(context.previousContext.next.ifItem)[0];
  const nextIfItem = context.previousContext.next.ifItem[nextField];
  const { operationType } = getOperation(nextIfItem, context.references, context.functions);
  //const nextPath = addPath(context.previousContext.path, nextField);
  /*console.log(
    'revisitField',
    context.bag,
    context.previousContext.next.modelItem,
    context.previousContext.modelItem,
    context.previousContext.next.ifItem,
    nextField,
    modelField
  );*/
  const nextModelItem = context.modelItem[modelField ?? nextField];
  return {
    ...context,
    //path: nextPath,
    next: {
      ifItem: nextIfItem,
      operationType: operationType,
      modelItem: nextModelItem,
    },
  };
};
