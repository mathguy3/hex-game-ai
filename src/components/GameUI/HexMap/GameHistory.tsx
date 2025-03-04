import { List, ListItem, Typography } from '@mui/material';
import { memo } from 'react';
import { GameState } from '../../../types/game';

export const GameHistory = memo(({ history }: { history?: GameState['history'] }) => {
  return (
    <List dense sx={{ p: 0, maxWidth: 175, overflow: 'auto', maxHeight: 165 }}>
      {!history || history.length === 0 ? (
        <Typography>Not started</Typography>
      ) : (
        history.map((x, index) => {
          return (
            <ListItem
              key={x + index}
              sx={{
                color: 'text.primary',
                p: 0,
              }}
            >
              {x}
            </ListItem>
          );
        })
      )}
    </List>
  );
});
