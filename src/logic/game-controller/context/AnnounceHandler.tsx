import { Box } from '@mui/material';
import { useGameSession } from './GameSessionProvider';
import { useEffect } from 'react';
import { useClient } from '../../client/ClientProvider';

export const AnnounceHandler = () => {
  const { client, user } = useClient();
  const { gameSession } = useGameSession();
  const { activeAnnounce } = gameSession.localControl ?? {};
  const currentPlayerId = Object.entries(gameSession.gameState.seats).find(
    (seat) => seat[1].userId === user.userId
  )?.[0];
  const toCurrentPlayer =
    activeAnnounce?.to === 'active'
      ? gameSession.gameState.activeId === currentPlayerId
      : activeAnnounce?.to === 'all' || activeAnnounce?.to === currentPlayerId;

  useEffect(() => {
    if (!activeAnnounce) {
      return;
    }
    const timeout = setTimeout(() => {
      client.ackAnnounce({ roomCode: gameSession.roomCode });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [activeAnnounce]);

  if (!activeAnnounce) {
    return null;
  }
  //centered on screen
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* make it stand out*/}
      <Box fontSize={56} fontWeight={600}>
        {toCurrentPlayer ? activeAnnounce.message : ''}
      </Box>
    </Box>
  );
};
