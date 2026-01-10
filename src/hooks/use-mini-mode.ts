import { useEffect, useState } from 'react';

export function useMiniMode(miniMode: boolean) {
  const [mini, setMini] = useState(miniMode);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setMini(miniMode);
  }, [miniMode]);

  const isMiniCollapsed = mini && !expanded;
  const isMiniExpanded = mini && expanded;

  return {
    mini,
    setMini,
    expanded,
    setExpanded,
    toggleExpanded: () => setExpanded(prev => !prev),
    isMiniCollapsed,
    isMiniExpanded,
  };
}

export function useSuperMiniMode(superMiniMode: boolean) {
  const [superMini, setSuperMini] = useState(superMiniMode);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setSuperMini(superMiniMode);
  }, [superMiniMode]);

  const isSuperMiniCollapsed = superMini && !expanded;
  const isSuperMiniExpanded = superMini && expanded;

  return {
    superMini,
    setSuperMini,
    expanded,
    setExpanded,
    toggleExpanded: () => setExpanded(prev => !prev),
    isSuperMiniCollapsed,
    isSuperMiniExpanded,
  };
}

