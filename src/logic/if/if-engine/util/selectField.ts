import { IFContext } from '../types';
import { getNextTarget } from './getNextTarget';
import { getTargetValue } from './getTargetValue';
import { log } from './log';

export const selectField = (context: IFContext, path: string, isOperation?: boolean): IFContext => {
  const nextPath = context.path + (context.path.length ? '.' : '') + path;

  let nextTarget = getNextTarget(context, path);
  //console.log(context, path, nextTarget);
  if (getTargetValue(nextTarget)?.parent) {
    //console.log('next target target');
    nextTarget = getTargetValue(nextTarget);
  }
  log('selecting path:', '', path, nextPath, nextTarget, isOperation, context.selected);
  const nextSelected = isOperation ? context.selected : nextTarget;
  return {
    ...context,
    ifValue: context.ifValue[path],
    selected: nextSelected,
    selectedParent: context.selected,
    path: nextPath,
  };
};
