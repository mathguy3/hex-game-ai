import { useState } from 'react';
import * as gamesData from '../../../data';
import { GameDefinition } from '../../../types/game';

export const useEngineState = () => {
  const [games, setGames] = useState<GameDefinition[]>([gamesData.hexChess]);
};
