import { IFValue } from '../../../../types/actions/if';
import { isIfCompare } from './isIfCompare';
import { isIfMath } from './isIfMath';

export const isOperation = (ifValue: IFValue) => {
  const isObject = typeof ifValue === 'object';
  return isObject && (isIfCompare(ifValue) || isIfMath(ifValue));
};
