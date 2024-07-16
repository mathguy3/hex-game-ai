import { IFContext } from '../types';

export const startOperation = (context: IFContext, path: string): IFContext => {
  const nextPath = context.path + (context.path.length ? '.' : '') + path;

  return {
    ...context,
    type: 'eval',
    ifValue: context.ifValue[path],
    selected: context.selected,
    path: nextPath,
  };
};
