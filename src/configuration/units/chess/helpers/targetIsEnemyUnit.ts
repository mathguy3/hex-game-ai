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
            properties: {
              team: {
                value: {
                  not: {
                    subject: {
                      contains: {
                        unit: { properties: { team: { value: IFStringValue } } },
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
