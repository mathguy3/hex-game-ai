import { ActionState } from '../../../types/game';
import { Interaction } from '../../../types/actions/interactions';

/**
 * Generates an AI turn based on the current game state and available interactions.
 * This is a simple implementation that:
 * 1. For hex interactions: Picks the first available target hex
 * 2. For card interactions: Picks the first available card
 * 3. For UI interactions: Picks the first available option
 * 
 * @param actionState Current state of the game
 * @param interaction The interaction that needs to be handled
 * @returns An ActionRequest that can be sent to the server
 */
export const generateAITurn = (actionState: ActionState, interaction: Interaction) => {
    const { localState, mapState } = actionState;
    const playerId = localState.meId;

    switch (interaction.type) {
        case 'hex': {
            // Find all valid target hexes from the preview state
            const validTargets = Object.entries(mapState)
                .filter(([_, hexState]) => hexState.pr eview?.isValid)
                .map(([key]) => key);

            if (validTargets.length === 0) {
                throw new Error('No valid targets found for hex interaction');
            }

            // Pick the first valid target
            const targetHexKey = validTargets[0];

            // For hex interactions, we need both the selected hex and the target hex
            const selectedHexKey = Object.values(localState.selectionState)[0]?.key;
            if (!selectedHexKey) {
                throw new Error('No hex selected for interaction');
            }

            return {
                type: 'interact',
                playerId,
                subjects: [{
                    type: 'hex',
                    id: selectedHexKey,
                    targets: [{
                        type: 'hex',
                        id: targetHexKey
                    }]
                }]
            };
        }

        case 'card': {
            // For card interactions, pick the first card from the hand
            const card = localState.playerState.hand?.[0];
            if (!card) {
                throw new Error('No cards available for interaction');
            }

            return {
                type: 'interact',
                playerId,
                subjects: [{
                    type: 'card',
                    id: card.id,
                    targets: []
                }]
            };
        }

        case 'ui': {
            // For UI interactions, just continue
            return {
                type: 'continue',
                playerId
            };
        }

        default:
            throw new Error(`Unsupported interaction type: ${interaction.type}`);
    }
};
