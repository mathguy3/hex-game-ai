import { IF } from '../../../../types/actions/if';
import { getIf } from './modules/getIf';
import { GameModel, IFContext } from './types';

const defaultSet = {
  type: 'eval' as const,
  path: '',
  state: {},
  model: {} as GameModel,
};

export const evalValue = (ifValue: IF, context?: Partial<IFContext>) => {
  const initialContext = { ...defaultSet, ...context, ifValue };
  return getIf(initialContext);
};
