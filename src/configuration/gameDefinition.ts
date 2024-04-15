import { GameDefinition } from '../types/game';
import { swordsman } from './units/swordsman';

export const gameDefinition: GameDefinition = {
  name: 'Base',
  unit: {
    swordsman,
  },
};
