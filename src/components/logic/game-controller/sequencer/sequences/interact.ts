import { originHex } from "../../../../../configuration/constants";
import { Interaction } from "../../../../../types/actions/interactions";
import { ActionState, PlayerState, Sequence } from "../../../../../types/game";
import { generateTileSet } from "../../../map/hex/generateTileSet";
import { clearPreviews } from "../../../map/preview/clearMapPreview";
import { generateUnitPreview } from "../../../map/preview/generateUnitPreview";
import { clearSelection } from "../../../map/unselectCoordinates";
import { ActionRequest } from "../doSequence";

export const interact = (actionState: ActionState, stepId: string, action: Sequence | Interaction, request: ActionRequest) => {
    if (request.type !== 'interact') {
        throw new Error('wrong request type, should be interact');
    }

    const { activeAction } = actionState.gameState;
    if (activeAction.type !== 'options') {
        throw new Error('trying to interact during a non options step');
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
                const hex = actionState.mapState[subject.id];
                actionState.selectedHex = hex;
                const { unit } = hex.contains;
                //const unitDefinition = actionState.gameDefinition.units[unit.kind];
                const unitPreview = generateUnitPreview(actionState, unit.kind, hex.coordinates);
                const unitDefinition = actionState.gameDefinition.units[unit.kind];
                for (const target of subject.targets) {
                    if (target.type != 'hex') {
                        throw new Error('bad hex');
                    }
                    actionState.targetHex = actionState.mapState[target.id];

                    const actionPreview = unitPreview[target.id];
                    const defaultAction = Object.values(actionPreview.preview)[0];
                    const selectedPreview = target.kind ? actionPreview.preview[target.kind] : defaultAction;

                    const finalInteraction = unitDefinition.interactions.find((x) => x.kind === selectedPreview.type);

                    const subjectTiles = generateTileSet(activeAction.interactions.hex.targeting.tiles, originHex, actionState, true);
                    const targetTiles = generateTileSet(finalInteraction.targeting.tiles, hex.coordinates, actionState)
                    if (!subjectTiles[hex.key] || !targetTiles[target.id]) {
                        throw new Error('Invalid subject or target');
                    }

                    actionState = clearSelection(clearPreviews(actionState));

                    actionState.gameState.actionContext.isComplete = true;

                    actionState.gameState.activeStep = actionState.gameState.activeStep + '.hex';
                    actionState.gameState.activeAction = finalInteraction;
                    actionState.gameState.activeActions[actionState.gameState.activeStep] = finalInteraction;

                    actionState.gameState.actionContext.subjects = [{
                        id: hex.key,
                        targets: [target],
                        type: 'hex',
                    }];
                    actionState.gameState.actionContext = {
                        id: actionState.gameState.activeStep,
                        action: finalInteraction,
                        subjects: actionState.gameState.actionContext.subjects,
                        previousContext: actionState.gameState.actionContext,
                    }
                }
                break;
            case 'card':
                // Idea: defined interaction may allow a different user's hand for this
                // but by default we're selecting from the user's hand
                const card = (actionState.activePlayer as PlayerState).hand.find((x) => x.id === subject.id);
                // Now this will depend on the type of card it is. Whether it can be used 'on a hex or what'
                // Once a card is selected it might just set off a sequence, and that sequence can be used to select the hex
                // idk here. We'll probably just set this card to 'selected' and continue
                break;
        }
    }

    return { ...actionState };
};
