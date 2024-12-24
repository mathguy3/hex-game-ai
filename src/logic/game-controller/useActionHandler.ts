import { useState } from 'react';
import { MapState } from '../../types';
import { ActionState, GameState, LocalControl, LocalState } from '../../types/game';
import { useUpdatingRef } from '../../utils/useUpdatingRef';
import { ActionRequest, doSequence } from './sequencer';

export const useActionHandler = (params: {
  client: any;
  roomCode: string;
  hasEnoughPlayers: boolean;
  localState: LocalState;
  basicActionState: ActionState;
  setGameState: (state: GameState) => void;
  setLocalControl: (state: LocalControl) => void;
  setMapState: (state: MapState) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = useUpdatingRef(
    async (request: ActionRequest, actionState: ActionState = params.basicActionState) => {
      try {
        // Immediately apply optimistic update
        const optimisticState = doSequence(actionState, request);
        console.log('------ optimisticState ------', optimisticState.gameState.activeStep);

        // Update UI immediately with all changes including active player
        params.setGameState({ ...optimisticState.gameState });
        params.setMapState({ ...optimisticState.mapState });
        params.setLocalControl({ ...optimisticState.localControl });

        // Send to server in background
        if (params.hasEnoughPlayers) {
          setIsProcessing(true);
          const serverResponse = await params.client.handleAction({
            roomCode: params.roomCode,
            request,
            localState: params.localState,
          });
          console.log('------ serverResponse ------', serverResponse.gameState.activeStep);
        }
      } catch (error) {
        console.error('Action failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  );

  return { handleAction, isProcessing };
};
