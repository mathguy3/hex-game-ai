import Box from '@mui/material/Box';
import { useState } from 'react';
import { isDev } from '../../configuration/constants';
import { soldier } from '../../configuration/units/swordsman';
import { ActionState } from '../../types/game';
import { HexItem, MapState } from '../../types/map';
import { isMatch } from '../../utils/coordinates/isMatch';
import { useKeys } from '../../utils/useKeys';
import { useUpdatingRef } from '../../utils/useUpdatingRef';
import { doAction } from '../logic/Interaction/doAction';
import { showPreview } from '../logic/Map/preview/showPreview';
import { selectHex } from '../logic/Map/selectHex';
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
                key: x.key,
                kind: x.coordinates.q === -2 ? 'river' : 'hex',
                aspects:
                  x.coordinates.q === -1
                    ? {
                        hot: { type: 'hot' },
                      }
                    : {},
                coordinates: x.coordinates,
                isSelected: false,
                contains: isMatch(x.coordinates, origin) ? [soldier] : [],
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
      // Todo: have different zones for multiple possible actions?
      actionState = doAction(actionState);
      actionState = showPreview(actionState);
    } else {
      actionState = selectHex(actionState, isMultiSelect);
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
