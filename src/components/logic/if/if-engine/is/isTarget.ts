import { IFObject, IFValue } from '../../../../../types/actions/if';
import { isIF } from './isIf';
import { isIfCompare } from './isIfCompare';
import { isIfMath } from './isIfMath';
import { isIfVector } from './isIfVector';

export const isTarget = (ifValue: IFValue): ifValue is IFObject => {
  const isObject = typeof ifValue === 'object';
  const isTarget =
    isObject &&
    !isIfVector(ifValue) &&
    !isIfCompare(ifValue) &&
    !isIfMath(ifValue) &&
    !isIF(ifValue) &&
    !Array.isArray(ifValue) &&
    !!Object.keys(ifValue).length;

  return isTarget;
};
