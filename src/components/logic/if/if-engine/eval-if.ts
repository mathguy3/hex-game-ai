import { IF } from '../../../../types/actions/if';
import { getIf } from './modules/getIf';
import { GameModel } from './types';
import { debugLogger } from './util/debug-logger';

const defaultIf = {
  type: 'if' as const,
  path: '',
  state: {},
};

export const evalIf = (ifValue: IF, model: GameModel) => {
  debugLogger.log({
    step: 'Start Evaluation',
    path: '',
    context: { ifValue, model }
  });
  const result = getIf({ ...defaultIf, model, ifValue });

  return result;
};
