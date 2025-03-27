# twist-aplayer

<p align="center">
<img src="https://assets.razzh.cn/aplayer/aplayer.svg" alt="ADPlayer" width="100">
</p>
<h1 align="center">Twist APlayer</h1>

> A shadcn ui theme aplayer for your React application.

![image](https://assets.razzh.cn/aplayer/aplayer-light.png)
![image](https://assets.razzh.cn/aplayer/aplayer-dark.png)

## Features
Twist Aplayer supports:
- Mini mode
- Playlist - Lyrics
- Light or dark theme switch
- Custom theme color with component-level variables
- SSR compatibility

## Usage

```bash
npm i twist-aplayer
```

Import TwistAPlayer component from twist-aplayer package, and import stylesheet.

```tsx
import { TwistAPlayer } from 'twist-aplayer';
import 'twist-aplayer/dist/index.css';

render(
  <APlayer
    audio={{
      name: 'ヘリオス',
      artist: 'Helios',
      url: 'https://music.163.com/#/song?id=1919555788&userid=122967305',
    }}
    autoPlay
  />
);
```

### Interface

```ts
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
  theme?: 'light' | 'dark';
}
```

## Credits

The implementation of this project is inspired by the following prior art project:
- [aplayer-react](https://github.com/SevenOutman/aplayer-react)
- [aplayer](https://github.com/DIYgod/APlayer)
