import { IF, IFStringValue } from '../../../../../types/actions/if';
import { evalValue } from '../../eval-value';
import { GameModel } from '../../types';

const getTeamValue: IF = {
  subject: {
    contains: {
      unit: {
        aspects: {
          key: { subject: { contains: { unit: { aspects: { team: IFStringValue } } } } },
          value: IFStringValue,
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
          team1: 'first',
          team2: 'second',
        },
      },
    },
  },
};

const secondTeamModel: Partial<GameModel> = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: 'team2',
          team1: 'first',
          team2: 'second',
        },
      },
    },
  },
};

const cases = [
  {
    test: getTeamValue,
    model: firstTeamModel,
    result: 'first',
  },
  {
    test: getTeamValue,
    model: secondTeamModel,
    result: 'second',
  },
];

test.each(cases)('can get result based on result', ({ test, model, result }) => {
  const actual = evalValue(test, model);
  expect(actual).toBe(result);
});
