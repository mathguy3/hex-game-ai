import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { isDev } from '../../configuration/constants';
import { useGameController } from '../logic/game-controller/GameControllerProvider';
import { Hex } from './Hex/Hex';
import { MapFrame } from './MapFrame';
import { SelectionInfo } from './SelectionInfo';

export const HexMap = () => {
  const { pressHex, systemAction, basicActionState } = useGameController();
  const { selectionState, mapState, gameState } = basicActionState;

  return (
    <>
      {isDev && (
        <Box position="absolute" top="10px" right="10px" zIndex={1000}>
          {Object.values(selectionState).map((x) => (
            <SelectionInfo key={x.key} item={x} />
          ))}
        </Box>
      )}
      <MapFrame>
        <Box id="inner-inner" position="relative">
          {Object.values(mapState).map((x) => {
            return <Hex key={x.key} item={x} onSelectedRef={pressHex} />;
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

      <Box position="fixed" top={0} left={0}>
        {gameState.activePlayerId}
      </Box>
    </>
  );
};
