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

const tablePadding = 25;

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
    styles: {
      width: 1500,
      height: 1000,
      border: '1px solid #777',
      borderRadius: 10,
    },
    children: [
      {
        id: 'drawStack',
        type: 'CardStack',
        disabled: hasNotStarted,
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: tablePadding,
        },
      },
      {
        id: 'stack1',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: 400,
          backgroundColor: '#ccc',
        },
        disabled: hasNotStarted,
      },
    ],
  },
};
