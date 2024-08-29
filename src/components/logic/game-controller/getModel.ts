import { ActionState } from '../../../types/game';

export const getModel = (actionState: ActionState) => {
  const { mapState, selectedHex, targetHex } = actionState;
  return {
    subject: { parent: mapState, field: selectedHex.key },
    target: { parent: mapState, field: targetHex.key },
    context: { parent: actionState, field: 'gameState' },
  };
};
