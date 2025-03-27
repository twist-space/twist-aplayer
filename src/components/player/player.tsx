import type { PlaylistLoop, PlaylistOrder } from '@/hooks/use-playlist';
import type { ArtistInfo, AudioInfo } from '@/types';
import { PlaybackControls } from '@/components/controller';
import { Playlist } from '@/components/list';
import { Lyrics } from '@/components/lyrics';
import { useAudioControl } from '@/hooks/use-audio-control';
import { useNameHelper } from '@/hooks/use-name-helper';
import { useNotice } from '@/hooks/use-notice';
import { usePlaylist } from '@/hooks/use-playlist';
import { useSetTimeout } from '@/hooks/use-set-timeout';
import {
  IonPause as IconPause,
  IonIosArrowForward as IconRight,
} from '@twistify/react-icons/ion';
import { TiPlay as IconPlay } from '@twistify/react-icons/ti';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/main.scss';

/**
 * @see https://aplayer.js.org/#/home?id=options
 */
export interface APlayerProps {
  /**
   * @description audio info, should be an object or object array
   */
  audio: AudioInfo | readonly AudioInfo[];
  /**
   * Initial volume
   * @description default volume
   * @default 0.7
   */
  volume?: number;

  /**
   * @description values: 'normal', 'fixed'
   * @default "normal"
   */
  appearance?: 'normal' | 'fixed';

  /**
   * @description values: 'all' | 'one' | 'none'
   * @default "all"
   */
  initialLoop?: PlaylistLoop;

  /**
   * @description values: 'list' | 'random'
   * @default "list"
   */
  initialOrder?: PlaylistOrder;

  /**
   * @description audio autoplay
   * @default false
   */
  autoPlay?: boolean;

  /**
   * @description list max height
   * @default 250
   */
  listMaxHeight?: number;
  /**
   * @description enable mini mode
   * @default false
   */
  mini?: boolean;
  /**
   * @default prevent to play multiple player at the same time, pause other players when this player start play
   * @default true
   */
  mutex?: boolean;
  /**
   * @description indicate whether list should folded at first
   * @default false
   */
  listFolded?: boolean;
  /**
   * @description player theme, values: light, dark
   * @default light
   */
  theme?: 'light' | 'dark'
}

export function TwistAPlayer({
  audio,
  appearance = 'normal',
  volume = 0.7,
  initialLoop,
  initialOrder,
  autoPlay = false,
  listMaxHeight = 250,
  mini: _mini = false,
  mutex = true,
  listFolded = false,
  theme = 'light'
}: APlayerProps) {
  const nh = useNameHelper('aplayer');
  const playlist = usePlaylist(Array.isArray(audio) ? audio : [audio], {
    initialLoop,
    initialOrder,
    getSongId: song => song.url,
  });

  const [notice, showNotice] = useNotice();

  const setTimeout = useSetTimeout();

  const autoSkipTimeoutRef = useRef<
  ReturnType<typeof setTimeout> | undefined
  >();

  const cancelAutoSkip = useCallback(() => {
    if (autoSkipTimeoutRef.current) {
      clearTimeout(autoSkipTimeoutRef.current);
      autoSkipTimeoutRef.current = undefined;
    }
  }, []);

  const audioControl = useAudioControl({
    src: playlist.currentSong.url,
    initialVolume: volume,
    autoPlay,
    mutex,
    onError(e) {
      const { error } = e.target as HTMLAudioElement;

      if (error) {
        showNotice(
          'An audio error has occurred, player will skip forward in 2 seconds.',
        );
      }
      if (playlist.hasNextSong) {
        autoSkipTimeoutRef.current = setTimeout(() => {
          playlist.next();
        }, 2000);
      }
    },
    onEnded() {
      if (playlist.hasNextSong) {
        playlist.next();
      }
    },
  });

  useEffect(() => {
    if (autoPlay) {
      audioControl.playAudio(playlist.currentSong.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isInitialEffectRef = useRef(true);

  useEffect(() => {
    if (isInitialEffectRef.current) {
      isInitialEffectRef.current = false;
    } else {
      if (playlist.currentSong) {
        audioControl.playAudio(playlist.currentSong.url);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist.currentSong, audioControl.playAudio]);

  const handlePlayButtonClick = useCallback(() => {
    cancelAutoSkip();
    audioControl.togglePlay(playlist.currentSong.url);
  }, [audioControl, cancelAutoSkip, playlist.currentSong.url]);

  const renderArtist = useCallback((artist?: string | ArtistInfo) => {
    if (!artist) return 'Audio artist';
    if (typeof artist === 'string') return artist;

    if (!artist.url) {
      return artist.name ?? 'Audio artist';
    }

    return (
      <a href={artist.url} target="_blank" rel="noreferrer">
        {artist.name ?? 'Audio artist'}
      </a>
    );
  }, []);

  const hasPlaylist = playlist.length > 1;

  const playlistAudioProp = useMemo(
    () => (Array.isArray(audio) ? audio : [audio]),
    [audio],
  );

  const { prioritize } = playlist;
  const handlePlayAudioFromList = useCallback(
    (audioInfo: AudioInfo) => {
      cancelAutoSkip();
      prioritize(audioInfo);
    },
    [cancelAutoSkip, prioritize],
  );

  const [isPlaylistOpen, setPlaylistOpen] = useState(() => hasPlaylist && !listFolded);

  const [mini, setMini] = useState(_mini);

  const [displayLyrics, setDisplayLyrics] = useState(true);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMini(_mini);
  }, [_mini]);

  useEffect(() => {
    if (appearance === 'fixed') {
      if (bodyRef.current) {
        const bodyElement = bodyRef.current;
        // Explicitly set width on the body element
        // to ensure the width transition works
        bodyElement.style.width = `${bodyElement.offsetWidth - 18}px`;

        return () => {
          bodyElement.removeAttribute('style');
        };
      }
    }
  }, [appearance]);

  return (
    <div className={clsx(nh.b(), {
      [nh.bs(theme)]: true,
      [nh.bs('vars')]: true,
      [nh.bm('fixed')]: appearance === 'fixed',
      [nh.bm('loading')]: audioControl.isLoading,
      [nh.bm('withlist')]: hasPlaylist,
      [nh.bm('withlrc')]: Boolean(playlist.currentSong.lrc) && appearance !== 'fixed',
      [nh.bm('narrow')]: mini,
    })}
    >
      <div ref={bodyRef} className={nh.be('body')}>
        <div
          className={nh.be('pic')}
          onClick={handlePlayButtonClick}
          style={{
            backgroundImage: `url("${playlist.currentSong?.cover}")`,
          }}
        >
          <div
            className={clsx(
              nh.be('button'),
              audioControl.isPlaying ? nh.bm('pause') : nh.bm('play'),
            )}
          >
            {audioControl.isPlaying ? <IconPause /> : <IconPlay />}
          </div>
        </div>
        <div className={clsx(nh.be('info'))}>
          <div className={clsx(nh.be('music'))}>
            <span className={clsx(nh.be('title'))}>
              {playlist.currentSong?.name ?? 'Audio name'}
            </span>
            <span className={clsx(nh.be('author'))}>
              {' '}
              -
              {' '}
              {renderArtist(playlist.currentSong?.artist)}
            </span>
          </div>
          {appearance === 'fixed'
            ? null
            : (
                <Lyrics
                  show={displayLyrics}
                  lrcText={playlist.currentSong.lrc}
                  currentTime={audioControl.currentTime ?? 0}
                />
              )}
          <PlaybackControls
            volume={audioControl.volume ?? volume}
            onChangeVolume={audioControl.setVolume}
            muted={audioControl.muted ?? false}
            onToggleMuted={() => audioControl.toggleMuted()}
            currentTime={audioControl.currentTime}
            audioDurationSeconds={audioControl.duration}
            bufferedSeconds={audioControl.bufferedSeconds}
            onSeek={second => audioControl.seek(second)}
            onToggleMenu={() => setPlaylistOpen(open => !open)}
            order={playlist.order}
            onOrderChange={playlist.setOrder}
            loop={playlist.loop}
            onLoopChange={playlist.setLoop}
            isPlaying={audioControl.isPlaying ?? false}
            onTogglePlay={handlePlayButtonClick}
            onSkipForward={() => {
              if (playlist.hasNextSong) {
                playlist.next();
              }
            }}
            onSkipBack={() => {
              playlist.previous();
            }}
            showLyrics={displayLyrics}
            onToggleLyrics={() => {
              setDisplayLyrics(prev => !prev);
            }}
          />
        </div>
        <div className={nh.be('notice')} style={notice.style}>
          {notice.text}
        </div>
        <div
          className={nh.be('miniswitcher')}
          onClick={() => setMini(prev => !prev)}
        >
          <button className={nh.bs('icon')} type="button">
            <IconRight />
          </button>
        </div>
      </div>
      {hasPlaylist
        ? (
            <Playlist
              open={isPlaylistOpen}
              audio={playlistAudioProp}
              playingAudioUrl={playlist.currentSong.url}
              onPlayAudio={handlePlayAudioFromList}
              listMaxHeight={listMaxHeight}
            />
          )
        : null}
      {appearance === 'fixed' && (
        <Lyrics
          show={displayLyrics}
          lrcText={playlist.currentSong.lrc}
          currentTime={audioControl.currentTime ?? 0}
        />
      )}
    </div>
  );
}
