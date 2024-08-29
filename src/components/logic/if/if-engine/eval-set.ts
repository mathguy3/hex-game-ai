import { IF } from '../../../../types/actions/if';
import { getIf } from './modules/getIf';
import { GameModel } from './types';

const defaultSet = {
  type: 'set' as const,
  path: '',
  state: {},
};

export const evalSet = (ifValue: IF, model: GameModel) => {
  const initialContext = { ...defaultSet, model, ifValue };
  getIf(initialContext);
  return initialContext.model;
};
