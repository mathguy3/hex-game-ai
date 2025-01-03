import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ServerRoutes } from '../../server/startup';
import { User } from '../../server/user/id';
import { uuid } from '../../utils/uuid';

type ClientCtx = {
  client: Omit<ServerRoutes, 'id'>;
  user: User;
};
const ClientContext = createContext<ClientCtx>(null);

// eslint-disable-next-line
const baseUrl = `http://${location.hostname}:3006`;

const getOrAddId = () => {
  let id = sessionStorage.getItem('id');
  if (!id) {
    id = uuid();
    sessionStorage.setItem('id', id);
  }
  return id;
};

export const ClientProvider = ({ children }: React.PropsWithChildren) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!sessionId) {
      void getId();
    }
    async function getId() {
      const sessionId = getOrAddId();
      const response = await fetch(`${baseUrl}/id`, {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
      setUser(await response.json());
      setSessionId(sessionId);
    }
  }, []);
  function handler(route: string) {
    return async (params?: Record<string, any>) => {
      const response = await fetch(`${baseUrl}/${route}`, {
        method: 'POST',
        body: JSON.stringify({ ...params, sessionId }),
      });
      return await response.json();
    };
  }
  const client: Omit<ServerRoutes, 'id'> = useMemo(
    () => ({
      chat: handler('chat'),
      createGame: handler('createGame'),
      joinGame: handler('joinGame'),
      listGames: handler('listGames'),
      handleAction: handler('handleAction'),
      leaveGame: handler('leaveGame'),
      getGameState: handler('getGameState'),
    }),
    [sessionId]
  );
  return <ClientContext.Provider value={{ client, user }}>{children}</ClientContext.Provider>;
};

export const useClient = () => useContext(ClientContext);
