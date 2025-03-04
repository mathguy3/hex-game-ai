import { Box } from '@mui/material';
import { TextUIModel } from '../UI';
import { mapStyles } from '../utils/mapStyles';
import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { useUIPlayer } from '../../../../logic/game-controller/context/UIPlayerProvider';

export const Text = ({ content, styles }: TextUIModel) => {
  const { gameSession } = useGameSession();
  const { playerState } = useUIPlayer();
  const { gameState } = gameSession;
  const { doEval } = useIf(gameState);
  const mappedStyles = styles ? mapStyles(styles, doEval) : {};
  const mappedContent = content ? doEval(content, { player: playerState }) : content;
  console.log('rendering text', mappedContent);
  return <Box sx={{ ...mappedStyles }}>{mappedContent}</Box>;
};
