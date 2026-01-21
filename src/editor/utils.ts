import type { EditorPath } from './types';

export const setAtPath = (root: any, path: EditorPath, value: any) => {
  if (path.length === 0) {
    return value;
  }
  const clone = structuredClone(root);
  let cursor = clone;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (cursor[key] === undefined) {
      const nextKey = path[i + 1];
      cursor[key] = typeof nextKey === 'number' ? [] : {};
    }
    cursor = cursor[key];
  }
  cursor[path[path.length - 1]] = value;
  return clone;
};

export const removeAtPath = (root: any, path: EditorPath) => {
  if (path.length === 0) {
    return root;
  }
  const clone = structuredClone(root);
  let cursor = clone;
  for (let i = 0; i < path.length - 1; i += 1) {
    cursor = cursor[path[i]];
    if (cursor === undefined) {
      return clone;
    }
  }
  const lastKey = path[path.length - 1];
  if (Array.isArray(cursor)) {
    cursor.splice(lastKey as number, 1);
  } else {
    delete cursor[lastKey];
  }
  return clone;
};

export const getAtPath = (root: any, path: EditorPath) => {
  let cursor = root;
  for (const key of path) {
    cursor = cursor?.[key];
  }
  return cursor;
};
