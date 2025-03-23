import { useBEM as genBEM } from '@twistui/bem-helper';
import { useMemo } from 'react';
/**
 * Create a name helper for BEM.
 *
 * For css vars name, the namespace is fixed to 'twist' (not responsive).
 */
export function useNameHelper<B extends string>(
  block: B,
) {
  return useMemo(() => genBEM(block, 'twist'), [block]);
}
