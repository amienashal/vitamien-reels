import {continueRender, delayRender, staticFile} from 'remotion';

const fonts: [string, string, string][] = [
  ['Plus Jakarta Sans', '500', 'fonts/pjs-500.woff2'],
  ['Plus Jakarta Sans', '700', 'fonts/pjs-700.woff2'],
  ['Plus Jakarta Sans', '800', 'fonts/pjs-800.woff2'],
  ['DM Mono', '400', 'fonts/dmm-400.woff2'],
  ['DM Mono', '500', 'fonts/dmm-500.woff2'],
];

if (typeof window !== 'undefined' && 'FontFace' in window) {
  const h = delayRender('local fonts');
  Promise.all(
    fonts.map(([fam, w, p]) => {
      const ff = new FontFace(fam, `url(${staticFile(p)}) format('woff2')`, {weight: w});
      document.fonts.add(ff);
      return ff.load();
    }),
  )
    .then(() => continueRender(h))
    .catch(() => continueRender(h));
}

export const theme = {
  bg: '#FFF6E8',
  bg2: '#FBEBD2',
  ink: '#1A1714',
  ink2: '#4A433B',
  label: '#8C7F70',
  line: 'rgba(26,23,20,0.12)',
  sun: '#F29A0C',
  sunDeep: '#D9480F',
  sunSoft: '#FFD98A',
  cool: '#3B6EA8',
  cart: '#FFC21A',
  title: "'Plus Jakarta Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

export const FPS = 30;
