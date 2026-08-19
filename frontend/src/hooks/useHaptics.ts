
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'success' | 'selection';

export function useHaptics() {
  const trigger = useCallback((type: HapticType = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        switch (type) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(40);
            break;
          case 'success':
            navigator.vibrate([10, 50, 20]);
            break;
          case 'selection':
            navigator.vibrate(15);
            break;
          default:
            navigator.vibrate(10);
        }
      } catch (e) {
        // Ignore vibration errors (e.g., user hasn't interacted with document yet)
      }
    }
  }, []);

  return trigger;
}
