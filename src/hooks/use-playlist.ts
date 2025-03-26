import { useCallback, useEffect, useMemo, useState } from 'react';
import { shuffle } from '../utils/shuffle';

export type PlaylistLoop = 'all' | 'one' | 'none';
export type PlaylistOrder = 'list' | 'random';

export interface PlaylistOptions<T, K> {
  initialLoop?: PlaylistLoop;
  initialOrder?: PlaylistOrder;
  getSongId: (song: T) => K;
}

type PlaylistState<T> = Readonly<{
  currentSong: T;
  hasNextSong: boolean;
  next: () => void;
  previous: () => void;
  prioritize: (song: T) => void;
  order: PlaylistOrder;
  setOrder: (order: PlaylistOrder) => void;
  loop: PlaylistLoop;
  setLoop: (loop: PlaylistLoop) => void;
  length: number;
}>;

/**
 * Controls what to play next
 */
export function usePlaylist<T, K>(
  songs: readonly T[],
  {
    initialLoop = 'all',
    initialOrder = 'list',
    getSongId,
  }: PlaylistOptions<T, K>,
): PlaylistState<T> {
  const [loop, setLoop] = useState<PlaylistLoop>(initialLoop);
  const [order, setOrder] = useState<PlaylistOrder>(initialOrder);
  // The actual play order
  const list = useMemo(() => {
    if (order === 'list') {
      return songs;
    }

    return shuffle(songs);
  }, [songs, order]);

  // Index in list of the current playing song
  // Supposed to be updated when moving to next song
  const [currentSong, setCurrentSong] = useState(list[0]);

  useEffect(() => {
    const sameSong = list.find(
      song => getSongId(song) === getSongId(currentSong),
    );

    if (sameSong) {
      setCurrentSong(sameSong);
    } else {
      setCurrentSong(list[0]);
    }
  }, [list, getSongId, currentSong]);

  const nextSong = useMemo(() => {
    // If the playlist is loop one, it always play currentSong
    if (loop === 'one') {
      return { ...currentSong };
    }

    const currentSongIndex = list.indexOf(currentSong);

    // Not the last song, just update currentSong
    if (currentSongIndex < list.length - 1) {
      return list[currentSongIndex + 1];
    }

    // If the playlist loops, it always has a next song to play
    if (loop !== 'none') return list[0];

    // If the playlist is looped none, playing the last song stops
    return undefined;
  }, [list, currentSong, loop]);

  const next = useCallback(() => {
    if (nextSong) {
      setCurrentSong(nextSong);
    }
  }, [nextSong, loop]);

  const previous = useCallback(() => {
    setCurrentSong((prev) => {
      const currentSongIndex = list.indexOf(prev);

      if (currentSongIndex > 0) {
        return list[currentSongIndex - 1];
      }

      return prev;
    });
  }, [list]);

  const prioritize = useCallback((song: T) => {
    setCurrentSong(song);
  }, []);

  return {
    currentSong,
    hasNextSong: typeof nextSong !== 'undefined',
    next,
    previous,
    prioritize,
    order,
    setOrder,
    loop,
    setLoop,
    length: list.length,
  };
}
