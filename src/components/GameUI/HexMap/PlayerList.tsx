import { List, ListItem, Typography } from '@mui/material';
import { memo } from 'react';
import { GameDefinition, GameState } from '../../../types/game';

const PlayerList = memo(
  ({
    seatConfig,
    seats,
    activeId,
    meId,
  }: {
    seatConfig: GameDefinition['definitions']['seats'];
    seats: GameState['seats'];
    activeId: string;
    meId: string;
  }) => {
    console.log('seats', seats, activeId, meId);
    return (
      <>
        <Typography variant="subtitle2">Players - {activeId}</Typography>
        <List dense sx={{ p: 0 }}>
          {Object.entries(seatConfig).map(([id, config], index) => {
            const seat = seats[id];
            return (
              <ListItem
                key={id + seat.userName + index}
                sx={{
                  color: id === activeId ? 'primary.main' : 'text.primary',
                }}
              >
                {` - ${seat.userName ?? 'Open'} `}
                {/*'(' + player.teamId + ')'}*/}
                {seat.userId === meId && ' (me)'}
                {seat.isActive && ' (active)'}
              </ListItem>
            );
          })}
        </List>
      </>
    );
  }
);

export default PlayerList;
