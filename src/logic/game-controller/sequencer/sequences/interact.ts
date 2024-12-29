import { originHex } from '../../../../configuration/constants';
import { Interaction } from '../../../../types/actions/interactions';
import { ActionState, Sequence } from '../../../../types/game';
import { doSet } from '../../../if/if-engine-3/doSet';
import { generateTileSet } from '../../../map/hex/generateTileSet';
import { generateUnitPreview } from '../../../map/preview/generateUnitPreview';
import { ActionRequest } from '../doSequence';

export const interact = (
  actionState: ActionState,
  stepId: string,
  action: Sequence | Interaction,
  request: ActionRequest
) => {
  console.log('interact', request);
  if (request.type !== 'interact') {
    throw new Error('wrong request type, should be interact');
  }

  const { activeAction } = actionState.gameState;
  if (activeAction.type !== 'options') {
    throw new Error('trying to interact during a non options step ' + activeAction.type);
  }

  if (!activeAction.multi && request.subjects.length > 1) {
    throw new Error('Trying to interact with multiple actions in a non multi options');
  }

  if (request.subjects.length > 1) {
    throw new Error('subjects limited to 1 for now');
  }

  for (const subject of request.subjects) {
    const definedInteraction = activeAction.interactions[subject.type];
    if (!definedInteraction) {
      throw new Error('No defined interaction');
    }
    switch (subject.type) {
      case 'hex':
        if (subject.targets?.length > 1) {
          throw new Error('targets limited to 1 for hexes for now');
        }
        const subjectHex = actionState.mapState[subject.id];
        actionState.selectedHex = subjectHex;
        const { unit } = subjectHex.contains;
        //const unitDefinition = actionState.gameDefinition.units[unit.kind];
        const unitPreview = generateUnitPreview(actionState, unit.kind, subjectHex.coordinates);
        const unitDefinition = actionState.gameDefinition.definitions.units[unit.kind];
        for (const target of subject.targets) {
          if (target.type != 'hex') {
            throw new Error('bad hex');
          }
          actionState.targetHex = actionState.mapState[target.id];

          const actionPreview = unitPreview[target.id];
          const defaultAction = Object.values(actionPreview.preview)[0];
          const selectedPreview = target.kind ? actionPreview.preview[target.kind] : defaultAction;

          const unitInteraction = unitDefinition.interactions.find((x) => x.kind === selectedPreview.type);

          const subjectTiles = generateTileSet(
            activeAction.interactions.hex.targeting.tiles,
            originHex,
            actionState,
            true
          );
          const targetTiles = generateTileSet(unitInteraction.targeting.tiles, subjectHex.coordinates, actionState);
          if (!subjectTiles[subjectHex.key] || !targetTiles[target.id]) {
            throw new Error('Invalid subject or target');
          }

          actionState.gameState.actionContext.isComplete = true;

          actionState.gameState.activeStep = actionState.gameState.activeStep + '.hex';
          actionState.gameState.activeAction = unitInteraction;
          actionState.gameState.activeActions[actionState.gameState.activeStep] = unitInteraction;

          actionState.gameState.actionContext.subjects = [
            {
              id: subjectHex.key,
              targets: [target],
              type: 'hex',
            },
          ];
          actionState.gameState.actionContext = {
            id: actionState.gameState.activeStep,
            action: unitInteraction,
            subjects: actionState.gameState.actionContext.subjects,
            previousContext: actionState.gameState.actionContext,
          };
          actionState.autoContinue = true;
        }
        break;
      case 'card':
        console.log('card', subject);
        // Idea: defined interaction may allow a different user's hand for this
        // but by default we're selecting from the user's hand
        //const card = (actionState.activePlayer as PlayerState).hand.find((x) => x.id === subject.id);
        // Now this will depend on the type of card it is. Whether it can be used 'on a hex or what'
        // Once a card is selected it might just set off a sequence, and that sequence can be used to select the hex
        // idk here. We'll probably just set this card to 'selected' and continue
        console.log('card', subject, request);
        console.log(actionState.gameState.cardStacks);
        const target = subject.targets[0];
        const card = actionState.gameState.cardStacks[subject.stackId].find((x) => x.id === subject.id);
        actionState.gameState.cardStacks[target.id] = [...actionState.gameState.cardStacks[target.id], card];
        actionState.gameState.cardStacks[subject.stackId] = actionState.gameState.cardStacks[subject.stackId].filter(
          (x) => x.id !== subject.id
        );
        actionState.gameState.actionContext.isComplete = true;
        actionState.autoContinue = true;

        break;
      case 'ui':
        const ui = actionState.uiState[subject.id];
        if (action.type == 'ui' && action.id && action.id !== ui.id) {
          throw new Error('ui id mismatch');
        }
        const uiAction = ui.action;
        const { context } = doSet({
          model: { context: actionState.gameState },
          subject: ui,
          ifItem: uiAction,
        });
        actionState.gameState = context;
        actionState.gameState.actionContext.isComplete = true;
        actionState.autoContinue = true;
        break;
    }
  }

  return { ...actionState };
};
