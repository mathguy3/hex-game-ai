import { MapInteractionCSS } from 'react-map-interaction';

export const MapFrame = ({ children }: React.PropsWithChildren) => {
  return (
    <MapInteractionCSS
      minScale={0.2}
      maxScale={2.0}
      defaultValue={{
        scale: 1,
        translation: { x: 0, y: 0 }
      }}
      showControls={false}
      onChange={(e) => {
        console.log('panning start', e);
      }}
    >
      {children}
    </MapInteractionCSS>
  );
};
