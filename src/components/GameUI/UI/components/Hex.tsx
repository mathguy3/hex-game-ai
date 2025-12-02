import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { gridColumnWidth, gridRowHeight } from '../../../../configuration/constants';
import { Coordinates } from '../../../../types/coordinates';
import { HexImg } from '../../HexMap/Hex/HexImg';
import blinkblade from '../../../../images/tokens/blinkblade.png';
import enemy from '../../../../images/tokens/enemy.png';
import { useTouchTap } from '../utils/useTouchTap';
import { UI } from '../UI';

const tokenIcon = {
  blinkblade: <img width={50} src={blinkblade} alt="blinkblade" />,
  enemy: <img width={50} src={enemy} alt="enemy" />,
};

type HexProps = {
  id: string;
  data: any;
  hex: any;
  isSelected: boolean;
  isTargeted: boolean;
  preview: Record<string, any>;
  selectHex: React.MutableRefObject<(hex: any) => void>;
  transition: any;
  slots: Record<string, any>;
};

const previewColor = {
  selected: 'green',
  select: 'blue',
  target: 'yellow',
  targeted: 'red',
};

function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

export const Hex = React.memo(
  ({ id, hex, data, slots, selectHex, isSelected, isTargeted, preview, transition }: HexProps) => {
    const { coordinates } = data ?? {};
    const { left, top } = offsetFromCoordinates(coordinates);

    const { handleTouchStart, handleTouchEnd, handleTouchCancel } = useTouchTap(() => selectHex.current(data));

    useTraceUpdate({ id, hex, data, slots, selectHex, isSelected, isTargeted, preview, transition });
    if (preview) {
      //console.log('preview hex', isSelected, id, preview);
    }
    const color = isSelected ? 'green' : isTargeted ? 'red' : previewColor[preview?.type] ?? data?.color ?? '#000';

    if (data?.slot) {
      //console.log('properties', data?.slot?.properties);
    }

    let transitionOffset = { left: 0, top: 0 };
    let transitionOpacity = 1;
    if (transition) {
      if (transition.to.store === 'supply') {
        transitionOpacity = 0;
        transitionOffset = { left: 0, top: -100 };
      } else {
        console.log('hex transitions', id, transition);
        const isTransitionItem = data[transition.from.link];
        console.log('isTransitionItem', isTransitionItem);
        const toCoordinates = transition.toItem.coordinates;
        const fromCoordinates = transition.fromItem.coordinates;
        const transitionVector = {
          q: toCoordinates.q - fromCoordinates.q,
          r: toCoordinates.r - fromCoordinates.r,
          s: toCoordinates.s - fromCoordinates.s,
        };
        console.log('transitionVector', transitionVector);
        transitionOffset = offsetFromCoordinates(transitionVector);
        console.log('transitionOffset', transitionOffset);
      }
    }
    const slotKeys = Object.keys(slots);
    //console.log('slots', slots, slotKeys);
    if (data) {
      //console.log('hex', id, data, hex, isSelected, isTargeted, preview);
    }
    //console.log('data', data);
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
          console.log('onClick direct', data);
          selectHex.current(data);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        zIndex={isSelected || preview || isTargeted ? 1 : 0}
      >
        <Box position="absolute">
          <HexImg
            width={gridColumnWidth}
            strokeWidth={isSelected || preview || isTargeted ? 6 : 2}
            zIndex={1}
            color={color}
          />
          <Box position="absolute" top={'50px'} left={'50px'} zIndex={3}>
            {data?.character?.properties.health}
          </Box>
        </Box>
        {slotKeys.map((slotKey) =>
          data[slotKey] ? <UI key={slotKey} {...slots[slotKey]} data={data[slotKey]} /> : null
        )}
        <Box
          position="absolute"
          top={50}
          right={15}
          zIndex={99}
          color="white"
          bgcolor="#00000080"
          borderRadius={10}
          p={'2px'}
        >
          {coordinates.q},{coordinates.r},{coordinates.s}
        </Box>
        {/*data?.character && (
        <Box
          zIndex={2}
          sx={
            transition
              ? {
                  transition: 'all 0.75s ease-in-out',
                  transform: `translate(${transitionOffset.left}px, ${transitionOffset.top}px)`,
                }
              : {}
          }
        >
          {tokenIcon[data.character.kind] ?? NoPhotographyIcon}
        </Box>
      )}*/}
      </Box>
    );
  }
);

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
