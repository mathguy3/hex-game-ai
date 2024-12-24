import { useGameController } from '../../../logic/game-controller/GameControllerProvider';
import { UI } from './UI';

export const UIStart = () => {
  const { basicActionState } = useGameController();
  const { gameDefinition } = basicActionState;
  return <UI {...gameDefinition.ui} />;
};
