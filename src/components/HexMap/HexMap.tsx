import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { isDev } from '../../configuration/constants';
import { useGameController } from '../logic/game-controller/GameControllerProvider';
import { clearPreviews } from '../logic/map/preview/clearMapPreview';
import { Hex } from './Hex/Hex';
import { MapFrame } from './MapFrame';
import PlayerList from './PlayerList';
import { SelectionInfo } from './SelectionInfo';

export const HexMap = () => {
  const { pressHex, saveActionState, basicActionState, doAction } = useGameController();
  const { localState, mapState, gameState, gameDefinition } = basicActionState;

  const handleStartGame = () => {
    doAction.current({
      playerId: localState.meId,
      type: 'start'
    });
  };

  useEffect(() => {
    if (localState.mapManager.state === 'play') {
      //saveActionState.current(applyPreviewTiles(basicActionState, localState.mapManager.selector, 'interaction'));
    } else {
      saveActionState.current(clearPreviews(basicActionState));
    }
  }, [localState.mapManager.state]);

  return (
    <>
      {!gameState.hasStarted && (
        <Box position="absolute" top="16px" right="16px" zIndex={1000}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartGame}
            sx={{ minWidth: '120px' }}
          >
            Start Game
          </Button>
        </Box>
      )}

      {isDev && (
        <Box position="absolute" top="60px" right="10px" zIndex={1000}>
          {Object.values(localState.selectionState).map((x) => (
            <SelectionInfo key={x.key} item={x} />
          ))}
          <Box sx={{
            bgcolor: 'background.paper',
            p: 1,
            mt: 2,
            border: '1px solid grey',
            borderRadius: 1
          }}>
            <PlayerList
              players={gameState.players}
              activePlayerId={gameState.activePlayerId}
              meId={localState.meId}
            />
          </Box>
        </Box>
      )}
      <MapFrame>
        <Box id="inner-inner" position="relative" >
          {Object.values(mapState).map((x) => {
            return <Hex key={x.key} item={x} isSelected={!!localState.selectionState[x.key]} preview={localState.previewState[x.key]?.preview} onSelectedRef={pressHex} />;
          })}
        </Box>
      </MapFrame>
      <Box position="fixed" top={0} left={150}>
        {gameState.activePlayerId}
      </Box>
    </>
  );
};
