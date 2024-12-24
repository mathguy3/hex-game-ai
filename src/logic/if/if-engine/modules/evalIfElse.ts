import { isIfElse } from '../is/isIfElse';
import { IFContext } from '../types';
import { getFields } from '../util/getFields';
import { selectField } from '../util/selectField';
import { getIf } from './getIf';
import { selectIfValue } from './selectIfValue';

export const evalIfElse = (context: IFContext): boolean => {
  const { ifValue: ifElse } = context;
  if (!isIfElse(ifElse)) {
    throw new Error("Can't do ifelse on not ifelse");
  }
  //console.log('---------');
  const ifResult = getIf({ ...context, ifValue: ifElse.if, type: 'if' });
  //console.dir(ifElse.if, { depth: null });
  //console.log(ifResult);
  if (ifResult) {
    const { field } = getFields(ifElse.then);
    return selectIfValue(selectField({ ...context, ifValue: ifElse.then }, field));
  } else {
    const { field } = getFields(ifElse.else);
    return selectIfValue(selectField({ ...context, ifValue: ifElse.else }, field));
  }
};
