import { Box, Button as MUIButton } from '@mui/material';
import { useGameController } from '../../../logic/game-controller/GameControllerProvider';
import { useIf } from '../../../logic/if/if-engine-3/useIf';
import { ButtonUIModel, UI } from './UI';
import { mapStyles } from './utils/mapStyles';
import { useCallback, useMemo } from 'react';

export const Button = ({ id, styles, content, action, disabled }: ButtonUIModel) => {
  const { basicActionState, doAction } = useGameController();
  const { doEval, doIf } = useIf(basicActionState.gameState);
  const mappedStyles = mapStyles(styles, doEval);
  const isDisabled = useMemo(() => (disabled !== undefined ? doIf(disabled) : false), [disabled, doIf]);
  //console.log('isDisabled', id, isDisabled, disabled);
  if (content && typeof content !== 'string' && !('type' in content)) {
    throw new Error('Button content must be a string');
  }

  const handleClick = useCallback(() => {
    console.log('action', action);
    if (action) {
      doAction.current({
        type: 'interact',
        subjects: [{ id, type: 'ui' }],
        playerId: basicActionState.localState.meId,
      });
    }
  }, [action, basicActionState.localState.meId]);
  return (
    <Box sx={{ ...mappedStyles }}>
      <MUIButton
        variant="contained"
        color={mappedStyles.color ?? 'primary'}
        sx={{ fontSize: 32, textTransform: 'none' }}
        disabled={isDisabled}
        onClick={(e) => {
          e.preventDefault();
          //console.log('test');
          handleClick();
        }}
      >
        {content ? typeof content === 'string' ? content : <UI {...content} /> : null}
      </MUIButton>
    </Box>
  );
};
