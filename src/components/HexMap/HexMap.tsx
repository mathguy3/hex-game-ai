import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { isDev } from '../../configuration/constants';
import { useGameController } from '../logic/game-controller/GameControllerProvider';
import { clearPreviews } from '../logic/map/preview/clearMapPreview';
import { Hex } from './Hex/Hex';
import { MapFrame } from './MapFrame';
import { SelectionInfo } from './SelectionInfo';

export const HexMap = () => {
  const { pressHex, systemAction, saveActionState, basicActionState } = useGameController();
  const { localState, mapState, gameState } = basicActionState;
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
        </Box>
      )}
      <MapFrame>
        <Box id="inner-inner" position="relative">
          {Object.values(mapState).map((x) => {
            if (x.key === '0.0.0') {
              console.log('HexMap render', x);
            }
            return <Hex key={x.key} item={x} isSelected={!!localState.selectionState[x.key]} preview={localState.previewState[x.key]?.preview} onSelectedRef={pressHex} />;
          })}
        </Box>
      </MapFrame>

      <Box position="fixed" top={0} right={0}>
        <Button
          variant="contained"
          disabled={/*!isPlayerTurn(gameState)*/ false}
          onClick={() => systemAction.current('end-turn')}
        >
          {'End turn'}
        </Button>
      </Box>
      <Box position="fixed" top={0} left={150}>
        {gameState.activePlayerId}
      </Box>
    </>
  );
};
