import { HexInteraction } from '../../../types/actions/interactions';
import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import { targetIsUnit } from './helpers/targetIsUnit';

const getMoveTwice = (direction: number): HexInteraction => ({
  type: 'hex',
  kind: 'movement',
  targeting: {
    userSelect: true,
    tiles: {
      add: [
        {
          type: 'direction' as const,
          direction,
          range: 2,
          tileIf: targetIsNotUnit,
          isBlocking: targetIsUnit,
        },
        {
          type: 'direction' as const,
          direction,
          range: 1,
          tileIf: targetIsNotUnit,
          isBlocking: targetIsUnit,
        },
      ],
    },
  },
  actions: [
    {
      type: 'action' as const,
      name: 'moveToHex',
      description:
        'Moves subject unit to target hex, clears subject hex, and sets newly moved target unit aspect hasMoved: true',
      set: moveToHex,
    }
  ],
});

const getAttackUp = (direction: number): HexInteraction => ({
  type: 'hex' as const,
  kind: 'attack',
  targeting: {
    userSelect: true,
    tiles: {
      add: [
        {
          type: 'offset' as const,
          offset: { q: -1, r: 0, s: 1 },
          tileIf: targetIsEnemyUnit,
        },
        {
          type: 'offset' as const,
          offset: { q: 1, r: -1, s: 0 },
          tileIf: targetIsEnemyUnit,
        },
      ],
    },
  },
  actions: [
    {
      type: 'action' as const,
      name: 'attack',
      description: 'Attacks target unit, setting target unit aspect hasMoved: true',
      set: moveToHex,
    },
  ],
});

export const pawnWhite: UnitDefinition = {
  type: 'unit',
  kind: 'pawnWhite',
  properties: {},
  interactions: [getMoveTwice(2), getAttackUp(2)],
};
export const pawnBlack: UnitDefinition = {
  type: 'unit',
  kind: 'pawnBlack',
  properties: {},
  interactions: [getMoveTwice(5), getAttackUp(5)],
};
