import { IFValue, IFVector } from '../../../../../types/actions/if';

export function isIfVector(ifValue: IFValue): ifValue is IFVector {
  return (
    typeof ifValue === 'object' &&
    ('q' in ifValue || 'r' in ifValue || 's' in ifValue)
  );
}
