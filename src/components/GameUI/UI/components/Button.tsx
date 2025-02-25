import { Box, Button as MUIButton } from '@mui/material';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { ButtonUIModel, UI } from '../UI';
import { mapStyles } from '../utils/mapStyles';
import { useCallback, useMemo } from 'react';

export const Button = ({ id, styles, content, action, disabled }: ButtonUIModel) => {
  const mappedStyles = { ...styles };
  if (content && typeof content !== 'string' && !('type' in content)) {
    throw new Error('Button content must be a string');
  }

  return (
    <Box sx={{ ...mappedStyles }}>
      <MUIButton
        variant="contained"
        color={mappedStyles.color ?? 'primary'}
        sx={{ fontSize: 32, textTransform: 'none' }}
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
