import { complete } from '../../utils/complete';
import { evalIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const add = {
  requiredFields: ['add'],
  alternateFields: ['plus'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, add);
    return { ...evalIfField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    if (typeof context.bag.result !== 'number' || typeof context.modelItem !== 'number') {
      console.log('add', context.bag.result, context.modelItem);
      throw new Error('Add operation can only be used on numbers');
    }

    console.log('add', context.bag.result, context.modelItem);
    return complete(context, context.bag.result + context.modelItem);
  },
};
