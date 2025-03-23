import { useNameHelper } from '@/hooks/use-name-helper';
import { computePercentageOfY } from '@/utils/computePercentage';
import {
  MiVolumeDownRounded as IconVolumeDown,
  MiVolumeMute as IconVolumeOff,
  MiVolumeUpRounded as IconVolumeUp,
} from '@twistify/react-icons/mi';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';

interface VolumeProps {
  volume: number;
  muted: boolean;
  onToggleMuted: () => void;
  onChangeVolume: (volume: number) => void;
}

export function Volume({
  volume,
  muted,
  onToggleMuted,
  onChangeVolume,
}: VolumeProps) {
  const nh = useNameHelper('aplayer-volumn');
  const nhi = useNameHelper('aplayer-icon');
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false); // ensure related element in :hover

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onChangeVolume(computePercentageOfY(e, volumeBarRef));
      setDragging(true);

      const handleMouseMove = (e: MouseEvent) => {
        onChangeVolume(computePercentageOfY(e, volumeBarRef));
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);

        setDragging(false);
        onChangeVolume(computePercentageOfY(e, volumeBarRef));
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onChangeVolume],
  );

  return (
    <div className={clsx(nh.b(), nh.bs('vars'))}>
      <button
        type="button"
        className={clsx(nhi.b(), nhi.bs('volume-down'))}
        onClick={() => onToggleMuted()}
      >
        {muted || !volume
          ? (
              <IconVolumeOff />
            )
          : volume >= 1
            ? (
                <IconVolumeUp />
              )
            : (
                <IconVolumeDown />
              )}
      </button>
      <div
        className={clsx(nh.be('bar-wrap'), {
          [nh.bem('bar-wrap', 'active')]: isDragging,
        })}
        ref={volumeBarRef}
        onMouseDown={handleMouseDown}
      >
        <div className={nh.be('bar')}>
          <div
            className={nh.be('thumb')}
            style={{
              height: muted ? 0 : `${volume * 100}%`,
            }}
          >
          </div>
        </div>
      </div>
    </div>
  );
}
