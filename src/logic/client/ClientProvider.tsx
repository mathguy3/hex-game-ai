import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ServerRoutes } from '../../server/startup';
import { User } from '../../server/user/id';
import { uuid } from '../../utils/uuid';
import { Box, CircularProgress, IconButton, TextField } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';

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
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [editName, setEditName] = useState(false);
  const [editingName, setEditingName] = useState(user?.userName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!sessionId) {
      void getId();
    }
    async function getId() {
      const sessionId = getOrAddId();
      try {
        setStatus('loading');
        const response = await fetch(`${baseUrl}/id`, {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        });
        setUser(await response.json());
        setSessionId(sessionId);
        console.log('user', user);
        console.log('sessionId', sessionId);
        setStatus('idle');
      } catch (e) {
        setStatus('error');
      }
    }
  }, []);
  function handler(route: string) {
    return async (params?: Record<string, any>) => {
      try {
        setStatus('loading');
        const response = await fetch(`${baseUrl}/${route}`, {
          method: 'POST',
          body: JSON.stringify({ ...params, sessionId }),
        });
        setStatus('idle');
        return await response.json();
      } catch (e) {
        setStatus('error');
      }
    };
  }
  const client: Omit<ServerRoutes, 'id'> = useMemo(
    () => ({
      chat: handler('chat'),
      createGame: handler('createGame'),
      joinGame: handler('joinGame'),
      listGames: handler('listGames'),
      listUsers: handler('listUsers'),
      handleAction: handler('handleAction'),
      leaveGame: handler('leaveGame'),
      getGameState: handler('getGameState'),
      startGame: handler('startGame'),
      continueGame: handler('continueGame'),
      interact: handler('interact'),
      ackAnnounce: handler('ackAnnounce'),
      updateName: handler('updateName'),
    }),
    [sessionId]
  );

  const handleUpdateName = async (name: string) => {
    if (!name) {
      setEditName(false);
      return;
    }
    await client.updateName({ name });
    setEditName(false);
    setUser({ ...user, userName: name });
  };

  return (
    <ClientContext.Provider value={{ client, user }}>
      <Box position="fixed" right={10} top={10}>
        {status === 'loading' && !user && (
          <Box display="flex" alignItems="center" gap={1}>
            {'Connecting to server...'} <CircularProgress size={16} />
          </Box>
        )}
        {status === 'error' && (
          <Box display="flex" alignItems="center" gap={1}>
            {'Could not connect to server'} <ErrorOutlineIcon color="error" />
          </Box>
        )}
        {status === 'idle' && (
          <Box display="flex" alignItems="center" gap={1}>
            {editName ? (
              <TextField
                ref={inputRef}
                size="small"
                sx={{ width: 115, '& .MuiInputBase-input': { height: '16px', width: '110px' } }}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateName(editingName);
                  }
                }}
                onBlur={() => handleUpdateName(editingName)}
              />
            ) : (
              <>
                {user?.userName}
                <IconButton
                  onClick={() => {
                    setEditName(true);
                    setEditingName(user?.userName);
                    inputRef.current?.select();
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </Box>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
