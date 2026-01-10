import type { ArtistInfo, TwistAPlayerProps } from '@/types';
import { PlaybackControls } from '@/components/controller';
import { Playlist } from '@/components/list';
import { Lyrics } from '@/components/lyrics';
import {
  useNameHelper,
  usePlayer,
} from '@/hooks';
import { IconPause, IconPlay, IconRight } from '@/icons';
import clsx from 'clsx';
import { useCallback } from 'react';
import './styles/main.scss';

export function TwistAPlayer(props: TwistAPlayerProps) {
  const nh = useNameHelper('aplayer');
  const {
    bodyRef,
    appearance,
    volume,
    listMaxHeight,
    theme,
    border,
    notice,
    audio,
    audioControl,
    handlePlayButtonClick,
    handlePlayAudioFromList,
    isPlaylistOpen,
    setPlaylistOpen,
    displayLyrics,
    setDisplayLyrics,
    playlist,
    hasPlaylist,
    showSuperMini,
    superMiniExpanded,
    toggleSuperMiniExpanded,
    isSuperMiniCollapsed,
    isSuperMiniExpanded,
    showMini,
    toggleMiniExpanded,
    isMiniCollapsed,
    isMiniExpanded
  } = usePlayer(props);
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

  return (
    <div
      className={clsx(nh.b(), {
        [nh.bs(theme)]: true,
        [nh.bs('vars')]: true,
        [nh.bm(appearance)]: true,
        [nh.bm('loading')]: audioControl.isLoading,
        [nh.bm('withlist')]: hasPlaylist,
        [nh.bm('list-collapsed')]: !isPlaylistOpen,
        [nh.bm('withlrc')]: Boolean(playlist.currentSong.lrc) && appearance !== 'fixed',
        [nh.bm('border')]: border,
        [nh.bm('mini')]: showMini,
        [nh.bm('mini-collapsed')]: isMiniCollapsed,
        [nh.bm('mini-expanded')]: isMiniExpanded,
        [nh.bm('super-mini')]: showSuperMini,
        [nh.bm('super-mini-collapsed')]: isSuperMiniCollapsed,
        [nh.bm('super-mini-expanded')]: isSuperMiniExpanded,
      })}
      role="region"
      aria-label="Audio Player"
    >
      <div
        ref={bodyRef}
        className={nh.be('body')}
      >
        <div
          className={nh.be('pic')}
          onClick={handlePlayButtonClick}
          style={{
            backgroundImage: `url("${playlist.currentSong?.cover}")`,
          }}
          role="button"
          aria-label={audioControl.isPlaying ? 'Pause audio' : 'Play audio'}
        >
          <div
            className={clsx(
              nh.be('button'),
              audioControl.isPlaying ? nh.bm('pause') : nh.bm('play'),
            )}
            role="presentation"
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
          onClick={toggleMiniExpanded}
        >
          <button className={clsx(nh.bs('icon'), nh.bs('icon-right'))} type="button">
            <IconRight />
          </button>
        </div>
        <div
          className={nh.be('super-miniswitcher')}
          onClick={toggleSuperMiniExpanded}
        >
          <button className={clsx(nh.bs('icon'), nh.bs('icon-right'))} type="button">
            <IconRight />
          </button>
        </div>
      </div>
      {hasPlaylist
        ? (
          <Playlist
            open={isPlaylistOpen}
            audio={audio}
            playingAudioUrl={playlist.currentSong.url}
            onPlayAudio={handlePlayAudioFromList}
            listMaxHeight={listMaxHeight}
            isMiniExpanded={isMiniExpanded}
            isSuperMiniExpanded={superMiniExpanded}
          />
        )
        : null}
      <Lyrics
        show={displayLyrics}
        lrcText={playlist.currentSong.lrc}
        currentTime={audioControl.currentTime ?? 0}
      />
    </div>
  );
}

