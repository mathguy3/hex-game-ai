/*import {
  IF,
  IFArrayValue,
  IFBooleanValue,
  IFCompare,
  IFFloatValue,
  IFIntValue,
  IFKeyValue,
  IFMath,
  IFObject,
  IFObjectValue,
  IFStringValue,
  IFTargetSelector,
  IFValue,
  IFVector,
} from '../../../types/actions/if';

type TargetContext = {
  parent: any;
  field: string;
};
export type IFContext = {
  type: 'if' | 'set' | 'eval';
  ifValue?: IFValue;
  subject?: TargetContext;
  target?: TargetContext;
  context?: TargetContext;
  selected?: TargetContext;
  path: string;
  state: any;
};

const log = (...args: any[]) => console.log(...args);

const defaultIf = { type: 'if' as const, path: '', state: {} };
const defaultSet = { type: 'set' as const, path: '', state: {} };

export const evalSet = (ifValue: IF, context?: Partial<IFContext>) => {
  return getIf({ ...defaultSet, ...context, ifValue });
};

export const evalIf = (ifValue: IF, context?: Partial<IFContext>) => {
  console.log('eval start', ifValue, context);
  const result = getIf({ ...defaultIf, ...context, ifValue });
  if (context.type === 'if') {
    log('result of ', context, result);
  }
  return result;
};

const getIf = (context: IFContext) => {
  const ifDef = context.ifValue;
  if (!isIF(ifDef)) {
    throw new Error(`Not an if ${JSON.stringify(ifDef)}`);
  }
  const { field } = getFields(ifDef);

  const contextMap: Record<string, (c: IFContext) => any> = {
    and: (c) =>
      'and' in ifDef &&
      ifDef.and.every((ifValue) => getIfValue({ ...c, ifValue })),
    or: (c) =>
      'or' in ifDef &&
      ifDef.or.some((ifValue) => getIfValue({ ...c, ifValue })),
    target: (c) => getIfValue(selectField(c, 'target')),
    subject: (c) => getIfValue(selectField(c, 'subject')),
    context: (c) => getIfValue(selectField(c, 'context')),
  };
  return contextMap[field](context);
};

const getIfValue = (context: IFContext) => {
  const { ifValue, target } = context;
  if (isSimpleValue(ifValue)) {
    return evalSimpleValue(ifValue, context);
  }
  if (!Object.keys(ifValue).length) {
    return ifValue;
  }
  const { field } = getFields(ifValue);

  const ifMap: Record<string, (c: IFContext) => any> = {
    or: (c) => getIf(c),
    and: (c) => getIf(c),
    target: (c) => getIf(c),
    subject: (c) => getIf(c),
    context: (c) => getIf(c),
  };

  let ifResult = ifMap[field]?.(context);
  let isOperation = false;
  if (ifResult === undefined) {
    if (isKeyValue(ifValue)) {
      ifResult = getKeyValue(context);
    } else if (isIfCompare(ifValue)) {
      ifResult = evalIfCompare(ifValue, target, context); // operation
      isOperation = true;
    } else if (isIfMath(ifValue)) {
      ifResult = evalIfMath(ifValue, target, context); // operation
      isOperation = true;
    } else if (isIF(ifValue)) {
      ifResult = getIf(context);
    } else if (isIfVector(ifValue) || Array.isArray(ifValue)) {
      ifResult = ifValue;
    }
  }

  if (context.type === 'set') {
  }

  // TODO handle differences with if/set here

  return ifResult;
};

const getKeyValue = (context: IFContext) => {
  const { ifValue } = context;
  if (!isKeyValue(ifValue)) {
    throw new Error('how dare you');
  }
  const { key, value } = ifValue;
  const keyResult = getIfValue(selectField(context, 'key'));
  // Use the referenced key to select the apropriate value from the model
  const keyedContext = { ...context, ifValue: { key, [keyResult]: value } };
  return getIfValue(selectField(keyedContext, keyResult));
};

const getObjectValue = (ifValue: IFValue, context: IFContext) => {
  if (!isTarget(ifValue)) {
    throw new Error(`Not a valid target ${JSON.stringify(ifValue)}`);
  }
  const field = Object.keys(ifValue)[0];
  const nextTarget = getNextTarget(context, field);
  if (context.type === 'if') {
    const { compared, operation } = context.state;
    const nextValue = evalIfValue2(selectField(context, field));
    if (context.state.compared) {
      return nextValue;
    }
    return compareOperation();
  }
  //switch operation
  // If
  // get future value
  // if !state.compared
  // use state.operation to compare
  // else return result
  // set
  // get future value
  // set to this item and return updated item
};

const evalSimpleValue = (
  ifValue: string | number | boolean,
  context: IFContext
) => {
  if (typeof ifValue === 'number' || typeof ifValue === 'boolean') {
    return ifValue;
  }
  if (typeof ifValue === 'string') {
    const fieldValue = getValue(context.selected);
    const valueMap = {
      [IFFloatValue]: (v) => parseFloat(v),
      [IFIntValue]: (v) => parseInt(v),
      [IFBooleanValue]: (v) => Boolean(v),
      [IFStringValue]: (v) => v,
      [IFObjectValue]: (v) => v,
      [IFArrayValue]: (v) => v,
    };

    return valueMap[ifValue]?.(fieldValue) ?? ifValue;
  }

  throw new Error(`Invalid ifValue ${JSON.stringify(ifValue)}`);
};

const evalIfTarget = (
  ifTarget: IFObject,
  target: TargetContext,
  context: IFContext
) => {
  let [field, ifValue] = Object.entries(ifTarget)[0];
  let nextTarget = { parent: getValue(target), field };

  log(
    'Our current target is the field -',
    field,
    '- and for data, we get that from',
    getValue(target)
  );

  const canTarget =
    !(context.type == 'eval' || context.type == 'if') || !!nextTarget.parent;

  if (context.type == 'set' && nextTarget.parent === undefined) {
    log('target is undefined, auxiliary measures');
    nextTarget.parent = {};
    if (!target.parent[target.field]) {
      target.parent[target.field] = nextTarget.parent;
    }
  }

  if (isKeyValue(ifValue)) {
    // const field = 'player'
    // const ifValue = { key: {etc..}, value: {etc..}}
    const [keyField, keyValue] = Object.entries(ifValue.key)[0];
    const keyNextTarget = { parent: getValue(nextTarget), field: keyField };

    const keyIf = ifValue.key;
    const keyEvalValue = evalIfValue(
      keyValue,
      keyNextTarget,
      addPath(setEval(context), keyField)
    );
    console.log('Got key value', keyValue);
    const [valueField, valueValue] = Object.entries(ifValue.value)[0];
    const valueNextTarget = { parent: getValue(nextTarget), field: valueField };
    return evalIfValue(
      valueValue,
      valueNextTarget,
      addPath(setEval(context), field)
    );
  }
  if (isTarget(ifValue) && canTarget) {
    log(
      "We're not going to save that value, we're going to retarget to",
      ifValue,
      getValue(nextTarget)
    );
    return evalIfTarget(ifValue, nextTarget, addPath(context, field));
  } else {
    if (!canTarget) {
      log('Cannot target undefined target, skipping to evaluation');
    }
    log('Deciding', ifValue, 'is NOT a target', nextTarget);
    let valueResult;
    let operation = 'default';
    if (isOperation(ifValue)) {
      log('is operation!', ifValue, context.type, nextTarget);
      // Skip the current target in this case, since this is just an operation selector
      const [nextField, nextValue] = Object.entries(ifValue)[0];
      operation = nextField;
      const nextNextTarget = { parent: getValue(nextTarget), field: nextField };

      log(
        'operation active!',
        nextField,
        nextValue,
        context.type,
        nextNextTarget
      );
      valueResult = evalIfValue(
        nextValue,
        nextNextTarget,
        addPath(setEval(context), nextField)
      );
      log('operation value result!', valueResult);
    } else {
      valueResult = evalIfValue(
        ifValue,
        nextTarget,
        addPath(setEval(context), field)
      );
    }

    log('Value of', ifValue, nextTarget, 'is', valueResult);
    log('returning value', valueResult, 'result of', context.type);
    switch (context.type) {
      case 'eval':
        return valueResult;
      case 'if':
        return ifMatch(nextTarget, valueResult, operation);
      case 'set':
        setValue(nextTarget, valueResult, operation);
        return;
    }
  }
};

const evalIfValue = (
  ifValue: IFValue,
  target: TargetContext,
  context: IFContext
) => {
  if (typeof ifValue === 'number' || typeof ifValue === 'boolean') {
    return ifValue;
  }
  if (typeof ifValue === 'string') {
    const fieldValue = getValue(target);
    switch (ifValue) {
      case IFFloatValue:
        const parseResult = parseFloat(fieldValue);
        if (isNaN(parseResult)) {
          throw new Error(`If value not a number`);
        }
        return parseResult;
      case IFIntValue:
        const parseIntResult = parseInt(fieldValue);
        if (isNaN(parseIntResult)) {
          throw new Error(`If value not a number`);
        }
        return parseIntResult;
      case IFBooleanValue:
        const boolean = Boolean(fieldValue);
        return boolean;
      case IFStringValue:
      case IFObjectValue:
      case IFArrayValue:
        return fieldValue;
      default:
        return ifValue;
    }
  }
  if (isIfVector(ifValue)) {
    return ifValue;
  }
  if (isIfCompare(ifValue)) {
    return evalIfCompare(ifValue, target, context);
  }

  if (isIfMath(ifValue)) {
    return evalIfMath(ifValue, target, context);
  }

  if (isIF(ifValue)) {
    return evalIf(ifValue, context);
  }

  if (Array.isArray(ifValue)) {
    return ifValue;
  }

  if (!Object.keys(ifValue).length) {
    return ifValue;
  }

  log(ifValue);
  throw new Error('IFTarget passed to if value processor');
};
const setValue = (target: TargetContext, result: any, operation: string) => {
  log('setting', result, 'onto', target, target);
  target.parent[target.field] = result;
};

const ifMatch = (target: TargetContext, result: any, operation: string) => {
  const targetValue = getValue(target);
  const isEqual = (!targetValue && !result) || targetValue == result;
  switch (operation) {
    case 'default':
      return isEqual;
    case 'not':
      return !isEqual;
  }
  const isMatch = (!targetValue && !result) || targetValue == result;
  log('comparing', targetValue, '==', result, '===', isMatch);
  log(target);
  return isMatch;
};

const getFields = (ifValue: IFValue) => {
  const fields = Object.keys(ifValue);
  const field = fields[0];
  return { fields, field };
};

const evalIfMath = (
  ifMath: IFMath,
  target: TargetContext,
  context: IFContext
): number => {
  if (ifMath.add || ifMath.subtract) {
    let result = getValue(target);
    result = ifMath.add
      ? result + evalIfValue(ifMath.add, target, context)
      : result;
    result = ifMath.subtract
      ? result - evalIfValue(ifMath.subtract, target, context)
      : result;
    return result;
  }

  if (ifMath.multiplyBy || ifMath.divideBy) {
    let result = getValue(target);
    result = ifMath.multiplyBy
      ? result * evalIfValue(ifMath.multiplyBy, target, context)
      : result;
    result = ifMath.divideBy
      ? result / evalIfValue(ifMath.divideBy, target, context)
      : result;
    return result;
  }
  throw new Error('No math defined');
};

const evalIfCompare = (
  ifCompare: IFCompare,
  target: TargetContext,
  context: IFContext
): boolean => {
  const fieldValue = getValue(target);
  const not =
    !ifCompare.not ||
    fieldValue !== evalIfValue(ifCompare.not, target, context);
  const greaterThan =
    !ifCompare.greaterThan ||
    fieldValue > evalIfValue(ifCompare.greaterThan, target, context);
  const lessThan =
    !ifCompare.lessThan ||
    fieldValue < evalIfValue(ifCompare.not, target, context);
  const greaterEqualThan =
    !ifCompare.greaterEqualThan ||
    fieldValue >= evalIfValue(ifCompare.not, target, context);
  const lessEqualThan =
    !ifCompare.lessEqualThan ||
    fieldValue <= evalIfValue(ifCompare.not, target, context);
  return not && greaterThan && lessThan && greaterEqualThan && lessEqualThan;
};

const isSimpleValue = (
  ifValue: IFValue
): ifValue is string | number | boolean => {
  return (
    typeof ifValue === 'string' ||
    typeof ifValue === 'boolean' ||
    typeof ifValue === 'number'
  );
};

const isKeyValue = (ifValue: IFValue): ifValue is IFKeyValue => {
  const isObject = typeof ifValue === 'object';
  return isObject && 'key' in ifValue && 'value' in ifValue;
};

const isTarget = (ifValue: IFValue): ifValue is IFObject => {
  const isObject = typeof ifValue === 'object';
  const isTarget =
    isObject &&
    !isIfVector(ifValue) &&
    !isIfCompare(ifValue) &&
    !isIfMath(ifValue) &&
    !isIF(ifValue) &&
    !Array.isArray(ifValue) &&
    !!Object.keys(ifValue).length;

  return isTarget;
};

const isOperation = (ifValue: IFValue) => {
  const isObject = typeof ifValue === 'object';
  return isObject && (isIfCompare(ifValue) || isIfMath(ifValue));
};

const getNextTarget = (context: IFContext, path: string) => {
  return context[path]
    ? { parent: context, field: path }
    : context.selected?.[path]
    ? { parent: context.selected, field: path }
    : undefined;
};

const selectField = (context: IFContext, path: string): IFContext => {
  const nextPath = context.path + (context.path.length ? '.' : '') + path;
  log('path:', nextPath);
  const nextTarget = getNextTarget(context, path);
  return {
    ...context,
    ifValue: context.ifValue[path],
    selected: nextTarget,
    path: nextPath,
  };
};

const setEval = (context: IFContext) => ({
  ...context,
  type: 'eval' as const,
});

const getValue = (target: TargetContext) => {
  return !target?.parent ? undefined : target.parent[target.field];
};

const getTargetKey = (targetSelector: IFTargetSelector) => {
  return 'target' in targetSelector
    ? 'target'
    : 'subject' in targetSelector
    ? 'subject'
    : 'context';
};

function isIfCompare(ifValue: IFValue): ifValue is IFCompare {
  return (
    typeof ifValue === 'object' &&
    ('not' in ifValue ||
      'greaterThan' in ifValue ||
      'lessThan' in ifValue ||
      'greaterEqualThan' in ifValue ||
      'lessEqualThan' in ifValue)
  );
}

function isIfMath(ifValue: IFValue): ifValue is IFMath {
  return (
    typeof ifValue === 'object' &&
    ('add' in ifValue ||
      'subtract' in ifValue ||
      'multiplyBy' in ifValue ||
      'divideBy' in ifValue)
  );
}

function isIfVector(ifValue: IFValue): ifValue is IFVector {
  return (
    typeof ifValue === 'object' &&
    ('q' in ifValue || 'r' in ifValue || 's' in ifValue)
  );
}

function isIF(ifValue: IFValue): ifValue is IF {
  return (
    typeof ifValue === 'object' &&
    ('or' in ifValue ||
      'and' in ifValue ||
      'target' in ifValue ||
      'subject' in ifValue ||
      'context' in ifValue)
  );
}
*/
