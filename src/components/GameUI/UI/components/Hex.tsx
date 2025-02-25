import { Box } from '@mui/material';
import React from 'react';
import { gridColumnWidth, gridRowHeight } from '../../../../configuration/constants';
import { Coordinates } from '../../../../types/coordinates';
import { HexImg } from '../../HexMap/Hex/HexImg';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import blinkblade from '../../../../images/tokens/blinkblade.png';
import enemy from '../../../../images/tokens/enemy.png';
import { useTouchTap } from '../utils/useTouchTap';

const tokenIcon = {
  blinkblade: <img width={50} src={blinkblade} alt="blinkblade" />,
  enemy: <img width={50} src={enemy} alt="enemy" />,
};

type HexProps = {
  id: string;
  coordinates: Coordinates;
  data: any;
  isSelected: boolean;
  preview: Record<string, any>;
  onClick: () => void;
};

const previewColor = {
  selected: 'green',
  select: 'blue',
  target: 'yellow',
  targeted: 'red',
};

export const Hex = React.memo(({ id, coordinates, data, isSelected, preview, onClick }: HexProps) => {
  const { left, top } = offsetFromCoordinates(coordinates);

  const { handleTouchStart, handleTouchEnd, handleTouchCancel } = useTouchTap(onClick);

  if (preview) {
    //console.log('preview hex', isSelected, id, preview);
  }
  const color = isSelected ? 'green' : previewColor[preview?.type] ?? data?.color ?? '#000';

  if (data?.slot) {
    //console.log('properties', data?.slot?.properties);
  }
  return (
    <Box
      position="absolute"
      left={left}
      top={top}
      width={gridColumnWidth}
      height={gridRowHeight}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        console.log('onClick direct', id);
        onClick();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      zIndex={isSelected || preview ? 1 : 0}
    >
      <Box position="absolute">
        <HexImg width={gridColumnWidth} strokeWidth={isSelected || preview ? 6 : 2} zIndex={1} color={color} />
        <Box position="absolute" top={'50px'} left={'50px'} zIndex={3}>
          {data?.slot?.properties.health}
        </Box>
      </Box>
      {data?.slot && <Box zIndex={2}>{tokenIcon[data.slot.kind] ?? NoPhotographyIcon}</Box>}
    </Box>
  );
});

const flipYRender = false;

function offsetFromCoordinates(coordinates: Coordinates) {
  const s = coordinates.s ?? -(coordinates.q + coordinates.r);
  console.assert(coordinates.q + coordinates.r + s === 0, `Invalid coordinate ${JSON.stringify(coordinates)}`);

  const leftOffset = coordinates.q * 0.75 * gridColumnWidth;
  const topOffset = flipYRender
    ? -coordinates.r * gridRowHeight - coordinates.q * (gridRowHeight / 2)
    : coordinates.r * gridRowHeight + coordinates.q * (gridRowHeight / 2);
  return { left: leftOffset, top: topOffset };
}
