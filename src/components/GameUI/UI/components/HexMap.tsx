import { Box } from '@mui/material';
import { HexMapUIModel, UI } from '../UI';
import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';
import { Hex } from './Hex';
import { mapStyles } from '../utils/mapStyles';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { useMapSelection } from '../../../../logic/game-controller/context/MapSelectionProvider';

export const HexMap = ({ id, styles, spaces }: HexMapUIModel) => {
  const { gameSession } = useGameSession();
  const { selectedHex, previewState, selectHex } = useMapSelection();
  const { doEval } = useIf(gameSession.gameState);
  const content = gameSession.gameState.data[id];

  const mappedStyles = styles ? mapStyles(styles, doEval) : {};
  //console.log('spaces', spaces);
  console.log('selectedHex', selectedHex);
  return (
    <Box sx={{ ...mappedStyles }}>
      {Object.entries(spaces).map(([key, space]) => (
        <Hex
          key={key}
          id={key}
          coordinates={space.coordinates}
          data={content[key]}
          isSelected={selectedHex?.id === key}
          preview={previewState[key]}
          onClick={() => {
            console.log('onClick', key);
            selectHex(space);
          }}
        />
      ))}
    </Box>
  );
};
