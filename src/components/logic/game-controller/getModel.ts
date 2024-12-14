import { ActionState } from '../../../types/game';

export const getModel = (actionState: ActionState) => {
  const { mapState, selectedHex, targetHex } = actionState;
  const { subjects } = actionState.gameState.actionContext;
  const subjectHex = subjects?.[0]?.id || selectedHex;
  const target = subjects?.[0]?.targets?.[0]?.id || targetHex;
  return {
    subject: subjectHex ? { parent: mapState, field: subjectHex } : undefined,
    target: target ? { parent: mapState, field: target } : undefined,
    context: { parent: actionState, field: 'gameState' },
  };
};
