import React, { createContext, MutableRefObject, useContext, useEffect, useState } from 'react';
import { HexItem, MapState } from '../../types';
import { ActionState, GameState, LocalControl, LocalState } from '../../types/game';
import { useUpdatingRef } from '../../utils/useUpdatingRef';
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
import { doIf } from '../if/if-engine-3/doIf';

type GameControllerCtx = {
  basicActionState: ActionState;
  pressHex: MutableRefObject<(hex: HexItem) => void>;
  saveActionState: MutableRefObject<(actionState: ActionState) => void>;
  doAction: MutableRefObject<(request: ActionRequest) => void>;
  handlePlaceCard: MutableRefObject<(cardId: string, fromStackId: string, toStackId: string) => void>;
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
      playerId: meId,
      status: 'active',
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

  const uiState = {};
  const buildUiState = (ui: any) => {
    //console.log('building ui', ui.id);
    const children = ui.children || [];
    for (const child of children) {
      buildUiState(child);
    }
    uiState[ui.id] = ui;
    //console.log('adding ui', ui.id);
  };
  buildUiState(selectedGame.ui);
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
    uiState,
  };

  useEffect(() => {
    if (gameState.isComplete) {
      alert('Game is complete');
      console.log('do you win?');
    }
  }, [gameState.isComplete]);

  const { handleAction } = useActionHandler({
    client,
    roomCode: gameState.roomCode,
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

    if (
      somethingSelected &&
      localState.previewState[hex.key] &&
      !localState.previewState[hex.key].preview.interaction &&
      canInteract
    ) {
      const request: ActionRequest = {
        type: 'interact',
        playerId: localState.meId,
        subjects: [
          {
            type: 'hex',
            id: Object.values(localState.selectionState)[0].key,
            targets: [
              {
                type: 'hex',
                id: hex.key,
              },
            ],
          },
        ],
      };

      await handleAction.current(request, actionState);
    } else {
      actionState = clearPreviews(actionState);
      // Local only preview/selection handling
      actionState = selectHex(actionState);
      if (canInteract) {
        const canSelectThatThing = Object.values(localControl.activeActions).some((x) =>
          isHexInTileSet(hex.coordinates, x, actionState)
        );

        if (canSelectThatThing) {
          actionState = showPreview(actionState);
        }
      }

      setLocalState({ ...actionState.localState });
      setGameState(actionState.gameState);
      setMapState({ ...actionState.mapState });
    }
  });

  const handlePlaceCard = useUpdatingRef(async (cardId: string, fromStackId: string, toStackId: string) => {
    const request: ActionRequest = {
      type: 'interact',
      playerId: localState.meId,
      subjects: [
        {
          type: 'card',
          id: cardId,
          stackId: fromStackId,
          targets: [
            {
              type: 'card',
              id: toStackId,
            },
          ],
        },
      ],
    };
    console.log('request', request);

    await handleAction.current(request, basicActionState);
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
        console.error('Error parsing WebSocket message:', error, event);
        return;
      }

      console.log('handleWebSocketMessage', message);
      if (message.type === 'gameUpdate' && message.roomCode === gameState.roomCode) {
        const updatedGameState = message.payload.gameState;
        const updatedMapState = message.payload.mapState;
        const updatedLocalControl = message.payload.localControl;
        //console.log('---- gameUpdate ---', updatedGameState.activeStep, updatedMapState['0.0.0'].contains);
        setGameState(updatedGameState);
        setMapState(updatedMapState);
        console.log('localControl', updatedLocalControl);
        setLocalControl(updatedLocalControl);

        // in 500ms kick of a continue
        const { nextStep } = moveToNextStep(
          {
            ...basicActionState,
            gameState: updatedGameState,
            mapState: updatedMapState,
          },
          true
        );
        console.log('nextStep', nextStep, updatedGameState.activeStep);
        const canContinue = nextStep !== updatedGameState.activeStep;
        console.log(
          'game update finished for step',
          nextStep,
          updatedGameState.activeStep,
          updatedGameState.activeAction?.type,
          canContinue
        );
        console.log('isPlayerTurn', isPlayerTurn(updatedGameState, localState), canContinue);

        if (isPlayerTurn(updatedGameState, localState) && canContinue) {
          setTimeout(() => {
            handleAction.current({ playerId: localState.meId, type: 'continue' });
          }, 50);
        }
      }
      // When we get a player joined message, we should request a game state update
      if (message.type === 'playerJoined' && message.roomCode === gameState.roomCode) {
        console.log('playerJoined', message);
        const userId = gameState.players[localState.meId].playerId;
        sendMessage({
          type: 'getGameUpdate',
          roomCode: gameState.roomCode,
          payload: {
            userId,
            gameState: gameState,
            mapState: mapState,
          },
        });
      }
    };

    // Add WebSocket listener
    window.addEventListener('message', handleWebSocketMessage);

    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
    };
  }, [gameState.roomCode]);

  useEffect(() => {
    const updatedState = clearPreviews(clearSelection(basicActionState));
    if (isPlayerTurn(gameState, localState)) {
      setLocalState({
        ...updatedState.localState,
        mapManager: { ...updatedState.localState.mapManager, state: 'play' },
      });
    } else {
      setLocalState({
        ...updatedState.localState,
        mapManager: { ...updatedState.localState.mapManager, state: 'view' },
      });
    }
  }, [isPlayerTurn(gameState, localState)]);

  const { sendMessage } = useWebSocket();

  useEffect(() => {
    if (gameState?.roomCode) {
      // Join the game's WebSocket room
      console.log('joining game', gameState.roomCode);
      sendMessage({
        type: 'playerJoined',
        roomCode: gameState.roomCode,
        payload: {
          playerId: localState.meId,
        },
      });

      return () => {
        // Leave the game's WebSocket room
        sendMessage({
          type: 'playerLeft',
          roomCode: gameState.roomCode,
          payload: {
            playerId: localState.meId,
          },
        });
      };
    }
  }, [gameState?.roomCode]);

  return (
    <GameControllerContext.Provider
      value={{
        pressHex: handlePressHex,
        basicActionState,
        saveActionState,
        doAction: handleAction,
        handlePlaceCard,
      }}
    >
      {children}
    </GameControllerContext.Provider>
  );
};

export const useGameController = () => useContext(GameControllerContext);
