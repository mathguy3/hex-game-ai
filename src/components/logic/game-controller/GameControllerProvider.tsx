import React, { createContext, MutableRefObject, useContext, useEffect, useState } from 'react';
import { originHex } from '../../../configuration/constants';
import { HexItem, MapState, Tile } from '../../../types';
import { SystemAction } from '../../../types/actions/interactions';
import { ActionState, GameState, LocalState } from '../../../types/game';
import { mapRecord } from '../../../utils/record/mapRecord';
import { useUpdatingRef } from '../../../utils/useUpdatingRef';
import { initialUnits } from '../../HexMap/generation/initialPlacement';
import { showPreview } from '../map/preview/showPreview';
import { selectHex } from '../map/selectHex';
import { rangeSimple } from '../tile-generators';
import { isPlayerTurn } from '../util/isPlayerTurn';
import { useGameDefinition } from './GameDefinitionProvider';
import { ActionRequest, doSequence } from './sequencer';
import { getNextStep } from './steps/getNextStep';
import { activateSystemAction } from './system-actions/activateSystemAction';

type GameControllerCtx = {
  basicActionState: ActionState;
  pressHex: MutableRefObject<(hex: HexItem) => void>;
  systemAction: MutableRefObject<(type: SystemAction['kind']) => void>;
  saveActionState: MutableRefObject<(actionState: ActionState) => void>;
};
export type DoAction = (actionState: ActionState) => Promise<ActionState>;

const generatedRange = { type: 'range' as const, range: 5 };
const generateMap = false;
const GameControllerContext = createContext<GameControllerCtx>(null);

export const GameControllerProvider = ({ children }: React.PropsWithChildren) => {
  const { game: selectedGame } = useGameDefinition();
  // TODO: Split this with local state
  const [localState, setLocalState] = useState<LocalState>({
    meId: 'team1',
    playerState: {},
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
  const [gameState, setGameState] = useState<GameState>({
    gameId: 'theonlygame',
    players: {
      team1: {
        type: 'player',
        properties: {
          isTurnUsed: false,
        },
        hand: [
          {
            id: '1',
            kind: 'time-1',
            properties: { ...selectedGame.cards['time-1'].properties },
          },
          {
            id: '2',
            kind: 'time-1',
            properties: { ...selectedGame.cards['time-1'].properties },
          },
          {
            id: '3',
            kind: 'time-1',
            properties: { ...selectedGame.cards['time-1'].properties },
          },
          {
            id: '4',
            kind: 'time-1',
            properties: { ...selectedGame.cards['time-1'].properties },
          },
        ],
      },
      team2: {
        type: 'ai',
        properties: {
          isTurnUsed: false,
        },
      },
      team3: {
        type: 'ai',
        properties: {
          isTurnUsed: false,
        },
      },
    },
    activeActions: {},
    activeStep: 'start',
    activeAction: selectedGame.sequencing,
    activePlayerId: 'team1',
    actionContext: {
      id: 'start',
      action: selectedGame.sequencing,
    },
    actionHistory: [],
  });
  const [mapState, setMapState] = useState<MapState>(
    generateMap
      ? mapRecord(rangeSimple(generatedRange, originHex, true), (x: Tile) => ({
        type: 'hex',
        key: x.key,
        kind: x.coordinates.q === -2 ? 'river' : 'hex',
        aspects: {},
        coordinates: x.coordinates,
        isSelected: false,
        contains: { unit: initialUnits[x.key] },
        preview: {},
      }))
      : selectedGame.map
  );
  const [selectionState, setSelectionState] = useState<Record<string, HexItem>>({});
  const [previewState, setPreviewState] = useState<Record<string, HexItem>>({});

  const basicActionState: ActionState = {
    mapState,
    gameState,
    targetHex: undefined,
    selectedCard: undefined,
    selectedHex: Object.values(selectionState)[0],
    activePlayer: gameState.players[gameState.activePlayerId],
    gameDefinition: selectedGame,
    localState,
  };

  const doAction = useUpdatingRef(async (action: string, subject: any, target: any) => {
    const shouldUseApi = false; //Object.values(gameState.players).filter((x) => x.type === 'player').length > 1;


    if (shouldUseApi) {
      // Send action to server
      try {
        const response = await fetch(`${"baseurl"}/play`, {
          method: 'POST',
          body: JSON.stringify({
            gameId: gameState.gameId,
            action,
            subject,
            target,
            sessionId: localState.meId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to execute action');
        }

        const result = await response.json();
        return result.actionState;
      } catch (error) {
        console.error('Action failed:', error);
        return basicActionState; // Return unchanged state on error
      }
    }

    // Handle local game logic
    let actionState: ActionState = { ...basicActionState };

    // Get the action definition from game config
    const actionDef = selectedGame.actions[action];
    if (!actionDef) {
      console.error(`Unknown action: ${action}`);
      return actionState;
    }

    // Validate action can be performed
    /*if (actionDef.requirements) {
      const canPerform = actionDef.requirements.every(req => {
        // Evaluate requirement against current state
        return evaluateRequirement(req, actionState, subject, target);
      });
      
      if (!canPerform) {
        return actionState;
      }
    }*/

    // Apply action effects
    /*if (actionDef.set) {
      actionState = await actionDef.set(actionState, subject, target);
    }*/

    // Update sequence/turn state
    const nextStep = getNextStep(actionState, actionState.gameState.activeActions);
    actionState.gameState = {
      ...actionState.gameState,
      activeStep: nextStep,
    };

    return actionState;
  });

  const handlePressHex = useUpdatingRef((hex: HexItem) => {
    let actionState: ActionState = {
      ...basicActionState,
      targetHex: hex,
    };

    const canInteract = isPlayerTurn(gameState, localState) && localState.mapManager.state === 'play';
    const somethingSelected = Object.values(localState.selectionState).length > 0;
    if (somethingSelected && localState.previewState[hex.key] && !localState.previewState[hex.key].preview.interaction && canInteract) {
      // This needs to trigger the interaction/next part of the sequence

      // Create interaction request with selected hex as target
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

      // Apply the interaction via sequencer
      actionState = doSequence(actionState, request);
    } else {
      // Local only
      console.log("localState pre", actionState.localState);
      actionState = selectHex(actionState);
      console.log("localState post", actionState.localState);
      if (canInteract) {
        actionState = showPreview(actionState);
      }
    }

    setLocalState({ ...actionState.localState });
    setGameState(actionState.gameState);
    setMapState({ ...actionState.mapState });
  });

  const handleSystemAction = useUpdatingRef((kind: SystemAction['kind']) => {
    let actionState: ActionState = basicActionState;

    actionState = activateSystemAction(kind, actionState);

    setLocalState(actionState.localState);
    setGameState(actionState.gameState);
    setMapState({ ...actionState.mapState });
  });

  const saveActionState = useUpdatingRef((actionState: ActionState) => {
    setLocalState(actionState.localState);
    setGameState(actionState.gameState);
    setMapState(actionState.mapState);
  });

  // add a check so this only runs once per render
  const [hasActivated, setHasActivated] = useState(false);
  useEffect(() => {
    // Kick off 'interact' call
    // Do local 'interact'
    // Do final 'interact' result from call
    /*const activeStep = sequenceMap[gameState.activeStep];
    console.log(' ----- activating step', gameState.activeStep, activeStep?.type);
    if (activeStep) {
      saveActionState.current(activateStep(basicActionState, activeStep));
    }*/
    let actionState: ActionState = basicActionState;

    console.log(' ----- activating step', gameState.activeStep);
    actionState = doSequence(actionState, {
      type: 'continue',
      playerId: actionState.localState.meId,
    });

    setLocalState({ ...actionState.localState });
    setGameState({ ...actionState.gameState });
    setMapState({ ...actionState.mapState });
  }, [gameState.activeStep]);

  return (
    <GameControllerContext.Provider
      value={{
        pressHex: handlePressHex,
        systemAction: handleSystemAction,
        basicActionState,
        saveActionState,
      }}
    >
      {children}
    </GameControllerContext.Provider>
  );
};

export const useGameController = () => useContext(GameControllerContext);
