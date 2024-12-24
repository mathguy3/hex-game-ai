import { Interaction } from '../../../../types/actions/interactions';
import { Sequence } from '../../../../types/game';

export const isOptions = (action: Sequence | Interaction) => action?.type === 'options';
