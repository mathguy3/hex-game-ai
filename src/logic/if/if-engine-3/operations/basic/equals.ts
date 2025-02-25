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
    //console.log('equals', context);
    const nextContext = selectNext(context);
    //console.log('equals', context, nextContext);
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
      //console.log('equals set', context.previousContext.previousContext, field, context.bag.result);
      context.previousContext.previousContext.modelItem[field] = context.bag.result;
    } else {
      //console.log('equals', context, context.bag.result);
      context.bag.result = context.modelItem == context.bag.result;
    }
    return { ...context, isComplete: true };
  },
};
