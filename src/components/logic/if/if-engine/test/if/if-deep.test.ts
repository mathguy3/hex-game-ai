import { IFStringValue } from '../../../../../../types/actions/if';
import { evalIf } from '../../eval-if';
import { IFContext } from '../../types';

const sameTeam = {
  subject: {
    hex: {
      contains: {
        unit: {
          aspects: {
            team: {
              target: {
                hex: {
                  contains: { unit: { aspects: { team: IFStringValue } } },
                },
              },
            },
          },
        },
      },
    },
  },
};

const bothTeams: Partial<IFContext> = {
  model: {
    subject: {
      hex: {
        contains: {
          unit: {
            aspects: {
              team: 'team1',
            },
          },
        },
      },
    },
    target: {
      hex: {
        contains: {
          unit: {
            aspects: {
              team: 'team2',
            },
          },
        },
      },
    },
  },
};

const cases = [
  { ifValue: sameTeam, context: bothTeams, expectedResult: false },
];

test.each(cases)(
  'can change static value',
  ({ ifValue, context, expectedResult }) => {
    const result = evalIf(ifValue, context);
    expect(result).toBe(expectedResult);
  }
);
