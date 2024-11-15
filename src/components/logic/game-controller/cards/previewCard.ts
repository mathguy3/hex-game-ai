import { originHex } from '../../../../configuration/constants';
import { ActionState } from '../../../../types/game';
import { generateTileSet } from '../../map/hex/generateTileSet';

export const previewCard = (actionState: ActionState, cardId: string) => {
  const { gameState, gameDefinition } = actionState;
  const currentPlayer = gameState.players[gameState.meId];
  const card = currentPlayer.hand.find((x) => x.id === cardId);
  const cardDefinition = gameDefinition.game.cards[card.kind];
  if (cardDefinition.targeting) {
    const matchingTiles = generateTileSet(cardDefinition.targeting.tiles, originHex, actionState);

    // Multi preview?
    const defaultTile = Object.values(matchingTiles)[0];
  }

  return actionState;
};
