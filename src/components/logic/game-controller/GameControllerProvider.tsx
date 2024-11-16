import React, { createContext, MutableRefObject, useContext, useEffect, useState } from 'react';
import { WebSocketMessage } from '../../../game/websocket';
import { HexItem, MapState } from '../../../types';
import { ActionState, GameState, LocalState } from '../../../types/game';
import { useUpdatingRef } from '../../../utils/useUpdatingRef';
import { useClient } from '../client/ClientProvider';
import { showPreview } from '../map/preview/showPreview';
import { selectHex } from '../map/selectHex';
import { isPlayerTurn } from '../util/isPlayerTurn';
import { useWebSocket } from '../websocket/WebSocketProvider';
import { useGameDefinition } from './GameDefinitionProvider';
import { ActionRequest } from './sequencer';
import { useActionHandler } from './useActionHandler';

type GameControllerCtx = {
  basicActionState: ActionState;
  pressHex: MutableRefObject<(hex: HexItem) => void>;
  saveActionState: MutableRefObject<(actionState: ActionState) => void>;
  doAction: MutableRefObject<(request: ActionRequest) => void>;
};

const GameControllerContext = createContext<GameControllerCtx>(null);

export const GameControllerProvider = ({ children }: React.PropsWithChildren) => {
  const { client } = useClient();
  const { game: selectedGameSession } = useGameDefinition();
  const selectedGame = selectedGameSession.gameDefinition;
  // TODO: Split this with local state
  const [localState, setLocalState] = useState<LocalState>({
    meId: 'team1',
    playerState: {
      teamId: 'team1',
      status: 'active'
    },
    previewState: {},
    selectionState: {},
    cardManager: {
      state: 'view',
      selectionSlots: 0,
    },
    mapManager: {
      state: 'view',
    },
  });
  const [gameState, setGameState] = useState<GameState>(selectedGameSession.gameState);
  const [mapState, setMapState] = useState<MapState>(selectedGameSession.mapState);

  const basicActionState: ActionState = {
    mapState,
    gameState,
    targetHex: undefined,
    selectedCard: undefined,
    selectedHex: Object.values(localState.selectionState)[0],
    activePlayer: gameState.players[gameState.activePlayerId],
    gameDefinition: selectedGame,
    localState,
    shouldUpdateLocalState: false,
  };

  const { handleAction, isProcessing } = useActionHandler({
    client,
    gameId: gameState.gameId,
    hasEnoughPlayers: Object.keys(gameState.players).length >= 2,
    localState,
    basicActionState,
    setLocalState,
    setGameState,
    setMapState
  });

  const handlePressHex = useUpdatingRef(async (hex: HexItem) => {
    let actionState: ActionState = {
      ...basicActionState,
      targetHex: hex,
    };

    const canInteract = isPlayerTurn(gameState, localState) && localState.mapManager.state === 'play';
    const somethingSelected = Object.values(localState.selectionState).length > 0;

    if (somethingSelected && localState.previewState[hex.key] &&
      !localState.previewState[hex.key].preview.interaction && canInteract) {

      const request: ActionRequest = {
        type: 'interact',
        playerId: localState.meId,
        subjects: [{
          type: 'hex',
          id: Object.values(localState.selectionState)[0].key,
          targets: [{
            type: 'hex',
            id: hex.key
          }]
        }],
      };

      await handleAction(request, actionState);
    } else {
      // Local only preview/selection handling
      actionState = selectHex(actionState);
      if (canInteract) {
        actionState = showPreview(actionState);
      }

      setLocalState({ ...actionState.localState });
      setGameState(actionState.gameState);
      setMapState({ ...actionState.mapState });
    }
  });
  /*
    useEffect(() => {
      const handleStepChange = async () => {
        const request: ActionRequest = {
          type: 'continue',
          playerId: localState.meId,
        };
  
        await handleAction(request);
      };
  
      // Initial call
      handleStepChange();
  
      // Set up polling
      const pollInterval = setInterval(() => {
        handleStepChange();
      }, 1000);
  
      // Cleanup
      return () => {
        clearInterval(pollInterval);
      };
    }, [gameState.activeStep]);*/

  const saveActionState = useUpdatingRef((actionState: ActionState) => {
    setLocalState(actionState.localState);
    setGameState(actionState.gameState);
    setMapState(actionState.mapState);
  });

  const doAction = useUpdatingRef((request: ActionRequest) => {
    handleAction(request);
  });

  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      if (message.type === 'gameUpdate' && message.gameId === gameState.gameId) {
        setGameState(message.payload.gameState);
        setMapState(message.payload.mapState);
        if (message.payload.shouldSetLocalState) {
          setLocalState(message.payload.localState);
        }
      }
      // When we get a player joined message, we should request a game state update
      if (message.type === 'playerJoined' && message.gameId === gameState.gameId) {
        console.log('playerJoined', message);
        const userId = gameState.players[localState.meId].playerId;
        sendMessage({
          type: 'getGameUpdate',
          gameId: gameState.gameId,
          payload: {
            userId,
            gameState: gameState,
            mapState: mapState,
          }
        });
      }
    };

    // Add WebSocket listener
    window.addEventListener('message', handleWebSocketMessage);

    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
    };
  }, [gameState.gameId]);

  const { sendMessage } = useWebSocket();

  useEffect(() => {
    if (gameState?.gameId) {
      // Join the game's WebSocket room
      console.log('joining game', gameState.gameId);
      sendMessage({
        type: 'playerJoined',
        gameId: gameState.gameId,
        payload: {
          playerId: localState.meId
        }
      });

      return () => {
        // Leave the game's WebSocket room
        sendMessage({
          type: 'playerLeft',
          gameId: gameState.gameId,
          payload: {
            playerId: localState.meId
          }
        });
      };
    }
  }, [gameState?.gameId]);

  useEffect(() => {
    if (isPlayerTurn(gameState, localState)) {
      doAction.current({ type: 'continue', playerId: localState.meId });
    }
    // it needs to poll every second
    const pollInterval = setInterval(() => {
      if (isPlayerTurn(gameState, localState)) {
        doAction.current({ type: 'continue', playerId: localState.meId });
      }
    }, 500);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isPlayerTurn(gameState, localState)]);

  return (
    <GameControllerContext.Provider
      value={{
        pressHex: handlePressHex,
        basicActionState,
        saveActionState,
        doAction
      }}
    >
      {children}
    </GameControllerContext.Provider>
  );
};

export const useGameController = () => useContext(GameControllerContext);
