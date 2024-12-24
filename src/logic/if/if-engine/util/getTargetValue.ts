import { TargetContext } from '../types';

export const getTargetValue = (target: TargetContext) => {
  return target?.parent?.[target.field];
};
