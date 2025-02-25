import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';
import { getProcedure } from '../../getProcedure';

export const not = {
  requiredFields: ['not'],
  alternateFields: ['!'],
  optionalFields: [],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1 || keys[0] !== 'not') {
      throw new Error('Field operation requires exactly one field' + JSON.stringify(keys));
    }
    const notItem = context.ifItem.not;

    const { operationType } = getOperation(notItem);
    const nextPath = addPath(context.path, 'not');
    return {
      previousContext: context,
      type: 'if',
      operationType: 'not',
      bag: context.bag,
      path: nextPath,

      nextOperation: operationType,
      modelItem: context.modelItem,
      ifItem: getProcedure(notItem, context.procedures),
    };
  },
  revisitOp: (context: Context) => {
    if (context.previousContext.type == 'set') {
      throw new Error('Not operation cannot be used for a set operation');
    }
    return {
      ...context,
      bag: { ...context.bag, result: !context.bag.result },
      isComplete: true,
    };
  },
};
