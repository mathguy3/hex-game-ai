import * as crypto from 'node:crypto';
import { GameDefinition } from '../../types/game';
import { User } from '../user/id';

export type GameInfo = {
  gameId: string;
  gameDefinition: GameDefinition;
  players: Record<string, string>;
};

const games: Record<string, GameInfo> = {};

export const info = () => {
  return games;
};

export const startNewGame = (gameDefinition: GameDefinition, user: User) => {
  const gameId = crypto.randomBytes(10).toString('hex');
  const newGame = {
    gameId,
    gameDefinition,
    players: { player1: user.id },
  };
  games[gameId] = newGame;
  return newGame;
};
