import type { AudioInfo } from '../src/types';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TwistAPlayer } from '../src';

const playlist1 = [
  {
    name: '出现又离开',
    artist: {
      name: '梁博',
      url: 'https://music.163.com/#/artist?id=166010',
    },
    url: 'https://cj-sycdn.kuwo.cn/d2e7fbd04b44dd27d794cc27195887d8/67e3bb79/resource/n3/94/69/591693552.mp3',
    cover:
      'https://p1.music.126.net/mAV2OH6nPJd4XLwn80kwpA==/109951164054054313.jpg?param=130y130',
    lrc: '[00:02.77] 作词 : 梁博\n[00:03.99] 作曲 : 梁博\n[00:05.73] 编曲 : 梁博\n[00:07.58] 音乐总监 : 谭伊哲@TYZ\n[00:10.22] 混音 : 林梦洋\n[00:12.62] 爱尔兰风笛 : Eric Rigler\n[00:14.83] 鼓 : 祁大为\n[00:17.01] 贝斯 : 杜大鹏\n[00:19.38] 键盘 : 张效衡\n[00:21.60] 吉他 : Misha Kalinin\n[00:24.08] 和声 : 秋子／李郡洲\n[00:26.90] 乐器技师 : 于磊\n[00:29.10] 调音 : 杨光\n[00:31.25] 我跟你 本应该\n[00:35.11] 各自好 各自坏\n[00:39.50] 各自生活的自在\n[00:43.23] 毫无关联的存在\n[00:47.41] 直到你 出现在\n[00:53.30] 我眼中 躲不开\n[00:57.56] 我也占领你的心海\n[01:00.64] 充实着你的空白\n[01:05.82] 为何出现在彼此的生活又离开\n[01:13.44] 只留下在心里深深浅浅的表白\n[01:20.90] 谁也没有想过再更改\n[01:26.63] 谁也没有想过再想回来\n[01:31.30] 哦 我不明白\n[01:37.76] 我和你 不应该\n[01:58.62] 制造感觉 表达爱\n[02:03.01] 试探未知和未来\n[02:07.14] 相信那胡言一派\n[02:10.98] 当天空暗下来\n[02:14.67] 当周围又安静起来\n[02:18.84] 当我突然梦里醒来\n[02:22.22] 就等着太阳出来\n[02:26.53] 为何出现在彼此的生活又离开\n[02:34.42] 只留下在心里深深浅浅的表白\n[02:42.33] 谁也没有想过再更改\n[02:48.19] 谁也没有想过再想回来\n[02:52.75] 哦 我不明白\n[02:58.24] 我们紧紧相拥\n[03:03.14] 头也不抬\n[03:06.31] 因为不想告别\n[03:11.27] 就悄然离开\n[03:14.12] 不用认真的说\n[03:19.31] 多舍不得你\n[03:22.63] 每一个未来\n[03:27.03] 都有人在\n[03:32.05] 每一个未来\n[03:39.14] 都有人在\n[03:44.30] 那你无需感慨\n[03:48.45] 我别徘徊\n[03:52.55] 因为谁也没有想过再更改\n[03:57.14] 谁也没有想过再想回来\n',
  },
  {
    name: '日落大道',
    artist: '梁博',
    url: 'https://er-sycdn.kuwo.cn/df6751ccae387f41d9e2eecb2a442b52/67e3b503/resource/30106/trackmedia/M500002l1NA61Nz6ff.mp3',
    cover:
      'https://p2.music.126.net/8Xt93DOQF6X9ayqSaXjVtA==/109951169775153266.jpg?param=130y130',
  },
  {
    name: '死性不改',
    artist: 'Boy\'z / Twins',
    url: 'https://lv-sycdn.kuwo.cn/80e0ddba1f50892ab142f74bc23668dc/67e3c94d/resource/30106/trackmedia/M500002ABTbY303JQT.mp3',
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R300x300M000002ED1x02iNULS.jpg',
    lrc: '[00:00.85]作词 : 黄敬佩\n[00:01.95]作曲 : 张佳添\n[00:03.31]编曲 : Billy Chan/Barry Chung\n[00:07.91]Gil：\n[00:10.46]再见了我的宠爱\n[00:14.92]谁愿接受这种意外\n[00:19.56]你赞我天生可爱\n[00:24.77]不愿看着我离开\n[00:28.84]Sa：\n[00:29.85]同伴也话我傻\n[00:32.35]喜欢受挫\n[00:35.07]宁愿情敌在伤我\n[00:39.66]人天生根本都不可以\n[00:42.47]爱死身边的一个\n[00:45.03]无奈你最够刺激我\n[00:47.66]凡事也治倒我\n[00:49.84]几多黑心的教唆\n[00:52.26]我亦捱得过\n[00:54.67]来煽风来点火\n[00:57.09]就击倒我么\n[00:59.09]Gil：\n[00:59.96]谁恋爱就多障碍\n[01:03.00]死性我不想改\n[01:05.15]如我没有你的爱\n[01:07.44]我没法活得来\n[01:09.83]情人的存在\n[01:12.69]是我从来都志在\n[01:15.19]Twins：\n[01:15.54]难在我拱手让爱\n[01:21.00]口白：\n[01:23.06]Sa：点解要咁啫？\n[01:27.48]Gil：点解唔可以咁啊？\n[01:29.28]Sa：你唔觉得好辛苦咩？\n[01:31.30]Gil：辛苦，但系我钟意啊。\n[01:34.80]Sa：算吧啦\n[01:38.93]Kenny：\n[01:42.72]我怕可一不可再\n[01:47.34]难道你被爱都有害\n[01:51.40]Steven：\n[01:52.68]我确信天真不会错\n[01:57.26]威力会移山填海\n[02:01.45]Boy\'z：\n[02:02.31]同伴也话我傻\n[02:05.15]喜欢受挫\n[02:07.63]宁愿情敌在伤我\n[02:12.40]人天生根本都不可以\n[02:14.93]爱死身边的一个\n[02:17.38]无奈你最够刺激我\n[02:20.13]凡事也治倒我\n[02:22.48]几多黑心的教唆\n[02:24.93]我亦捱得过\n[02:27.36]来煽风来点火\n[02:29.92]就击倒我么\n[02:32.26]谁恋爱就多障碍\n[02:35.25]死性我不想改\n[02:37.71]如我没有你的爱\n[02:40.14]我没法活得来\n[02:42.43]情人的存在\n[02:44.82]是我从来都志在\n[02:47.89]难在我拱手让爱\n[02:50.97]Boyz/Twins：\n[02:51.84]人天生根本都不可以\n[02:55.22]爱死身边的一个\n[02:57.34]无奈你最够刺激我\n[03:00.16]凡事也治倒我\n[03:02.35]几多黑心的教唆\n[03:04.53]我亦捱得过\n[03:06.93]来煽风来点火\n[03:09.48]就击倒我么\n[03:12.38]谁恋爱就多障碍\n[03:15.27]死性我不想改\n[03:17.69]如我没有你的爱\n[03:19.93]我没法活得来\n[03:22.22]情人的存在\n[03:25.63]是我从来都志在\n[03:27.53]难在我拱手让爱',
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
