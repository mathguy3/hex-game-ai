import { Box, Button as MUIButton } from '@mui/material';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { ButtonUIModel, UI } from '../UI';
import { mapStyles } from '../utils/mapStyles';
import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';

export const Button = ({ id, styles, content, action, disabled }: ButtonUIModel) => {
  const { gameSession } = useGameSession();
  const { doEval } = useIf(gameSession);
  if (content && typeof content !== 'string' && !('type' in content)) {
    throw new Error('Button content must be a string');
  }

  const mappedStyles = styles ? mapStyles(styles, doEval) : {};
  console.log(mappedStyles);
  return (
    <Box sx={{ ...mappedStyles }}>
      <MUIButton
        variant="contained"
        color={mappedStyles.color ?? 'primary'}
        size="small"
        sx={{ fontSize: 24, textTransform: 'none' }}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {content ? typeof content === 'string' ? content : <UI {...content} /> : null}
      </MUIButton>
    </Box>
  );
};
