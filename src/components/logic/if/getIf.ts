import {
  IF,
  IFArrayValue,
  IFBooleanValue,
  IFCompare,
  IFFloatValue,
  IFIntValue,
  IFMath,
  IFObjectValue,
  IFStringValue,
  IFTarget,
  IFTargetSelector,
  IFValue,
  IFVector,
} from '../../../types/actions/if';

type TargetContext = {
  parent: any;
  field: any;
};
type IFContext = {
  type: 'if' | 'set' | 'eval';
  subject?: TargetContext;
  target?: TargetContext;
  context?: TargetContext;
  path: string;
  state: any;
};

const defaultIf = { type: 'if' as const, path: '', state: {} };
const defaultSet = { type: 'set' as const, path: '', state: {} };

export const evalSet = (ifDef: IF, context?: Partial<IFContext>) => {
  return getIf(ifDef, { ...defaultSet, ...context });
};

export const evalIf = (ifDef: IF, context?: Partial<IFContext>) => {
  const result = getIf(ifDef, { ...defaultIf, ...context });
  if (context.type === 'if') {
    console.log('result of ', ifDef, context, result);
  }
  return result;
};

const getIf = (ifDef: IF, context: IFContext) => {
  return 'and' in ifDef
    ? getAndIf(ifDef, context)
    : 'or' in ifDef
    ? getOrIf(ifDef, context)
    : evalSingleIf(ifDef, context);
};

const getAndIf = (ifAnd: IF, context: IFContext) => {
  if (!('and' in ifAnd)) {
    throw new Error('No and in def');
  }

  return ifAnd.and.every((x) => getIf(x, context));
};

const getOrIf = (ifAnd: IF, context: IFContext) => {
  if (!('or' in ifAnd)) {
    throw new Error('No or in def');
  }

  return ifAnd.or.some((x) => getIf(x, context));
};

const evalSingleIf = (
  ifTargetSelector: IFTargetSelector,
  context: IFContext
) => {
  const targetKey = getTargetKey(ifTargetSelector);
  if (!context[targetKey]) {
    throw new Error(
      `Incorrect definition. Expected "${targetKey}" on context based on ${JSON.stringify(
        ifTargetSelector
      )}`
    );
  }
  return evalIfTarget(
    ifTargetSelector[targetKey],
    context[targetKey],
    addPath(context, targetKey)
  );
};

const evalIfTarget = (
  ifTarget: IFTarget,
  target: TargetContext,
  context: IFContext
) => {
  let [field, ifValue] = Object.entries(ifTarget)[0];
  let nextTarget = { parent: getValue(target), field };

  console.log(
    'Our current target is the field -',
    field,
    '- and for data, we get that from',
    getValue(target)
  );

  const canTarget =
    !(context.type == 'eval' || context.type == 'if') || !!nextTarget.parent;

  if (context.type == 'set' && nextTarget.parent === undefined) {
    console.log('target is undefined, auxiliary measures');
    nextTarget.parent = {};
    if (!target.parent[target.field]) {
      target.parent[target.field] = nextTarget.parent;
    }
  }

  if (isTarget(ifValue) && canTarget) {
    console.log(
      "We're not going to save that value, we're going to retarget to",
      ifValue,
      getValue(nextTarget)
    );
    return evalIfTarget(ifValue, nextTarget, addPath(context, field));
  } else {
    if (!canTarget) {
      console.log('Cannot target undefined target, skipping to evaluation');
    }
    console.log('Deciding', ifValue, 'is NOT a target', nextTarget);
    let valueResult;
    let operation = 'default';
    if (isOperation(ifValue)) {
      console.log('is operation!', ifValue, context.type, nextTarget);
      // Skip the current target in this case, since this is just an operation selector
      const [nextField, nextValue] = Object.entries(ifValue)[0];
      operation = nextField;
      const nextNextTarget = { parent: getValue(nextTarget), field: nextField };

      console.log(
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
      console.log('operation value result!', valueResult);
    } else {
      valueResult = evalIfValue(
        ifValue,
        nextTarget,
        addPath(setEval(context), field)
      );
    }

    console.log('Value of', ifValue, nextTarget, 'is', valueResult);
    console.log('returning value', valueResult, 'result of', context.type);
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

  throw new Error('IFTarget passed to if value processor');
};
const setValue = (target: TargetContext, result: any, operation: string) => {
  console.log('setting', result, 'onto', target, target);
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
  console.log('comparing', targetValue, '==', result, '===', isMatch);
  console.log(target);
  return isMatch;
};

const evalIfMath = (
  ifMath: IFMath,
  target: TargetContext,
  context: IFContext
) => {
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
) => {
  const fieldValue = getValue(target);
  const not =
    !ifCompare.greaterThan ||
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

const isTarget = (ifValue: IFValue): ifValue is IFTarget => {
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

const addPath = (context: IFContext, path: string) => {
  const nextPath = context.path + (context.path.length ? '.' : '') + path;
  console.log('path:', nextPath);
  return {
    ...context,
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
