import { IF, IFStringValue } from '../../../../../../types/actions/if';
import { evalSet } from '../../eval-set';
import { IFContext } from '../../types';

const shareTeam: IF = {
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

const bothTeamsModel: Partial<IFContext> = {
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

test('can change static value', () => {
  expect(bothTeamsModel.model.subject.hex.contains.unit.aspects.team).toBe(
    'team1'
  );
  const updatedModel = evalSet(shareTeam, bothTeamsModel);
  expect(updatedModel.subject.hex.contains.unit.aspects.team).toBe('team2');
});
