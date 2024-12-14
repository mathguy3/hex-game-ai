import { sentinelValues } from '../../../../../types/actions/if';
import { isIF } from '../is/isIf';
import { isIfCompare } from '../is/isIfCompare';
import { isIfElse } from '../is/isIfElse';
import { isIfMath } from '../is/isIfMath';
import { isIfVector } from '../is/isIfVector';
import { isKeyValue } from '../is/isKeyValue';
import { isSimpleValue } from '../is/isSimpleValue';
import { isTarget } from '../is/isTarget';
import { IFContext } from '../types';
import { debugLogger } from '../util/debug-logger';
import { getFields } from '../util/getFields';
import { getNextTarget } from '../util/getNextTarget';
import { getTargetValue } from '../util/getTargetValue';
import { selectField } from '../util/selectField';
import { evalIfCompare } from './evalIfCompare';
import { evalIfElse } from './evalIfElse';
import { evalIfMath } from './evalIfMath';
import { evalKeyValue } from './evalKeyValue';
import { getIf } from './getIf';
import { getSimpleValue } from './getSimpleValue';

const evalByType = {
  if: (context, value) => value === getTargetValue(context.selected),
  set: (context, value) => {
    context.selectedParent.parent[context.selectedParent.field] = {
      ...context.selected.parent,
      [context.selected.field]: value,
    };
    return true;
  },
  eval: (_context, value) => value,
};

export const selectIfValue = (context: IFContext) => {
  //console.log("Select If Value", context);
  /*debugLogger.log({
    step: 'Select Value Start',
    path: context.path,
    context
  });*/

  const { ifValue } = context;

  if (isSimpleValue(ifValue)) {
    const value = getSimpleValue(ifValue, context);
    debugLogger.log({
      step: 'Simple Value',
      path: context.path,
      result: value
    });
    // don't want to 'eval' here, only set or if
    const contextType = context.type === 'eval' && typeof ifValue == 'string' && !sentinelValues[ifValue] ? 'if' : context.type;
    return evalByType[contextType](context, value);
  }
  if (!ifValue) {
    console.log('WHATS');
    console.dir(context, { depth: null });
  }
  if (!Object.keys(ifValue).length) {
    //console.log('selected empty object');
    return evalByType[context.type](context, ifValue);
  }
  const { field } = getFields(ifValue);
  if (!getNextTarget(context, field) && context.type === 'set') {
    //console.log('YOURE TELLING ME WHAT', context);
    // TODO: Maybe check if the rest of the chain is assignable
    return evalByType[context.type](context, ifValue);
  }

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
    if (isIfCompare(ifValue)) {
      ifResult = evalIfCompare(context); // operation
    } else if (isIfMath(ifValue)) {
      ifResult = evalIfMath(context); // operation
    } else if (isIfElse(ifValue)) {
      ifResult = evalIfElse(context);
    } else if (isKeyValue(ifValue)) {
      ifResult = evalKeyValue(context);
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
