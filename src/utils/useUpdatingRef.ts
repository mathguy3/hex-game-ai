import { useEffect, useRef } from 'react';

export const useUpdatingRef = <T>(item: T) => {
  const createdRef = useRef(item);
  useEffect(() => {
    createdRef.current = item;
  }, [item]);
  return createdRef;
};
