import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const equals = {
  requiredFields: ['equals'],
  optionalFields: [],
  alternateFields: ['=', '=='],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1 || (!equals.requiredFields.includes(keys[0]) && !equals.alternateFields.includes(keys[0]))) {
      throw new Error('Field operation requires exactly one field' + JSON.stringify(keys));
    }
    const nextContext = selectNext(context);
    return {
      ...nextContext,
      type: 'eval',
      modelItem: context.modelItem,
      operationType: 'equals',
    };
  },
  revisitOp: (context: Context) => {
    if (context.previousContext.type == 'set') {
      if (!('field' in context.previousContext) || !context.previousContext.previousContext) {
        throw new Error('Set equals operation invalid' + JSON.stringify(context.previousContext));
      }
      const field = context.previousContext.field;
      context.previousContext.previousContext.modelItem[field] = context.bag.result;
    } else {
      context.bag.result = context.modelItem == context.bag.result;
    }
    return { ...context, isComplete: true };
  },
};
