import { useCallback, useEffect, useRef } from 'react';

export const useKeys = () => {
  const pressedKeys = useRef<Record<string, boolean>>({});
  const addKey = useCallback((event: KeyboardEvent) => {
    pressedKeys.current[event.code] = true;
  }, []);
  const removeKey = useCallback((event: KeyboardEvent) => {
    pressedKeys.current[event.code] = false;
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', addKey);
    window.addEventListener('keyup', removeKey);
    return () => {
      window.removeEventListener('keydown', addKey);
      window.removeEventListener('keyup', removeKey);
    };
  }, [addKey, removeKey]);
  return pressedKeys;
};
