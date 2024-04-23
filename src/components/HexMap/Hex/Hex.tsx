import Box from '@mui/material/Box';
import React, { useCallback } from 'react';
import { colors } from '../../../configuration/colors';
import {
  gridColumnWidth,
  gridRowHeight,
  isDev,
} from '../../../configuration/constants';
import { Preview } from '../../../types/actions/preview';
import { HexItem } from '../../../types/map';
import { Soldier } from '../../Soldier/Soldier';
import { HexImg } from './HexImg';

type HexProps = {
  item: HexItem;
  onSelectedRef: React.MutableRefObject<(hex: HexItem) => void>;
};

export const Hex = React.memo(({ item, onSelectedRef }: HexProps) => {
  const { coordinates, isSelected } = item;
  if (!coordinates) {
    console.log(item);
  }
  const s = coordinates.s ?? -(coordinates.q + coordinates.r);
  console.assert(coordinates.q + coordinates.r + s === 0, 'Invalid coordinate');

  const leftOffset = coordinates.q * 0.75 * gridColumnWidth;
  const topOffset =
    coordinates.r * gridRowHeight + coordinates.q * (gridRowHeight / 2);

  const handlSelection = useCallback(() => {
    onSelectedRef.current?.(item);
  }, [item, onSelectedRef]);

  const preview =
    Object.values(item.preview)[0] ??
    ({
      type: 'none',
      color: isSelected ? colors.hex.selection : '#000',
      tile: { type: 'tile', coordinates: item.coordinates, key: item.key },
    } as Preview);

  if (Object.keys(item.preview).length) {
    console.log('preview!', item.key, item.preview);
  }

  //console.log('rendering', coordinates, item.contains);

  return (
    <Box
      position="absolute"
      left={leftOffset}
      top={topOffset}
      onClick={handlSelection}
      zIndex={isSelected ? 1 : 0}
    >
      {isDev && (
        <div style={{ userSelect: 'none', fontSize: '12px' }}>
          <Box position="absolute" top="5px" left={gridColumnWidth / 2 - 5}>
            {coordinates.q}
          </Box>
          <Box
            position="absolute"
            top={gridRowHeight * 0.6}
            left={gridColumnWidth * 0.75}
          >
            {coordinates.r}
          </Box>
          <Box
            position="absolute"
            top={gridRowHeight * 0.6}
            left={gridColumnWidth * 0.2}
          >
            {s}
          </Box>
        </div>
      )}
      <HexImg
        width={gridColumnWidth}
        strokeWidth={isSelected ? 4 : 2}
        color={preview.color}
      />
      {item.contains.unit && (
        <Soldier key={item.contains.unit.id} item={item.contains.unit} />
      )}
      {preview.tile.type === 'pathrange' ? (
        <Box
          position="absolute"
          top={gridRowHeight * 0.35}
          left={gridColumnWidth * 0.45}
          fontWeight={800}
        >
          {preview.tile.pathRange}
        </Box>
      ) : undefined}
    </Box>
  );
});