import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { subjectHasMoved } from './helpers/subjectHasMoved';
import { subjectHasNotMoved } from './helpers/subjectHasNotMoved';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsUnit } from './helpers/targetIsUnit';

export const pawn: UnitDefinition = {
  type: 'unit',
  kind: 'pawn',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: {
        add: [
          {
            type: 'direction',
            direction: 2,
            range: 2,
            isBlocking: targetIsUnit,
            if: subjectHasNotMoved,
          },
          {
            type: 'direction',
            direction: 2,
            range: 1,
            isBlocking: targetIsUnit,
            if: subjectHasMoved,
          },
        ],
      },
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: {
        add: [
          {
            type: 'offset',
            offset: { q: -1, r: 0, s: 1 },
            tileIf: targetIsEnemyUnit,
          },
          {
            type: 'offset',
            offset: { q: 1, r: -1, s: 0 },
            tileIf: targetIsEnemyUnit,
          },
        ],
      },
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
