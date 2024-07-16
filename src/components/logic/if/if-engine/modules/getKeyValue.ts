import { isKeyValue } from '../is/isKeyValue';
import { IFContext } from '../types';
import { selectField } from '../util/selectField';
import { selectIfValue } from './selectIfValue';

export const getKeyValue = (context: IFContext) => {
  const { ifValue } = context;
  if (!isKeyValue(ifValue)) {
    throw new Error('how dare you');
  }
  const { key, value } = ifValue;
  const keyResult = selectIfValue(selectField(context, 'key'));
  // Use the referenced key to select the apropriate value from the model
  const keyedContext = { ...context, ifValue: { key, [keyResult]: value } };
  return selectIfValue(selectField(keyedContext, keyResult));
};
