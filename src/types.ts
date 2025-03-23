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
