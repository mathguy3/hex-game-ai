import { complete } from '../../utils/complete';
import { evalIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const equals = {
  requiredFields: ['equals'],
  optionalFields: [],
  alternateFields: ['=', '=='],
  startOp: (context: Context) => {
    validateFields(context, equals);
    return { ...evalIfField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    const { previousContext, ...rest } = context.previousContext;

    if (context.previousContext.type == 'set') {
      if (!('field' in context.previousContext) || !context.previousContext.previousContext) {
        throw new Error('Set equals operation invalid: ' + JSON.stringify(context.previousContext));
      }
      const field = context.previousContext.field;
      context.previousContext.modelItem[field] = context.bag.result;
      return complete(context);
    } else {
      const result = context.modelItem == context.bag.result;
      return complete(context, result);
    }
  },
};
