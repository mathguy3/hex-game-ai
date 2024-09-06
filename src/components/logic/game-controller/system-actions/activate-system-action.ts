import { SystemAction } from '../../../../types/actions/interactions';
import { ActionState, GameDefinition } from '../../../../types/game';
import { activateAction } from '../activateAction';
import { endTurn } from './end-turn';

// This needs to run to return the appropriate action for the type
// So end-turn should run 'next-turn' for the given active player
// This would be made easier with { if: {}, else: {} } and { field: {}, value: {} } types
const actions: Record<SystemAction['type'], any> = {
  'end-turn': endTurn,
  'end-sequence': () => {},
  'give-control': () => {},
  'player-turn': () => {},
};

export const activateSystemAction = (
  type: SystemAction['type'],
  actionState: ActionState,
  gameDefinition: GameDefinition
) => {
  const action = actions[type];
  actionState = activateAction(actionState, action, gameDefinition);
  return actionState;
};
