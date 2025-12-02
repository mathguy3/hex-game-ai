import { addPath } from '../../utils/addPath';
import { Context } from '../types';

// type Map from $String/Object/Array/Number/Boolean to the value
const map = {
  $String: 'string',
  $Object: 'object',
  $Array: 'array',
  $Number: 'number',
  $Boolean: 'boolean',
  $Action: 'action',
};

export const simple = {
  requiredFields: [],
  optionalFields: [],
  alternateFields: [],
  isLeaf: true,
  startOp: (context: Context) => {
    const item = context.next.ifItem;
    //console.log('simple', item);
    if (typeof item !== 'string' && typeof item !== 'number' && typeof item !== 'boolean' && item !== null) {
      throw new Error('Simple operation requires a simple type' + JSON.stringify(item));
    }
    context.bag.result = item;
    let path = addPath(context.path, context.bag.result);
    if (map[context.next.ifItem]) {
      context.bag.result = context.next.modelItem;
      //console.log('simple result', context.bag.result);
      path = addPath(context.path, context.next.ifItem);
    }
    //console.log('simple complete', context.path, context.modelItem, context.bag.result);
    return {
      previousContext: context,
      type: 'eval',
      path: path,
      operationType: 'simple',
      bag: context.bag,
    };
  },
  revisitOp: (context: Context) => {
    return { ...context, isComplete: true };
  },
};
