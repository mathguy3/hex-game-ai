import { IFStringValue } from '../../../../types/actions/if';

export const targetIsEnemyUnit = {
  and: [
    {
      target: {
        contains: {
          unit: {
            type: 'unit',
          },
        },
      },
    },
    {
      target: {
        contains: {
          unit: {
            aspects: {
              team: {
                value: {
                  not: {
                    subject: {
                      contains: {
                        unit: { aspects: { team: { value: IFStringValue } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
};
