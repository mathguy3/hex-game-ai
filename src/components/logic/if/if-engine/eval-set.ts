import { IF } from '../../../../types/actions/if';
import { getIf } from './modules/getIf';
import { GameModel, IFContext } from './types';

const defaultSet = {
  type: 'set' as const,
  path: '',
  state: {},
  model: {} as GameModel,
};

export const evalSet = (ifValue: IF, context?: Partial<IFContext>) => {
  const initialContext = { ...defaultSet, ...context, ifValue };
  getIf(initialContext);
  return initialContext.model;
};
