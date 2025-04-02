import { useEffect, useState } from 'react';

export function useMiniMode(miniMode: boolean) {
  const [mini, setMini] = useState(miniMode);

  useEffect(() => {
    setMini(miniMode);
  }, [miniMode]);

  return {
    mini,
    setMini,
  };
}
