import { useState } from 'react';
import { hexChess } from '../../data';
import { CardManager } from '../CardManager/CardManager';
import { HexMap } from '../HexMap/HexMap';
import { GameControllerProvider } from '../logic/game-controller/GameControllerProvider';
import { GameDefinitionProvider } from '../logic/game-controller/GameDefinitionProvider';
import { ConfigureMenu } from './ConfigureMenu';
import { MainMenu } from './MainMenu';

export const GameUI = () => {
  const [page, setPage] = useState('main');

  return (
    <>
      {page === 'main' && <MainMenu onPlay={() => setPage('game')} onConfigure={() => setPage('configure')} />}
      {page === 'game' && (
        <GameDefinitionProvider game={hexChess}>
          <GameControllerProvider>
            <HexMap />
            <CardManager />
          </GameControllerProvider>
        </GameDefinitionProvider>
      )}
      {page === 'configure' && <ConfigureMenu />}
    </>
  );
};
