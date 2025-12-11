export function getGroupArray(currentSequence: Record<string, any>): any[] | undefined {
  return currentSequence.actions || currentSequence.phases || currentSequence.turns || currentSequence.rounds;
}
