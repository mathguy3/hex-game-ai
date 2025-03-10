import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { Box } from '@mui/material';
import { TokenUIModel } from '../UI';

export const Token = ({ id, styles, image, data }: TokenUIModel) => {
  const { gameSession } = useGameSession();
  const { doEval } = useIf(gameSession?.gameState);

  const defaultStyles = {
    position: 'relative',
  };
  const mappedStyles = styles
    ? Object.fromEntries(Object.entries(styles).map(([key, value]) => [key, doEval(value)]))
    : {};
  const mappedImage = image ? doEval(image, { token: data }) : '';

  //console.log('mappedStyles', data, image);
  return <Box sx={{ ...defaultStyles, ...mappedStyles, background: `center/contain url(${mappedImage}) no-repeat` }} />;
};
