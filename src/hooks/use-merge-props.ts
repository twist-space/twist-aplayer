import { useMemo } from 'react';

export function useMergeProps<PropsType, Defaults extends Partial<PropsType>>(
  props: PropsType,
  defaultProps: Defaults,
): PropsType & Required<Defaults> {
  return useMemo(() => {
    const merged = { ...defaultProps } as any;
    for (const key in props) {
      if (props[key] !== undefined) {
        merged[key] = props[key];
      }
    }
    return merged as PropsType & Required<Defaults>;
  }, [props, defaultProps]);
}
