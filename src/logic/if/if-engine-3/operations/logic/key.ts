import { Context } from '../types';
import { validateFields } from '../../utils/validateFields';
import { evalIfField } from '../../utils/evalIfField';
import { complete } from '../../utils/complete';
import { revisitField } from '../../utils/evalField';

export const key = {
  requiredFields: ['key', 'value'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, key);

    return { ...evalIfField(context, 'key'), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    if (context.localBag?.key !== undefined) {
      return complete(context);
    }

    if (typeof context.bag.result !== 'string') {
      return complete(context, null);
      //throw new Error('Key statement requires a string result to work');
    }

    const nextModelKey = context.bag.result;
    const nextContext = {
      ...revisitField(context, 'value', nextModelKey),
      type: context.previousContext.type,
      localBag: { key: nextModelKey },
    };
    return nextContext;
  },
};
