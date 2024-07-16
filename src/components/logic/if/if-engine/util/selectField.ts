import { IFContext } from '../types';
import { getNextTarget } from './getNextTarget';
import { log } from './log';

export const selectField = (
  context: IFContext,
  path: string,
  isOperation?: boolean
): IFContext => {
  const nextPath = context.path + (context.path.length ? '.' : '') + path;

  const nextTarget = getNextTarget(context, path);
  log(
    'selecting path:',
    '',
    path,
    nextPath,
    nextTarget,
    isOperation,
    context.selected
  );
  return {
    ...context,
    ifValue: context.ifValue[path],
    selected: isOperation ? context.selected : nextTarget,
    path: nextPath,
  };
};
