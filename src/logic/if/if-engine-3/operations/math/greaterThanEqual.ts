import { complete } from '../../utils/complete';
import { evalIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const greaterThanEqual = {
  requiredFields: ['greaterThanEqual'],
  alternateFields: ['>='],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, greaterThanEqual);
    return { ...evalIfField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    if (typeof context.bag.result !== 'number' || typeof context.modelItem !== 'number') {
      throw new Error('Greater than equal operation can only be used on numbers');
    }

    const result = context.bag.result >= context.modelItem;
    return complete(context, result);
  },
};
