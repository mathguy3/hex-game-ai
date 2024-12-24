import { Box } from '@mui/material';
import { useGameController } from '../../../logic/game-controller/GameControllerProvider';
import { Hex } from './Hex/Hex';

export const HexMap = () => {
  const { pressHex, basicActionState } = useGameController();
  const { localState, mapState } = basicActionState;

  return (
    <Box id="inner-inner" position="relative">
      {Object.values(mapState).map((x) => {
        return (
          <Hex
            key={x.key}
            item={x}
            isSelected={!!localState.selectionState[x.key]}
            preview={localState.previewState[x.key]?.preview}
            onSelectedRef={pressHex}
          />
        );
      })}
    </Box>
  );
};
