import { Alert, Button, Snackbar } from '@mui/material';
import { useState } from 'react';
import { GameSession } from '../../server/games/gameManager';
import { GameDefinition } from '../../types/game';
import { CardManager } from '../CardManager/CardManager';
import { HexMap } from '../HexMap/HexMap';
import { ClientProvider, useClient } from '../logic/client/ClientProvider';
import { GameControllerProvider } from '../logic/game-controller/GameControllerProvider';
import { GameDefinitionProvider } from '../logic/game-controller/GameDefinitionProvider';
import { WebSocketProvider } from '../logic/websocket/WebSocketProvider';
import { ConfigureMenu } from './ConfigureMenu';
import { GamePicker } from './GamePicker';
import { MainMenu } from './MainMenu';
import { Username } from './Username';

// Define page types for better type safety
type PageType = 'main' | 'gamePicker' | 'game' | 'configure';

interface PageState {
  type: PageType;
  data?: {
    gameSession?: GameSession;
    isNewGame?: boolean;
    gameId?: string;
  };
}

interface PageProps {
  navigate: (page: PageState) => void;
  data?: PageState['data'];
}

// Separate page components
const MainPage: React.FC<PageProps> = ({ navigate }) => {
  return (
    <MainMenu
      onPlay={() => navigate({ type: 'gamePicker' })}
      onConfigure={() => navigate({ type: 'configure' })}
    />
  );
};

const GamePickerPage: React.FC<PageProps> = ({ navigate }) => {
  const { client } = useClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async (game: GameDefinition) => {
    setLoading(true);
    setError(null);

    try {
      const newGame = await client.createGame({
        gameDefinition: game,
      });


      navigate({
        type: 'game',
        data: {
          gameSession: newGame,
          isNewGame: true,
          gameId: newGame.id
        }
      });
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
        gameId: gameSession.id
      });

      if (!response) {
        throw new Error('Failed to join game');
      }

      navigate({
        type: 'game',
        data: {
          gameSession: gameSession,
          gameId: gameSession.id
        }
      });
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

  return (
    <>
      <GamePicker
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        loading={loading}
      />
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

const GamePage: React.FC<PageProps> = ({ navigate, data }) => {
  const { client } = useClient();

  const handleBack = async () => {
    if (data?.gameId) {
      await client.leaveGame({ gameId: data.gameId });
    }
    navigate({ type: 'gamePicker' });
  };

  if (!data?.gameSession) return null;

  return (
    <>
      <Button
        onClick={handleBack}
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}
        variant="contained"
      >
        Back to Games
      </Button>
      <GameDefinitionProvider game={data.gameSession}>
        <GameControllerProvider>
          <HexMap />
          <CardManager />
        </GameControllerProvider>
      </GameDefinitionProvider>
    </>
  );
};

const ConfigurePage: React.FC<PageProps> = () => {
  return <ConfigureMenu />;
};

// Map of pages to their components
const Pages: Record<PageType, React.FC<PageProps>> = {
  main: MainPage,
  gamePicker: GamePickerPage,
  game: GamePage,
  configure: ConfigurePage
};

export const GameUI: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>({ type: 'main' });

  const navigate = (newPage: PageState) => {
    setPageState(newPage);
  };

  const CurrentPage = Pages[pageState.type];

  return (
    <ClientProvider>
      <WebSocketProvider>
        <Username />
        <CurrentPage navigate={navigate} data={pageState.data} />
      </WebSocketProvider>
    </ClientProvider>
  );
};
