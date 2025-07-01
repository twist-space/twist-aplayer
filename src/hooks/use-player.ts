import type { AudioInfo, TwistAPlayerProps } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useAudioControl,
  useMergeProps,
  useMiniMode,
  useNotice,
  usePlaylist,
  useSetTimeout,
} from '.';

export function usePlayer(_props: TwistAPlayerProps) {
  const props = useMergeProps(_props, {
    appearance: 'normal',
    volume: 0.7,
    autoPlay: false,
    listMaxHeight: 250,
    mini: false,
    mutex: true,
    listFolded: false,
    theme: 'light',
    border: false,
  });

  const {
    audio,
    appearance,
    initialLoop,
    initialOrder,
    volume,
    autoPlay,
    listMaxHeight,
    listFolded,
    mutex,
    theme,
    border,
  } = props;

  const playlistAudioProp = useMemo(
    () => (Array.isArray(audio) ? audio : [audio]),
    [audio],
  );

  const playlist = usePlaylist(playlistAudioProp, {
    initialLoop,
    initialOrder,
  });

  const [notice, showNotice] = useNotice();

  const { mini, setMini } = useMiniMode(props.mini);

  const setTimeout = useSetTimeout();

  const autoSkipTimeoutRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const cancelAutoSkip = useCallback(() => {
    if (autoSkipTimeoutRef.current) {
      clearTimeout(autoSkipTimeoutRef.current);
      autoSkipTimeoutRef.current = null;
    }
  }, []);

  const isLoopNoonLastSongEndingRef = useRef(false);

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
      const { list, currentSong, loop, prioritize, hasNextSong } = playlist;
      const { audio } = audioControl;

      // only play current song when loop is "one"
      if (loop === 'one') {
        prioritize({ ...currentSong });
        return;
      }

      // in last songs and loop is "none"
      if (!hasNextSong && loop === 'none') {
        isLoopNoonLastSongEndingRef.current = true;
        audio!.currentTime = 0;
        audio!.pause();
        audio!.src = list[0].url;
        prioritize(list[0]);
        return;
      }

      playlist.next();
    },
  });

  const hasPlaylist = playlist.length > 1;

  const handlePlayButtonClick = useCallback(() => {
    cancelAutoSkip();
    audioControl.togglePlay(playlist.currentSong.url);
  }, [audioControl, cancelAutoSkip, playlist.currentSong.url]);

  const { prioritize } = playlist;

  const handlePlayAudioFromList = useCallback(
    (audioInfo: AudioInfo) => {
      cancelAutoSkip();
      prioritize(audioInfo);
    },
    [cancelAutoSkip, prioritize],
  );

  const [isPlaylistOpen, setPlaylistOpen] = useState(() => hasPlaylist && !listFolded);

  const [displayLyrics, setDisplayLyrics] = useState(true);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoPlay) {
      audioControl.playAudio(playlist.currentSong.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isInitialEffectRef = useRef(true);
  const prevSong = useRef(playlist.currentSong);

  useEffect(() => {
    if (isInitialEffectRef.current) {
      isInitialEffectRef.current = false;
      return;
    }

    if (isLoopNoonLastSongEndingRef.current) {
      isLoopNoonLastSongEndingRef.current = false;
      return;
    }

    // playlist.currentSong !== prevSong.current can avoid react strictMode twice render effect
    if (playlist.currentSong && (
      playlist.loop === 'one'
      || playlist.currentSong !== prevSong.current
    )) {
      prevSong.current = playlist.currentSong;
      audioControl.playAudio(playlist.currentSong.url);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist.currentSong]);

  useEffect(() => {
    if (appearance === 'fixed' && bodyRef.current) {
      const bodyElement = bodyRef.current;
      // Explicitly set width on the body element
      // to ensure the width transition works
      bodyElement.style.width = '400px';

      return () => {
        bodyElement.removeAttribute('style');
      };
    }
  }, [appearance]);

  return {
    bodyRef,
    appearance,
    volume,
    listMaxHeight,
    theme,
    border,
    notice,
    audioControl,
    audio: playlistAudioProp,
    handlePlayButtonClick,
    handlePlayAudioFromList,
    isPlaylistOpen,
    setPlaylistOpen,
    mini,
    displayLyrics,
    setDisplayLyrics,
    setMini,
    playlist,
    hasPlaylist,
  };
}
