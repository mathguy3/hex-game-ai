import { Interaction } from '../../../../types/actions/interactions';
import { Sequence } from '../../../../types/game';

export const isOption = (action: Sequence | Interaction) => action?.type === 'option';
