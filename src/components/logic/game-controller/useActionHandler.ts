import { useState } from 'react';
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

    const handleAction = async (request: ActionRequest, actionState: ActionState = params.basicActionState) => {
        setIsProcessing(true);

        try {
            if (params.hasEnoughPlayers) {
                // Use server-side action handling
                const response = await params.client.handleAction({
                    gameId: params.gameId,
                    request,
                    localState: params.localState
                });

                // Update state with response
                params.setLocalState({ ...response.localState });
                params.setGameState({ ...response.gameState });
                params.setMapState({ ...response.mapState });
            } else {
                // Local handling for testing/single player
                const newActionState = doSequence(actionState, request);
                params.setLocalState({ ...newActionState.localState });
                params.setGameState({ ...newActionState.gameState });
                params.setMapState({ ...newActionState.mapState });
            }
        } catch (error) {
            console.error('Failed to handle action:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return { handleAction, isProcessing };
}; 