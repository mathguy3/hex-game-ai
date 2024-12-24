import { IFKeyValue, IFValue } from '../../../../types/actions/if';

export const isKeyValue = (ifValue: IFValue): ifValue is IFKeyValue => {
  const isObject = typeof ifValue === 'object';
  return isObject && 'key' in ifValue && 'value' in ifValue;
};
