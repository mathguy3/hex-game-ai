import { IFValue } from '../../../../../types/actions/if';

export const getFields = (ifValue: IFValue) => {
  const fields = Object.keys(ifValue);
  const field = fields[0];
  return { fields, field };
};
