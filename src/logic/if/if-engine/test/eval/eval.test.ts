import { IF, IFStringValue } from '../../../../../types/actions/if';
import { evalValue } from '../../eval-value';
import { GameModel } from '../../types';

const getTeam: IF = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: IFStringValue,
        },
      },
    },
  },
};

const firstTeamModel: Partial<GameModel> = {
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

test('can change static value', () => {
  const result = evalValue(getTeam, firstTeamModel);
  expect(result).toBe('team1');
});
