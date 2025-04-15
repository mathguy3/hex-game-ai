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
      throw new Error('Key statement requires a string result to work');
    }

    const nextModelKey = context.bag.result;
    //console.log('key', context, nextModelKey);
    const nextContext = {
      ...revisitField(context, 'value', nextModelKey),
      type: context.previousContext.type,
      localBag: { key: nextModelKey },
    };
    //console.log('key next context', nextContext);
    return nextContext;
  },
};
