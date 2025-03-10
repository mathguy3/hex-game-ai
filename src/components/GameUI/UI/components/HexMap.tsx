import { Box } from '@mui/material';
import { HexMapUIModel, UI } from '../UI';
import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';
import { Hex } from './Hex';
import { mapStyles } from '../utils/mapStyles';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { useMapSelection } from '../../../../logic/game-controller/context/MapSelectionProvider';
import { useCallback } from 'react';
import { useUpdatingRef } from '../../../../utils/useUpdatingRef';

const transitionTypes = ['move'];

export const HexMap = ({ id, styles, hex }: HexMapUIModel) => {
  const { gameSession, transitions: localTransitions } = useGameSession();
  const { selectedHex, previewState, targetState, selectHex } = useMapSelection();
  const { gameState } = gameSession;
  const { doEval } = useIf(gameState);
  const content = gameState.data[id] as Record<string, any>;

  const stores = gameState.data;

  const mappedStyles = styles ? mapStyles(styles, doEval) : {};
  const transitions = localTransitions
    ? Object.entries(localTransitions)
        .filter(([key, value]) => transitionTypes.includes(key) && id == value.from.store && content[value.from.id])
        .reduce((acc, [key, value]) => {
          acc[value.from.id] = {
            from: value.from,
            fromItem: content[value.from.id],
            to: value.to,
            toItem: value.to.store === 'supply' ? null : stores[value.to.store][value.to.id],
            type: key,
          };
          return acc;
        }, {} as Record<string, any>)
    : {};

  //console.log('local transitions', localTransitions);
  console.log('previewState', selectedHex, previewState);

  return (
    <Box sx={mappedStyles}>
      {Object.entries(content).map(([key, item]) => (
        <UI
          key={key}
          hex={hex}
          data={item}
          isSelected={selectedHex?.id === key}
          isTargeted={targetState[key]}
          preview={previewState[key]}
          transition={transitions[key]}
          selectHex={selectHex}
        />
      ))}
    </Box>
  );
};
