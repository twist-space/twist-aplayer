import type { AudioInfo } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shuffle } from '../utils/shuffle';

/**
 * @type all
 * @description List loop, when the last songs is ended the first songs will played
 *
 * @type one
 * @description Single song loop
 *
 * @type none
 * @description Not loop, will not play after the last songs ended
 */
export type PlaylistLoop = 'all' | 'one' | 'none';

/**
 * @type list
 * @description Play sequentially, in the original order of the song list.
 *
 * @type random
 * @description Play randomly, shuffle the song order and then play.
 */
export type PlaylistOrder = 'list' | 'random';

export interface PlaylistOptions {
  initialLoop?: PlaylistLoop;
  initialOrder?: PlaylistOrder;
}

type PlaylistState<T> = Readonly<{
  list: T[];
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
export function usePlaylist(
  songs: AudioInfo[],
  options: PlaylistOptions,
): PlaylistState<AudioInfo> {
  const { initialLoop = 'all', initialOrder = 'list' } = options;
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

  const getSong = useCallback((song: AudioInfo) => song.url, []);

  const hasNextSong = useMemo(() => {
    const currentSongIndex = list.findIndex(song => getSong(song) === getSong(currentSong));

    if (currentSongIndex < list.length - 1) {
      return true;
    }

    if (loop !== 'none') return true;

    return false;
  }, [list, currentSong, loop, getSong]);

  const next = useCallback(() => {
    setCurrentSong((prevSong) => {
      const currentSongIndex = list.findIndex(song => getSong(song) === getSong(prevSong));

      // not has last song, just return next song
      if (currentSongIndex < list.length - 1) {
        return list[currentSongIndex + 1];
      }

      return { ...list[0] };
    });
  }, [loop, list, getSong]);

  const previous = useCallback(() => {
    setCurrentSong((prev) => {
      const currentSongIndex = list.indexOf(prev);

      if (currentSongIndex > 0) {
        return list[currentSongIndex - 1];
      }

      return prev;
    });
  }, [list]);

  const prioritize = useCallback((song: AudioInfo) => {
    setCurrentSong(song);
  }, []);

  useEffect(() => {
    const sameSong = list.find(
      song => getSong(song) === getSong(currentSong),
    );

    if (sameSong) {
      setCurrentSong(sameSong);
    } else {
      setCurrentSong(list[0]);
    }
  }, [list, getSong, currentSong]);

  return {
    list,
    currentSong,
    hasNextSong,
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
