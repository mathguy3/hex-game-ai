import { IFValue } from '../../../../../types/actions/if';

export const isSimpleValue = (
  ifValue: IFValue
): ifValue is string | number | boolean => {
  return (
    typeof ifValue === 'string' ||
    typeof ifValue === 'boolean' ||
    typeof ifValue === 'number'
  );
};
