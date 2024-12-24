import { Alert, Button } from '@mui/material';

import { Snackbar } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../../logic/client';
import { GameSession } from '../../../server/games/gameManager';
import { GameDefinition } from '../../../types/game';
import { GamePicker } from './GamePicker';

export const GamePickerPage: React.FC = () => {
  const { client } = useClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGame = async (game: GameDefinition) => {
    setLoading(true);
    setError(null);

    try {
      const newGame = await client.createGame({
        gameDefinition: game,
      });

      navigate(`/room/${newGame.roomCode}`);
    } catch (error) {
      console.error('Failed to create game:', error);
      setError('Failed to create game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (gameSession: GameSession) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.joinGame({
        roomCode: gameSession.roomCode,
      });

      if (!response) {
        throw new Error('Failed to join game');
      }

      navigate(`/room/${response.gameSession.roomCode}`);
    } catch (error) {
      console.error('Failed to join game:', error);
      let errorMessage = 'Failed to join game.';

      if (error instanceof Error) {
        if (error.message.includes('full')) {
          errorMessage = 'This game is full.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Game no longer exists.';
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Button onClick={handleBack} sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }} variant="contained">
        Back to Main Menu
      </Button>
      <GamePicker onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} loading={loading} />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
