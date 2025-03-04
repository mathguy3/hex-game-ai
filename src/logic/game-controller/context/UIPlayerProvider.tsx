import React, { createContext, useContext } from 'react';
import { PlayerState } from '../../../types/game';
import { useGameSession } from './GameSessionProvider';
import { useClient } from '../../client/ClientProvider';

type UIPlayerCtx = {
  playerState: PlayerState | null;
};

const UIPlayerContext = createContext<UIPlayerCtx>(null);

export const UIPlayerProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { user } = useClient();
  const { gameSession } = useGameSession();

  const playerSeat = Object.values(gameSession?.gameState.seats ?? {}).find((seat: any) => seat.userId === user.userId);
  const playerState = gameSession?.gameState.data[playerSeat.id];

  return <UIPlayerContext.Provider value={{ playerState }}>{children}</UIPlayerContext.Provider>;
};

export const useUIPlayer = () => useContext(UIPlayerContext);
