import Box from '@mui/material/Box';
import { useState } from 'react';
import { isDev } from '../../configuration/constants';
import { gameDefinition } from '../../configuration/gameDefinition';
import { ActionState } from '../../types/game';
import { HexItem, MapState } from '../../types/map';
import { getSelectedHex } from '../../utils/actionState/getSelectedHex';
import { useKeys } from '../../utils/useKeys';
import { useUpdatingRef } from '../../utils/useUpdatingRef';
import { showPreview } from '../logic/Map/preview/showPreview';
import { selectHex } from '../logic/Map/selectHex';
import { evalSet } from '../logic/if/getIf';
import { range } from '../logic/tile-generators/range';
import { Hex } from './Hex/Hex';
import { MapFrame } from './MapFrame';
import { SelectionInfo } from './SelectionInfo';
import initialMap from './generation/initialMap';

const generatedRange = { type: 'range' as const, range: 7 };
const allowMultiSelect = false;
const origin = { q: 0, r: 0, s: 0 };
const generateMap = false;
export const HexMap = () => {
  const pressedKeys = useKeys();
  const [mapState, setMapState] = useState<MapState>(
    generateMap
      ? Object.fromEntries(
          range(generatedRange, origin)
            .map((x) => {
              const item: HexItem = {
                type: 'hex',
                key: x.key,
                kind: x.coordinates.q === -2 ? 'river' : 'hex',
                aspects: {},
                coordinates: x.coordinates,
                isSelected: false,
                contains: {},
                preview: {},
              };
              return item;
            })
            .map((x) => [x.key, x])
        )
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
          });
          console.log('POST SET', set, mapState[selectedHexKey]);
        }
      }
      actionState = selectHex(actionState, mapState[hex.key], isMultiSelect);
      actionState = showPreview(actionState);
    } else {
      console.log('Selecting hex ', hex, 'with unit', hex.contains[0]);
      actionState = selectHex(actionState, null, isMultiSelect);
      console.log('Hex selected creating preview', actionState);
      actionState = showPreview(actionState);
    }
    setSelectionState(actionState.selectionState);
    setPreviewState(actionState.previewState);
    setMapState(actionState.mapState);
  });

  return (
    <>
      {isDev && (
        <Box position="absolute" top="10px" right="10px">
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
