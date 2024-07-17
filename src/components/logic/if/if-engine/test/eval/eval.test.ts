import { IF, IFStringValue } from '../../../../../../types/actions/if';
import { evalValue } from '../../eval-value';
import { IFContext } from '../../types';

const getTeam: IF = {
  subject: {
    hex: {
      contains: {
        unit: {
          aspects: {
            team: IFStringValue,
          },
        },
      },
    },
  },
};

const firstTeamModel: Partial<IFContext> = {
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
  },
};

test('can change static value', () => {
  const result = evalValue(getTeam, firstTeamModel);
  expect(result).toBe('team1');
});
