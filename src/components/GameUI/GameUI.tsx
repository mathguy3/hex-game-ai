import { useState } from 'react';
import { hexChess } from '../../data';
import { HexMap } from '../HexMap/HexMap';
import { GameDefinitionProvider } from '../logic/game-controller/GameDefinitionProvider';
import { ConfigureMenu } from './ConfigureMenu';
import { MainMenu } from './MainMenu';

export const GameUI = () => {
  const [page, setPage] = useState('main');

  return (
    <>
      {page === 'main' && (
        <MainMenu
          onPlay={() => setPage('game')}
          onConfigure={() => setPage('configure')}
        />
      )}
      {page === 'game' && (
        <GameDefinitionProvider game={hexChess}>
          <HexMap />
        </GameDefinitionProvider>
      )}
      {page === 'configure' && <ConfigureMenu />}
    </>
  );
};
