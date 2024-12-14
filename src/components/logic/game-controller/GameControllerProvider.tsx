import React, { createContext, MutableRefObject, useContext, useEffect, useState } from 'react';
import { HexItem, MapState } from '../../../types';
import { ActionState, GameState, LocalControl, LocalState } from '../../../types/game';
import { useUpdatingRef } from '../../../utils/useUpdatingRef';
import { useClient } from '../client/ClientProvider';
import { isHexInTileSet } from '../map/hex/isHexInTileSet';
import { clearPreviews } from '../map/preview/clearMapPreview';
import { showPreview } from '../map/preview/showPreview';
import { selectHex } from '../map/selectHex';
import { clearSelection } from '../map/unselectCoordinates';
import { isPlayerTurn } from '../util/isPlayerTurn';
import { useWebSocket, WebSocketMessage } from '../websocket/WebSocketProvider';
import { useGameDefinition } from './GameDefinitionProvider';
import { ActionRequest } from './sequencer';
import { moveToNextStep } from './sequencer/utils/moveToNextStep';
import { useActionHandler } from './useActionHandler';

type GameControllerCtx = {
  basicActionState: ActionState;
  pressHex: MutableRefObject<(hex: HexItem) => void>;
  saveActionState: MutableRefObject<(actionState: ActionState) => void>;
  doAction: MutableRefObject<(request: ActionRequest) => void>;
};

const GameControllerContext = createContext<GameControllerCtx>(null);

export const GameControllerProvider = ({ children, meId }: React.PropsWithChildren<{ meId: string }>) => {
  const { client } = useClient();
  const { game: selectedGameSession } = useGameDefinition();
  const selectedGame = selectedGameSession.gameDefinition;
  // TODO: Split this with local state
  const [localState, setLocalState] = useState<LocalState>({
    meId,
    playerState: {
      teamId: meId,
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
  const [localControl, setLocalControl] = useState<LocalControl>({ activeActions: {} });

  const basicActionState: ActionState = {
    mapState,
    gameState,
    targetHex: undefined,
    selectedCard: undefined,
    selectedHex: Object.values(localState.selectionState)[0],
    activePlayer: gameState.players[gameState.activePlayerId],
    gameDefinition: selectedGame,
    localState,
    localControl,
  };

  const { handleAction, } = useActionHandler({
    client,
    gameId: gameState.gameId,
    hasEnoughPlayers: Object.keys(gameState.players).length >= 2,
    localState,
    basicActionState,
    setGameState,
    setMapState,
    setLocalControl,
  });

  const handlePressHex = useUpdatingRef(async (hex: HexItem) => {
    let actionState: ActionState = {
      ...basicActionState,
      targetHex: hex,
    };

    const canInteract = isPlayerTurn(gameState, localState);
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

      await handleAction.current(request, actionState);
    } else {
      actionState = clearPreviews(actionState)
      // Local only preview/selection handling
      actionState = selectHex(actionState);
      if (canInteract) {
        const canSelectThatThing = Object.values(localControl.activeActions).some(x => isHexInTileSet(hex.coordinates, x, actionState));

        if (canSelectThatThing) {
          actionState = showPreview(actionState);
        }
      }

      setLocalState({ ...actionState.localState });
      setGameState(actionState.gameState);
      setMapState({ ...actionState.mapState });
    }
  });

  const saveActionState = useUpdatingRef((actionState: ActionState) => {
    setGameState(actionState.gameState);
    setMapState(actionState.mapState);
  });

  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      let message: WebSocketMessage;
      try {
        message = JSON.parse(event.data);
        //console.log('WebSocket message received:', event.data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        return;
      }

      if (message.type === 'gameUpdate' && message.gameId === gameState.gameId) {
        const updatedGameState = message.payload.gameState;
        const updatedMapState = message.payload.mapState;
        const updatedLocalControl = message.payload.localControl;
        console.log('---- gameUpdate ---', updatedGameState.activeStep, updatedMapState['0.0.0'].contains);
        setGameState(updatedGameState);
        setMapState(updatedMapState);
        console.log('localControl', updatedLocalControl);
        setLocalControl(updatedLocalControl);
        // in 500ms kick of a continue
        const { nextStep } = moveToNextStep({
          ...basicActionState,
          gameState: updatedGameState,
          mapState: updatedMapState
        }, true);
        const canContinue = nextStep != updatedGameState.activeStep
        console.log("game update finished for step", nextStep, updatedGameState.activeStep, updatedGameState.activeAction?.type, canContinue);
        if (isPlayerTurn(updatedGameState, localState) && canContinue) {
          setTimeout(() => {
            handleAction.current({ playerId: localState.meId, type: 'continue' });
          }, 50);
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

  useEffect(() => {
    const updatedState = clearPreviews(clearSelection(basicActionState));
    if (isPlayerTurn(gameState, localState)) {
      setLocalState({ ...updatedState.localState, mapManager: { ...updatedState.localState.mapManager, state: 'play' } });
    } else {
      setLocalState({ ...updatedState.localState, mapManager: { ...updatedState.localState.mapManager, state: 'view' } });
    }
  }, [isPlayerTurn(gameState, localState)])

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

  return (
    <GameControllerContext.Provider
      value={{
        pressHex: handlePressHex,
        basicActionState,
        saveActionState,
        doAction: handleAction
      }}
    >
      {children}
    </GameControllerContext.Provider>
  );
};

export const useGameController = () => useContext(GameControllerContext);
