import Box from '@mui/material/Box';
import React, { useCallback } from 'react';
import { colors } from '../../../configuration/colors';
import { gridColumnWidth, gridRowHeight, isDev } from '../../../configuration/constants';
import { Preview } from '../../../types/actions/preview';
import { HexItem } from '../../../types/map';
import { Soldier } from '../../Soldier/Soldier';
import { HexImg } from './HexImg';

type HexProps = {
  item: HexItem;
  isSelected: boolean;
  preview: Record<string, Preview> | undefined;
  onSelectedRef: React.MutableRefObject<(hex: HexItem) => void>;
};

const flipYRender = false;
const renderqs = false;

export const Hex = React.memo(({ item, isSelected, preview, onSelectedRef }: HexProps) => {
  if (item.key === '0.0.0') {
    console.log('Hex render', item);
  }
  const { coordinates } = item;
  if (!coordinates) {
    console.log(item);
  }
  const s = coordinates.s ?? -(coordinates.q + coordinates.r);
  console.assert(coordinates.q + coordinates.r + s === 0, `Invalid coordinate ${JSON.stringify(coordinates)}`);

  const leftOffset = coordinates.q * 0.75 * gridColumnWidth;
  const topOffset = flipYRender
    ? -coordinates.r * gridRowHeight - coordinates.q * (gridRowHeight / 2)
    : coordinates.r * gridRowHeight + coordinates.q * (gridRowHeight / 2);

  const handlSelection = useCallback(() => {
    onSelectedRef.current?.(item);
  }, [item, onSelectedRef]);

  if (isSelected) {
    console.log("yeah i'm selected", coordinates);
  }

  const hexPreview =
    preview?.['attack'] ??
    preview?.['movement'] ??
    ({
      type: 'none',
      color: isSelected ? colors.hex.selection : '#000',
      tile: { type: 'tile', coordinates: item.coordinates, key: item.key },
    } as Preview);

  if (Object.keys(hexPreview).length) {
    //console.log('preview!', item.key, item.preview);
  }

  //console.log('rendering', coordinates, item.contains);

  if (item.contains.unit) {
    //console.log('THIS SPACE HAS UNIT', item.key, item.contains.unit);
  }
  const teamColor = { team1: '#0000ff', team2: '#ff0000' }[item.contains.unit?.aspects.team?.value];
  if (item.contains.unit) {
    //console.log('team color', teamColor);
  }
  const isPreview = hexPreview.type !== 'none';
  return (
    <Box
      position="absolute"
      left={leftOffset}
      top={topOffset}
      onClick={handlSelection}
      zIndex={isSelected || isPreview ? 1 : 0}
    >
      {isDev && (
        <div style={{ userSelect: 'none', fontSize: '12px' }}>
          <Box position="absolute" top="5px" left={gridColumnWidth / 2 - 5}>
            {renderqs ? 'q' : coordinates.q}
          </Box>
          <Box position="absolute" top={gridRowHeight * 0.6} left={gridColumnWidth * 0.75}>
            {renderqs ? 'r' : coordinates.r}
          </Box>
          <Box position="absolute" top={gridRowHeight * 0.6} left={gridColumnWidth * 0.2}>
            {renderqs ? 's' : s}
          </Box>
        </div>
      )}
      <HexImg width={gridColumnWidth} strokeWidth={isSelected || isPreview ? 4 : 2} color={hexPreview.color} />
      {item.contains.unit && <Soldier key={item.contains.unit.id} item={item.contains.unit} />}
      {/*Object.keys(item.preview)*/}
      <Box
        position="absolute"
        top={gridRowHeight * 0.7}
        left={gridColumnWidth * 0.24}
        width="50px"
        height="5px"
        bgcolor={teamColor}
      />

      {hexPreview.tile.type === 'pathrange' ? (
        <Box position="absolute" top={gridRowHeight * 0.35} left={gridColumnWidth * 0.45} fontWeight={800}>
          {hexPreview.tile.pathRange}
        </Box>
      ) : undefined}
    </Box>
  );
});
