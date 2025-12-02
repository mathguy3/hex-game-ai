import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { Box } from '@mui/material';
import { TokenUIModel } from '../UI';

export const Token = ({ id, styles, image, data }: TokenUIModel) => {
  const { gameSession } = useGameSession();
  const { unit } = gameSession.gameState.data;
  const { doEval } = useIf(gameSession);

  const defaultStyles = {
    position: 'relative',
  };
  const mappedStyles = styles
    ? Object.fromEntries(Object.entries(styles).map(([key, value]) => [key, doEval(value)]))
    : {};
  const unitDefinition = data && unit ? unit[data.kind] : undefined;
  const mappedImage = image
    ? doEval(image, { token: data })
    : unitDefinition?.image
    ? doEval(unitDefinition.image)
    : '';
  //console.log('mappedStyles', data, image);
  return (
    <Box sx={{ ...defaultStyles, ...mappedStyles, background: `center/contain url(${mappedImage}) no-repeat` }}>
      {data.kind}
    </Box>
  );
};
