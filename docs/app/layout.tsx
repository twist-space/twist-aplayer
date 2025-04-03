import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import React from 'react';
import { BaiduAnlaysisScript } from './baidu-anlaysis';
import 'nextra-theme-docs/style.css';
import 'twist-aplayer/dist/index.min.css';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'Twist Aplayer',
  description: 'twist-aplayer',
  authors: {
    url: 'https://github.com/razzh7',
    name: 'razzh7',
  },
  icons: 'https://assets.razzh.cn/aplayer/aplayer.svg',
  keywords: 'aplayer twist music-player twist-aplayer',
};

const navbar = (
  <Navbar
    logo={<b>Twist Aplayer</b>}
    projectLink="https://github.com/twist-space/twist-aplayer"
  />
);

const footer = (
  <Footer>
    MIT
    {new Date().getFullYear()}
    {' '}
    © Twist Aplayer.
  </Footer>
);

export default async function RootLayout({ children }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head />
      <body suppressHydrationWarning>
        <Layout
          nextThemes={{
            defaultTheme: 'dark',
          }}
          sidebar={{ defaultOpen: false }}
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
        >
          {children}
        </Layout>
      </body>
      <BaiduAnlaysisScript />
    </html>
  );
}
