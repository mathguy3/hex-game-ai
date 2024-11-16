import { Box, List, ListItem, Typography } from '@mui/material';
import { useEffect } from 'react';
import { isDev } from '../../configuration/constants';
import { useGameController } from '../logic/game-controller/GameControllerProvider';
import { clearPreviews } from '../logic/map/preview/clearMapPreview';
import { Hex } from './Hex/Hex';
import { MapFrame } from './MapFrame';
import { SelectionInfo } from './SelectionInfo';

export const HexMap = () => {
  const { pressHex, saveActionState, basicActionState } = useGameController();
  const { localState, mapState, gameState, gameDefinition } = basicActionState;
  console.log('HexMap', basicActionState.mapState);

  useEffect(() => {
    console.log('HexMap useEffect', localState.mapManager.state);
    // TODO: this is local state now
    if (localState.mapManager.state === 'play') {
      console.log('basicActionState', basicActionState);
      //saveActionState.current(applyPreviewTiles(basicActionState, localState.mapManager.selector, 'interaction'));
    } else {
      saveActionState.current(clearPreviews(basicActionState));
    }
  }, [localState.mapManager.state]);

  return (
    <>
      {isDev && (
        <Box position="absolute" top="10px" right="10px" zIndex={1000}>
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
            <Typography variant="subtitle2">Players:</Typography>
            <List dense>
              {Object.values(gameState.players).map((player) => {
                if (!player) return null;
                return (
                  <ListItem key={player.teamId} sx={{
                    color: player.teamId === gameState.activePlayerId ? 'primary.main' : 'text.primary'
                  }}>
                    {` - ${player.name ?? player.teamId}`}{player.teamId === localState.meId && ' (me)'}
                    {player.teamId === gameState.activePlayerId && ' (active)'}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      )}
      <MapFrame>
        <Box id="inner-inner" position="relative" >
          {Object.values(mapState).map((x) => {
            if (x.key === '0.0.0') {
              console.log('HexMap render', x);
            }
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
