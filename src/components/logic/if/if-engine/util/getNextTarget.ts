import { getTargetValue } from './getTargetValue';

export const getNextTarget = (context: any, path: string) => {
  const currentTarget = context.selected ? getTargetValue(context.selected) : context.model;

  //console.log('getNextTarget', path, context, currentTarget);
  const result = context.model[path]
    ? { parent: context.model, field: path }
    : currentTarget
    ? { parent: currentTarget, field: path }
    : undefined;

  return result;
};
