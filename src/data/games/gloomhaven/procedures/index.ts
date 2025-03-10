import { isEnemyTargetSpace } from './isEnemyTargetSpace';
import { isSubjectCurrentPlayer } from './isSubjectCurrentPlayer';
import { isTargetCurrentPlayer } from './isTargetCurrentPlayer';
import { subjectExists } from './subjectExists';
import { moveSlotToTarget } from './moveSlotToTarget';
import { spaceSlotCurrentPlayer } from './spaceSlotCurrentPlayer';
import { shuffleModifiers } from './playerActions/shuffleModifiers';
import { playerSelectCards } from './playerActions/playerSelectCards';
import { playerTurn } from './playerActions/playerTurn';

export const procedures = {
  isEnemyTargetSpace,
  moveSlotToTarget,
  subjectExists,
  isSubjectCurrentPlayer,
  isTargetCurrentPlayer,
  spaceSlotCurrentPlayer,
  shuffleModifiers,
  playerSelectCards,
  playerTurn,
};
