import { ActionState } from '../../../types/game';

export const getModel = (actionState: ActionState) => {
  const { mapState, selectedHex, targetHex } = actionState;
  return {
    subject: selectedHex ? { parent: mapState, field: selectedHex.key } : undefined,
    target: targetHex ? { parent: mapState, field: targetHex.key } : undefined,
    context: { parent: actionState, field: 'gameState' },
  };
};
