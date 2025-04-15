import { complete } from '../../utils/complete';
import { evalField } from '../../utils/evalField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const not = {
  requiredFields: ['not'],
  alternateFields: ['!'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, not);
    return { ...evalField(context), type: 'if' };
  },
  revisitOp: (context: Context) => {
    return complete(context, !context.bag.result);
  },
};
