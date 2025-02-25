import { useParams, Navigate } from 'react-router-dom';

import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../../logic/client';
import { CardManager } from '../../CardManager/CardManager';
import { DragStateProvider } from '../../CardManager/DragStateProvider';
import { TableFrame } from '../../GameUI/TableFrame';
import { UIStart } from '../../GameUI/UI/UIStart';
import { GameSessionProvider } from '../../../logic/game-controller/context/GameSessionProvider';
import { MapSelectionProvider } from '../../../logic/game-controller/context/MapSelectionProvider';
import { AnnounceHandler } from '../../../logic/game-controller/context/AnnounceHandler';

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { client, user } = useClient();
  const { roomCode } = useParams();

  if (!roomCode) return null;

  const handleBack = async () => {
    await client.leaveGame({ roomCode });
    navigate('/pick');
  };

  const startGame = async () => {
    await client.startGame({ roomCode });
  };

  const continueGame = async () => {
    await client.continueGame({ roomCode });
  };

  if (!user?.userId) return <Navigate to="/pick" />;

  return (
    <>
      <Button onClick={handleBack} sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }} variant="contained">
        {'<'}
      </Button>
      <Stack sx={{ position: 'absolute', top: 160, left: 12, zIndex: 1000, width: '75px' }} spacing={2}>
        <Button onClick={startGame} variant="contained">
          Start Game
        </Button>
        <Button onClick={continueGame} variant="contained">
          Continue Game
        </Button>
      </Stack>
      <GameSessionProvider roomCode={roomCode}>
        <AnnounceHandler />
        <MapSelectionProvider>
          <DragStateProvider>
            <CardManager>
              <TableFrame>
                <UIStart />
              </TableFrame>
            </CardManager>
          </DragStateProvider>
        </MapSelectionProvider>
      </GameSessionProvider>
    </>
  );
};
