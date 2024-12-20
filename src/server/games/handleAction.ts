import { ActionRequest } from "../../components/logic/game-controller/sequencer";
import { MapState } from "../../types";
import { GameState, LocalState } from "../../types/game";
import { createPatch, Patch } from "../../utils/statePatch";
import { User } from "../user/id";
import { gameManager } from "./gameManager";

interface ActionResponse {
    gameState: GameState;
    mapState: MapState;
    localState: LocalState;
    patch: Patch<{ gameState: GameState, mapState: MapState }>;
}

export const handleAction = (
    params: {
        gameId: string,
        user: User,
        localState: LocalState,
        request: ActionRequest
    }
): ActionResponse => {
    const { gameId, user, localState, request } = params;
    if (!gameId || !user) {
        throw new Error('Missing required parameters: gameId and user are required');
    }

    if (!gameManager.hasGame(gameId)) {
        throw new Error(`Game with id ${gameId} not found`);
    }

    try {
        // Validate the action request
        if (!request || !request.type) {
            throw new Error('Invalid action request');
        }

        //console.log('handleAction', request);

        const { gameState, mapState, localControl } = gameManager.getGameState(gameId, user.id);
        // Handle the action and get the response
        const response = gameManager.handleAction(
            gameId,
            user.id,
            localState,
            request
        );

        // Validate the response
        if (!response.gameState || !response.mapState) {
            throw new Error('Invalid game state after action');
        }

        const patch = createPatch({ gameState, mapState, localControl }, { gameState: response.gameState, mapState: response.mapState, localControl: response.localControl });

        return { ...response, patch };
    } catch (error) {
        console.error('Error handling action:', {
            gameId,
            userId: user.id,
            actionType: request.type,
            error: error.message
        });

        // Rethrow with more context
        throw error;
    }
};  