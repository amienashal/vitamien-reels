import React from 'react';
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, random} from 'remotion';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, Caption} from '@remotion/captions';
import {theme} from './theme';
import {pop, lerp} from './util';
import {Particles, Tag, Words, Rings, ez} from './kit';
import {Vimi} from './Mascot';
import {Hoaksin, HX} from './Villain';
import {Eri, Cacing} from './Cast';
import words from './ep3_words.json';

const FPS = 30;
const END = 38.0;
const TR = 12;
const V0 = 6.35;
const N0 = 11.5;

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
const Cup: React.FC<{x: number; y: number; s?: number; liquid: string; label?: string; steam?: boolean}> = ({x, y, s = 1, liquid, label, steam = true}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {steam &&
        [0, 1, 2].map((i) => {
          const p = ((f + i * 14) % 42) / 42;
          return <path key={i} d={`M${-30 + i * 30} ${-70 - p * 70} q 12 -18 0 -36 q -12 -18 0 -36`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={(1 - p) * 0.6} />;
        })}
      <path d="M70 -20 q 50 0 50 40 q 0 40 -56 40" stroke="#1A1714" strokeWidth={10} fill="none" />
      <path d="M-80 -50 L80 -50 L66 70 Q0 96 -66 70 Z" fill="#FFF4DE" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx={0} cy={-50} rx={80} ry={16} fill={liquid} stroke="#1A1714" strokeWidth={5} />
      {label && (
        <text y={36} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={30} fill="#1A1714">
          {label}
        </text>
      )}
    </g>
  );
};

const Pill: React.FC<{x: number; y: number; s?: number; rot?: number; o?: number}> = ({x, y, s = 1, rot = 0, o = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-46} y={-22} width={92} height={44} rx={22} fill="#B5452F" stroke="#1A1714" strokeWidth={5} />
    <rect x={0} y={-22} width={46} height={44} rx={0} fill="#D9654A" />
    <rect x={-46} y={-22} width={92} height={44} rx={22} fill="none" stroke="#1A1714" strokeWidth={5} />
    <text y={10} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={28} fill="#fff">
      Fe
    </text>
  </g>
);

const Milk: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-50 -60 L50 -60 L42 80 L-42 80 Z" fill="#fff" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <rect x={-46} y={-30} width={88} height={108} fill="#F4F4F4" />
    <path d="M-50 -60 L50 -60 L42 80 L-42 80 Z" fill="none" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
  </g>
);

// A LAIR: Hoaksin 0 – 6.35
const A: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 5.5 * 30 && f < 6.0 * 30 ? Math.sin(f * 3) * 10 : 0;
  const drop = ez(f, 3.6, 4.4);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2B1640 0%, #160A22 55%, #07030B 100%)', translate: `${shake}px 0px`}}>
      <Particles seed="a3" n={40} color={HX.spore} kind="dot" size={10} opacity={0.5} speed={0.5} />
      <Lair tint="#B7F03C" flashAt={[5.55]} />
      <Svg>
        {/* cauldron-cup: pill dropped into tea */}
        <g transform="translate(770 860)">
          <circle r={210} fill="#B7F03C" opacity={0.06 + Math.sin(f / 8) * 0.03} />
          <Cup x={0} y={60} s={1.5} liquid="#7A4A22" />
          <Pill x={lerp(-40, 0, drop)} y={lerp(-260, -20, drop)} s={0.9} rot={f * 6} o={drop < 1 ? 1 : 0} />
          {drop >= 1 &&
            Array.from({length: 8}).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const p = Math.min(1, (f - 4.4 * 30) / 14);
              return <circle key={i} cx={Math.cos(a) * 90 * p} cy={-15 + Math.sin(a) * 30 * p - p * 40} r={10 * (1 - p)} fill="#7A4A22" />;
            })}
        </g>
        <Hoaksin x={300} y={1080} s={1.4} mood="menace" megaphone={false} armL={140} />
      </Svg>
      <Pad>
        <Tag text="SALAH KAPRAH #3" at={0} color={HX.spore} bg="rgba(183,240,60,0.14)" />
        <div style={{height: 26}} />
        <Glitch text={'TABLET BESI\n+ TEH/KOPI'} size={88} color={HX.spore} at={0.8} />
      </Pad>
    </AbsoluteFill>
  );
};

// B CACING LICIK 6.35 – 11.5
const B: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - 6.35;
  const rise = ez(f, 0, 1.2);
  const grab = ez(f, t(9.2), t(10.4));
  const shake = f > t(7.6) * 30 && f < t(8.2) * 30 ? Math.sin(f * 2.6) * 12 : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #3E0A2A 0%, #1F0515 60%, #0A0207 100%)', translate: `${shake}px ${shake * 0.4}px`}}>
      <Particles seed="b3" n={36} color="#F2A7B5" kind="dot" size={10} opacity={0.35} />
      <Lair tint="#E8899B" flashAt={[t(7.7)]} />
      <AbsoluteFill style={{background: '#FF2E4D', opacity: (Math.sin(f / 6) * 0.5 + 0.5) * 0.06}} />
      <Svg>
        {/* undissolved iron pills drifting toward the worm */}
        {Array.from({length: 9}).map((_, i) => {
          const sx = 140 + (i % 3) * 120;
          const sy = 1150 - Math.floor(i / 3) * 90;
          return <Pill key={i} x={lerp(sx, 620, grab)} y={lerp(sy, 800, grab)} s={lerp(0.7, 0.2, grab)} rot={i * 40 + f * 3} o={1 - grab * 0.9} />;
        })}
        <Cacing x={lerp(600, 480, rise)} y={lerp(1300, 820, rise)} s={lerp(0.8, 1.9, rise)} />
      </Svg>
      <Pad>
        <Glitch text={'CACING LICIK\nPESTA BESI'} size={88} color="#F2A7B5" at={0.3} />
      </Pad>
    </AbsoluteFill>
  );
};

// C STOP + mechanism 11.5 – 16.9
const C: React.FC = () => {
  const f = useCurrentFrame();
  const S = N0;
  const t = (g: number) => g - S;
  const fly = ez(f, 0, 0.45);
  const stamp = pop(f, 0.45, 30, 8);
  const chain = ez(f, t(14.9), t(16.2));
  const tag = pop(f, t(13.3), 30, 12);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #1C7C94 0%, #0F5E73 55%, #083845 100%)'}}>
      <Particles seed="c3" n={30} color="#FFC21A" kind="star" size={12} opacity={0.5} />
      <Rings cx={700} cy={920} r={300} color="#FFC21A" o={0.16} />
      <Svg>
        {fly > 0.9 && <circle cx={260} cy={1000} r={(f - 13) * 40} fill="none" stroke="#FFC21A" strokeWidth={10} opacity={Math.max(0, 1 - (f - 13) / 18)} />}
        <Vimi x={lerp(-200, 250, fly)} y={lerp(1500, 1000, fly)} s={1.1} fly={fly < 1} tilt={fly < 1 ? 28 : 0} mood={fly < 1 ? 'wow' : 'think'} armR={fly < 1 ? 175 : 100} armL={35} glow={1} />
        {/* mechanism: Fe dots captured by tannin hexagons */}
        <g transform="translate(700 960)" opacity={tag}>
          <circle r={250} fill="#FFF4DE" stroke="#1A1714" strokeWidth={6} />
          <text y={-200} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#0F5E73">
            DI DALAM USUS
          </text>
          {Array.from({length: 6}).map((_, i) => {
            const a = (i / 6) * Math.PI * 2 + f / 40;
            const fx = Math.cos(a) * 130;
            const fy = Math.sin(a) * 110 + 10;
            const hx = Math.cos(a) * 200;
            const hy = Math.sin(a) * 170 + 10;
            const px = lerp(hx, fx + 34, chain);
            const py = lerp(hy, fy, chain);
            return (
              <g key={i}>
                <circle cx={fx} cy={fy} r={26} fill="#B5452F" stroke="#1A1714" strokeWidth={4} />
                <text x={fx} y={fy + 9} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={22} fill="#fff">
                  Fe
                </text>
                <polygon
                  points={Array.from({length: 6})
                    .map((_, k) => `${px + Math.cos((k / 6) * Math.PI * 2) * 22},${py + Math.sin((k / 6) * Math.PI * 2) * 22}`)
                    .join(' ')}
                  fill="#7A4A22"
                  stroke="#1A1714"
                  strokeWidth={4}
                />
                {chain > 0.95 && <line x1={fx + 20} y1={fy} x2={px - 14} y2={py} stroke="#1A1714" strokeWidth={6} />}
              </g>
            );
          })}
          <g opacity={chain} transform="translate(0 300)">
            <rect x={-140} y={-44} width={280} height={76} rx={20} fill="#E23E57" />
            <text y={12} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={46} fill="#fff">
              TERIKAT!
            </text>
          </g>
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', scale: `${stamp}`, rotate: `${-5 + (1 - stamp) * 20}deg`}}>
        <span style={{display: 'inline-block', background: '#E23E57', color: '#fff', fontFamily: theme.title, fontWeight: 800, fontSize: 80, padding: '10px 34px', borderRadius: 20, boxShadow: '0 12px 0 #8E1B30', letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>STOP! SALAH KAPRAH!</span>
      </div>
      <div style={{position: 'absolute', left: 90, right: 140, top: 470, textAlign: 'center', scale: `${tag}`}}>
        <span style={{display: 'inline-block', background: '#FFF4DE', color: '#7A4A22', fontFamily: theme.title, fontWeight: 800, fontSize: 52, padding: '8px 28px', borderRadius: 999, boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>Tanin & polifenol</span>
      </div>
    </AbsoluteFill>
  );
};

// D STUDY 16.9 – 24.55
const D: React.FC = () => {
  const f = useCurrentFrame();
  const S = 16.9;
  const t = (g: number) => g - S;
  const bars = ez(f, t(18.0), t(19.4));
  const tea = ez(f, t(19.0), t(20.6));
  const pct = Math.round(interpolate(f, [t(20.0) * 30, t(21.0) * 30], [0, 79], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const swallow = pop(f, t(22.0), 30, 11);
  const BarH = 420;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #F4F1FF 0%, #DCD6F7 70%, #C5BCF0 100%)'}}>
      <Particles seed="d3" n={18} color="#6B5FB3" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="STUDI · BR J NUTR 1999" at={0} color="#4A3AA8" bg="rgba(74,58,168,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Teh hitam:\nserapan besi anjlok'} at={0.1} size={84} color="#1A1240" hi={['anjlok']} hiColor="#E23E57" />
      </Pad>
      <Svg>
        <text x={350} y={760} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#4A3AA8" opacity={bars}>
          BESI YANG DISERAP
        </text>
        {[
          ['Air putih', '#1FA463', 1, 0],
          ['Teh hitam', '#7A4A22', lerp(1, 0.21, tea), 1],
        ].map(([lab, col, k, i]) => {
          const x = 140 + Number(i) * 230;
          const h = BarH * Number(k) * bars;
          return (
            <g key={String(lab)}>
              <rect x={x} y={1230 - h} width={170} height={h} rx={16} fill={String(col)} stroke="#1A1240" strokeWidth={5} />
              <text x={x + 85} y={1275} textAnchor="middle" fontFamily={theme.mono} fontSize={26} fill="#1A1240">
                {String(lab)}
              </text>
            </g>
          );
        })}
        {/* big percent card */}
        <g transform={`translate(790 ${lerp(1200, 960, ez(f, t(19.9), t(20.6)))})`} opacity={ez(f, t(19.9), t(20.4))}>
          <rect x={-160} y={-170} width={320} height={300} rx={30} fill="#fff" stroke="#1A1240" strokeWidth={5} />
          <text y={-120} textAnchor="middle" fontFamily={theme.mono} fontSize={22} fill="#4A3AA8">
            SERAPAN TURUN
          </text>
          <text y={-10} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={104} fill="#E23E57">
            -{pct}%
          </text>
          <text y={60} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#1A1240">
            s.d. -94%
          </text>
          <text y={105} textAnchor="middle" fontFamily={theme.mono} fontSize={18} fill="#6B5FB3">
            (Hurrell dkk.)
          </text>
        </g>
        {/* ditelan != diserap stamp */}
        <g transform={`translate(560 640) scale(${swallow}) rotate(-4)`}>
          <rect x={-210} y={-50} width={420} height={100} rx={24} fill="#E23E57" />
          <text y={16} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#fff">
            ditelan ≠ diserap
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// E JEDA 2 JAM 24.55 – 28.5
const E: React.FC = () => {
  const f = useCurrentFrame();
  const S = 24.55;
  const t = (g: number) => g - S;
  const sweep = ez(f, t(25.7), t(26.9));
  const items: [string, number, React.ReactNode][] = [
    ['Teh', 26.76, <Cup key="t" x={0} y={0} s={0.55} liquid="#7A4A22" steam={false} />],
    ['Kopi', 27.34, <Cup key="k" x={0} y={0} s={0.55} liquid="#3B2314" steam={false} />],
    ['Susu', 27.86, <Milk key="m" x={0} y={0} s={0.6} />],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #FFF8E8 0%, #FFE9BF 70%, #FFD98A 100%)'}}>
      <Particles seed="e3" n={16} color="#F5B21E" kind="cap" size={20} opacity={0.3} />
      <Pad>
        <Tag text="CARA YANG BENAR" at={0} color="#C2410C" bg="rgba(194,65,12,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Beri jeda\n2 jam'} at={t(25.7)} size={110} color="#3A2400" hi={['2', 'jam']} hiColor="#C2410C" />
      </Pad>
      <Svg>
        {/* clock */}
        <g transform="translate(760 700)">
          <circle r={150} fill="#fff" stroke="#3A2400" strokeWidth={8} />
          <path d={`M0 0 L0 -130 A130 130 0 0 1 ${Math.sin((sweep * Math.PI) / 3) * 130} ${-Math.cos((sweep * Math.PI) / 3) * 130} Z`} fill="#FFC21A" opacity={0.6} />
          {Array.from({length: 12}).map((_, i) => (
            <line key={i} x1={0} y1={-128} x2={0} y2={-110} stroke="#3A2400" strokeWidth={6} transform={`rotate(${i * 30})`} />
          ))}
          <line x1={0} y1={0} x2={0} y2={-80} stroke="#3A2400" strokeWidth={10} strokeLinecap="round" transform={`rotate(${sweep * 60})`} />
          <line x1={0} y1={0} x2={0} y2={-115} stroke="#C2410C" strokeWidth={6} strokeLinecap="round" transform={`rotate(${sweep * 720})`} />
          <circle r={12} fill="#3A2400" />
        </g>
        {items.map(([lab, at, icon], i) => {
          const p = pop(f, t(at), 30, 11);
          const x = 220 + i * 260;
          return (
            <g key={lab} transform={`translate(${x} 1060) scale(${p})`}>
              <circle r={110} fill="#fff" stroke="#3A2400" strokeWidth={6} />
              <g transform="translate(0 0)">{icon}</g>
              <line x1={-80} y1={-80} x2={80} y2={80} stroke="#E23E57" strokeWidth={14} strokeLinecap="round" />
              <text y={160} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#3A2400">
                {lab}
              </text>
            </g>
          );
        })}
      </Svg>
      <div style={{position: 'absolute', left: 90, top: 1250, fontFamily: theme.mono, fontSize: 22, color: '#6B4A00', opacity: 0.85}}>Pedoman TTD Kemenkes</div>
    </AbsoluteFill>
  );
};

// F VITAMIN C 28.5 – 32.0
const F: React.FC = () => {
  const f = useCurrentFrame();
  const S = 28.5;
  const t = (g: number) => g - S;
  const boost = ez(f, t(30.3), t(31.6));
  const pour = ez(f, t(28.9), t(29.8));
  const gauge = lerp(0.35, 0.8, boost);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)'}}>
      <Particles seed="f3" n={22} color="#FF9F1C" kind="plus" size={16} opacity={0.35} />
      <Pad>
        <Tag text="PLUS VITAMIN C" at={0} color="#1FA463" bg="rgba(31,164,99,0.14)" />
        <div style={{height: 18}} />
        <Words text={'Bareng jus jeruk\natau buah'} at={0.1} size={80} color="#0F2E1E" hi={['jeruk']} hiColor="#FF9F1C" />
      </Pad>
      <Svg>
        {/* orange + juice glass */}
        <g transform={`translate(260 ${lerp(1250, 900, pour)})`} opacity={pour}>
          <circle r={110} fill="#FF9F1C" stroke="#1A1714" strokeWidth={6} />
          {Array.from({length: 8}).map((_, i) => (
            <line key={i} x1={0} y1={0} x2={Math.cos((i / 8) * Math.PI * 2) * 86} y2={Math.sin((i / 8) * Math.PI * 2) * 86} stroke="#FFD08A" strokeWidth={6} />
          ))}
          <circle r={86} fill="none" stroke="#FFD08A" strokeWidth={6} />
          <text y={180} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={56} fill="#C2410C">
            Vit C
          </text>
        </g>
        {/* arrow + Eri carrying boosted iron */}
        <path d={`M390 900 L${lerp(390, 560, boost)} 900`} stroke="#1FA463" strokeWidth={18} strokeLinecap="round" />
        <Eri x={620} y={lerp(1000, 880, boost)} s={0.85} />
        {/* gauge */}
        <g transform="translate(860 700)">
          <rect x={-60} y={0} width={120} height={420} rx={28} fill="#fff" stroke="#0F2E1E" strokeWidth={6} />
          <rect x={-48} y={12 + 396 * (1 - gauge)} width={96} height={396 * gauge} rx={18} fill={gauge > 0.55 ? '#1FA463' : '#E23E57'} />
          <text y={470} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#0F2E1E">
            SERAPAN
          </text>
          <text y={-24} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={60} fill="#0F2E1E">
            ↑
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// G MUAL -> MALAM 32.0 – 34.15
const G: React.FC = () => {
  const f = useCurrentFrame();
  const S = 32.0;
  const t = (g: number) => g - S;
  const night = ez(f, t(32.8), t(33.6));
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 70% 25%, ${night > 0.5 ? '#2D3A7A' : '#5B6BC0'} 0%, #1B2350 60%, #0B0F2A 100%)`}}>
      <Particles seed="g3" n={40} color="#FFF4DE" kind="star" size={10} opacity={0.6} speed={0.3} />
      <Pad>
        <Tag text="MASIH MUAL?" at={0} color="#FFE066" bg="rgba(255,224,102,0.15)" />
        <div style={{height: 18}} />
        <Words text={'Minum\nmenjelang tidur'} at={t(32.85)} size={92} color="#FFF4DE" hi={['tidur']} hiColor="#FFE066" />
      </Pad>
      <Svg>
        <g transform={`translate(780 820) scale(${pop(f, 0.1, 30, 10)})`}>
          <circle r={130} fill="#FFE066" opacity={0.15} />
          <path d="M30 -110 A110 110 0 1 0 100 70 A86 86 0 1 1 30 -110 Z" fill="#FFE066" stroke="#1A1714" strokeWidth={6} />
        </g>
        <Vimi x={330} y={1040} s={0.95} mood="happy" armR={30} armL={30} glow={0.4} />
        {[0, 1, 2].map((i) => {
          const p = ((f + i * 15) % 45) / 45;
          return (
            <text key={i} x={460 + i * 30} y={880 - p * 120} fontFamily={theme.title} fontWeight={800} fontSize={40 + i * 8} fill="#FFF4DE" opacity={(1 - p) * night}>
              z
            </text>
          );
        })}
      </Svg>
    </AbsoluteFill>
  );
};

// H WIN 34.15 – END
const H: React.FC = () => {
  const f = useCurrentFrame();
  const S = 34.15;
  const t = (g: number) => g - S;
  const crumble = ez(f, 0.2, 1.2);
  const follow = pop(f, t(35.5), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)'}}>
      <Particles seed="h3" n={34} color="#FFF4DE" kind="star" size={16} opacity={0.7} />
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
        <Eri x={570} y={900} s={0.6} />
        <Hoaksin x={lerp(840, 900, crumble)} y={lerp(980, 1100, crumble)} s={0.8} mood="dizzy" megaphone={false} tilt={lerp(0, 75, crumble)} armL={10} />
        <g opacity={1 - crumble * 0.7}>
          <Cacing x={lerp(800, 1000, crumble)} y={lerp(1150, 1250, crumble)} s={0.5} />
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
  [N0, 16.9, C, '#FFF4DE', [20, 70], false],
  [16.9, 24.55, D, '#1A1240', [80, 30], false],
  [24.55, 28.5, E, '#3A2400', [50, 50], false],
  [28.5, 32.0, F, '#0F2E1E', [20, 40], false],
  [32.0, 34.15, G, '#FFF4DE', [70, 25], false],
  [34.15, END, H, '#1A1714', [50, 50], false],
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
        <div style={{fontFamily: theme.mono, fontSize: 28, color: col, opacity: 0.75, letterSpacing: '0.1em'}}>SALAH KAPRAH · EP 03</div>
      </div>
      <div style={{position: 'absolute', top: 210, left: 96, right: 120, height: 6, borderRadius: 3, background: col, opacity: 0.25}} />
      <div style={{position: 'absolute', top: 210, left: 96, width: `${(f / durationInFrames) * (1080 - 216)}px`, height: 6, borderRadius: 3, background: col}} />
    </AbsoluteFill>
  );
};

type W = {w: string; s: number; e: number; who: string};
const ws = words as W[];
const caps: Caption[] = ws.map((x, i) => ({text: (i === 0 ? '' : ' ') + x.w, startMs: x.s * 1000, endMs: Math.min(x.e + 0.05, END) * 1000, timestampMs: x.s * 1000, confidence: 1}));
const pages = (['hx', 'cac', 'n'] as const).flatMap((who) => createTikTokStyleCaptions({captions: caps.filter((_, i) => ws[i].who === who).map((c, i) => (i === 0 ? {...c, text: c.text.trimStart()} : c)), combineTokensWithinMilliseconds: 700}).pages);

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const ms = (f / FPS) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;
  const who = ms < V0 * 1000 ? 'hx' : ms < N0 * 1000 ? 'cac' : 'n';
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

export const Ep3: React.FC = () => (
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
      <Audio src={staticFile('ep3/hx_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(V0 * FPS)}>
      <Audio src={staticFile('ep3/cac_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(N0 * FPS)}>
      <Audio src={staticFile('ep3/nar_f.wav')} />
    </Sequence>
    <Audio src={staticFile('ep3/sfx.wav')} />
  </AbsoluteFill>
);

export const Ep3Comp: React.FC = () => <Composition id="Ep3" component={Ep3} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />;
