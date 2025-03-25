# twist-aplayer

<p align="center">
<img src="https://i.imgur.com/LnPvZvO.png" alt="ADPlayer" width="100">
</p>
<h1 align="center">Twist APlayer</h1>

> a shadcn ui theme aplayer for your React application.

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
      artist: 'Haruka Nakamura',
      url: 'https://music.163.com/#/song?id=1919555788&userid=122967305',
    }}
    autoPlay
  />
);
```

## Credits
The implementation of this project is inspired by the following prior art project:
- [aplayer-react](https://github.com/SevenOutman/aplayer-react)
- [aplayer](https://github.com/DIYgod/APlayer)
