import { HexInteraction } from '../../../types/actions/interactions';
import { UnitDefinition } from '../../../types/entities/unit/unit';
import { isFirstTeam } from './helpers/isFirstTeam';
import { isSecondTeam } from './helpers/isSecondTeam';
import { moveToHex } from './helpers/moveToHex';
import { subjectHasMoved } from './helpers/subjectHasMoved';
import { subjectHasNotMoved } from './helpers/subjectHasNotMoved';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import { targetIsUnit } from './helpers/targetIsUnit';
import { turnIsNotUsed } from './helpers/turnIsNotUsed';

const moveTwice: HexInteraction = {
  type: 'hex',
  kind: 'movement',
  if: { and: [turnIsNotUsed, isFirstTeam] },
  targeting: {
    userSelect: true,
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
};

const attackUp: HexInteraction = {
  type: 'hex' as const,
  kind: 'attack',
  if: { and: [turnIsNotUsed, isFirstTeam] },
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
};

const moveDown: HexInteraction = {
  type: 'hex' as const,
  kind: 'movement',
  if: { and: [turnIsNotUsed, isSecondTeam] },
  targeting: {
    userSelect: true,
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
  },
  actions: [
    {
      type: 'action' as const,
      name: 'moveToHex',
      description:
        'Moves subject unit to target hex, clears subject hex, and sets newly moved target unit aspect hasMoved: true',
      set: moveToHex,
    },
  ],
};

const attackDown: HexInteraction = {
  type: 'hex' as const,
  kind: 'attack',
  if: { and: [turnIsNotUsed, isSecondTeam] },
  targeting: {
    userSelect: true,
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
  },
  actions: [
    {
      type: 'action' as const,
      name: 'attack',
      description: 'Attacks target unit, setting target unit aspect hasMoved: true',
      set: moveToHex,
    },
  ],
};

export const pawn: UnitDefinition = {
  type: 'unit',
  kind: 'pawn',
  properties: {},
  interactions: [moveTwice, attackUp, moveDown, attackDown],
};
