import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useClient } from '../../../logic/client/ClientProvider';
import { GameSession } from '../../../server/games/gameManager';
import { GameDefinitionRecord } from '../../../server/games/gameManager';
import { useNavigate } from 'react-router-dom';

interface GamePickerProps {
  gameDefinitions: GameDefinitionRecord[];
  onCreateGame: (gameDefinition: GameDefinitionRecord) => void;
  onJoinGame: (gameSession: GameSession) => void;
  loading?: boolean;
}

export const GamePicker = ({ gameDefinitions, onCreateGame, onJoinGame, loading }: GamePickerProps) => {
  const { client, user } = useClient();
  const navigate = useNavigate();
  const [yourGames, setYourGames] = useState<GameSession[]>([]);
  const [otherGames, setOtherGames] = useState<GameSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log('fetchGames', user);
        const { yourGames, otherGames } = await client.listGames();
        setYourGames(yourGames ?? []);
        setOtherGames(otherGames ?? []);
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
        width: '100vw',
        paddingTop: 8,
        paddingX: 4,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          borderRight: '1px solid',
          borderColor: 'divider',
          pr: 4,
          overflowY: 'auto',
          paddingBottom: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Create New Game
        </Typography>
        <Stack height="content" border="1px solid" borderColor="divider" borderRadius={2}>
          {gameDefinitions.map((gameType, idx) => (
            <Stack
              key={gameType.id + idx}
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                padding: 1,
              }}
            >
              <Box>
                <Typography>{gameType.definition.config.name}</Typography>
                <Typography color="text.secondary" fontSize={16}>
                  {gameType.definition.config.description}
                </Typography>
              </Box>
              <Box>
                <Button variant="contained" fullWidth onClick={() => onCreateGame(gameType)} disabled={loading}>
                  {loading ? 'Creating...' : `New ${gameType.definition.config.name}`}
                </Button>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Stack sx={{ flex: 1, height: '100vh', overflowY: 'auto', paddingBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Games
        </Typography>
        <Stack spacing={2}>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          {yourGames.map((game) => {
            //const playerCount = Object.values(game.gameState.players).filter((player) => player.playerId).length;
            return (
              <Stack
                key={game.roomCode}
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  padding: 1,
                }}
              >
                <Box>
                  <Typography>Game {game.gameDefinition.config.name}</Typography>
                  {/* <Typography color="text.secondary">
                    {game.gameDefinition.name} - {playerCount}/{game.maxPlayers} players
                  </Typography> */}
                </Box>
                <Box>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/room/${game.roomCode}`)}
                    //disabled={loading || playerCount >= game.maxPlayers}
                    fullWidth
                  >
                    {loading ? 'Joining...' : 'Play Game'}
                  </Button>
                </Box>
              </Stack>
            );
          })}
          {yourGames.length === 0 && !error && (
            <Card sx={{ bgcolor: 'action.hover' }}>
              <CardContent>
                <Typography color="text.secondary" align="center">
                  No games available
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Stack>
      <Stack sx={{ flex: 1, height: '100vh', overflowY: 'auto', paddingBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Available Games
        </Typography>
        <Stack spacing={2}>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          {otherGames.map((game) => {
            //const playerCount = Object.values(game.gameState.players).filter((player) => player.playerId).length;
            return (
              <Card key={game.roomCode} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ pb: 0 }}>
                  <Typography variant="h6">Game {game.gameDefinition.config.name}</Typography>
                  {/* <Typography color="text.secondary">
                    {game.gameDefinition.name} - {playerCount}/{game.maxPlayers} players
                  </Typography> */}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onJoinGame(game)}
                    //disabled={loading || playerCount >= game.maxPlayers}
                    fullWidth
                  >
                    {loading ? 'Joining...' : 'Join Game'}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
          {otherGames.length === 0 && !error && (
            <Card sx={{ bgcolor: 'action.hover' }}>
              <CardContent>
                <Typography color="text.secondary" align="center">
                  No games available
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
