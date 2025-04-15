import { doOp } from './doOp';
import { ContextProps } from './types';

export const doEval = (context: ContextProps) => {
  return doOp(context, 'eval').bag.result;
};
