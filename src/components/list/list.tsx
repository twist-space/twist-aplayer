import type { ArtistInfo, AudioInfo } from '@/types';
import { useNameHelper } from '@/hooks/use-name-helper';
import { clsx } from 'clsx';
import { useCallback, useEffect, useRef } from 'react';

interface PlaylistProps {
  open: boolean;
  audio: AudioInfo[];
  playingAudioUrl?: string;
  onPlayAudio?: (audio: AudioInfo) => void;
  themeColor?: string;
  listMaxHeight?: number;
  mini: boolean;
}

export function Playlist({
  open,
  audio,
  playingAudioUrl,
  onPlayAudio,
  listMaxHeight,
  mini,
}: PlaylistProps) {
  const nh = useNameHelper('aplayer-list');
  const olStyle = listMaxHeight ? { maxHeight: listMaxHeight } : undefined;

  const renderArtist = useCallback((artist?: string | ArtistInfo) => {
    if (!artist) return 'Audio artist';
    if (typeof artist === 'string') return artist;

    return artist.name ?? 'Audio artist';
  }, []);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const listElement = listRef.current;
      listElement.style.maxHeight = `${Math.min(
        listElement.scrollHeight,
        listMaxHeight ?? Infinity,
      )}px`;

      return () => {
        listElement.removeAttribute('style');
      };
    }
  }, [listMaxHeight, mini]);

  return (
    <div
      ref={listRef}
      className={clsx(nh.b(), {
        [nh.bm('hide')]: !open,
        [nh.bs('vars')]: true,
      })}
      aria-label="Audio playlist"
      aria-live="polite"
    >
      <ol style={olStyle}>
        {audio.map((audioInfo, index) => (
          <li
            key={audioInfo.name || index}
            className={clsx({
              [nh.bm('active')]: audioInfo.url === playingAudioUrl,
            })}
            onClick={() => {
              if (audioInfo.url !== playingAudioUrl) {
                onPlayAudio?.(audioInfo);
              }
            }}
            role="button"
            aria-label={`${audioInfo.name ?? 'Audio name'} by ${renderArtist(audioInfo.artist)}}`}
          >
            <span className={nh.be('cur')}>
            </span>
            <span className={nh.be('index')}>{index + 1}</span>
            <span className={nh.be('title')}>
              {audioInfo.name ?? 'Audio name'}
            </span>
            <span className={nh.be('author')}>
              {renderArtist(audioInfo.artist)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
