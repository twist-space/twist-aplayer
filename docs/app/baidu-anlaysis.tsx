import Script from 'next/script';

export function BaiduAnlaysisScript() {
  // eslint-disable-next-line node/prefer-global/process
  return process.env.NODE_ENV === 'production'
    ? (
        <Script
          id="baidu-analysis"
          strategy="lazyOnload"
          // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{
            __html: `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?5edf3244866e5c04166c47bc42a01289";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
    `,
          }}
        />
      )
    : null;
}
