import { Box } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gridColumnWidth, gridRowHeight } from '../../configuration/constants';

const generatedRange = 3;
export const MapFrame = ({ children }: React.PropsWithChildren) => {
  const [scale, setScale] = useState(1);
  const offset = useRef({
    left: (generatedRange + 0.5) * gridColumnWidth,
    top: -(generatedRange + 0.5) * gridRowHeight,
  });
  const mapRef = useRef<HTMLElement>();
  const innerRef = useRef<HTMLElement>();
  const mainTouch = useRef<Touch | undefined>();
  const mainTouchPoint = useRef<{ left: number; top: number } | undefined>();
  const handleZoom = useCallback(
    (event: any) => {
      if (!innerRef.current) {
        return;
      }
      event.preventDefault();
      const zoomIn = event.deltaY < 0;
      const nextScale = zoomIn ? scale * 1.25 : scale * 0.8;
      setScale(nextScale);
      innerRef.current.style['transform'] = `scale(${nextScale})`;
    },
    [scale]
  );
  const handleMove = useCallback((event: TouchEvent) => {
    if (
      mainTouch.current?.identifier === undefined ||
      mainTouchPoint.current === undefined ||
      innerRef.current === undefined
    ) {
      return;
    }
    const movement = {
      left:
        event.changedTouches[mainTouch.current.identifier].clientX -
        mainTouch.current.clientX,
      top:
        event.changedTouches[mainTouch.current.identifier].clientY -
        mainTouch.current.clientY,
    };

    const left = movement.left + mainTouchPoint.current.left;
    const top = movement.top + mainTouchPoint.current.top;
    innerRef.current.style['left'] = `${left}px`;
    innerRef.current.style['top'] = `${top}px`;
    offset.current = { left, top };
  }, []);
  const handleMoveStart = useCallback((event: any) => {
    mainTouchPoint.current = offset.current;
    mainTouch.current = event.touches[0];
  }, []);
  const handleMoveEnd = useCallback(() => {
    mainTouchPoint.current = undefined;
    mainTouch.current = undefined;
  }, []);
  useEffect(() => {
    mapRef.current?.addEventListener('wheel', handleZoom, { passive: false });
    mapRef.current?.addEventListener('scroll', handleZoom, { passive: true });
    return () => {
      mapRef.current?.removeEventListener('wheel', handleZoom);
      mapRef.current?.removeEventListener('scroll', handleZoom);
    };
  }, [handleZoom]);

  useEffect(() => {
    mapRef.current?.addEventListener('touchstart', handleMoveStart);
    mapRef.current?.addEventListener('touchmove', handleMove);
    mapRef.current?.addEventListener('touchend', handleMoveEnd);
    return () => {
      mapRef.current?.removeEventListener('touchstart', handleMoveStart);
      mapRef.current?.removeEventListener('touchmove', handleMove);
      mapRef.current?.removeEventListener('touchend', handleMoveEnd);
    };
  }, [handleMove]);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.style['left'] = `${offset.current.left}px`;
      innerRef.current.style['top'] = `${offset.current.top}px`;
    }
  }, [innerRef.current]);
  return (
    <Box flex="1" id="outer" ref={mapRef} overflow="hidden" position="relative">
      <Box
        component="div"
        id="inner"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        ref={innerRef}
      >
        {children}
      </Box>
    </Box>
  );
};
