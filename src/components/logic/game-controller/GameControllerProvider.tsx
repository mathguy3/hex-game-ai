import React, { createContext, MutableRefObject, useContext, useEffect, useState } from 'react';
import { HexItem, MapState } from '../../../types';
import { ActionState, GameState, LocalState } from '../../../types/game';
import { useUpdatingRef } from '../../../utils/useUpdatingRef';
import { useClient } from '../client/ClientProvider';
import { showPreview } from '../map/preview/showPreview';
import { selectHex } from '../map/selectHex';
import { isPlayerTurn } from '../util/isPlayerTurn';
import { useGameDefinition } from './GameDefinitionProvider';
import { ActionRequest } from './sequencer';
import { useActionHandler } from './useActionHandler';

type GameControllerCtx = {
  basicActionState: ActionState;
  pressHex: MutableRefObject<(hex: HexItem) => void>;
  saveActionState: MutableRefObject<(actionState: ActionState) => void>;
};
export type DoAction = (actionState: ActionState) => Promise<ActionState>;

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

  useEffect(() => {
    const handleStepChange = async () => {
      const request: ActionRequest = {
        type: 'continue',
        playerId: localState.meId,
      };

      await handleAction(request);
    };

    handleStepChange();
  }, [gameState.activeStep, client, localState.meId]);

  const saveActionState = useUpdatingRef((actionState: ActionState) => {
    setLocalState(actionState.localState);
    setGameState(actionState.gameState);
    setMapState(actionState.mapState);
  });

  return (
    <GameControllerContext.Provider
      value={{
        pressHex: handlePressHex,
        basicActionState,
        saveActionState
      }}
    >
      {children}
    </GameControllerContext.Provider>
  );
};

export const useGameController = () => useContext(GameControllerContext);
