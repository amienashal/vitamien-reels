import React from 'react';
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, Caption} from '@remotion/captions';
import {theme, FPS} from './theme';
import {S1, S2, S3, S4, S5, S6, S7, PAL} from './Scenes';
import words from './words.json';

const END = 50.2;
const SCENES: [number, number, React.FC, string, [number, number]][] = [
  [0, 5.6, S1, PAL.s1.fg, [50, 50]],
  [5.6, 11.75, S2, PAL.s2.fg, [85, 20]],
  [11.75, 19.3, S3, PAL.s3.fg, [15, 50]],
  [19.3, 27.9, S4, PAL.s4.fg, [85, 80]],
  [27.9, 35.6, S5, PAL.s5.fg, [50, 40]],
  [35.6, 42.4, S6, PAL.s6.fg, [10, 20]],
  [42.4, END, S7, PAL.s7.fg, [90, 60]],
];
const TR = 16;

const captions: Caption[] = (words as {w: string; s: number; e: number}[]).map((x, i) => ({
  text: (i === 0 ? '' : ' ') + (x.w === 'D.' && i < 10 ? 'D?' : x.w),
  startMs: x.s * 1000,
  endMs: Math.min(x.e, END) * 1000,
  timestampMs: x.s * 1000,
  confidence: 1,
}));
const {pages} = createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 750});

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const idx = Math.max(0, SCENES.findIndex(([a, b]) => f / FPS >= a && f / FPS < b));
  const col = SCENES[idx][3];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, left: 96, right: 120, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 26, height: 26, borderRadius: 13, background: col}} />
          <div style={{fontFamily: theme.mono, fontSize: 32, fontWeight: 500, color: col, letterSpacing: '0.08em'}}>vitamien.io</div>
        </div>
        <div style={{fontFamily: theme.mono, fontSize: 30, color: col, opacity: 0.7, letterSpacing: '0.1em', fontVariantNumeric: 'tabular-nums'}}>
          {String(Math.max(1, idx + 1)).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
        </div>
      </div>
      <div style={{position: 'absolute', top: 210, left: 96, right: 120, height: 6, borderRadius: 3, background: col, opacity: 0.9}}>
        <div style={{width: `${(f / durationInFrames) * 100}%`, height: '100%', borderRadius: 3, background: col}} />
      </div>
    </AbsoluteFill>
  );
};

const SceneWrap: React.FC<{dur: number; children: React.ReactNode; first: boolean; o: [number, number]}> = ({dur, children, first, o}) => {
  const f = useCurrentFrame();
  const r = first ? 160 : interpolate(f, [0, TR], [0, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)});
  const zoom = interpolate(f, [0, dur * FPS], [1.0, 1.045]);
  return (
    <AbsoluteFill style={{clipPath: `circle(${r}% at ${o[0]}% ${o[1]}%)`}}>
      <AbsoluteFill style={{scale: `${zoom}`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const ms = (f / FPS) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;
  const local = ms - page.startMs;
  const s = interpolate(local, [0, 120], [0.85, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 1330,
          left: 80,
          right: 140,
          textAlign: 'center',
          scale: `${s}`,
          fontFamily: theme.title,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        <span style={{background: '#111', padding: '8px 22px', boxShadow: '0 8px 0 rgba(0,0,0,0.25)', borderRadius: 18, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
          {page.tokens.map((tk) => {
            const active = ms >= tk.fromMs && ms < tk.toMs;
            return (
              <span key={tk.fromMs} style={{color: active ? theme.sun : '#fff', whiteSpace: 'pre'}}>
                {tk.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const VitD: React.FC = () => (
  <AbsoluteFill>
    {SCENES.map(([a, b, C, , o], i) => (
      <Sequence key={i} from={Math.round(a * FPS)} durationInFrames={Math.round((b - a) * FPS) + (i === SCENES.length - 1 ? 0 : TR)}>
        <SceneWrap dur={b - a} first={i === 0} o={o}>
          <C />
        </SceneWrap>
      </Sequence>
    ))}
    <Header />
    <Captions />
    <Audio src={staticFile('vo.mp3')} />
  </AbsoluteFill>
);

export const MyComposition: React.FC = () => (
  <Composition id="VitD" component={VitD} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />
);
