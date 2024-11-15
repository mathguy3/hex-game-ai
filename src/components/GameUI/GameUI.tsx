import { useState } from 'react';
import { GameDefinition } from '../../types/game';
import { CardManager } from '../CardManager/CardManager';
import { HexMap } from '../HexMap/HexMap';
import { ClientProvider } from '../logic/client/ClientProvider';
import { GameControllerProvider } from '../logic/game-controller/GameControllerProvider';
import { GameDefinitionProvider } from '../logic/game-controller/GameDefinitionProvider';
import { ConfigureMenu } from './ConfigureMenu';
import { GamePicker } from './GamePicker';
import { MainMenu } from './MainMenu';
import { Username } from './Username';

export const GameUI = () => {
  const [page, setPage] = useState('main');

  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null);

  return (
    <ClientProvider>
      <Username />
      {page === 'main' && <MainMenu onPlay={() => setPage('gamePicker')} onConfigure={() => setPage('configure')} />}
      {page === 'gamePicker' && (
        <GamePicker
          onClick={(game) => {
            setSelectedGame(game);
            setPage('game');
          }}
        />
      )}
      {page === 'game' && selectedGame && (
        <GameDefinitionProvider game={selectedGame}>
          <GameControllerProvider>
            <HexMap />
            <CardManager />
          </GameControllerProvider>
        </GameDefinitionProvider>
      )}
      {page === 'configure' && <ConfigureMenu />}
    </ClientProvider>
  );
};
