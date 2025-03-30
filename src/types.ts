import type { PlaylistLoop, PlaylistOrder } from './hooks/use-playlist';

export interface AudioInfo {
  name?: string;
  artist?: string | ArtistInfo;
  url: string;
  cover?: string;
  lrc?: string;
  theme?: string;
  type?: 'auto' | 'hls' | 'normal';
}

export interface ArtistInfo {
  name?: string;
  url?: string;
}

/**
 * @see https://aplayer.js.org/#/home?id=options
 */
export interface TwistAPlayerProps {
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
  theme?: 'light' | 'dark';
  /**
   * @description user border, it can accent border if use dark mode.
   * @default false
   */
  border?: boolean;
}
