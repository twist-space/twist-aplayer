import type { PlaylistLoop, PlaylistOrder } from '@/hooks/usePlaylist';
import { ProgressBar } from '@/components/progress';
import { Volume } from '@/components/volume';
import { useNameHelper } from '@/hooks/use-name-helper';
import { formatAudioDuration } from '@/utils/formatAudioDuration';
import { AiBackwardFilled as IconBack, AiForwardFilled as IconForward } from '@twistify/react-icons/ai';
import { MdiMenu as IconMenu } from '@twistify/react-icons/mdi';
import {
  MiMusicVideo as IconLyric,
  MiPause as IconPause,
  MiPlayArrowRounded as IconPlay,
  MiRepeatRounded as IconReapteRounded,
  MiRepeatOneRounded as IconRepeatOne,
} from '@twistify/react-icons/mi';
import { TaRepeatOff as IconRepeatOff } from '@twistify/react-icons/ta';
import clsx from 'clsx';
import { useCallback } from 'react';

interface PlaybackControlsProps {
  volume: number;
  onChangeVolume: (volume: number) => void;
  muted: boolean;
  currentTime: number | undefined;
  audioDurationSeconds: number | undefined;
  bufferedSeconds: number | undefined;
  onToggleMenu?: () => void;
  onToggleMuted: () => void;
  order: PlaylistOrder;
  onOrderChange: (order: PlaylistOrder) => void;
  loop: PlaylistLoop;
  onLoopChange: (loop: PlaylistLoop) => void;
  onSeek?: (second: number) => void;
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onSkipForward?: () => void;
  onSkipBack?: () => void;
  showLyrics?: boolean;
  onToggleLyrics?: () => void;
}

export function PlaybackControls({
  volume,
  onChangeVolume,
  muted,
  currentTime,
  audioDurationSeconds,
  bufferedSeconds,
  onToggleMenu,
  onToggleMuted,
  order,
  onOrderChange,
  loop,
  onLoopChange,
  onSeek,
  isPlaying,
  onTogglePlay,
  onSkipForward,
  onSkipBack,
  showLyrics = true,
  onToggleLyrics,
}: PlaybackControlsProps) {
  const nh = useNameHelper('aplayer-controller');
  const nhi = useNameHelper('aplayer');
  // Switch order between "list" and "random"
  const handleOrderButtonClick = useCallback(() => {
    const nextOrder: PlaylistOrder = (
      {
        list: 'random',
        random: 'list',
      } as const
    )[order];

    onOrderChange(nextOrder);
  }, [order, onOrderChange]);

  // Transition of loop: all -> one -> none
  const handleLoopButtonClick = useCallback(() => {
    const nextLoop: PlaylistLoop = (
      {
        all: 'one',
        one: 'none',
        none: 'all',
      } as const
    )[loop];

    onLoopChange(nextLoop);
  }, [loop, onLoopChange]);

  return (
    <div className={clsx(nh.b(), nh.bs('vars'))}>
      <ProgressBar
        playedPercentage={
          typeof currentTime === 'undefined'
          || typeof audioDurationSeconds === 'undefined'
            ? undefined
            : currentTime / audioDurationSeconds
        }
        bufferedPercentage={
          typeof bufferedSeconds === 'undefined'
          || typeof audioDurationSeconds === 'undefined'
            ? undefined
            : bufferedSeconds / audioDurationSeconds
        }
        onSeek={progress => onSeek?.(progress * audioDurationSeconds!)}
      />
      <div className={nh.be('time')}>
        <span className={nh.be('time-inner')}>
          <span className={nh.be('ptime')}>
            {formatAudioDuration(currentTime)}
          </span>
          {' / '}
          <span className={nh.be('dtime')}>
            {formatAudioDuration(audioDurationSeconds)}
          </span>
        </span>
        <span className={clsx(nhi.bs('icon'), nhi.bs('icon-back'))} onClick={onSkipBack}>
          <IconBack />
        </span>
        <span className={clsx(nhi.bs('icon'), nhi.bs('icon-play'))} onClick={onTogglePlay}>
          {isPlaying ? <IconPause /> : <IconPlay />}
        </span>
        <span
          className={clsx(nhi.bs('icon'), nhi.bs('icon-forward'))}
          onClick={onSkipForward}
        >
          <IconForward />
        </span>
        <Volume
          volume={volume}
          muted={muted}
          onToggleMuted={onToggleMuted}
          onChangeVolume={onChangeVolume}
        />
        <button
          className={clsx(nhi.bs('icon'), nhi.bs('order'))}
          onClick={handleLoopButtonClick}
          type="button"
        >
          {
            {
              all: <IconReapteRounded />,
              one: <IconRepeatOne />,
              none: <IconRepeatOff />,
            }[loop]
          }
        </button>
        <button
          type="button"
          className={clsx(nhi.bs('icon'), nhi.bs('menu'))}
          onClick={() => onToggleMenu?.()}
        >
          <IconMenu />
        </button>
        <button
          type="button"
          className={clsx(nhi.bs('icon'), nhi.bs('lrc'), {
            [nhi.ns('icon-lrc-inactivity')]: !showLyrics,
          })}
          onClick={onToggleLyrics}
        >
          <IconLyric />
        </button>
      </div>
    </div>
  );
}
