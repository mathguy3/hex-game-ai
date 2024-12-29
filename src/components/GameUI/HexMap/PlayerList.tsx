import { List, ListItem, Typography } from '@mui/material';
import { memo } from 'react';
import { GameState } from '../../../types/game';

const PlayerList = memo(
  ({ players, activePlayerId, meId }: { players: GameState['players']; activePlayerId: string; meId: string }) => {
    console.log('players', players);
    return (
      <>
        <Typography variant="subtitle2">Players - {activePlayerId}</Typography>
        <List dense>
          {Object.values(players).map((player) => {
            if (!player) return null;
            return (
              <ListItem
                key={player.playerId}
                sx={{
                  color: player.playerId === activePlayerId ? 'primary.main' : 'text.primary',
                }}
              >
                {` - ${player.name ?? '{}'} `}
                {/*'(' + player.teamId + ')'}*/}
                {player.playerId === meId && ' (me)'}
                {player.playerId === activePlayerId && ' (active)'}
              </ListItem>
            );
          })}
        </List>
      </>
    );
  }
);

export default PlayerList;
