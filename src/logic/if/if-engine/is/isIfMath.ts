import { IFMath, IFValue } from '../../../../types/actions/if';

export function isIfMath(ifValue: IFValue): ifValue is IFMath {
  return (
    typeof ifValue === 'object' &&
    ('add' in ifValue || 'subtract' in ifValue || 'multiply' in ifValue || 'divide' in ifValue)
  );
}
