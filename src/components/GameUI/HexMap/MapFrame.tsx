import { MapInteractionCSS } from 'react-map-interaction';
import { useDragState } from '../../CardManager/DragStateProvider';

export const MapFrame = ({ children }: React.PropsWithChildren) => {
  const { isDragging } = useDragState();
  return (
    <MapInteractionCSS
      minScale={0.2}
      maxScale={3}
      defaultValue={{
        scale: 0.375,
        translation: { x: 375, y: 160 },
      }}
      showControls={false}
      onChange={(e) => {
        console.log('panning start', e);
      }}
      disablePan={isDragging}
      disableZoom={isDragging}
    >
      {children}
    </MapInteractionCSS>
  );
};
