import { IF } from '../../../../../../types/actions/if';
import { evalSet } from '../../eval-set';
import { GameModel } from '../../types';

const changeTeam: IF = {
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

const mapModel = {
  '0': {
    contains: {
      unit: {
        aspects: {
          team: 'team1',
        },
      },
    },
  },
};

const firstTeamModel: Partial<GameModel> = {
  subject: { parent: mapModel, field: '0' },
};

test('can change static value', () => {
  expect(mapModel['0'].contains.unit.aspects.team).toBe('team1');
  const updatedModel = evalSet(changeTeam, firstTeamModel);
  expect(updatedModel.subject.parent['0'].contains.unit.aspects.team).toBe('team2');
});
