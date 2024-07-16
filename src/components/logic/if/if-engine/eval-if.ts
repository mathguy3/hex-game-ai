import { IF } from '../../../../types/actions/if';
import { getIf } from './modules/getIf';
import { IFContext } from './types';
import { log } from './util/log';

const defaultIf = { type: 'if' as const, path: '', state: {}, model: {} };

export const evalIf = (ifValue: IF, context?: Partial<IFContext>) => {
  log('eval start', ifValue, context);
  const result = getIf({ ...defaultIf, ...context, ifValue });
  if (context.type === 'if') {
    log('result of ', context, result);
  }
  return result;
};
