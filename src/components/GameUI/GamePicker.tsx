import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { hexChess } from '../../data';
import { GameSession } from '../../server/games/gameManager';
import { GameDefinition } from '../../types/game';
import { useClient } from '../logic/client/ClientProvider';

interface GamePickerProps {
  onCreateGame: (gameDefinition: GameDefinition) => void;
  onJoinGame: (gameSession: GameSession) => void;
  loading?: boolean;
}

export const GamePicker = ({ onCreateGame, onJoinGame, loading }: GamePickerProps) => {
  const { client } = useClient();
  const [games, setGames] = useState<GameSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { games } = await client.listGames();
        console.log('games', games);
        setGames(games ?? []);
        setError(null);
      } catch (err) {
        setError('Failed to load games');
        console.error('Error loading games:', err);
      }
    };

    fetchGames();
    // Could add polling here if needed
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, [client]);

  return (
    <Stack
      direction="row"
      spacing={4}
      sx={{
        height: '100vh',
        p: 4,
        maxWidth: '1200px',
        margin: 'auto'
      }}
    >
      {/* Left Column - Create New Game */}
      <Box sx={{
        flex: 1,
        borderRight: '1px solid',
        borderColor: 'divider',
        pr: 4
      }}>
        <Typography variant="h5" gutterBottom>
          Create New Game
        </Typography>
        <Stack spacing={2}>
          {[hexChess].map((gameType, idx) => (
            <Card key={gameType.name + idx}>
              <CardContent>
                <Typography variant="h6">{gameType.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {gameType.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onCreateGame(gameType)}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : `New ${gameType.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Right Column - Available Games */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          Available Games
        </Typography>
        <Stack spacing={2}>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          {games.map((game) => {
            const playerCount = Object.values(game.gameState.players).filter(player => player.playerId).length;
            return (
              <Card key={game.id}>
                <CardContent>
                  <Typography variant="h6">Game {game.gameDefinition.name}</Typography>
                  <Typography color="text.secondary">
                    {game.gameDefinition.name} - {playerCount}/{game.maxPlayers} players
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onJoinGame(game)}
                    disabled={loading || playerCount >= game.maxPlayers}
                    fullWidth
                  >
                    {loading ? 'Joining...' : 'Join Game'}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
          {games.length === 0 && !error && (
            <Card sx={{ bgcolor: 'action.hover' }}>
              <CardContent>
                <Typography color="text.secondary" align="center">
                  No games available
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};
