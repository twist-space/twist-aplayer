import type React from 'react';
import { useNameHelper } from '@/hooks/use-name-helper';
import { computePercentage } from '@/utils/computePercentage';
import { TiLoading } from '@twistify/react-icons/ti';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ProgressBarProps {
  bufferedPercentage?: number;
  playedPercentage?: number;
  /**
   * Callback when user seek progress on the progress bar
   * This includes clicking on the progress bar
   * and dragging the thumb (only once after mouse release)
   *
   * @param progress Progress in float (0-1)
   */
  onSeek?: (progress: number) => void;
}

export function ProgressBar({
  bufferedPercentage,
  playedPercentage,
  onSeek,
}: ProgressBarProps) {
  const nh = useNameHelper('aplayer-bar');
  const nhi = useNameHelper('aplayer-icon');
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(playedPercentage);
  const isDraggingRef = useRef(false);

  // Sync with current playing progress
  // only when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setProgress(playedPercentage);
    }
  }, [playedPercentage]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      const percentage = computePercentage(e, progressBarRef);
      setProgress(percentage);

      const handleMouseMove = (e: MouseEvent) => {
        const percentage = computePercentage(e, progressBarRef);
        setProgress(percentage);
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const percentage = computePercentage(e, progressBarRef);

        setProgress(percentage);
        onSeek?.(percentage);
        isDraggingRef.current = false;
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onSeek],
  );

  return (
    <div
      ref={progressBarRef}
      className={clsx(nh.b(), nh.bs('vars'))}
      onMouseDown={handleMouseDown}
      role="slider"
      aria-label="Audio progress"
      aria-valuenow={progress ? progress * 100 : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-live="polite"
    >
      <div className={nh.be('inner')}>
        {typeof bufferedPercentage !== 'undefined'
          ? (
              <div
                className={nh.be('loaded')}
                style={{ width: `${bufferedPercentage * 100}%` }}
              />
            )
          : null}
        {typeof progress !== 'undefined'
          ? (
              <div
                className={nh.be('played')}
                style={{
                  width: `${progress * 100}%`,
                }}
              >
                <span
                  className={nh.be('thumb')}
                >
                  <span className={clsx(nhi.bs('loading'))}>
                    <TiLoading />
                  </span>
                </span>
              </div>
            )
          : null}
      </div>
    </div>
  );
}
