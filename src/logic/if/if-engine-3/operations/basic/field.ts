import { complete } from '../../utils/complete';
import { evalField } from '../../utils/evalField';
import { Context } from '../types';

export const field = {
  requiredFields: [],
  optionalFields: [],
  alternateFields: [],
  startOp: (context: Context) => {
    const keys = Object.keys(context.next.ifItem);
    if (keys.length !== 1) {
      throw new Error('Field operation requires exactly one field');
    }
    const field = keys[0];
    const updatedContext = evalField(context);
    if (!updatedContext.next.modelItem) {
      console.log('loading unknown field', field, Object.keys(updatedContext.bag.model), context.bag.references);
      if (context.bag.references?.[field]) {
        console.log('loading reference field', field, context.bag.references[field]);
        updatedContext.next.modelItem = context.bag.references[field];
      } else if (updatedContext.bag.model?.[field]) {
        updatedContext.next.modelItem = updatedContext.bag.model[field];
        console.log('loading model field', field, updatedContext.next.modelItem);
      } else {
        console.log('field loaded', field, updatedContext.next.modelItem);
      }
    } else {
      console.log('field loaded', field, updatedContext.next.modelItem);
    }
    return {
      ...updatedContext,
      field: keys[0],
    };
  },
  revisitOp: (context: Context) => {
    return complete(context);
  },
};
