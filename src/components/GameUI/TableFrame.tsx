import { Box, Button } from '@mui/material';
import { MapInteractionCSS } from 'react-map-interaction';
import { isDev } from '../../configuration/constants';
import { useDragState } from '../CardManager/DragStateProvider';
import { PlayerList } from './HexMap/PlayerList';
import { useGameSession } from '../../logic/game-controller/context/GameSessionProvider';
import { useClient } from '../../logic/client';
import { GameHistory } from './HexMap/GameHistory';

export const TableFrame = ({ children }: React.PropsWithChildren) => {
  const { isDragging } = useDragState();
  const { user } = useClient();
  const { gameSession } = useGameSession();
  const { gameState, gameDefinition } = gameSession;
  const ui = (gameDefinition.ui.shared as any).zone;
  //console.log(gameDefinition.ui);

  const primaryWidth = ui.styles?.width ?? 1;
  const primaryHeight = ui.styles?.height ?? 1;

  const handleStartGame = () => {
    /*doAction.current({
      playerId: localState.meId,
      type: 'start',
    });*/
  };

  const maxWidth = 550;
  const maxHeight = 400;
  const scale = Math.min(maxWidth / primaryWidth, maxHeight / primaryHeight);

  console.log('active playerid', gameState.activeId, user.userId);
  return (
    <Box position="relative" width="100%" height={gameDefinition.config.useHand ? 'calc(100vh - 25px)' : '100vh'}>
      {/*!gameState.hasStarted && (
        <Box position="absolute" top="16px" right="16px" zIndex={1000}>
          <Button variant="contained" color="primary" onClick={handleStartGame} sx={{ minWidth: '120px' }}>
            Start Game
          </Button>
        </Box>
      )*/}

      <>
        <Box position="absolute" top="20px" right="10px" zIndex={1000}>
          {/*Object.values(localState.selectionState).map((x) => (
            <SelectionInfo key={x.key} item={x} />
          ))*/}
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 1,
              mt: 2,
              border: '1px solid grey',
              borderRadius: 1,
            }}
          >
            <PlayerList
              seatConfig={gameDefinition.definitions.seats}
              seats={gameState.seats}
              activeId={gameState.activeId}
              meId={user.userId}
            />
          </Box>
        </Box>
        <Box position="absolute" bottom="20px" right="10px" zIndex={1}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 1,
              mt: 2,
              border: '1px solid grey',
              borderRadius: 1,
            }}
          >
            <GameHistory history={gameState.history} />
          </Box>
        </Box>
      </>
      <MapInteractionCSS
        minScale={0.1}
        maxScale={10}
        defaultValue={{
          scale: scale,
          translation: {
            x: 375 - (primaryWidth * scale) / 2,
            y: 210 - (primaryHeight * scale) / 2,
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
