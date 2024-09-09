import { useState } from 'react';
import { origin } from '../../../configuration/constants';
import { HexItem, MapState, Tile } from '../../../types';
import { SystemAction } from '../../../types/actions/interactions';
import { ActionState, GameState } from '../../../types/game';
import { mapRecord } from '../../../utils/record/mapRecord';
import { useUpdatingRef } from '../../../utils/useUpdatingRef';
import { initialUnits } from '../../HexMap/generation/initialPlacement';
import { rangeSimple } from '../tile-generators';
import { useGameDefinition } from './GameDefinitionProvider';
import { pressHex } from './interactions/pressHex';
import { activateSystemAction } from './system-actions/activate-system-action';

const generatedRange = { type: 'range' as const, range: 5 };
const generateMap = false;

export const useGameController = () => {
  const { game: selectedGame } = useGameDefinition();
  const [gameState, setGameState] = useState<GameState>({
    players: {
      team1: {
        properties: {
          isTurnUsed: false,
        },
        hand: [
          {
            id: '1',
            kind: 'time-1',
            properties: { ...selectedGame.game.cards['time-1'].properties },
          },
          {
            id: '2',
            kind: 'time-1',
            properties: { ...selectedGame.game.cards['time-1'].properties },
          },
          {
            id: '3',
            kind: 'time-1',
            properties: { ...selectedGame.game.cards['time-1'].properties },
          },
        ],
      },
      team2: {
        properties: {
          isTurnUsed: false,
        },
      },
      team3: {
        properties: {
          isTurnUsed: false,
        },
      },
    },
    activePlayerId: 'team1',
    meId: 'team1',
  });
  const [mapState, setMapState] = useState<MapState>(
    generateMap
      ? mapRecord(rangeSimple(generatedRange, origin, true), (x: Tile) => ({
          type: 'hex',
          key: x.key,
          kind: x.coordinates.q === -2 ? 'river' : 'hex',
          aspects: {},
          coordinates: x.coordinates,
          isSelected: false,
          contains: { unit: initialUnits[x.key] },
          preview: {},
        }))
      : selectedGame.game.map
  );
  const [selectionState, setSelectionState] = useState<Record<string, HexItem>>({});
  const [previewState, setPreviewState] = useState<Record<string, HexItem>>({});

  const basicActionState: ActionState = {
    mapState,
    selectionState,
    previewState,
    targetHex: undefined,
    selectedHex: Object.values(selectionState)[0],
    gameState,
    activePlayer: gameState.players[gameState.activePlayerId],
  };

  const handlePressHex = useUpdatingRef((hex: HexItem) => {
    let actionState: ActionState = {
      ...basicActionState,
      selectedHex: Object.values(selectionState)[0],
    };

    actionState = pressHex(actionState, selectedGame);

    setSelectionState(actionState.selectionState);
    setPreviewState(actionState.previewState);
    setGameState(actionState.gameState);
    setMapState({ ...actionState.mapState });
  });

  const handleSystemAction = useUpdatingRef((type: SystemAction['type']) => {
    let actionState: ActionState = basicActionState;

    actionState = activateSystemAction(type, actionState, selectedGame);

    setSelectionState(actionState.selectionState);
    setPreviewState(actionState.previewState);
    setGameState(actionState.gameState);
    setMapState({ ...actionState.mapState });
  });

  const saveActionState = useUpdatingRef((actionState: ActionState) => {
    setSelectionState(actionState.selectionState);
    setPreviewState(actionState.previewState);
    setGameState(actionState.gameState);
    setMapState(actionState.mapState);
  });

  return {
    mapState,
    selectionState,
    gameState,
    pressHex: handlePressHex,
    systemAction: handleSystemAction,
    basicActionState,
    saveActionState,
  };
};
