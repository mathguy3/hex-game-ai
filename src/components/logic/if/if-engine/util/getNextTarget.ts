import { getTargetValue } from './getTargetValue';

export const getNextTarget = (context: any, path: string) => {
  const currentTarget = context.selected
    ? getTargetValue(context.selected)
    : context;

  const result = context.model[path]
    ? { parent: context.model, field: path }
    : currentTarget?.[path]
    ? { parent: currentTarget, field: path }
    : undefined;

  return result;
};
