import { isIfMath } from '../is/isIfMath';
import { IFContext } from '../types';
import { getTargetValue } from '../util/getTargetValue';
import { startOperation } from '../util/startOperation';
import { selectIfValue } from './selectIfValue';

export const evalIfMath = (context: IFContext): number => {
  const { ifValue: ifMath, selected } = context;
  if (!isIfMath(ifMath)) {
    throw new Error("Can't do math on not math");
  }
  if (ifMath.add || ifMath.subtract) {
    if (!selected) {
      console.log('no selection', context);
    }
    let result = getTargetValue(selected);
    result = ifMath.add
      ? result + selectIfValue(startOperation(context, 'add'))
      : result;
    console.log('before subtract', result);
    result = ifMath.subtract
      ? result - selectIfValue(startOperation(context, 'subtract'))
      : result;
    console.log('after subtract', result);
    return result;
  }

  if (ifMath.multiply || ifMath.divide) {
    let result = getTargetValue(selected);
    console.log('before multiply', result);
    result = ifMath.multiply
      ? result * selectIfValue(startOperation(context, 'multiply'))
      : result;
    console.log('after multiply', result);
    result = ifMath.divide
      ? result / selectIfValue(startOperation(context, 'divide'))
      : result;
    return result;
  }
  throw new Error('No math defined');
};
