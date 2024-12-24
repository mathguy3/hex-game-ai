import {
  IFArrayValue,
  IFBooleanValue,
  IFFloatValue,
  IFIntValue,
  IFObjectValue,
  IFStringValue,
} from '../../../../types/actions/if';
import { IFContext } from '../types';
import { getValue } from '../util/getValue';

export const getSimpleValue = (ifValue: string | number | boolean, context: IFContext) => {
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
