import { Box } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gridColumnWidth, gridRowHeight } from '../../configuration/constants';

const generatedRange = 3;
export const MapFrame = ({ children }: React.PropsWithChildren) => {
  const [scale, setScale] = useState(0.4);
  const offset = useRef({
    left: (generatedRange + 0.5) * gridColumnWidth + 100,
    top: (generatedRange + 0.5) * gridRowHeight - 105,
  });
  const mapRef = useRef<HTMLElement>();
  const innerRef = useRef<HTMLElement>();
  const mainTouch = useRef<Touch | undefined>();
  const mainTouchPoint = useRef<{ left: number; top: number } | undefined>();
  const handleZoom = useCallback(
    (event: WheelEvent) => {
      if (!innerRef.current || !mapRef.current) {
        return;
      }
      event.preventDefault();

      // Get mouse position relative to the viewport
      const rect = mapRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate mouse position relative to the scaled content
      const contentX = (mouseX - offset.current.left) / scale;
      const contentY = (mouseY - offset.current.top) / scale;

      // Calculate new scale with bounds
      const zoomIn = event.deltaY < 0;
      const nextScale = Math.min(Math.max(
        zoomIn ? scale * 1.15 : scale * 0.85,
        0.2  // minimum zoom
      ), 2.0); // maximum zoom

      // Calculate new offset to keep mouse position fixed
      const newLeft = mouseX - contentX * nextScale;
      const newTop = mouseY - contentY * nextScale;

      // Update scale and position
      setScale(nextScale);
      offset.current = { left: newLeft, top: newTop };

      // Apply transformations
      innerRef.current.style.transform = `scale(${nextScale})`;
      innerRef.current.style.left = `${newLeft}px`;
      innerRef.current.style.top = `${newTop}px`;
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
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </Box>
    </Box>
  );
};
