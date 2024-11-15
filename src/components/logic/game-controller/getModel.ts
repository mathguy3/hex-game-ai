import { ActionState } from '../../../types/game';

export const getModel = (actionState: ActionState) => {
  const { mapState } = actionState;
  const { subjects } = actionState.gameState.actionContext;
  const subjectHex = subjects[0]?.id;
  const targetHex = subjects[0]?.targets?.[0]?.id;
  return {
    subject: subjectHex ? { parent: mapState, field: subjectHex } : undefined,
    target: targetHex ? { parent: mapState, field: targetHex } : undefined,
    context: { parent: actionState, field: 'gameState' },
  };
};
