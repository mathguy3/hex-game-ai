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

type Target = Record<string, any>;
type TargetContext = {
  parent: any;
  field: any;
};

export type IFContext = {
  type?: 'if' | 'set' | 'eval';
  subject?: TargetContext;
  target?: TargetContext;
  context?: TargetContext;
  path?: string;
  stableContext?: any;
};

const evalIf = (ifDefinition: IF, ifContext: IFContext) => {
  console.log('Eval if');
  if ('and' in ifDefinition) {
    console.log('evaluating and');
    const andResult = ifDefinition.and.every((x) => evalIf(x, ifContext)); // boolean only
    console.log('and results', andResult);
    return andResult.every((x) => x);
  } else if ('or' in ifDefinition) {
    console.log('evaluating or');
    const orResult = ifDefinition.or.some((x) => evalIf(x, ifContext));
    console.log('or results', orResult);
    return orResult;
  } else {
    console.log('evaluating single if');
    const singleResult = evalIfSelector(ifDefinition, ifContext);
    console.log('single result', singleResult);
    return singleResult;
  }
};

const evalIfSelector = (ifSelector: IFTargetSelector, ifContext: IFContext) => {
  console.log('evaluating if target selector', ifSelector);
  if ('target' in ifSelector) {
    console.log(
      'evaluating if target selector target',
      ifContext.target.parent,
      ifContext.target.field
    );
    const targetResult = evalIfTarget(ifSelector.target, ifContext.target, {
      ...ifContext,
      path: ifContext.path + 'target',
    });
    console.log('if target selector target result', targetResult);
    return targetResult;
  } else if ('subject' in ifSelector) {
    console.log(
      'evaluating if target selector subject',
      ifContext.subject.parent,
      ifContext.subject.field
    );
    const targetResult = evalIfTarget(ifSelector.subject, ifContext.subject, {
      ...ifContext,
      path: ifContext.path + 'subject',
    });
    //console.log('PATH EVALUATION1', ifContext.path, ifContext.path + 'subject');
    console.log('if target selector subject result', targetResult);
    return targetResult;
  } else {
    console.log('evaluating if target selector context');
    const targetResult = evalIfTarget(ifSelector.context, ifContext.context, {
      ...ifContext,
      path: ifContext.path + 'context',
    });
    console.log('if target selector context result', targetResult);
    return targetResult;
  }
};

const evalIfTarget = (
  ifTarget: IFTarget,
  target: TargetContext,
  ifContext: IFContext
) => {
  console.log('evaulating if target, evaluating under:', ifContext.type);
  console.log('evaluation is:', ifTarget);
  console.log('target is:', target);
  // This function should really be the one deciding between eval/if

  // This *has* to restrict to a single field? Or could multiple be set/iffed at once?
  // One for now, but I suppose it could set several
  const [ifTargetField, ifTargetFieldValue] = Object.entries(ifTarget)[0];
  console.log('evaluating field:', ifTargetField);
  if (!ifTargetField) {
    return false;
  }
  //console.log('field type', ifTargetField, typeof ifTargetFieldValue);

  const evalContext =
    typeof ifTargetFieldValue === 'object'
      ? { ...ifContext, path: ifContext.path + '.' + ifTargetField }
      : {
          ...ifContext,
          type: 'eval' as const,
          path: ifContext.path + '.' + ifTargetField,
        };
  //console.log('PATH EVALUATION2', ifContext.path, evalContext.path);
  if (!target.parent) {
    /*console.log(
      'Creating parent for field',
      target.parent,
      target.field,
      ifTargetField,
      ifTargetFieldValue
    );*/
    target.parent = {};
  }

  console.log(
    'evaluating field',
    ifTargetField,
    evalContext,
    typeof ifTargetFieldValue === 'object'
  );
  const targetResult = evalIfValue(
    ifTargetFieldValue,
    target.parent[target.field],
    ifTargetField,
    evalContext
  );

  console.log(
    'evaluation of field',
    ifTargetField,
    'result',
    targetResult,
    evalContext
  );
  if (ifContext.stableContext.hasSet) {
    return targetResult;
  }
  if (ifContext.type === 'if') {
    console.log('calculation of equality', targetResult, target, ifTargetField);
    const finalIfResult = evalIfResult(
      targetResult,
      target.parent[target.field]?.[ifTargetField]
    );
    ifContext.stableContext.hasSet = true;
    console.log('final if result', finalIfResult, ifContext.path);
    return finalIfResult;
  } else if (ifContext.type === 'set') {
    console.log(
      'setting final value',
      ifContext.type,
      evalContext.path,
      '=',
      targetResult
    );
    evalSetResult(targetResult, target, ifTargetField);
    ifContext.stableContext.hasSet = true;
    console.log(
      'has set value',
      target,
      target.parent[target.field],
      ifContext
    );
    return targetResult;
  }

  console.log('returning result for further evaluation', targetResult);
  return targetResult;
};

const evalIfValue = (
  ifValue: IFValue,
  target: Target,
  field: string,
  ifContext: IFContext
) => {
  console.log('evaluating if value', ifValue);
  if (typeof ifValue === 'number' || typeof ifValue === 'boolean') {
    console.log('returning simple value', ifValue);
    return ifValue;
  }
  if (typeof ifValue === 'string') {
    const fieldValue = target[field];
    switch (ifValue) {
      case IFFloatValue:
        const parseResult = parseFloat(fieldValue);
        if (isNaN(parseResult)) {
          console.log('If value not a number', ifValue, fieldValue);
          throw new Error(`If value not a number`);
        }
        console.log('returning fetched number', parseResult);
        return parseResult;
      case IFIntValue:
        const parseIntResult = parseInt(fieldValue);
        if (isNaN(parseIntResult)) {
          console.log('If value not a number', ifValue, fieldValue);
          throw new Error(`If value not a number`);
        }
        console.log('returning fetched number', parseIntResult);
        return parseIntResult;
      case IFBooleanValue:
        const boolean = Boolean(fieldValue);
        console.log('returning fetched boolean', ifValue, fieldValue, boolean);
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
  const updatedContext = ifContext; //{ ...ifContext, path: ifContext.path + '.' + field };
  //console.log('PATH EVALUATION3', ifContext.path, updatedContext.path);
  if (isIfCompare(ifValue)) {
    return evalIfCompare(ifValue, target, field, updatedContext);
  }

  if (isIfMath(ifValue)) {
    return evalIfMath(ifValue, target, field, updatedContext);
  }

  if (isIF(ifValue)) {
    return evalIf(ifValue, { ...updatedContext, type: 'eval' });
  }

  if (Array.isArray(ifValue)) {
    return ifValue;
  }

  if (!Object.keys(ifValue).length) {
    return ifValue;
  }

  return evalIfTarget(ifValue, { parent: target, field }, updatedContext);
};
const evalIfMath = (
  ifMath: IFMath,
  target: Target,
  field: string,
  ifContext: IFContext
) => {
  if (ifMath.add || ifMath.subtract) {
    let result = target[field];
    result = ifMath.add
      ? result + evalIfValue(ifMath.add, target, field, ifContext)
      : result;
    result = ifMath.subtract
      ? result - evalIfValue(ifMath.subtract, target, field, ifContext)
      : result;
    return result;
  }

  if (ifMath.multiplyBy || ifMath.divideBy) {
    let result = target[field];
    result = ifMath.multiplyBy
      ? result * evalIfValue(ifMath.multiplyBy, target, field, ifContext)
      : result;
    result = ifMath.divideBy
      ? result / evalIfValue(ifMath.divideBy, target, field, ifContext)
      : result;
    return result;
  }
  throw new Error('No math defined');
};

const evalIfCompare = (
  ifCompare: IFCompare,
  target: Target,
  field: string,
  ifContext: IFContext
) => {
  const fieldValue = target[field];
  const not =
    !ifCompare.greaterThan ||
    fieldValue !== evalIfValue(ifCompare.not, target, field, ifContext);
  const greaterThan =
    !ifCompare.greaterThan ||
    fieldValue > evalIfValue(ifCompare.greaterThan, target, field, ifContext);
  const lessThan =
    !ifCompare.lessThan ||
    fieldValue < evalIfValue(ifCompare.not, target, field, ifContext);
  const greaterEqualThan =
    !ifCompare.greaterEqualThan ||
    fieldValue >= evalIfValue(ifCompare.not, target, field, ifContext);
  const lessEqualThan =
    !ifCompare.lessEqualThan ||
    fieldValue <= evalIfValue(ifCompare.not, target, field, ifContext);
  return not && greaterThan && lessThan && greaterEqualThan && lessEqualThan;
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

function evalIfResult(result: any, targetValue: any) {
  return typeof targetValue === 'object'
    ? keysAreEqual(targetValue, result)
    : !result && !targetValue
    ? true
    : result == targetValue;
}
function evalSetResult(
  result: any,
  target: TargetContext,
  targetField: string
) {
  const targetHex = target.parent[target.field];
  /*if (
    typeof targetHex[targetField] === 'object' &&
    !Array.isArray(targetHex[targetField])
  ) {
    console.log('writing object', targetHex, targetField, result);
    deepWrite(targetHex[targetField], result);
    target.parent[target.field] = { ...targetHex };
  } else {
    console.log('writing value', targetHex, targetField, result);
    targetHex[targetField] = result;
    target.parent[target.field] = { ...targetHex, [targetField]: result };
  }*/

  console.log(
    '------writing value------',
    target,
    target.parent,
    target.field,
    targetHex,
    targetField,
    result
  );
  target.parent[target.field] = { ...targetHex, [targetField]: result };
}

function keysAreEqual(
  object1: Record<string, any>,
  object2: Record<string, any>
) {
  const entries2 = Object.entries(object2);
  return entries2.every(([key, value]) => object1[key].value == value);
}

function deepWrite(destination, source) {
  for (const property in source) {
    if (typeof source[property] === 'object' && source[property] !== null) {
      destination[property] = destination[property] || {};
      deepWrite(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
}

/*export const setTest: IF[] = [
  {
    target: {
      coords: {
        q: 1,
        r: 2,
        s: 3,
      },
    },
  },
];
*/
