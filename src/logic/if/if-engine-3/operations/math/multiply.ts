import { complete } from '../../utils/complete';
import { evalField } from '../../utils/evalField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const multiply = {
  requiredFields: ['multiply'],
  alternateFields: ['times', 'x'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, multiply);
    return { ...evalField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    if (typeof context.bag.result !== 'number' || typeof context.modelItem !== 'number') {
      throw new Error('Multiply operation can only be used on numbers');
    }

    const result = context.bag.result * context.modelItem;
    return complete(context, result);
  },
};
