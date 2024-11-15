import { GameState } from '../../types/game';
import { User } from '../user/id';

const gameState: Record<string, GameState> = {};

type PlayParams = {
  gameId: string;
  user: User;
  move: string;
  data: any;
};

export const play = (params: PlayParams) => {
  const { gameId, user, move, data } = params;
  //console.log(game, move, data);
  //TODO return model
  return { gameId, user, move, data };
};
