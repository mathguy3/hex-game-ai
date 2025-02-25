import { useGameSession } from '../../../logic/game-controller/context/GameSessionProvider';
import { UI } from './UI';

export const UIStart = () => {
  const { gameSession } = useGameSession();
  const { gameDefinition } = gameSession;
  return <UI {...gameDefinition.ui} />;
};
