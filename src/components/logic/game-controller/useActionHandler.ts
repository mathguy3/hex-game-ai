import { useCallback, useState } from 'react';
import { MapState } from "../../../types";
import { ActionState, GameState, LocalState } from "../../../types/game";
import { ActionRequest, doSequence } from "./sequencer";

export const useActionHandler = (params: {
    client: any;
    gameId: string;
    hasEnoughPlayers: boolean;
    localState: LocalState;
    basicActionState: ActionState;
    setLocalState: (state: LocalState) => void;
    setGameState: (state: GameState) => void;
    setMapState: (state: MapState) => void;
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = useCallback(async (request: ActionRequest, actionState: ActionState = params.basicActionState) => {
        try {
            // Immediately apply optimistic update
            const optimisticState = doSequence(actionState, request);

            // Update UI immediately with all changes including active player
            params.setLocalState({ ...optimisticState.localState });
            params.setGameState({ ...optimisticState.gameState });
            params.setMapState({ ...optimisticState.mapState });

            // Send to server in background
            if (params.hasEnoughPlayers) {
                setIsProcessing(true);
                const serverResponse = await params.client.handleAction({
                    gameId: params.gameId,
                    request,
                    localState: params.localState
                });

                // Only update if server state differs significantly
                if (JSON.stringify(serverResponse.gameState) !== JSON.stringify(optimisticState.gameState)) {
                    params.setGameState({ ...serverResponse.gameState });
                    params.setMapState({ ...serverResponse.mapState });
                }
            }
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [params.gameId, params.hasEnoughPlayers, params.localState]);

    return { handleAction, isProcessing };
}; 