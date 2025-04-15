import { doOp } from './doOp';
import { ContextProps } from './types';

export const doSet = (context: ContextProps) => {
  return doOp(context, 'set').modelItem;
};
