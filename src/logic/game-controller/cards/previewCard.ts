import { originHex } from '../../../configuration/constants';
import { ActionState, PlayerState } from '../../../types/game';
import { generateTileSet } from '../../map/hex/generateTileSet';

export const previewCard = (actionState: ActionState, cardId: string) => {
  const { gameState, gameDefinition, localState } = actionState;
  const currentPlayer = gameState.players[localState.meId] as PlayerState;
  console.log(currentPlayer);
  const card = currentPlayer.hand.find((x) => x.id === cardId);
  if (!card) return actionState;
  const cardDefinition = gameDefinition.cards[card.kind];
  if (cardDefinition.targeting) {
    const matchingTiles = generateTileSet(cardDefinition.targeting.tiles, originHex, actionState);

    // Multi preview?
    const defaultTile = Object.values(matchingTiles)[0];
  }

  return actionState;
};
