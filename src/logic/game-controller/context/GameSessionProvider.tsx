import React, { createContext, useContext, useEffect, useState } from 'react';
import { GameSession } from '../../../server/games/gameManager';
import { useClient } from '../../client/ClientProvider';
import { useNavigate } from 'react-router-dom';
import { useWebSocket, WebSocketMessage } from '../../websocket/WebSocketProvider';

type GameSessionCtx = {
  gameSession: GameSession | null;
  transitions: Record<string, any>;
};

const GameSessionContext = createContext<GameSessionCtx>(null);

export const GameSessionProvider = ({ roomCode, children }: React.PropsWithChildren<{ roomCode: string }>) => {
  const navigate = useNavigate();
  const { client, user } = useClient();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [transitions, setTransitions] = useState<Record<string, any>>({});

  useEffect(() => {
    async function init() {
      try {
        const response = await client.getGameState({ roomCode });
        const { gameSession } = response;
        setGameSession(gameSession);
      } catch (e) {
        console.log('Error getting game state', e);
        navigate('/pick');
      }
    }
    if (roomCode) {
      init();
    }
  }, [roomCode, client]);

  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      let message: WebSocketMessage;
      try {
        message = JSON.parse(event.data);
        //console.log('WebSocket message received:', event.data);
      } catch (error) {
        console.log('Error parsing WebSocket message:', error, event);
        console.log(event.data);
        return;
      }

      if (message.type === 'gameUpdate' && message.roomCode === gameSession.roomCode) {
        console.log('gameUpdate', message.payload);
        if (message.payload.localControl?.transitions) {
          console.log('transitions', message.payload.localControl.transitions);
          setTransitions(message.payload.localControl.transitions);
          setTimeout(() => {
            setTransitions({});
            setGameSession({ ...gameSession, ...message.payload });
          }, 750);
        } else {
          setGameSession({ ...gameSession, ...message.payload });
        }
      }
    };
    // Add WebSocket listener
    window.addEventListener('message', handleWebSocketMessage);

    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
    };
  }, [gameSession?.roomCode]);

  const { sendMessage } = useWebSocket();

  useEffect(() => {
    if (gameSession?.roomCode) {
      // Join the game's WebSocket room
      console.log('joining game', gameSession.roomCode, user.userId);
      sendMessage({
        type: 'connectToRoom',
        roomCode: gameSession.roomCode,
        payload: {
          userId: user.userId,
        },
      });

      return () => {
        // Leave the game's WebSocket room
        sendMessage({
          type: 'disconnectFromRoom',
          roomCode: gameSession.roomCode,
          payload: {
            userId: user.userId,
          },
        });
      };
    }
  }, [gameSession?.roomCode]);

  if (!gameSession) return null;

  return <GameSessionContext.Provider value={{ gameSession, transitions }}>{children}</GameSessionContext.Provider>;
};

export const useGameSession = () => useContext(GameSessionContext);
