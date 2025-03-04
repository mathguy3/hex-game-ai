import { List, ListItem, Typography } from '@mui/material';
import { memo } from 'react';
import { GameDefinition, GameState } from '../../../types/game';
import CircleIcon from '@mui/icons-material/Circle';

export const PlayerList = memo(
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
    return (
      <List dense sx={{ p: 0 }}>
        {Object.entries(seatConfig)
          .filter((x) => x[1].isConfigurable !== false)
          .map(([id, config], index) => {
            const seat = seats[id];
            return (
              <ListItem
                key={id + seat.userName + index}
                sx={{
                  color: id === activeId ? 'primary.main' : 'text.primary',
                  pl: 0,
                }}
              >
                <CircleIcon
                  sx={{
                    top: 2,
                    position: 'relative',
                    width: 10,
                    height: 10,
                    mr: 0.75,
                    color: seat.isActive ? '#00ff00' : '#dd0000',
                  }}
                />
                {`${seat.userName ?? 'Open'} `}
                {/*'(' + player.teamId + ')'}*/}
                {seat.userId === meId && ' (me)'}
              </ListItem>
            );
          })}
      </List>
    );
  }
);
