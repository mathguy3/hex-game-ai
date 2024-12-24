import { IF, IFValue } from '../../../../types/actions/if';

export function isIF(ifValue: IFValue): ifValue is IF {
  return (
    typeof ifValue === 'object' &&
    ('or' in ifValue || 'and' in ifValue || 'target' in ifValue || 'subject' in ifValue || 'context' in ifValue)
  );
}
