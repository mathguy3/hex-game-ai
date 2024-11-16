import { List, ListItem, Typography } from '@mui/material';
import { memo } from 'react';
import { GameState } from '../../types/game';

const PlayerList = memo(({ players, activePlayerId, meId }: {
    players: GameState['players'];
    activePlayerId: string;
    meId: string;
}) => {
    return (
        <>
            <Typography variant="subtitle2">Players:</Typography>
            <List dense>
                {Object.values(players).map((player) => {
                    if (!player) return null;
                    return (
                        <ListItem key={player.teamId} sx={{
                            color: player.teamId === activePlayerId ? 'primary.main' : 'text.primary'
                        }}>
                            {` - ${player.name ?? "{}"} `}{"(" + player.teamId + ")"}
                            {player.teamId === meId && ' (me)'}
                            {player.teamId === activePlayerId && ' (active)'}
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
});

export default PlayerList; 