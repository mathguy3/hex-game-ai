import { IF } from '../../../../../../types/actions/if';
import { evalSet } from '../../eval-set';
import { IFContext } from '../../types';

const changeTeam: IF = {
  subject: {
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
  expect(firstTeamModel.model.subject.hex.contains.unit.aspects.team).toBe(
    'team1'
  );
  const updatedModel = evalSet(changeTeam, firstTeamModel);
  expect(updatedModel.subject.hex.contains.unit.aspects.team).toBe('team2');
});
