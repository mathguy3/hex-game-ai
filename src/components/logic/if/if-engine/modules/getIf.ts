import { isIF } from '../is/isIf';
import { IFContext } from '../types';
import { getFields } from '../util/getFields';
import { selectField } from '../util/selectField';
import { selectIfValue } from './selectIfValue';

export const getIf = (context: IFContext) => {
  const ifDef = context.ifValue;
  if (!isIF(ifDef)) {
    throw new Error(`Not an if ${JSON.stringify(ifDef)}`);
  }
  const { field } = getFields(ifDef);

  console.log('getIf', field);
  const contextMap: Record<string, (c: IFContext) => any> = {
    and: (c) =>
      'and' in ifDef &&
      ifDef.and.every((ifValue) => selectIfValue({ ...c, ifValue })),
    or: (c) =>
      'or' in ifDef &&
      ifDef.or.some((ifValue) => selectIfValue({ ...c, ifValue })),
    target: (c) => selectIfValue(selectField(c, 'target')),
    subject: (c) => selectIfValue(selectField(c, 'subject')),
    context: (c) => selectIfValue(selectField(c, 'context')),
  };
  return contextMap[field](context);
};
