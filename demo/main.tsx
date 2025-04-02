import type { AudioInfo } from '../src/types';
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TwistAPlayer } from '../src';

const playlist1 = [
  {
    name: '完美孤独',
    artist: {
      name: '莫文蔚',
      url: 'https://music.163.com/#/artist?id=8926',
    },
    url: 'https://music.163.com/song/media/outer/url?id=27937425',
    cover:
      'https://p2.music.126.net/lAn76HMjRiiWJawCZ0kCNA==/109951165884867482.jpg?param=130y130',
    lrc: '[00:01.75]作词 : 林夕\n[00:04.69]作曲 : 莫文蔚\n[00:07.46]编曲 : Terence Teo\n\n[00:14.95]再没有谁的脸色 需要照顾\n[00:19.85]也没有谁的难题 需要应付\n[00:25.94]一个人睡着 或睡不着\n[00:33.49]喜欢看书 就看到日出\n[00:45.58]再没有人有机会 让我受苦\n[00:50.15]也没有人有能力 让我认输\n[00:56.27]何必再等谁 一起诉苦\n[01:04.13]各自忙碌 有什么好处\n[01:16.38]盲目如何变反目\n[01:18.67]爱的程序我早已烂熟\n[01:22.57]可是说 伴侣是身外之物\n[01:26.39]我又不甘 不服\n[01:31.48]我希望觉悟 又害怕麻木\n[01:35.25]单身的好日子 有没有虚渡\n[01:39.06]再完美的孤独算不算美中不足\n[01:46.05]呜~~~~\n[02:01.18]呜~~~~\n\n[02:31.94]一切心血再不会 白白付出\n[02:36.00]所有时间怎么过 由我作主\n[02:42.01]爱过的爱人 一个个数\n[02:50.27]谁给过我 这一种满足\n[03:02.26]爱情有一本账簿\n[03:04.71]从盈到亏我早已烂熟\n[03:08.49]可是说 伴侣是身外之物\n[03:12.46]我又不甘 不服\n[03:17.44]我希望觉悟 又害怕麻木\n[03:21.01]单身的好日子 有没有虚渡\n[03:25.02]再完美的孤独算不算美中不足\n[03:31.93]呜~~~~\n[03:47.33]呜~~~~\n[04:06.51]孤身 身处何处有净土\n[04:18.47]独立 立在哪里无寒露',
  },
  {
    name: 'DAN DAN 心魅かれて(live)',
    artist: 'V.A.',
    url: 'https://music.163.com/song/media/outer/url?id=451703865',
    cover:
      'https://p2.music.126.net/FZX7XAjsmEPGyVOqm4H7aQ==/109951166361039007.jpg?param=130y130',
  },
  {
    name: '合唱 君をのせて',
    artist: {
      name: '久石譲',
      url: 'https://music.163.com/#/artist?id=14408',
    },
    url: 'https://music.163.com/song/media/outer/url?id=442746',
    cover:
      'https://p1.music.126.net/afGMbOf7SauRBMYlzLRBMg==/109951164728026153.jpg?param=130y130',
  },
  {
    name: 'ヘリオス',
    artist: 'Helios',
    url: 'https://music.163.com/song/media/outer/url?id=1919555788',
    cover:
      'https://p1.music.126.net/FmxMZrXdheBjqa2BtD3VAg==/109951167039811985.jpg?param=130y130',
  },
];

type Theme = 'light' | 'dark';

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const [playlist] = useState<AudioInfo[]>(playlist1);
  const [theme, setTheme] = useState<Theme>('light');
  const changeTheme = (theme: Theme) => {
    if (theme === 'light') {
      document.documentElement.style.background = '#121212';
      setTheme('dark');
    } else {
      setTheme('light');
      document.documentElement.style.background = '#ffffff';
    }
  };
  const [mini, setMini] = useState(false);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
      }}
      >
        <button
          onClick={() => changeTheme(theme)}
          type="button"
        >
          切换主题
        </button>
        <button onClick={() => setMini(!mini)} type="button">
          切换mini
        </button>
      </div>
      {/* fixed */}
      <div style={{ width: 600 }}>
        <TwistAPlayer
          audio={playlist}
          appearance="fixed"
          initialLoop="all"
          mini={mini}
          theme={theme}
        />
      </div>
      {/* normal */}
      <div style={{ width: 600 }}>
        <TwistAPlayer
          audio={playlist}
          appearance="normal"
          initialLoop="all"
          theme={theme}
          border
        />
      </div>
    </div>

  );
}

createRoot(document.getElementById('root') as HTMLElement).render((
  <StrictMode>
    <App />
  </StrictMode>
));
