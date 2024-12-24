import { IFStringValue } from '../../../types/actions/if';
import { GameDefinition } from '../../../types/game';

const isMyTeam = {
  target: {
    contains: {
      unit: {
        properties: {
          team: {
            value: {
              context: { activePlayerId: IFStringValue },
            },
          },
        },
      },
    },
  },
};

const hasNotStarted = {
  context: {
    not: {
      hasStarted: '$Boolean',
    },
  },
};

export const solitaire: GameDefinition = {
  name: 'Solitaire',
  config: {
    rotateTable: true,
    description: 'A simple card game',
  },
  players: {
    player1: {},
  },
  initialState: {},
  definitions: {
    map: {},
    sequencing: {
      type: 'repeating',
      //breakOn: currentPlayerHasWon,
      actions: [
        {
          type: 'options',
          interactions: {
            card: {
              type: 'card',
              kind: 'play',
            },
          },
        },
      ],
    },
    actions: {},
    cards: {
      ace: {
        properties: { value: 1 },
      },
    },
    units: {},
  },
  ui: {
    type: 'Zone',
    id: 'solitaire-ui',
    children: [
      {
        id: 'drawStack',
        type: 'CardStack',
        disabled: hasNotStarted,
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 0,
        },
      },
      {
        id: 'stack1',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 400,
          width: '150px',
          height: '190px',
          backgroundColor: '#ccc',
        },
        disabled: hasNotStarted,
      },
    ],
  },
};
