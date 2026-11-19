import React from 'react';
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, random} from 'remotion';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, Caption} from '@remotion/captions';
import {theme} from './theme';
import {pop, lerp} from './util';
import {Particles, Tag, Words, Rings, ez} from './kit';
import {Vimi} from './Mascot';
import {Hoaksin, HX} from './Villain';
import {OmForward} from './Cast';
import words from './ep5_words.json';

const FPS = 30;
const END = 41.0;
const TR = 12;
const V0 = 5.05;
const N0 = 11.9;

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);
const Pad: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{position: 'absolute', left: 90, right: 120, top: 280}}>{children}</div>;

// shared villain atmosphere: smoke, vignette, swinging light, lightning
const Lair: React.FC<{tint: string; flashAt?: number[]; local?: number}> = ({tint, flashAt = [], local = 0}) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 22) * 25;
  const flash = flashAt.reduce((m, a) => Math.max(m, interpolate(f, [(a - local) * 30, (a - local) * 30 + 2, (a - local) * 30 + 10], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})), 0);
  return (
    <AbsoluteFill>
      <Svg>
        <defs>
          <radialGradient id={'vg' + tint}>
            <stop offset="0.45" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.85} />
          </radialGradient>
        </defs>
        {/* spotlight cone */}
        <g transform={`translate(540 -100) rotate(${sw})`}>
          <path d="M-40 0 L40 0 L360 1700 L-360 1700 Z" fill={tint} opacity={0.12} />
        </g>
        {/* smoke */}
        {Array.from({length: 9}).map((_, i) => {
          const x = ((random('sm' + i) * 1400 + f * (0.8 + i * 0.1)) % 1500) - 200;
          return <ellipse key={i} cx={x} cy={1500 + Math.sin(f / 30 + i) * 40 + i * 30} rx={260} ry={90} fill={tint} opacity={0.08} />;
        })}
        {/* lightning bolt */}
        {flash > 0.05 && <path d="M760 -20 L640 380 L720 380 L560 820 L800 300 L710 300 L840 -20 Z" fill="#E9FFB0" opacity={flash} />}
        <rect width={1080} height={1920} fill={`url(#vg${tint})`} />
      </Svg>
      <AbsoluteFill style={{background: '#E9FFB0', opacity: flash * 0.35}} />
    </AbsoluteFill>
  );
};

const Glitch: React.FC<{text: string; size: number; color: string; at: number}> = ({text, size, color, at}) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 30, 12);
  const g = f % 23 < 3 ? 1 : 0;
  const style: React.CSSProperties = {fontFamily: theme.title, fontWeight: 800, fontSize: size, letterSpacing: '-0.03em', lineHeight: 1.0, position: 'absolute', left: 0, top: 0, whiteSpace: 'pre'};
  return (
    <div style={{position: 'relative', scale: `${p}`, transformOrigin: 'left center', height: size * text.split('\n').length * 1.05}}>
      <div style={{...style, color: '#FF2E4D', translate: `${-6 - g * 10}px ${g * 4}px`, opacity: 0.8}}>{text}</div>
      <div style={{...style, color: '#2EE6FF', translate: `${6 + g * 10}px ${-g * 4}px`, opacity: 0.8}}>{text}</div>
      <div style={{...style, color}}>{text}</div>
    </div>
  );
};



// ---------- props ----------
const Pill: React.FC<{x: number; y: number; s?: number; rot?: number; evil?: boolean}> = ({x, y, s = 1, rot = 0, evil = false}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-62} width={300} height={124} rx={62} fill={evil ? '#4A1D63' : '#FFF4DE'} stroke="#1A1714" strokeWidth={7} />
    <path d="M0 -62 L88 -62 A62 62 0 0 1 88 62 L0 62 Z" fill={evil ? '#B7F03C' : '#F29A0C'} stroke="#1A1714" strokeWidth={7} />
    <rect x={-120} y={-44} width={90} height={18} rx={9} fill="#fff" opacity={0.45} />
    <text x={-62} y={16} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={44} fill={evil ? '#B7F03C' : '#1A1714'}>
      MV
    </text>
  </g>
);

const Leaf: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 90 C -70 40 -80 -60 0 -120 C 80 -60 70 40 0 90 Z" fill="#2FA34A" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <path d="M0 110 L0 -100" stroke="#9BE3A8" strokeWidth={6} strokeLinecap="round" />
  </g>
);
const Carrot: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-34 -60 L34 -60 L0 110 Z" fill="#FF8A1F" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <path d="M-14 -20 L6 -20 M-6 20 L10 20 M-4 55 L6 55" stroke="#C25A00" strokeWidth={5} strokeLinecap="round" />
    <path d="M0 -60 L-26 -110 M0 -60 L0 -118 M0 -60 L26 -110" stroke="#2FA34A" strokeWidth={12} strokeLinecap="round" />
  </g>
);
const Orange: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={80} fill="#FF9F1C" stroke="#1A1714" strokeWidth={6} />
    {Array.from({length: 8}).map((_, i) => (
      <line key={i} x1={0} y1={0} x2={Math.cos((i / 8) * Math.PI * 2) * 60} y2={Math.sin((i / 8) * Math.PI * 2) * 60} stroke="#FFD08A" strokeWidth={6} />
    ))}
    <circle r={60} fill="none" stroke="#FFD08A" strokeWidth={6} />
  </g>
);
const Banana: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-100 -30 Q0 120 110 -40 Q90 40 0 60 Q-80 50 -100 -30 Z" fill="#FFD93B" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <rect x={100} y={-56} width={18} height={24} rx={5} fill="#6B4A1F" />
  </g>
);
const Tomato: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={70} fill="#E5383B" stroke="#1A1714" strokeWidth={6} />
    <path d="M-30 -62 L0 -48 L30 -62 L14 -40 L0 -70 L-14 -40 Z" fill="#2FA34A" stroke="#1A1714" strokeWidth={4} strokeLinejoin="round" />
    <ellipse cx={-26} cy={-20} rx={16} ry={10} fill="#fff" opacity={0.4} />
  </g>
);
const Heart: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 60 C -90 0 -80 -70 -30 -70 C -10 -70 0 -55 0 -45 C 0 -55 10 -70 30 -70 C 80 -70 90 0 0 60 Z" fill="#E23E57" stroke="#1A1714" strokeWidth={6} />
  </g>
);
const Ribbon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 -10 C -60 -60 -30 -90 0 -90 C 30 -90 60 -60 10 -10 L50 70 L28 80 L0 20 L-28 80 L-50 70 Z" fill="#B38CFF" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
  </g>
);
const Plate: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={190} ry={66} cy={40} fill="#F4F1EA" stroke="#1A1714" strokeWidth={6} />
    <Leaf x={-90} y={-10} s={0.45} rot={-40} />
    <Carrot x={-20} y={-20} s={0.5} rot={20} />
    <Tomato x={60} y={10} s={0.5} />
    <Orange x={130} y={-10} s={0.45} />
  </g>
);

// A LAIR: Hoaksin + giant pill 0 – V0
const A: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 3.9 * 30 && f < 4.4 * 30 ? Math.sin(f * 3) * 10 : 0;
  const rise = ez(f, 1.8, 3.0);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2B1640 0%, #160A22 55%, #07030B 100%)', translate: `${shake}px 0px`}}>
      <Particles seed="a5" n={40} color={HX.spore} kind="dot" size={10} opacity={0.5} speed={0.5} />
      <Lair tint="#B7F03C" flashAt={[3.95]} />
      <Svg>
        <g transform="translate(720 980)">
          <circle r={250} fill="#B7F03C" opacity={0.07 + Math.sin(f / 8) * 0.03} />
          {/* altar */}
          <path d="M-170 160 L170 160 L130 260 L-130 260 Z" fill="#3A1F52" stroke="#1A1714" strokeWidth={6} />
          <Pill x={0} y={lerp(140, -20, rise) + Math.sin(f / 10) * 12} s={lerp(0.5, 0.95, rise)} rot={-12} evil />
          {Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + f / 30;
            return <circle key={i} cx={Math.cos(a) * 210} cy={Math.sin(a) * 120 - 20} r={8} fill="#B7F03C" opacity={rise * 0.8} />;
          })}
        </g>
        <Hoaksin x={280} y={1100} s={1.35} mood={f > 3.9 * 30 ? 'laugh' : 'menace'} megaphone={false} armL={140} />
      </Svg>
      <Pad>
        <Tag text="SALAH KAPRAH #5" at={0} color={HX.spore} bg="rgba(183,240,60,0.14)" />
        <div style={{height: 26}} />
        <Glitch text={'1 TABLET =\nSEMUA BERES?'} size={92} color={HX.spore} at={0.8} />
      </Pad>
    </AbsoluteFill>
  );
};

// B OM FORWARD + buang sayur V0 – N0
const B: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - V0;
  const toss = ez(f, t(6.6), t(7.8));
  const drain = ez(f, t(9.6), t(11.0));
  const shake = f > t(10.3) * 30 && f < t(10.8) * 30 ? Math.sin(f * 2.6) * 12 : 0;
  const items = [
    (k: number) => <Leaf key="l" x={0} y={0} s={0.5} rot={k * 300} />,
    (k: number) => <Carrot key="c" x={0} y={0} s={0.55} rot={k * 400} />,
    (k: number) => <Banana key="b" x={0} y={0} s={0.5} rot={k * 360} />,
    (k: number) => <Orange key="o" x={0} y={0} s={0.5} />,
    (k: number) => <Tomato key="t" x={0} y={0} s={0.5} />,
  ];
  const bat = lerp(0.9, 0.12, drain);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #3E0A2A 0%, #1F0515 60%, #0A0207 100%)', translate: `${shake}px ${shake * 0.4}px`}}>
      <Particles seed="b5" n={36} color="#F2A7B5" kind="dot" size={10} opacity={0.35} />
      <Lair tint="#E8899B" flashAt={[t(10.3)]} />
      <AbsoluteFill style={{background: '#FF2E4D', opacity: (Math.sin(f / 6) * 0.5 + 0.5) * 0.06}} />
      <Svg>
        {/* trash bin */}
        <g transform="translate(740 1160)">
          <path d="M-120 -80 L120 -80 L95 140 L-95 140 Z" fill="#2A2A33" stroke="#1A1714" strokeWidth={6} />
          <rect x={-140} y={-110} width={280} height={34} rx={10} fill="#3B3B47" stroke="#1A1714" strokeWidth={6} transform={`rotate(${-25 * (1 - toss * 0)} -140 -76)`} />
          {[-50, 0, 50].map((xx) => (
            <line key={xx} x1={xx} y1={-40} x2={xx * 0.8} y2={110} stroke="#4A4A58" strokeWidth={8} strokeLinecap="round" />
          ))}
        </g>
        {items.map((it, i) => {
          const d = Math.min(1, Math.max(0, toss * 1.6 - i * 0.15));
          const sx = 230 + i * 90;
          const sy = 820 - (i % 2) * 70;
          const x = lerp(sx, 740 + (i - 2) * 20, d);
          const y = lerp(sy, 1100, d) - Math.sin(d * Math.PI) * 220;
          return (
            <g key={i} transform={`translate(${x} ${y})`} opacity={d > 0.97 ? 0 : 1}>
              {it(d)}
            </g>
          );
        })}
        {/* energy battery draining */}
        <g transform="translate(90 960)" opacity={ez(f, t(9.3), t(9.7))}>
          <rect x={0} y={0} width={110} height={230} rx={18} fill="none" stroke="#F2A7B5" strokeWidth={8} />
          <rect x={35} y={-22} width={40} height={22} rx={6} fill="#F2A7B5" />
          <rect x={12} y={12 + 206 * (1 - bat)} width={86} height={206 * bat} rx={10} fill={bat > 0.4 ? '#B7F03C' : '#FF2E4D'} />
          <text x={55} y={280} textAnchor="middle" fontFamily={theme.mono} fontSize={28} fill="#F2A7B5">
            ENERGI
          </text>
        </g>
        <OmForward x={420} y={1060} s={1.75} />
      </Svg>
      <Pad>
        <Glitch text={'SAYUR? BUAH?\nBUANG SAJA!'} size={84} color="#F2A7B5" at={0.3} />
      </Pad>
    </AbsoluteFill>
  );
};

// C STOP + USPSTF N0 – 21.1
const C_END = 21.1;
const C: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - N0;
  const fly = ez(f, 0, 0.45);
  const stamp = pop(f, 0.45, 30, 8);
  const card = ez(f, t(13.7), t(14.5));
  const hrt = pop(f, t(19.1), 30, 11);
  const rib = pop(f, t(19.65), 30, 11);
  const verdict = pop(f, t(20.1), 30, 8);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #1C7C94 0%, #0F5E73 55%, #083845 100%)'}}>
      <Particles seed="c5" n={30} color="#FFC21A" kind="star" size={12} opacity={0.5} />
      <Rings cx={700} cy={960} r={300} color="#FFC21A" o={0.16} />
      <Svg>
        {fly > 0.9 && <circle cx={220} cy={1080} r={(f - 13) * 40} fill="none" stroke="#FFC21A" strokeWidth={10} opacity={Math.max(0, 1 - (f - 13) / 18)} />}
        <Vimi x={lerp(-200, 210, fly)} y={lerp(1500, 1090, fly)} s={0.95} fly={fly < 1} tilt={fly < 1 ? 28 : 0} mood={fly < 1 ? 'wow' : 'think'} armR={fly < 1 ? 175 : 100} armL={35} glow={1} />
        {/* report card */}
        <g transform={`translate(${lerp(1200, 640, card)} 880)`} opacity={card}>
          <rect x={-250} y={-300} width={500} height={600} rx={30} fill="#FFF4DE" stroke="#1A1714" strokeWidth={6} />
          <rect x={-250} y={-300} width={500} height={90} rx={30} fill="#1A1714" />
          <text y={-240} textAnchor="middle" fontFamily={theme.mono} fontSize={34} fill="#FFC21A" letterSpacing="0.1em">
            USPSTF · 2022
          </text>
          <text y={-150} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#1A1714">
            Multivitamin untuk
          </text>
          <text y={-102} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#1A1714">
            mencegah…
          </text>
          <g transform={`translate(-110 10) scale(${hrt})`}>
            <Heart x={0} y={0} s={0.8} />
            <text y={100} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#1A1714">
              Jantung
            </text>
          </g>
          <g transform={`translate(110 10) scale(${rib})`}>
            <Ribbon x={0} y={0} s={0.75} />
            <text y={100} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#1A1714">
              Kanker
            </text>
          </g>
          <g transform={`translate(0 210) rotate(-6) scale(${verdict})`}>
            <rect x={-215} y={-52} width={430} height={96} rx={18} fill="none" stroke="#E23E57" strokeWidth={8} />
            <text y={-6} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#E23E57">
              BUKTI
            </text>
            <text y={32} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#E23E57">
              BELUM CUKUP
            </text>
          </g>
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', scale: `${stamp}`, rotate: `${-5 + (1 - stamp) * 20}deg`, opacity: 1 - card}}>
        <span style={{display: 'inline-block', background: '#E23E57', color: '#fff', fontFamily: theme.title, fontWeight: 800, fontSize: 68, padding: '10px 30px', borderRadius: 20, boxShadow: '0 12px 0 #8E1B30', letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>STOP! SALAH KAPRAH!</span>
      </div>
    </AbsoluteFill>
  );
};

// D TABLET vs PIRING 21.1 – 28.9
const D_END = 28.9;
const D: React.FC = () => {
  const f = useCurrentFrame();
  const S = C_END;
  const t = (g: number) => g - S;
  const rows: [string, number, boolean][] = [
    ['Vitamin & mineral', 24.0, true],
    ['Serat', 26.0, false],
    ['Zat lain dari makanan', 27.2, false],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #F4F1FF 0%, #DCD6F7 70%, #C5BCF0 100%)'}}>
      <Particles seed="d5" n={18} color="#6B5FB3" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="NIH ODS" at={0} color="#4A3AA8" bg="rgba(74,58,168,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Tablet ≠\nmakanan'} at={0.1} size={92} color="#1A1240" hi={['≠']} hiColor="#E23E57" />
      </Pad>
      <Svg>
        <g transform={`translate(440 760) scale(${pop(f, t(22.3), 30, 11)})`}>
          <Pill x={0} y={0} s={0.55} rot={-10} />
        </g>
        <g transform={`translate(740 760) scale(${pop(f, t(23.2), 30, 11)})`}>
          <Plate x={0} y={0} s={0.8} />
        </g>
        {rows.map(([lab, at, both], i) => {
          const p = pop(f, t(at), 30, 12);
          const y = 950 + i * 120;
          return (
            <g key={lab} opacity={Math.min(1, p * 1.3)} transform={`translate(${(1 - p) * -60} 0)`}>
              <rect x={90} y={y - 50} width={830} height={96} rx={22} fill="#fff" stroke="#1A1240" strokeWidth={4} />
              <text x={120} y={y + 12} fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#1A1240">
                {lab}
              </text>
              <text x={590} y={y + 16} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={54} fill={both ? '#1FA463' : '#E23E57'}>
                {both ? '✓' : '✗'}
              </text>
              <text x={800} y={y + 16} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={54} fill="#1FA463">
                ✓
              </text>
            </g>
          );
        })}
      </Svg>
    </AbsoluteFill>
  );
};

// E CARA BENAR 28.9 – 36.8
const E_END = 36.8;
const E: React.FC = () => {
  const f = useCurrentFrame();
  const S = D_END;
  const t = (g: number) => g - S;
  const gram = ez(f, t(32.9), t(33.8));
  const sup = pop(f, t(34.0), 30, 11);
  const doc = pop(f, t(35.8), 30, 10);
  const icons = [
    (k: string) => <Leaf key={k} x={0} y={0} s={0.42} />,
    (k: string) => <Carrot key={k} x={0} y={0} s={0.45} />,
    (k: string) => <Tomato key={k} x={0} y={0} s={0.55} />,
    (k: string) => <Banana key={k} x={0} y={0} s={0.42} rot={-20} />,
    (k: string) => <Orange key={k} x={0} y={0} s={0.5} />,
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)'}}>
      <Particles seed="e5" n={22} color="#FF9F1C" kind="plus" size={16} opacity={0.35} />
      <Pad>
        <Tag text="CARA YANG BENAR · WHO" at={0} color="#1FA463" bg="rgba(31,164,99,0.14)" />
        <div style={{height: 18}} />
        <Words text={'5 porsi sayur\n& buah/hari'} at={0.1} size={80} color="#0F2E1E" hi={['5']} hiColor="#1FA463" />
      </Pad>
      <Svg>
        {icons.map((ic, i) => {
          const p = pop(f, t(30.6 + i * 0.18), 30, 11);
          return (
            <g key={i} transform={`translate(${170 + i * 165} 720) scale(${p})`}>
              <circle r={72} fill="#fff" stroke="#0F2E1E" strokeWidth={5} />
              {ic('i' + i)}
              <text y={-86} textAnchor="middle" fontFamily={theme.mono} fontSize={26} fill="#0F2E1E">
                {i + 1}
              </text>
            </g>
          );
        })}
        {/* scale ≈400 g */}
        <g transform="translate(250 960)" opacity={gram}>
          <rect x={-150} y={-20} width={300} height={130} rx={24} fill="#0F2E1E" />
          <rect x={-110} y={10} width={220} height={70} rx={12} fill="#CFF5DC" />
          <text y={62} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={52} fill="#0F2E1E">
            ≈{Math.round(lerp(0, 400, gram))} g
          </text>
          <rect x={-170} y={-44} width={340} height={26} rx={13} fill="#1FA463" />
        </g>
        <g transform={`translate(660 960) scale(${sup})`}>
          <rect x={-230} y={-60} width={460} height={180} rx={26} fill="#fff" stroke="#0F2E1E" strokeWidth={5} />
          <Pill x={-150} y={30} s={0.32} />
          <text x={-70} y={10} fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#0F2E1E">
            Suplemen?
          </text>
          <text x={-70} y={60} fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#C2410C">
            Hanya bila perlu
          </text>
        </g>
        <g transform={`translate(420 1200) scale(${doc})`}>
          <rect x={-200} y={-42} width={400} height={84} rx={42} fill="#1FA463" />
          <text y={14} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#fff">
            Konsultasi dulu ✚
          </text>
        </g>
        <Vimi x={830} y={1215} s={0.5} mood="happy" armR={150} thumbR armL={30} glow={0.8} />
      </Svg>
    </AbsoluteFill>
  );
};

// F WIN 36.8 – END
const F: React.FC = () => {
  const f = useCurrentFrame();
  const S = E_END;
  const t = (g: number) => g - S;
  const crumble = ez(f, 0.2, 1.2);
  const follow = pop(f, t(38.1), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)'}}>
      <Particles seed="f5" n={34} color="#FFF4DE" kind="star" size={16} opacity={0.7} />
      <Svg>
        <g transform="translate(540 820)">
          {Array.from({length: 16}).map((_, i) => (
            <path key={i} d="M0 0 L-50 -1300 L50 -1300 Z" fill="#FFF4DE" opacity={0.15} transform={`rotate(${i * 22.5 + f * 0.5})`} />
          ))}
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
        <span style={{display: 'inline-block', scale: `${pop(f, 0, 30, 8)}`, rotate: '-5deg', fontFamily: theme.title, fontWeight: 800, fontSize: 100, color: '#1A1714', letterSpacing: '-0.04em', whiteSpace: 'nowrap'}}>HOAKS TUMBANG!</span>
      </div>
      <Svg>
        <Vimi x={300} y={840} s={1.2} mood="wink" armR={150} thumbR armL={35} glow={1} />
        <Plate x={560} y={1010} s={0.55} />
        <Hoaksin x={lerp(840, 900, crumble)} y={lerp(980, 1100, crumble)} s={0.8} mood="dizzy" megaphone={false} tilt={lerp(0, 75, crumble)} armL={10} />
        <g opacity={1 - crumble * 0.6}>
          <Pill x={lerp(820, 960, crumble)} y={lerp(1180, 1260, crumble)} s={0.3} rot={crumble * 160} evil />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1200, textAlign: 'center'}}>
        <span style={{display: 'inline-block', scale: `${follow}`, background: '#1A1714', color: '#fff', borderRadius: 999, padding: '20px 44px', fontFamily: theme.title, fontWeight: 800, fontSize: 48, boxShadow: '0 10px 0 rgba(0,0,0,0.2)'}}>
          <span style={{color: '#FFC21A'}}>+</span> Follow @vitamien.io
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: [number, number, React.FC, string, [number, number], boolean][] = [
  [0, V0, A, '#B7F03C', [50, 50], true],
  [V0, N0, B, '#F2A7B5', [50, 55], true],
  [N0, C_END, C, '#FFF4DE', [20, 70], false],
  [C_END, D_END, D, '#1A1240', [80, 30], false],
  [D_END, E_END, E, '#0F2E1E', [20, 40], false],
  [E_END, END, F, '#1A1714', [50, 50], false],
];

const SceneWrap: React.FC<{dur: number; children: React.ReactNode; first: boolean; o: [number, number]}> = ({dur, children, first, o}) => {
  const f = useCurrentFrame();
  const r = first ? 160 : interpolate(f, [0, TR], [0, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)});
  const zoom = interpolate(f, [0, dur * FPS], [1.0, 1.04]);
  return (
    <AbsoluteFill style={{clipPath: `circle(${r}% at ${o[0]}% ${o[1]}%)`}}>
      <AbsoluteFill style={{scale: `${zoom}`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const idx = Math.max(0, SCENES.findIndex(([a, b]) => f / FPS >= a && f / FPS < b));
  const col = SCENES[idx][3];
  const evil = SCENES[idx][5];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, left: 96, right: 120, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 26, height: 26, borderRadius: 13, background: col}} />
          <div style={{fontFamily: theme.mono, fontSize: 32, fontWeight: 500, color: col, letterSpacing: '0.08em'}}>{evil ? 'MARKAS HOAKSIN' : 'vitamien.io'}</div>
        </div>
        <div style={{fontFamily: theme.mono, fontSize: 28, color: col, opacity: 0.75, letterSpacing: '0.1em'}}>SALAH KAPRAH · EP 05</div>
      </div>
      <div style={{position: 'absolute', top: 210, left: 96, right: 120, height: 6, borderRadius: 3, background: col, opacity: 0.25}} />
      <div style={{position: 'absolute', top: 210, left: 96, width: `${(f / durationInFrames) * (1080 - 216)}px`, height: 6, borderRadius: 3, background: col}} />
    </AbsoluteFill>
  );
};

type W = {w: string; s: number; e: number; who: string};
const ws = words as W[];
const caps: Caption[] = ws.map((x, i) => ({text: (i === 0 ? '' : ' ') + x.w, startMs: x.s * 1000, endMs: Math.min(x.e + 0.05, END) * 1000, timestampMs: x.s * 1000, confidence: 1}));
const pages = (['hx', 'n'] as const).flatMap((who) => createTikTokStyleCaptions({captions: caps.filter((_, i) => ws[i].who === who).map((c, i) => (i === 0 ? {...c, text: c.text.trimStart()} : c)), combineTokensWithinMilliseconds: 700}).pages);

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const ms = (f / FPS) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;
  const who = ms < N0 * 1000 ? 'hx' : 'n';
  const st = {hx: {bg: '#0E1A0E', bd: HX.spore, act: HX.spore}, cac: {bg: '#2A0617', bd: '#E8899B', act: '#F2A7B5'}, n: {bg: '#111', bd: 'transparent', act: '#FFC21A'}}[who];
  const s = interpolate(ms - page.startMs, [0, 120], [0.85, 1], {extrapolateRight: 'clamp'});
  const jitter = who !== 'n' && f % 17 < 2 ? 4 : 0;
  return (
    <div style={{position: 'absolute', top: 1340, left: 80, right: 140, textAlign: 'center', scale: `${s}`, translate: `${jitter}px 0px`, fontFamily: theme.title, fontWeight: 800, fontSize: 74, lineHeight: 1.1, letterSpacing: '-0.02em'}}>
      <span style={{background: st.bg, border: `4px solid ${st.bd}`, padding: '8px 22px', borderRadius: 18, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>
        {page.tokens.map((tk) => {
          const active = ms >= tk.fromMs && ms < tk.toMs;
          return (
            <span key={tk.fromMs} style={{color: active ? st.act : '#fff', whiteSpace: 'pre'}}>
              {tk.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export const Ep5: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SCENES.map(([a, b, C, , o], i) => (
      <Sequence key={i} from={Math.round(a * FPS)} durationInFrames={Math.round((b - a) * FPS) + (i === SCENES.length - 1 ? 0 : TR)}>
        <SceneWrap dur={b - a} first={i === 0} o={o}>
          <C />
        </SceneWrap>
      </Sequence>
    ))}
    <Header />
    <Captions />
    <Sequence from={Math.round(0.15 * FPS)}>
      <Audio src={staticFile('ep5/hx_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(N0 * FPS)}>
      <Audio src={staticFile('ep5/nar_f.wav')} />
    </Sequence>
    <Audio src={staticFile('ep5/sfx.wav')} />
  </AbsoluteFill>
);

export const Ep5Comp: React.FC = () => <Composition id="Ep5" component={Ep5} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />;
