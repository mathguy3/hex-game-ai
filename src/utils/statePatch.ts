export type PatchArray<T> = {
    newItems?: [number, T][];
    removedItems?: number[];
    updatedItems?: { [index: number]: Patch<T> };
};

export type Patch<T> = T extends Array<infer U>
    ? PatchArray<U>
    : T extends object
    ? { [K in keyof T]?: T[K] extends object ? Patch<T[K]> : T[K] | null | undefined }
    : T | null | undefined;

const countOccurrences = (arr: any[]) => {
    const counts = new Map();
    arr.forEach((item, index) => {
        const key = JSON.stringify(item);
        if (!counts.has(key)) {
            counts.set(key, { count: 1, indices: [index] });
        } else {
            const current = counts.get(key);
            current.count++;
            current.indices.push(index);
        }
    });
    return counts;
};
const compareItems = (item1: any, item2: any) => {
    //Should do a simple compare if the items are basic types like numbers, strings, booleans, etc.
    if (typeof item1 === 'number' && typeof item2 === 'number') {
        return item1 === item2;
    }
    if (typeof item1 === 'string' && typeof item2 === 'string') {
        return item1 === item2;
    }
    if (typeof item1 === 'boolean' && typeof item2 === 'boolean') {
        return item1 === item2;
    }
    if (item1.id !== undefined && item2.id !== undefined) {
        console.log('comparing ids', item1.id, item2.id);
        return item1.id === item2.id;
    }
    if (item1.key !== undefined && item2.key !== undefined) {
        return item1.key === item2.key;
    }
    return JSON.stringify(item1) === JSON.stringify(item2);
}

export function createPatch<T>(original: T, modified: T): Patch<T> {
    if (original === modified) return {} as Patch<T>;

    if (Array.isArray(original) && Array.isArray(modified)) {
        const patch: PatchArray<any> = {};

        const originalMap = new Map(
            original.map((item, index) => [JSON.stringify(item), index])
        );
        const modifiedMap = new Map(modified.map((item, index) => [JSON.stringify(item), index]));

        const originalCounts = countOccurrences(original);
        const modifiedCounts = countOccurrences(modified);

        const unchangedItems: [number, number][] = [];
        const usedModifiedIndices = new Set<number>();

        originalCounts.forEach((origValue, itemStr) => {
            if (modifiedCounts.has(itemStr)) {
                const modifiedValue = modifiedCounts.get(itemStr);
                const minCount = Math.min(origValue.count, modifiedValue.count);

                // Track how many of this item we've matched
                let matchedCount = 0;

                // Try to match items in order of appearance
                for (let i = 0; i < origValue.indices.length && matchedCount < minCount; i++) {
                    const origIndex = origValue.indices[i];

                    // Find the first unused matching item in modified
                    for (let j = 0; j < modifiedValue.indices.length && matchedCount < minCount; j++) {
                        const modIndex = modifiedValue.indices[j];
                        if (!usedModifiedIndices.has(modIndex)) {
                            unchangedItems.push([origIndex, modIndex]);
                            usedModifiedIndices.add(modIndex);
                            matchedCount++;
                            break;
                        }
                    }
                }
            }
        });


        // Find new items - items in modified that don't exist in original
        const newItems: [number, any][] = modified
            .map((item, index) => [index, item] as [number, any])
            .filter(([_, item]) => {
                return !original.some(origItem => compareItems(origItem, item));
            });


        // Create a Set of stringified unchanged items for faster lookup
        const unchangedSet = new Set(unchangedItems.map(([_, item]) => JSON.stringify(item)));

        // Find updates (for non-moved items)
        const updates: { [index: number]: Patch<any> } = {};
        // Go through new items and check if they are updates
        modified.forEach((item, index) => {
            const originalItem = original.find(origItem => compareItems(origItem, item));
            if (originalItem && !unchangedSet.has(JSON.stringify(index))) {
                updates[index] = createPatch(originalItem, item);
            }
        });

        // Find removed items by checking what's in original but not in modified or unchanged
        const removedItems: [number, any][] = [];
        originalMap.forEach((index, itemStr) => {
            if (!modifiedMap.has(itemStr) && !unchangedSet.has(itemStr) && !updates[index]) {
                removedItems.push([index, original[index]]);
            }
        });

        if (Object.keys(updates).length) patch.updatedItems = updates;
        if (removedItems.length) patch.removedItems = removedItems.map(([index]) => index);
        if (newItems.length) patch.newItems = newItems;

        return patch as Patch<T>;
    }

    // Rest of the implementation remains the same for objects
    if (original && modified && typeof original === 'object' && typeof modified === 'object') {
        const patch: any = {};
        const allKeys = new Set([...Object.keys(original), ...Object.keys(modified)]);

        allKeys.forEach(key => {
            if (!(key in modified)) {
                patch[key] = undefined;
            } else if (!(key in original)) {
                patch[key] = modified[key];
            } else if (original[key] !== modified[key]) {
                patch[key] = createPatch(original[key], modified[key]);
            }
        });

        return Object.keys(patch).length ? patch : {};
    }

    return modified === original ? {} as Patch<T> : modified as Patch<T>;
}

export function applyPatch<T>(original: T, patch: Patch<T>): T {
    if (!patch || typeof patch !== 'object') return patch as T;

    if (Array.isArray(original)) {
        const arrayPatch = patch as PatchArray<any>;
        let result = [...original];

        // Then apply updates to moved/existing items
        if (arrayPatch.updatedItems) {
            Object.entries(arrayPatch.updatedItems).forEach(([index, itemPatch]) => {
                result[Number(index)] = applyPatch(result[Number(index)], itemPatch);
            });
        }

        // Remove items (adjusting for moves)
        if (arrayPatch.removedItems) {
            result = result.filter((_, index) => !arrayPatch.removedItems.includes(index));
        }

        // Insert new items at specific indexes
        if (arrayPatch.newItems) {
            arrayPatch.newItems.forEach(([index, item]) => {
                // Ensure array is large enough
                while (result.length < index) {
                    result.push(undefined);
                }
                // Insert at index, shifting existing items right
                result.splice(index, 0, item);
            });
        }

        return result as T;
    }

    if (typeof original === 'object') {
        const result = { ...original };
        Object.entries(patch).forEach(([key, value]) => {
            if (value === undefined) {
                delete result[key];
            } else if (value === null) {
                result[key] = null;
            } else if (typeof value === 'object' && typeof result[key] === 'object') {
                result[key] = applyPatch(result[key], value);
            } else {
                result[key] = value;
            }
        });
        return result as T;
    }

    return patch as T;
} 