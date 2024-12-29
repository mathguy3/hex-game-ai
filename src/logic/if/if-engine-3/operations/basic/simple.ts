import { addPath } from '../../utils/addPath';
import { Context } from '../types';

// type Map from $String/Object/Array/Number/Boolean to the value
const map = {
  $String: 'string',
  $Object: 'object',
  $Array: 'array',
  $Number: 'number',
  $Boolean: 'boolean',
};

export const simple = {
  requiredFields: [],
  optionalFields: [],
  alternateFields: [],
  isLeaf: true,
  startOp: (context: Context) => {
    const item = context.ifItem;
    if (typeof item !== 'string' && typeof item !== 'number' && typeof item !== 'boolean') {
      throw new Error('Simple operation requires a simple type' + JSON.stringify(item));
    }
    context.bag.result = item;
    let path = addPath(context.path, context.bag.result);
    if (map[context.ifItem]) {
      context.bag.result = context.modelItem;
      path = addPath(context.path, context.ifItem);
    }
    //console.log('simple complete', context.path, context.modelItem, context.bag.result);
    return {
      type: 'eval',
      previousContext: context,
      bag: context.bag,
      path: path,
      operationType: 'simple',
    };
  },
  revisitOp: (context: Context) => {
    return { ...context, isComplete: true };
  },
};
