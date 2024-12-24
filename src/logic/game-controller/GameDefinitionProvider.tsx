import React, { createContext, useContext } from 'react';
import { GameSession } from '../../server/games/gameManager';

type GameDefinitionCtx = {
  game: GameSession;
};

const GameDefinitionContext = createContext<GameDefinitionCtx>(null);

export const GameDefinitionProvider = ({ game, children }: React.PropsWithChildren<GameDefinitionCtx>) => (
  <GameDefinitionContext.Provider value={{ game }}>{children}</GameDefinitionContext.Provider>
);

export const useGameDefinition = () => useContext(GameDefinitionContext);
