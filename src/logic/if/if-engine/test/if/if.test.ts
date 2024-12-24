import { isFirstTeam } from '../../../../../configuration/units/chess/helpers/isFirstTeam';
import { IFStringValue } from '../../../../../types/actions/if';
import { evalIf } from '../../eval-if';
import { GameModel } from '../../types';

const firstTeam: Partial<GameModel> = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: 'team1',
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
        },
      },
    },
  },
};

const sameTeam = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: {
            target: {
              contains: { unit: { aspects: { team: IFStringValue } } },
            },
          },
        },
      },
    },
  },
};

const bothTeams: Partial<GameModel> = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: 'team1',
        },
      },
    },
  },
  target: {
    contains: {
      unit: {
        aspects: {
          team: 'team2',
        },
      },
    },
  },
};

const cases = [
  {
    ifValue: isFirstTeam,
    context: firstTeam,
    expectedResult: true,
  },
  {
    ifValue: isFirstTeam,
    context: secondTeam,
    expectedResult: false,
  },
  { ifValue: sameTeam, context: bothTeams, expectedResult: false },
];

test.each(cases)('can change static value', ({ ifValue, context, expectedResult }) => {
  const result = evalIf(ifValue, context);
  expect(result).toBe(expectedResult);
});
