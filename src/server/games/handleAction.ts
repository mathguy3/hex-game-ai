import { ActionRequest } from "../../components/logic/game-controller/sequencer";
import { MapState } from "../../types";
import { GameState, LocalState } from "../../types/game";
import { User } from "../user/id";
import { gameManager } from "./gameManager";

interface ActionResponse {
    gameState: GameState;
    mapState: MapState;
    localState: LocalState;
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

        // Handle the action and get the response
        const response = gameManager.handleAction(
            gameId,
            user.id,
            localState,
            request
        );

        // Validate the response
        if (!response.gameState || !response.mapState || !response.localState) {
            throw new Error('Invalid game state after action');
        }

        return response;
    } catch (error) {
        console.error('Error handling action:', {
            gameId,
            userId: user.id,
            actionType: request.type,
            error: error.message
        });

        // Rethrow with more context
        throw new Error(`Failed to handle action: ${error.message}`);
    }
};  