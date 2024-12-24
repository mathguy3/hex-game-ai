import { Box, Button } from '@mui/material';
import { MapInteractionCSS } from 'react-map-interaction';
import { isDev } from '../../configuration/constants';
import { useGameController } from '../../logic/game-controller/GameControllerProvider';
import { useDragState } from '../CardManager/DragStateProvider';
import PlayerList from './HexMap/PlayerList';
import { SelectionInfo } from './HexMap/SelectionInfo';

export const TableFrame = ({ children }: React.PropsWithChildren) => {
  const { isDragging } = useDragState();
  const { basicActionState, doAction } = useGameController();
  const { gameState, localState, gameDefinition } = basicActionState;
  const ui = gameDefinition.ui;

  const handleStartGame = () => {
    doAction.current({
      playerId: localState.meId,
      type: 'start',
    });
  };

  const maxWidth = 550;
  const maxHeight = 400;
  const scale = Math.min(maxWidth / ui.styles.width, maxHeight / ui.styles.height);

  return (
    <Box position="relative" width="100%" height={gameDefinition.config.useHand ? 'calc(100vh - 25px)' : '100vh'}>
      {!gameState.hasStarted && (
        <Box position="absolute" top="16px" right="16px" zIndex={1000}>
          <Button variant="contained" color="primary" onClick={handleStartGame} sx={{ minWidth: '120px' }}>
            Start Game
          </Button>
        </Box>
      )}

      {isDev && (
        <Box position="absolute" top="60px" right="10px" zIndex={1000}>
          {Object.values(localState.selectionState).map((x) => (
            <SelectionInfo key={x.key} item={x} />
          ))}
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 1,
              mt: 2,
              border: '1px solid grey',
              borderRadius: 1,
            }}
          >
            <PlayerList players={gameState.players} activePlayerId={gameState.activePlayerId} meId={localState.meId} />
          </Box>
        </Box>
      )}
      <MapInteractionCSS
        minScale={0.1}
        maxScale={10}
        defaultValue={{
          scale: scale,
          translation: {
            x: 375 - (ui.styles.width * scale) / 2,
            y: 210 - (ui.styles.height * scale) / 2,
          },
        }}
        showControls={false}
        disablePan={isDragging}
        disableZoom={isDragging}
      >
        {children}
      </MapInteractionCSS>
    </Box>
  );
};
