import { IFCompare, IFValue } from '../../../../../types/actions/if';

export function isIfCompare(ifValue: IFValue): ifValue is IFCompare {
  return (
    typeof ifValue === 'object' &&
    ('equal' in ifValue ||
      'not' in ifValue ||
      'greaterThan' in ifValue ||
      'lessThan' in ifValue ||
      'greaterThanEqual' in ifValue ||
      'lessThanEqual' in ifValue)
  );
}
