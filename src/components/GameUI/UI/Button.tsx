import { Box, Button as MUIButton } from '@mui/material';
import { useGameController } from '../../../logic/game-controller/GameControllerProvider';
import { useIf } from '../../../logic/if/if-engine-3/useIf';
import { ButtonUIModel, UI } from './UI';
import { mapStyles } from './utils/mapStyles';

export const Button = ({ styles, content, properties }: ButtonUIModel) => {
  const { basicActionState } = useGameController();
  const { disabled } = properties;
  const { doEval, doIf } = useIf(basicActionState.gameState);
  const mappedStyles = mapStyles(styles, doEval);

  if (content && typeof content !== 'string' && !('type' in content)) {
    throw new Error('Button content must be a string');
  }
  return (
    <Box sx={{ ...mappedStyles }}>
      <MUIButton
        variant="contained"
        color={mappedStyles.color ?? 'primary'}
        sx={{ fontSize: 32, textTransform: 'none' }}
        disabled={doIf(disabled)}
      >
        {typeof content === 'string' ? content : <UI {...content} />}
      </MUIButton>
    </Box>
  );
};
