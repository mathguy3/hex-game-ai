import { isIfCompare } from '../is/isIfCompare';
import { IFContext } from '../types';
import { getTargetValue } from '../util/getTargetValue';
import { startOperation } from '../util/startOperation';
import { selectIfValue } from './selectIfValue';

export const evalIfCompare = (context: IFContext): boolean => {
  const { ifValue: ifCompare, selected } = context;
  if (!isIfCompare(ifCompare)) {
    throw new Error("Can't do compare on not compare");
  }
  const fieldValue = getTargetValue(selected);
  const equal = !ifCompare.equal || fieldValue === selectIfValue(startOperation(context, 'equal'));
  const not = !ifCompare.not || fieldValue !== selectIfValue(startOperation(context, 'not'));
  const greaterThan = !ifCompare.greaterThan || fieldValue > selectIfValue(startOperation(context, 'greaterThan'));
  const lessThan = !ifCompare.lessThan || fieldValue < selectIfValue(startOperation(context, 'lessThan'));
  const greaterThanEqual =
    !ifCompare.greaterThanEqual || fieldValue >= selectIfValue(startOperation(context, 'greaterThanEqual'));
  const lessThanEqual =
    !ifCompare.lessThanEqual || fieldValue <= selectIfValue(startOperation(context, 'lessThanEqual'));

  const result = equal && not && greaterThan && lessThan && greaterThanEqual && lessThanEqual;
  /*console.log(
    'if compare result',
    fieldValue,
    equal,
    not,
    greaterThan,
    lessThan,
    greaterThanEqual,
    lessThanEqual,
    result
  );*/
  return result;
};
