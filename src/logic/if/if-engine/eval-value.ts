import { IF } from '../../../types/actions/if';
import { getIf } from './modules/getIf';
import { GameModel } from './types';

const defaultSet = {
  type: 'eval' as const,
  path: '',
  state: {},
};

export const evalValue = (ifValue: IF, model: GameModel) => {
  const initialContext = { ...defaultSet, model, ifValue };
  return getIf(initialContext);
};
