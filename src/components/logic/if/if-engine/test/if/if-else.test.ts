import { IFStringValue } from '../../../../../../types/actions/if';
import { evalValue } from '../../eval-value';
import { GameModel } from '../../types';

const firstTeam: Partial<GameModel> = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: 'team1',
          health: '50',
          attack: '25',
        },
      },
    },
  },
};

const secondTeam: Partial<GameModel> = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: 'team2',
          health: '50',
          attack: '25',
        },
      },
    },
  },
};

const healthOrAttack = {
  subject: {
    contains: {
      unit: {
        aspects: {
          if: {
            subject: {
              contains: { unit: { aspects: { team: 'team1' } } },
            },
          },
          then: { health: IFStringValue },
          else: { attack: IFStringValue },
        },
      },
    },
  },
};

const cases = [
  {
    ifValue: healthOrAttack,
    context: firstTeam,
    expectedResult: '50',
  },
  {
    ifValue: healthOrAttack,
    context: secondTeam,
    expectedResult: '25',
  },
];

test.each(cases)('can switch based on value', ({ ifValue, context, expectedResult }) => {
  const result = evalValue(ifValue, context);
  expect(result).toBe(expectedResult);
});
