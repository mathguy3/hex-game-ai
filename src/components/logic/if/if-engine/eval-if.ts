import { IF } from '../../../../types/actions/if';
import { getIf } from './modules/getIf';
import { GameModel } from './types';

const defaultIf = {
  type: 'if' as const,
  path: '',
  state: {},
};

export const evalIf = (ifValue: IF, model: GameModel) => {
  //console.log('evalif', ifValue, model);
  return getIf({ ...defaultIf, model, ifValue });
};
