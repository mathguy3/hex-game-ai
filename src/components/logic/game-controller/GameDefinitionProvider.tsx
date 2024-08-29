import React, { createContext, useContext } from 'react';
import { GameDefinition } from '../../../types/game';

type GameDefinitionCtx = {
  game: GameDefinition;
};

const GameDefinitionContext = createContext<GameDefinitionCtx>(null);

export const GameDefinitionProvider = ({
  game,
  children,
}: React.PropsWithChildren<GameDefinitionCtx>) => (
  <GameDefinitionContext.Provider value={{ game }}>
    {children}
  </GameDefinitionContext.Provider>
);

export const useGameDefinition = () => useContext(GameDefinitionContext);
