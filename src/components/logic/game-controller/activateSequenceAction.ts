import { Interaction } from '../../../types/actions/interactions';
import { ActionState } from '../../../types/game';
import { activateAction } from './activateAction';
import { activateCardOption } from './options/card';
import { activateHexOption } from './options/hex';

export const activateSequenceAction = (actionState: ActionState, interaction: Interaction) => {
  let state = actionState;
  switch (interaction.type) {
    case 'action':
    case 'system':
      state = activateAction(state, interaction);
      break;
    case 'card':
      state = activateCardOption(state, interaction);
      // Will need to stop and select card
      break;
    case 'hex':
      state = activateHexOption(state, interaction);
      // Will need to stop and wait for board action
      break;
  }
  return state;
};
