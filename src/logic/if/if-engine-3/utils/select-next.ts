import { getNextOperation, getOperation } from '../getNextOperation';
import { Context } from '../operations/types';
import { addPath } from './addPath';
import { getProcedure } from '../getProcedure';

export const selectNext = (context: Context) => {
  const { fields } = getNextOperation(context);
  const nextIfItem = context.ifItem[fields[0]];
  const operationType = getOperation(nextIfItem).operationType;
  const nextPath = addPath(context.path, fields[0]);
  let nextModelItem = context.modelItem?.[fields[0]];
  if (!nextModelItem && context.bag.model?.[fields[0]]) {
    nextModelItem = context.bag.model?.[fields[0]];
  }
  return {
    type: context.type,
    previousContext: context,
    path: nextPath,
    modelItem: nextModelItem,
    ifItem: getProcedure(nextIfItem, context.procedures),
    bag: context.bag,
    nextOperation: operationType,
  };
};

export const select = (context: Context) => {
  const { fields, operationType } = getOperation(context.ifItem);
  console.log('selecting next', context.path, fields, operationType);
  const nextPath = addPath(context.path, fields[0]);
  return {
    type: context.type,
    previousContext: context,
    path: nextPath,
    modelItem: context.modelItem?.[fields[0]],
    ifItem: getProcedure(context.ifItem[fields[0]], context.procedures),
    bag: context.bag,
    nextOperation: operationType,
  };
};
