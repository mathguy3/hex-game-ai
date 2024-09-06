import { isKeyValue } from '../is/isKeyValue';
import { IFContext } from '../types';
import { selectField } from '../util/selectField';
import { getIf } from './getIf';
import { selectIfValue } from './selectIfValue';

export const evalKeyValue = (context: IFContext): boolean => {
  const { ifValue: ifKeyValue } = context;
  if (!isKeyValue(ifKeyValue)) {
    throw new Error("Can't do ifKeyValue on not ifKeyValue");
  }
  const field = getIf({ ...context, ifValue: ifKeyValue.key, type: 'eval' });

  return selectIfValue({ ...selectField(context, field), ifValue: ifKeyValue.value });
};
