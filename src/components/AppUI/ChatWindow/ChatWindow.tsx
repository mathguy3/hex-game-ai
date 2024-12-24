import { Box, Input, Stack } from '@mui/material';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { useClient } from '../../../logic/client/ClientProvider';
import { useGameController } from '../../../logic/game-controller/GameControllerProvider';
import { ChatLog } from '../../../server/chat/chat';
import { User } from '../../../server/user/id';

export const ChatWindow = () => {
  const { client } = useClient();
  const { basicActionState } = useGameController();
  const inputRef = useRef<HTMLInputElement>();
  const [log, setLog] = useState<ChatLog>({ gameId: basicActionState.gameState.roomCode, messages: [] });
  const [userReference, setUserReference] = useState<Record<string, User>>({});
  const handleEnter: KeyboardEventHandler<HTMLInputElement> = async (event) => {
    if (event.key === 'Enter') {
      try {
        const { chatLog, users } = await client.chat({
          gameId: basicActionState.gameState.roomCode,
          message: inputRef.current.value,
        });
        setLog(chatLog);
        setUserReference(users);
        inputRef.current.value = '';
      } catch (error) {
        console.error('Error sending chat message', error);
      }
    }
  };
  useEffect(() => {
    let intervalRef;
    if (client && basicActionState.gameState.roomCode) {
      intervalRef = setInterval(async () => {
        try {
          const { chatLog, users } = await client.chat({
            gameId: basicActionState.gameState.roomCode,
          });
          setLog(chatLog);
          setUserReference(users);
        } catch (error) {
          console.error('Error fetching chat log', error);
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef);
  }, [client, basicActionState.gameState.roomCode]);
  return (
    <Stack
      display="flex"
      position="fixed"
      width="200px"
      right={0}
      top={0}
      bottom={0}
      border="1px solid #ccc"
      bgcolor="white"
    >
      <Stack flex="1">
        {log.messages.map((message) => (
          <Box>
            {message.message}
            {userReference[message.userId].name}
          </Box>
        ))}
      </Stack>
      <Box flexBasis="50px" border="1px solid black" bgcolor="white">
        <Input inputRef={inputRef} placeholder="Type anything..." onKeyDown={handleEnter} />
      </Box>
    </Stack>
  );
};
