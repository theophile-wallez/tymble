import { useCallback, useEffect } from 'react';

type Props = {
  onToggle: () => void;
  shortcut:
    | {
        meta?: boolean;
        ctrl?: boolean;
        cmd?: boolean;
        key: string;
      }
    | string;
  enabled?: boolean;
};

export const useCommand = ({ onToggle, shortcut, enabled = true }: Props) => {
  const isShortcut = useCallback(
    (event: KeyboardEvent, shortcut: Props['shortcut']) => {
      if (typeof shortcut === 'string') {
        return shortcut.toLowerCase() === event.key.toLowerCase();
      }
      if (shortcut.meta && !event.metaKey) {
        return false;
      }
      if (shortcut.ctrl && !event.ctrlKey) {
        return false;
      }
      if (shortcut.cmd && !(event.metaKey || event.ctrlKey)) {
        return false;
      }
      return shortcut.key.toLowerCase() === event.key.toLowerCase();
    },
    []
  );
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isShortcut(event, shortcut)) {
        event.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled, onToggle, shortcut, isShortcut]);
};
