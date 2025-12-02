import { Box } from '@mui/material';
import { useGameSession } from './GameSessionProvider';
import { useIf } from '../../if/if-engine-3/useIf';

export const WinCondition = () => {
  const { gameSession } = useGameSession();
  const { doIf } = useIf(gameSession);

  console.log('win condition', gameSession.gameState.isComplete);
  if (!gameSession.gameState.isComplete) {
    return null;
  }
  const condition = gameSession.gameDefinition.definitions.winCondition;
  if (!condition) {
    return null;
  }
  const hasWon = doIf(condition);
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
        {hasWon ? 'You win!' : 'You lose!'}
      </Box>
    </Box>
  );
};
