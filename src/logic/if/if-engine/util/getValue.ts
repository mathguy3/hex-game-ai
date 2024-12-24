import { TargetContext } from '../types';

export const getValue = (target: TargetContext) => {
  return !target?.parent ? undefined : target.parent[target.field];
};
