import type { AudioInfo } from '../src/types';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TwistAPlayer } from '../src';

const playlist1 = [
  {
    name: 'Dancing with my phone',
    artist: {
      name: 'HYBS',
      url: 'https://music.163.com/#/artist?id=49713779',
    },
    url: 'https://music.163.com/song/media/outer/url?id=1969744125',
    cover:
      'https://p1.music.126.net/tOtUdKjS9rktAFRamcomWQ==/109951167748733958.jpg',
    lrc: '[00:00.000] 作词 : James Alyn Wee/Kasidej Hongladaromp\n[00:01.000] 作曲 : James Alyn Wee/Kasidej Hongladaromp\n[00:28.836] I\'m just laying on the floor again\n[00:33.124] Can\'t be bothered to get up now\n[00:36.345] I wouldn’t care\n[00:38.348] If I never get up again\n[00:41.363] I don’t want to\n[00:47.388] Then our song comes on the radio\n[00:51.906] Makes me wanna start to dance, oh\n[00:55.163] I wanna know\n[00:56.997] If you feel the same way as me\n[01:00.097] Why would you go?\n[01:02.695]\n[01:05.780] Dancing, I\'m all alone\n[01:09.163] Figuring out how I can get you home\n[01:15.129] Dancing with my phone\n[01:18.393] Thinking about you\n[01:22.292]\n[01:25.154] On my feet and now I\'m out the door\n[01:29.741] Walking by the places that we used to go\n[01:34.478] I remember all your favorite stores\n[01:37.743] I won\'t lie\n[01:43.345] I don\'t think I even know myself anymore\n[01:52.741] You\'re the one who knew me ****ing well\n[01:58.914] Yeah, you know\n[02:00.129]\n[02:02.177] Dancing, I\'m all alone\n[02:05.652] Figuring out how I can get you home\n[02:11.617] Dancing with my phone\n[02:14.687] Thinking about you\n[02:20.993] Dancing, I\'m all alone (I\'m dancing all alone)\n[02:24.218] Figuring out how I can get you home (How I can get you home)\n[02:30.291] Dancing with my phone (I\'m dancing with my phone)\n[02:33.626] Thinking about you\n[02:37.376]\n[02:39.724] Dancing all alone, dancing all alone (I\'m dancing all alone)\n[02:44.589] Dancing all alone, dancing all alone (I\'m dancing with my phone)\n[02:49.284] Dancing with my phone\n[02:52.504] Thinking about you\n[02:58.522] Dancing all alone, dancing all alone\n[03:03.262] Dancing all alone, dancing all alone (Thinking about you)\n[03:08.094] Dancing with my phone\n[03:11.402] Thinking about you\n',
  },
  {
    name: 'ヘリオス',
    artist: 'Helios',
    url: 'https://music.163.com/song/media/outer/url?id=1919555788',
    cover:
      'https://p1.music.126.net/FmxMZrXdheBjqa2BtD3VAg==/109951167039811985.jpg?param=130y130',
  },
  {
    name: 'エカテリーナのための協奏曲',
    artist: '松下奈緒',
    url: 'https://music.163.com/song/media/outer/url?id=22825753',
    cover:
      'https://p2.music.126.net/Gl5oBQl-8kNeqzvTB3wvag==/109951166202756701.jpg',
  },
  {
    name: '海辺の丘',
    artist: '小瀬村晶/信澤宣明',
    url: 'https://music.163.com/song/media/outer/url?id=1331298993',
    cover:
      'https://p1.music.126.net/RzAd3yEwGX6PW7LEQtK6mA==/109951163707194914.jpg',
  },
];

type Theme = 'light' | 'dark';
function App() {
  const [playlist] = useState<AudioInfo[]>(playlist1);
  const [theme, setTheme] = useState<Theme>('light');
  const changeTheme = (theme: Theme) => {
    const bodyClassList = document.documentElement.classList;

    bodyClassList.remove('twist-aplayer-dark');

    if (theme === 'light') {
      bodyClassList.add('twist-aplayer-dark');
      document.documentElement.style.background = '#121212';
      setTheme('dark');
    } else {
      setTheme('light');
      document.documentElement.style.background = '#ffffff';
    }
  };

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
      <button
        onClick={() => changeTheme(theme)}
        type="button"
      >
        切换主题
      </button>
      <div style={{ width: 600 }}>
        <TwistAPlayer
          audio={playlist}
          appearance="fixed"
          initialLoop="all"
        />
      </div>
      <div style={{ width: 600 }}>
        <TwistAPlayer
          audio={playlist}
          appearance="normal"
          initialLoop="all"
        />
      </div>
    </div>

  );
}
createRoot(document.getElementById('root') as HTMLElement).render(<App />);
