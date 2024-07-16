import { UnitDefinition } from '../../../types/entities/unit/unit';
import { isFirstTeam } from './helpers/isFirstTeam';
import { isSecondTeam } from './helpers/isSecondTeam';
import { moveToHex } from './helpers/moveToHex';
import { subjectHasMoved } from './helpers/subjectHasMoved';
import { subjectHasNotMoved } from './helpers/subjectHasNotMoved';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import { targetIsUnit } from './helpers/targetIsUnit';

const moveUp = {
  type: 'movement' as const,
  if: isFirstTeam,
  tiles: {
    add: [
      {
        type: 'direction' as const,
        direction: 2,
        range: 2,
        tileIf: targetIsNotUnit,
        isBlocking: targetIsUnit,
        if: subjectHasNotMoved,
      },
      {
        type: 'direction' as const,
        direction: 2,
        range: 1,
        tileIf: targetIsNotUnit,
        isBlocking: targetIsUnit,
        if: subjectHasMoved,
      },
    ],
  },
  actions: [
    {
      type: 'movement' as const,
      set: moveToHex,
    },
  ],
};

const attackUp = {
  type: 'attack' as const,
  if: isFirstTeam,
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
  actions: [
    {
      type: 'attack' as const,
      set: moveToHex,
    },
  ],
};

const moveDown = {
  type: 'movement' as const,
  if: isSecondTeam,
  tiles: {
    add: [
      {
        type: 'direction' as const,
        direction: 5,
        range: 2,
        tileIf: targetIsNotUnit,
        isBlocking: targetIsUnit,
        if: subjectHasNotMoved,
      },
      {
        type: 'direction' as const,
        direction: 5,
        range: 1,
        tileIf: targetIsNotUnit,
        isBlocking: targetIsUnit,
        if: subjectHasMoved,
      },
    ],
  },
  actions: [
    {
      type: 'movement' as const,
      set: moveToHex,
    },
  ],
};

const attackDown = {
  type: 'attack' as const,
  if: isSecondTeam,
  tiles: {
    add: [
      {
        type: 'offset' as const,
        offset: { q: -1, r: 1, s: 0 },
        tileIf: targetIsEnemyUnit,
      },
      {
        type: 'offset' as const,
        offset: { q: 1, r: 0, s: -1 },
        tileIf: targetIsEnemyUnit,
      },
    ],
  },
  actions: [
    {
      type: 'attack' as const,
      set: moveToHex,
    },
  ],
};

export const pawn: UnitDefinition = {
  type: 'unit',
  kind: 'pawn',
  aspects: {},
  interactions: [moveUp, attackUp, moveDown, attackDown],
};
