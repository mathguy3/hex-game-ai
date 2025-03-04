import { Box } from '@mui/material';
import { useGameSession } from '../../../logic/game-controller/context/GameSessionProvider';
import { UI } from './UI';
import { UIPlayerProvider } from '../../../logic/game-controller/context/UIPlayerProvider';

export const UIStart = () => {
  const { gameSession } = useGameSession();
  const { gameDefinition } = gameSession;
  return (
    <Box>
      <UI {...gameDefinition.ui.shared} />
      <UIPlayerProvider>
        <UI {...gameDefinition.ui.player} />
      </UIPlayerProvider>
    </Box>
  );
};
