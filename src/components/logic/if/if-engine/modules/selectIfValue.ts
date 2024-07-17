import { isIF } from '../is/isIf';
import { isIfCompare } from '../is/isIfCompare';
import { isIfMath } from '../is/isIfMath';
import { isIfVector } from '../is/isIfVector';
import { isKeyValue } from '../is/isKeyValue';
import { isSimpleValue } from '../is/isSimpleValue';
import { isTarget } from '../is/isTarget';
import { IFContext } from '../types';
import { getFields } from '../util/getFields';
import { getTargetValue } from '../util/getTargetValue';
import { selectField } from '../util/selectField';
import { evalIfCompare } from './evalIfCompare';
import { evalIfMath } from './evalIfMath';
import { getIf } from './getIf';
import { getKeyValue } from './getKeyValue';
import { getSimpleValue } from './getSimpleValue';

const evalByType = {
  if: (context, value) => value === getTargetValue(context.selected),
  set: (context, value) => {
    context.selected.parent[context.selected.field] = value;
    return true;
  },
  eval: (_context, value) => value,
};

export const selectIfValue = (context: IFContext) => {
  const { ifValue } = context;

  if (isSimpleValue(ifValue)) {
    const value = getSimpleValue(ifValue, context);
    return evalByType[context.type](context, value);
  }
  if (!Object.keys(ifValue).length) {
    console.log('selected empty object');
    return ifValue;
  }
  const { field } = getFields(ifValue);

  const ifMap: Record<string, (c: IFContext) => any> = {
    or: getIf,
    and: getIf,
    target: getIf,
    subject: getIf,
    context: getIf,
  };

  let ifResult;
  if (isIF(ifValue)) {
    ifResult = ifMap[field]({ ...context, type: 'eval' });

    if (ifResult) {
      return evalByType[context.type](context, ifResult);
    }
  } else {
    if (isKeyValue(ifValue)) {
      ifResult = getKeyValue(selectField(context, field));
    } else if (isIfCompare(ifValue)) {
      ifResult = evalIfCompare(context); // operation
    } else if (isIfMath(ifValue)) {
      ifResult = evalIfMath(context); // operation
    } else if (isIF(ifValue)) {
      ifResult = getIf(context);
    } else if (isIfVector(ifValue) || Array.isArray(ifValue)) {
      ifResult = ifValue;
    } else if (isTarget(ifValue)) {
      ifResult = selectIfValue(selectField(context, field));
    }

    if (isIfMath(ifValue)) {
      return evalByType[context.type](context, ifResult);
    }
  }

  return ifResult;
};
