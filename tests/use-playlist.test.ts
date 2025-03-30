import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { type PlaylistOptions, usePlaylist } from '../src/hooks/use-playlist';

describe('usePlaylist', () => {
  const songs = [
    { url: 'music.com/song1' },
    { url: 'music.com/song2' },
    { url: 'music.com/song3' },
  ];

  const renderUsePlaylist = (options?: PlaylistOptions) => renderHook(() => {
    const { initialLoop, initialOrder } = options || { initialLoop: 'all', initialOrder: 'list' };
    return usePlaylist(songs, {
      initialLoop,
      initialOrder,
    });
  },
  );

  test('should initialize with default loop and order', () => {
    const { result } = renderUsePlaylist();

    expect(result.current.currentSong).toEqual(songs[0]);
    expect(result.current.order).toEqual('list');
    expect(result.current.loop).toEqual('all');
    expect(result.current.length).toEqual(3);
  });

  test('should change order when setOrder is called', () => {
    const { result } = renderUsePlaylist();

    act(() => {
      result.current.setOrder('random');
    });

    expect(result.current.order).toBe('random');

    act(() => {
      result.current.setOrder('list');
    });

    expect(result.current.order).toBe('list');
  });

  test('should move to next song when next is called', () => {
    const { result } = renderUsePlaylist();

    act(() => {
      result.current.next();
    });

    expect(result.current.currentSong).toEqual(songs[1]);

    act(() => {
      result.current.next();
    });

    expect(result.current.currentSong).toEqual(songs[2]);
  });

  test('should move to previous song when previous is called', () => {
    const { result } = renderUsePlaylist();

    act(() => {
      result.current.next();
    });

    expect(result.current.currentSong).toEqual(songs[1]);

    act(() => {
      result.current.previous();
    });

    expect(result.current.currentSong).toEqual(songs[0]);
  });

  test('should loop back to first song when loop is "all" and next is called on last song', () => {
    const { result } = renderUsePlaylist();

    expect(result.current.currentSong).toEqual(songs[0]);

    act(() => {
      result.current.next();
      result.current.next();
      result.current.next();
    });

    expect(result.current.currentSong).toEqual(songs[0]);
  });

  test('only play current song when loop is "one"', () => {
    const { result } = renderUsePlaylist();

    act(() => {
      result.current.next();
    });

    expect(result.current.currentSong).toEqual(songs[1]);

    act(() => {
      result.current.prioritize({ ...result.current.currentSong });
    });

    expect(result.current.currentSong).toEqual(songs[1]);
  });
});
