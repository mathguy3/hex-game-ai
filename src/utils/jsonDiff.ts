export type JsonPatch = {
    [key: string]: any;
    _deleted?: string[];
};

function isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
}

export function createPatch(original: any, modified: any, path: string[] = []): JsonPatch {
    if (original === modified) return {};

    const patch: JsonPatch = {};
    const deleted: string[] = [];

    if (!isObject(original) || !isObject(modified)) {
        return modified;
    }

    // Handle deletions and modifications
    Object.keys(original).forEach(key => {
        const currentPath = [...path, key];

        if (!(key in modified)) {
            deleted.push(key);
        } else if (Array.isArray(original[key]) || Array.isArray(modified[key])) {
            if (JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
                patch[key] = modified[key];
            }
        } else if (isObject(original[key]) && isObject(modified[key])) {
            const nestedPatch = createPatch(original[key], modified[key], currentPath);
            if (Object.keys(nestedPatch).length > 0) {
                patch[key] = nestedPatch;
            }
        } else if (original[key] !== modified[key]) {
            patch[key] = modified[key];
        }
    });

    // Handle additions
    Object.keys(modified).forEach(key => {
        if (!(key in original)) {
            patch[key] = modified[key];
        }
    });

    if (deleted.length > 0) {
        patch._deleted = deleted;
    }

    return patch;
}

export function applyPatch(original: any, patch: JsonPatch): any {
    if (!isObject(original) || !isObject(patch)) {
        return patch;
    }

    const result = { ...original };

    // Remove deleted keys
    if (patch._deleted) {
        patch._deleted.forEach(key => {
            delete result[key];
        });
    }

    // Apply modifications and additions
    Object.keys(patch).forEach(key => {
        if (key === '_deleted') return;

        if (isObject(result[key]) && isObject(patch[key])) {
            result[key] = applyPatch(result[key], patch[key]);
        } else {
            result[key] = patch[key];
        }
    });

    return result;
} 