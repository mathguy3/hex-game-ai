import { complete } from '../../utils/complete';
import { evalIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const root = {
  requiredFields: ['root'],
  alternateFields: ['√', 'sqrt'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, root);
    return { ...evalIfField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    if (typeof context.bag.result !== 'number' || typeof context.modelItem !== 'number') {
      throw new Error('Root operation can only be used on numbers');
    }

    const result = Math.sqrt(context.bag.result);
    return complete(context, result);
  },
};
