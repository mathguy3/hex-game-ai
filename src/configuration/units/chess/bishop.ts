import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import SoldierSvg from '../../../components/Soldier/Soldier.svg';
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

export const bishop: any = {
  type: 'unit',
  kind: 'bishop',
  image: SoldierSvg,
  properties: {},
  actions: [
    {
      type: 'hex' as const,
      kind: 'movement',
      targeting: {
        userSelect: true,
        tiles: getBishopAttackMove(),
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
    },
    {
      type: 'hex' as const,
      kind: 'attack',
      targeting: {
        userSelect: true,
        tiles: getBishopAttackMove(true),
      },
      actions: [
        {
          type: 'action' as const,
          name: 'attackHex',
          description: 'Attacks target hex, and sets target unit aspect hasMoved: true',
          set: moveToHex,
        },
      ],
    },
  ],
};
