import { Box } from '@mui/material';
import { useGameSession } from './GameSessionProvider';
import { doIf } from '../../if/if-engine-3/doIf';

export const WinCondition = () => {
  const { gameSession } = useGameSession();

  console.log('win condition', gameSession.gameState.isComplete);
  if (!gameSession.gameState.isComplete) {
    return null;
  }
  const condition = gameSession.gameDefinition.definitions.winCondition;
  const hasWon = doIf({
    ifItem: condition,
    model: { context: gameSession.gameState },
    procedures: gameSession.gameDefinition.definitions.procedures,
  });
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
