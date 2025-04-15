import { complete } from '../../utils/complete';
import { evalIfField, revisitIfField } from '../../utils/evalIfField';
import { Context } from '../types';

export const action = {
  requiredFields: ['action'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    return {
      ...evalIfField(context),
      type: 'eval',
    };
  },
  revisitOp: (context: Context) => {
    if (context.localBag.isActionRun) {
      return complete(context);
    }
    const action = context.bag.result;
    const field = Object.keys(action)[0];
    return {
      ...revisitIfField(context, field),
      localBag: { ...context.localBag, isActionRun: true },
      type: context.previousContext.type,
    };
  },
};
