import { BoardInteraction } from '../../../types/actions/interactions';
import { ActionState, GameDefinition } from '../../../types/game';
import { activateAction } from './activateAction';

export const activateInteraction = (
  actionState: ActionState,
  interaction: BoardInteraction,
  gameDefinition: GameDefinition
) => {
  if (!interaction.actions?.length) {
    return;
  }
  for (const action of interaction.actions) {
    activateAction(actionState, action, gameDefinition);
  }
  /*const playerPostInteractions =
    gameDefinition.player['team1']?.postInteraction.filter(
      (x): x is Action => 'set' in x
    ) ?? [];
  for (const action of playerPostInteractions) {
    activateAction(actionState, action);
  }*/
  return actionState;
};
