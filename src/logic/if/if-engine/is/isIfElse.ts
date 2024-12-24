import { IFElse, IFValue } from '../../../../types/actions/if';

export function isIfElse(ifValue: IFValue): ifValue is IFElse {
  return typeof ifValue === 'object' && 'if' in ifValue && 'then' in ifValue;
}
