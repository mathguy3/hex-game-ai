import { UnitState } from '../../../../types/entities/unit/unit';
import { ActionState } from '../../../../types/game';
import { selectHex } from '../../map/selectHex';
import { activateInteraction } from '../activateInteraction';

export const activateHex = (actionState: ActionState): ActionState => {
  const { selectedHex, targetHex, gameDefinition } = actionState;
  const selectedUnit: UnitState | undefined = selectedHex.contains?.unit;
  if (!selectedUnit) {
    throw new Error('No selected unit when attempting to activate previewed action');
  }

  const previewKey = Object.keys(targetHex.preview)[0];
  const { interactions } = gameDefinition.units[selectedUnit.kind];

  const interactionDefinition = interactions.find((x) => x.type === previewKey);

  actionState = activateInteraction(actionState, interactionDefinition);
  actionState = selectHex(actionState);
  return actionState;
};
