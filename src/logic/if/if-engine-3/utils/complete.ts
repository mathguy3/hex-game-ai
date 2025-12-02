import { Context } from '../operations/types';

export const complete = (context: Context, result?: any) => {
  //console.log('complete', context.path, context.bag.result, result);
  return { ...context, isComplete: true, bag: { ...context.bag, result: result ?? context.bag.result } };
};
