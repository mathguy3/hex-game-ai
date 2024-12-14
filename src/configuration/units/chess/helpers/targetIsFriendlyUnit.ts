import { IFStringValue } from '../../../../types/actions/if';

export const targetIsFriendlyUnit = {
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
  ],
};
