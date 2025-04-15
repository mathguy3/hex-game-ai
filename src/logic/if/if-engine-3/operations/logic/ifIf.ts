import { complete } from '../../utils/complete';
import { evalIfField, revisitIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const ifIf = {
  requiredFields: ['if', 'then'],
  alternateFields: [],
  optionalFields: ['else'],
  startOp: (context: Context) => {
    validateFields(context, ifIf);

    return { ...evalIfField(context, 'if'), type: 'if' };
  },
  revisitOp: (context: Context) => {
    if (context.localBag?.ifResult !== undefined) {
      return complete(context);
    }
    const result = !!context.bag.result;
    return {
      ...revisitIfField(context, result ? 'then' : 'else'),
      type: context.previousContext.type,
      localBag: { ifResult: result },
    };
  },
};
