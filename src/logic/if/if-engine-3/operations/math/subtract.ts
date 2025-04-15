import { complete } from '../../utils/complete';
import { evalField } from '../../utils/evalField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const subtract = {
  requiredFields: ['subtract'],
  alternateFields: ['minus'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, subtract);
    return { ...evalField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    if (typeof context.bag.result !== 'number' || typeof context.modelItem !== 'number') {
      throw new Error('Subtract operation can only be used on numbers');
    }

    const result = context.modelItem - context.bag.result;
    return complete(context, result);
  },
};
