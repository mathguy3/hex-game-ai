import { IFObjectValue } from '../../../../types/actions/if';

export const moveToHex = [
  {
    target: {
      contains: {
        subject: {
          contains: IFObjectValue,
        },
      },
    },
  },
  {
    subject: {
      contains: {},
    },
  },
  {
    target: {
      contains: {
        unit: {
          aspects: {
            hasMoved: {
              value: true,
            },
          },
        },
      },
    },
  },
];