import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const notEquals = {
  requiredFields: ['notEquals'],
  optionalFields: [],
  alternateFields: ['!='],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1 || keys[0] !== 'notEquals') {
      throw new Error('Field operation requires exactly one field' + JSON.stringify(keys));
    }
    const nextContext = selectNext(context);
    return {
      ...nextContext,
      type: 'eval',
      modelItem: context.modelItem,
      operationType: 'notEquals',
    };
  },
  revisitOp: (context: Context) => {
    if (context.previousContext.type == 'set') {
      throw new Error('Set notEquals operation invalid' + JSON.stringify(context.previousContext));
    }
    context.bag.result = context.modelItem != context.bag.result;
    return { ...context, isComplete: true };
  },
};
