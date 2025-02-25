import { useCallback, useState } from 'react';

export const useTouchTap = (onTap: () => void) => {
  const [touchStartPosition, setTouchStartPosition] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartPosition) return;

      // If there was movement, check if it was significant
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPosition.x);
        const deltaY = Math.abs(touch.clientY - touchStartPosition.y);

        // If movement was minimal (less than 10px), consider it a tap
        if (deltaX < 10 && deltaY < 10) {
          console.log('tap');
          onTap?.();
        }
      }

      setTouchStartPosition(null);
    },
    [touchStartPosition]
  );

  const handleTouchCancel = useCallback(() => {
    setTouchStartPosition(null);
  }, []);

  return { handleTouchStart, handleTouchEnd, handleTouchCancel };
};
