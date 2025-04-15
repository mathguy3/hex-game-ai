import { complete } from '../../utils/complete';
import { evalIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const notEquals = {
  requiredFields: ['notEquals'],
  alternateFields: ['!=', '!=='],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, notEquals);
    return { ...evalIfField(context), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    const result = context.modelItem != context.bag.result;
    return complete(context, result);
  },
};
