import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import { targetIsUnit } from './helpers/targetIsUnit';

const getBishopAttackMove = (attack?: boolean) => ({
  add: [
    {
      type: 'diagonal' as const,
      range: 10,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
      isBlocking: attack ? undefined : targetIsUnit,
    },
  ],
});

export const bishop: UnitDefinition = {
  type: 'unit',
  kind: 'bishop',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: getBishopAttackMove(),
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: getBishopAttackMove(true),
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
