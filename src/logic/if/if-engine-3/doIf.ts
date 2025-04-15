import { doOp } from './doOp';
import { ContextProps } from './types';

export const doIf = (context: ContextProps) => {
  return doOp(context, 'if').bag.result;
};
