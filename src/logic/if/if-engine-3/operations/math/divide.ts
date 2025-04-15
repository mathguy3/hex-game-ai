import { complete } from '../../utils/complete';
import { evalIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const divide = {
  requiredFields: ['divide'],
  alternateFields: ['/'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, divide);
    return { ...evalIfField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    if (typeof context.bag.result !== 'number' || typeof context.modelItem !== 'number') {
      throw new Error('Divide operation can only be used on numbers');
    }

    const result = context.bag.result / context.modelItem;
    return complete(context, result);
  },
};
