import { Box } from '@mui/material';
import { HexMapUIModel, UI } from '../UI';
import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';
import { Hex } from './Hex';
import { mapStyles } from '../utils/mapStyles';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { useMapSelection } from '../../../../logic/game-controller/context/MapSelectionProvider';

const transitionTypes = ['move'];

export const HexMap = ({ id, styles, spaces }: HexMapUIModel) => {
  const { gameSession, transitions: localTransitions } = useGameSession();
  const { selectedHex, previewState, selectHex } = useMapSelection();
  const { gameState } = gameSession;
  const { doEval } = useIf(gameState);
  const content = gameState.data[id];

  const stores = gameState.data;

  const mappedStyles = styles ? mapStyles(styles, doEval) : {};
  const transitions = localTransitions
    ? Object.entries(localTransitions)
        .filter(([key, value]) => transitionTypes.includes(key) && id == value.from.store && spaces[value.from.id])
        .reduce((acc, [key, value]) => {
          acc[value.from.id] = {
            from: value.from,
            fromItem: spaces[value.from.id],
            to: value.to,
            toItem: value.to.store === 'supply' ? null : stores[value.to.store][value.to.id],
            type: key,
          };
          return acc;
        }, {} as Record<string, any>)
    : {};

  console.log('local transitions', localTransitions);
  console.log('transitions', id, transitions);

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
            //console.log('onClick', key);
            selectHex(space);
          }}
          transition={transitions[key]}
        />
      ))}
    </Box>
  );
};
