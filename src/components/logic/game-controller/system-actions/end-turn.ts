import { IFStringValue } from '../../../../types/actions/if';
import { ActionState } from '../../../../types/game';
import { deselect } from '../interactions/deselect';

export const endTurn = (actionState: ActionState) => {
  const playerIds = Object.keys(actionState.gameState.players);
  const nextPlayerIndex = playerIds.indexOf(actionState.gameState.activePlayerId) + 1;
  console.log(actionState.gameState.activePlayerId, playerIds[nextPlayerIndex] ?? playerIds[0]);

  return {
    actionState: deselect(actionState),
    action: {
      set: [
        {
          context: {
            players: {
              key: {
                context: {
                  activePlayerId: IFStringValue,
                },
              },
              value: {
                properties: {
                  isTurnUsed: false,
                },
              },
            },
          },
        },
        {
          context: {
            activePlayerId: playerIds[nextPlayerIndex] ?? playerIds[0],
          },
        },
      ],
    },
  };
};
