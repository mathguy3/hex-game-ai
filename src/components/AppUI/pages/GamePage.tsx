import { useParams } from 'react-router-dom';

import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../../logic/client';
import { GameControllerProvider } from '../../../logic/game-controller/GameControllerProvider';
import { GameDefinitionProvider } from '../../../logic/game-controller/GameDefinitionProvider';
import { GameSession } from '../../../server/games/gameManager';
import { CardManager } from '../../CardManager/CardManager';
import { DragStateProvider } from '../../CardManager/DragStateProvider';
import { HexMap } from '../../GameUI/HexMap/HexMap';
import { TableFrame } from '../../GameUI/TableFrame';
import { UIStart } from '../../GameUI/UI/UIStart';

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const { roomCode } = useParams();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    if (roomCode) {
      console.log('getGameState', roomCode);
      client
        .getGameState({ roomCode })
        .then(({ gameSession, myId }) => {
          console.log('getGameState', gameSession, myId);
          setGameSession(gameSession);
          setMyId(myId);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [roomCode, client]);

  const handleBack = async () => {
    if (roomCode) {
      await client.leaveGame({ roomCode });
    }
    navigate('/pick');
  };

  console.log('GamePage', roomCode, gameSession, myId);
  if (!roomCode || !gameSession || !myId) return null;

  return (
    <>
      <Button onClick={handleBack} sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }} variant="contained">
        {'<'}
      </Button>
      <GameDefinitionProvider game={gameSession}>
        <GameControllerProvider meId={myId}>
          <DragStateProvider>
            <CardManager>
              <TableFrame>
                <UIStart />
                <HexMap />
              </TableFrame>
            </CardManager>
          </DragStateProvider>
        </GameControllerProvider>
      </GameDefinitionProvider>
    </>
  );
};
