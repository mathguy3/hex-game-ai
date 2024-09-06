import { IF, IFStringValue } from '../../../../../../types/actions/if';
import { evalSet } from '../../eval-set';
import { GameModel } from '../../types';

const shareTeam: IF = {
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

const bothTeamsModel: Partial<GameModel> = {
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

test('can change static value', () => {
  expect(bothTeamsModel.subject.contains.unit.aspects.team).toBe('team1');
  const updatedModel = evalSet(shareTeam, bothTeamsModel);
  expect(updatedModel.subject.contains.unit.aspects.team).toBe('team2');
});
