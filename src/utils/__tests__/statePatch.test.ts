import { makeUnit } from '../../components/HexMap/generation/initialMap';
import { applyPatch, createPatch } from '../statePatch';

describe('State Patch Utilities - Basic Operations', () => {
    // Simple array update
    it('should handle single update operation', () => {
        const original = { items: [{ id: 1, value: 1 }, { id: 2, value: 2 }] };
        const modified = { items: [{ id: 1, value: 1 }, { id: 2, value: 3 }] };

        const patch = createPatch(original, modified);
        expect(patch).toEqual({
            items: {
                updatedItems: {
                    1: { value: 3 }
                }
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });

    // Simple array removal
    it('should handle single remove operation', () => {
        const original = { items: [1, 2, 3] };
        const modified = { items: [1, 3] };

        const patch = createPatch(original, modified);
        expect(patch).toEqual({
            items: {
                removedItems: [1]
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });

    // Change this to use objects instead of just numbers for the test
    it.only('should handle single add operation', () => {
        // please add ids to each item
        const original = { items: [{ id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }] };
        const modified = { items: [{ id: 4, value: 3 }, { id: 1, value: 1 }, { id: 5, value: 3 }, { id: 2, value: 2 }, { id: 3, value: 3 }, { id: 6, value: 6 }] };

        const patch = createPatch(original, modified);
        // fix these values please 
        expect(patch).toEqual({
            items: {
                newItems: [[1, { id: 4, value: 3 }], [2, { id: 5, value: 3 }], [3, { id: 6, value: 6 }]]
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });
});

describe('State Patch Utilities - Combined Operations', () => {
    // Reference to makeUnit from initialMap.ts
    // startLine: 1
    // endLine: 10

    it('should handle move + update operations', () => {
        const unit1 = makeUnit('team1', 'pawn');
        const unit2 = makeUnit('team1', 'bishop');

        const original = { units: [unit1, unit2] };
        const modified = {
            units: [
                unit2,
                { ...unit1, aspects: { ...unit1.aspects, health: { type: 'health', value: 75 } } }
            ]
        };

        const patch = createPatch(original, modified);
        expect(patch).toEqual({
            units: {
                movedItems: [[0, 1], [1, 0]],
                updatedItems: {
                    1: {
                        aspects: {
                            health: { type: 'health', value: 75 }
                        }
                    }
                }
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });

    it('should handle update + remove operations', () => {
        const unit1 = makeUnit('team1', 'pawn');
        const unit2 = makeUnit('team1', 'bishop');
        const unit3 = makeUnit('team2', 'knight');

        const original = { units: [unit1, unit2, unit3] };
        const modified = {
            units: [
                { ...unit1, aspects: { ...unit1.aspects, health: { type: 'health', value: 75 } } },
                unit3
            ]
        };

        const patch = createPatch(original, modified);
        expect(patch).toEqual({
            units: {
                removedItems: [1],
                updatedItems: {
                    0: {
                        aspects: {
                            health: { type: 'health', value: 75 }
                        }
                    }
                }
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });

    it('should handle move + add operations', () => {
        const unit1 = makeUnit('team1', 'pawn');
        const unit2 = makeUnit('team1', 'bishop');
        const unit3 = makeUnit('team2', 'knight');

        const original = { units: [unit1, unit2] };
        const modified = { units: [unit3, unit2, unit1] };

        const patch = createPatch(original, modified);
        expect(patch).toEqual({
            units: {
                newItems: [[0, unit3]],
                movedItems: [[0, 2]]
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });

    it('should handle remove + add operations', () => {
        const unit1 = makeUnit('team1', 'pawn');
        const unit2 = makeUnit('team1', 'bishop');
        const unit3 = makeUnit('team2', 'knight');

        const original = { units: [unit1, unit2] };
        const modified = { units: [unit3, unit1] };

        const patch = createPatch(original, modified);
        expect(patch).toEqual({
            units: {
                newItems: [[0, unit3]],
                removedItems: [1]
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });

    it('should handle all operations combined', () => {
        const unit1 = makeUnit('team1', 'pawn');
        const unit2 = makeUnit('team1', 'bishop');
        const unit3 = makeUnit('team2', 'knight');
        const unit4 = makeUnit('team2', 'rook');

        const original = { units: [unit1, unit2, unit3] };
        const modified = {
            units: [
                unit4,
                { ...unit2, aspects: { ...unit2.aspects, health: { type: 'health', value: 75 } } },
                unit1
            ]
        };

        const patch = createPatch(original, modified);
        expect(patch).toEqual({
            units: {
                newItems: [[0, unit4]],
                movedItems: [[0, 2]],
                removedItems: [2],
                updatedItems: {
                    1: {
                        aspects: {
                            health: { type: 'health', value: 75 }
                        }
                    }
                }
            }
        });
        expect(applyPatch(original, patch)).toEqual(modified);
    });
}); 