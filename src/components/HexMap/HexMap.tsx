import Box from '@mui/material/Box';
import { useState } from 'react';
import { isDev } from '../../configuration/constants';
import { gameDefinition } from '../../configuration/gameDefinition';
import { Tile } from '../../types';
import { Action } from '../../types/actions/interactions';
import { ActionState, GameState } from '../../types/game';
import { HexItem, MapState } from '../../types/map';
import { getSelectedHex } from '../../utils/actionState/getSelectedHex';
import { mapRecord } from '../../utils/record/mapRecord';
import { useKeys } from '../../utils/useKeys';
import { useUpdatingRef } from '../../utils/useUpdatingRef';
import { showPreview } from '../logic/Map/preview/showPreview';
import { selectHex } from '../logic/Map/selectHex';
import { evalSet } from '../logic/if/getIf';
import { rangeSimple } from '../logic/tile-generators';
import { Hex } from './Hex/Hex';
import { MapFrame } from './MapFrame';
import { SelectionInfo } from './SelectionInfo';
import initialMap from './generation/initialMap';
import { initialUnits } from './generation/initialPlacement';

const generatedRange = { type: 'range' as const, range: 5 };
const allowMultiSelect = false;
const origin = { q: 0, r: 0, s: 0 };
const generateMap = true;
export const HexMap = () => {
  const pressedKeys = useKeys();
  const [gameState, setGameState] = useState<GameState>({
    player: { team1: { properties: {} }, team2: { properties: {} } },
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
      : (initialMap as MapState)
  );

  const [selectionState, setSelectionState] = useState<Record<string, HexItem>>(
    {}
  );
  const [previewState, setPreviewState] = useState<Record<string, HexItem>>({});

  const handleHexClick = useUpdatingRef((hex: HexItem) => {
    const isMultiSelect =
      pressedKeys.current['ControlLeft'] && allowMultiSelect;
    const isPreview = Object.keys(hex.preview).length > 0;
    let actionState: ActionState = {
      mapState,
      selectionState,
      previewState,
      targetHex: hex,
      gameState,
    };
    if (!isMultiSelect && isPreview) {
      console.log('Doing action for', hex, getSelectedHex(actionState));
      const previewKey = Object.keys(hex.preview)[0];
      const selectedHex = Object.values(selectionState)[0];
      const selectedUnit = selectedHex.contains?.unit;
      if (!selectedUnit) {
        console.log('Action no selected unit');
        return;
      }

      const unitDefinition = gameDefinition.unit[selectedUnit.kind];
      const interactionDefinition = unitDefinition.interactions.find(
        (x) => x.type === previewKey
      );

      const selectedHexKey = selectedHex.key;

      if (!interactionDefinition?.actions?.length) {
        console.log(
          'action no interactions defined',
          unitDefinition.interactions,
          previewKey
        );
        return;
      }
      for (const action of interactionDefinition.actions) {
        for (const set of action.set) {
          console.log('-----------------');
          evalSet(set, {
            subject: { parent: mapState, field: selectedHexKey },
            target: { parent: mapState, field: hex.key },
            context: { parent: actionState, field: 'gameState' },
          });
          console.log(
            'POST SET',
            set,
            mapState[selectedHexKey],
            mapState[hex.key]
          );
        }
      }
      const playerPostInteractions =
        gameDefinition.player['team1']?.postInteraction.filter(
          (x): x is Action => 'set' in x
        ) ?? [];
      for (const action of playerPostInteractions) {
        for (const set of action.set) {
          console.log('doing post interaction', action, set);
          evalSet(set, {
            subject: { parent: mapState, field: selectedHexKey },
            target: { parent: mapState, field: hex.key },
            context: { parent: actionState, field: 'gameState' },
          });
          console.log(actionState.gameState);
        }
      }
      actionState = selectHex(actionState, mapState[hex.key], isMultiSelect);
      actionState = showPreview(actionState);
    } else {
      console.log(hex, hex.contains);
      console.log('Selecting hex ', hex, 'with unit', hex.contains);
      actionState = selectHex(actionState, null, isMultiSelect);
      console.log('Hex selected creating preview', actionState);
      actionState = showPreview(actionState);
    }
    setSelectionState(actionState.selectionState);
    setPreviewState(actionState.previewState);
    setGameState(actionState.gameState);
    setMapState({ ...actionState.mapState });
  });

  return (
    <>
      {isDev && (
        <Box position="absolute" top="10px" right="10px" zIndex={1000}>
          {Object.values(selectionState).map((x) => (
            <SelectionInfo key={x.key} item={x} />
          ))}
        </Box>
      )}
      <MapFrame>
        <Box id="inner-inner" position="relative">
          {Object.values(mapState).map((x) => {
            return <Hex key={x.key} item={x} onSelectedRef={handleHexClick} />;
          })}
        </Box>
      </MapFrame>
    </>
  );
};
