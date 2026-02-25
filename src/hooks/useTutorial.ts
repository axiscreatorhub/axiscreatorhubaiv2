import { useState, useEffect } from 'react';

export function useTutorial(moduleName: string) {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tutorial_seen_${moduleName}`);
    if (!hasSeen) {
      // Small delay to allow page to render
      const timer = setTimeout(() => setShowTutorial(true), 500);
      return () => clearTimeout(timer);
    }
  }, [moduleName]);

  const completeTutorial = () => {
    localStorage.setItem(`tutorial_seen_${moduleName}`, 'true');
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(`tutorial_seen_${moduleName}`);
    setShowTutorial(true);
  };

  return { showTutorial, completeTutorial, resetTutorial };
}
