import React from 'react';
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, random} from 'remotion';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, Caption} from '@remotion/captions';
import {theme} from './theme';
import {pop, lerp} from './util';
import {Particles, Tag, Words, Rings, ez} from './kit';
import {Vimi} from './Mascot';
import {Hoaksin, HX} from './Villain';
import {MythSpore} from './Villain';
import words from './ep7_words.json';

const FPS = 30;
const END = 46.6;
const TR = 12;
const V0 = 4.4;
const N0 = 8.5;

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
const BoltP: React.FC<{x: number; y: number; s?: number; fill?: string}> = ({x, y, s = 1, fill = '#FFC21A'}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M14 -70 L-36 8 L-4 8 L-18 70 L36 -14 L4 -14 Z" fill={fill} stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
);

const Bottle: React.FC<{x: number; y: number; s?: number; rot?: number; evil?: boolean}> = ({x, y, s = 1, rot = 0, evil = false}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-150} width={140} height={46} rx={10} fill={evil ? '#B7F03C' : '#F29A0C'} stroke="#1A1714" strokeWidth={7} />
    <path d="M-110 -100 Q-110 -112 -98 -112 L98 -112 Q110 -112 110 -100 L110 150 Q110 170 90 170 L-90 170 Q-110 170 -110 150 Z" fill={evil ? '#4A1D63' : '#FFF4DE'} stroke="#1A1714" strokeWidth={7} />
    <rect x={-110} y={-40} width={220} height={130} fill={evil ? '#2B1640' : '#F29A0C'} stroke="#1A1714" strokeWidth={6} />
    <BoltP x={0} y={25} s={0.8} fill={evil ? '#B7F03C' : '#FFF4DE'} />
    <rect x={-90} y={-95} width={22} height={240} rx={11} fill="#fff" opacity={0.18} />
  </g>
);

const RiceBowl: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 -10 Q-70 -80 0 -82 Q70 -80 80 -10 Z" fill="#fff" stroke="#1A1714" strokeWidth={6} />
    {[-40, -10, 20, 45, -25, 5, 32].map((dx, i) => (
      <ellipse key={i} cx={dx} cy={-30 - (i % 3) * 14} rx={8} ry={4} fill="#E9E2CF" />
    ))}
    <path d="M-95 -10 L95 -10 Q85 70 0 72 Q-85 70 -95 -10 Z" fill="#E23E57" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <path d="M-60 20 L60 20" stroke="#fff" strokeWidth={6} strokeDasharray="10 12" />
  </g>
);
const Egg: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 10 C -110 -60 -40 -80 -10 -70 C 40 -95 110 -60 90 10 C 80 70 -70 80 -90 10 Z" fill="#fff" stroke="#1A1714" strokeWidth={6} />
    <circle cx={0} cy={0} r={34} fill="#FFC21A" stroke="#1A1714" strokeWidth={5} />
    <circle cx={-10} cy={-10} r={9} fill="#fff" opacity={0.6} />
  </g>
);
const Drop: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -90 C 30 -40 70 0 70 30 C 70 70 38 90 0 90 C -38 90 -70 70 -70 30 C -70 0 -30 -40 0 -90 Z" fill="#FFD93B" stroke="#1A1714" strokeWidth={6} />
    <ellipse cx={-26} cy={30} rx={12} ry={22} fill="#fff" opacity={0.5} />
  </g>
);
const Leaf: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 90 C -70 40 -80 -60 0 -120 C 80 -60 70 40 0 90 Z" fill="#2FA34A" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <path d="M0 110 L0 -100" stroke="#9BE3A8" strokeWidth={6} strokeLinecap="round" />
  </g>
);
const Plate: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={190} ry={66} cy={40} fill="#F4F1EA" stroke="#1A1714" strokeWidth={6} />
    <RiceBowl x={-80} y={0} s={0.6} />
    <Leaf x={20} y={-10} s={0.45} rot={30} />
    <Egg x={110} y={10} s={0.5} />
  </g>
);
const Cross: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={70} fill="#E23E57" stroke="#1A1714" strokeWidth={6} />
    <rect x={-14} y={-44} width={28} height={88} rx={6} fill="#fff" />
    <rect x={-44} y={-14} width={88} height={28} rx={6} fill="#fff" />
  </g>
);


// ---------- new props ----------
const Scale: React.FC<{x: number; y: number; s?: number; needle: number; evil?: boolean; label?: string}> = ({x, y, s = 1, needle, evil = false, label}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-60} width={340} height={200} rx={40} fill={evil ? '#2B1640' : '#F4F1EA'} stroke={evil ? '#B7F03C' : '#1A1714'} strokeWidth={8} />
    <path d="M-110 30 A 110 110 0 0 1 110 30" fill={evil ? '#1A0F24' : '#fff'} stroke={evil ? '#B7F03C' : '#1A1714'} strokeWidth={6} />
    {Array.from({length: 9}).map((_, i) => {
      const a = Math.PI + (i / 8) * Math.PI;
      return <line key={i} x1={Math.cos(a) * 95} y1={30 + Math.sin(a) * 95} x2={Math.cos(a) * 80} y2={30 + Math.sin(a) * 80} stroke={evil ? '#B7F03C' : '#1A1714'} strokeWidth={4} />;
    })}
    <line x1={0} y1={30} x2={Math.cos(Math.PI + needle * Math.PI) * 85} y2={30 + Math.sin(Math.PI + needle * Math.PI) * 85} stroke="#E23E57" strokeWidth={8} strokeLinecap="round" />
    <circle cx={0} cy={30} r={12} fill="#E23E57" />
    {label && (
      <text y={110} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill={evil ? '#B7F03C' : '#1A1714'}>
        {label}
      </text>
    )}
  </g>
);

const FatBlob: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const w = Math.sin(f / 5) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-90 ${20 + w} C -110 -60 -40 ${-90 - w} 10 -80 C 80 -90 110 -30 95 20 C 85 80 -70 ${90 + w} -90 ${20 + w} Z`} fill="#FFE27A" stroke="#1A1714" strokeWidth={6} />
      <circle cx={-30} cy={-10} r={9} fill="#1A1714" />
      <circle cx={30} cy={-10} r={9} fill="#1A1714" />
      <path d="M-30 25 Q0 45 30 25" stroke="#1A1714" strokeWidth={6} fill="none" strokeLinecap="round" />
      <text y={-110} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#FFE27A">
        LEMAK
      </text>
    </g>
  );
};

const Tablet: React.FC<{x: number; y: number; s?: number; rot?: number; fill?: string}> = ({x, y, s = 1, rot = 0, fill = '#B7F03C'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-34} width={140} height={68} rx={34} fill={fill} stroke="#1A1714" strokeWidth={6} />
    <line x1={0} y1={-34} x2={0} y2={34} stroke="#1A1714" strokeWidth={5} />
    <rect x={-56} y={-24} width={40} height={12} rx={6} fill="#fff" opacity={0.4} />
  </g>
);

const Trash: React.FC<{x: number; y: number; s?: number; lid?: number}> = ({x, y, s = 1, lid = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 -60 L80 -60 L65 120 L-65 120 Z" fill="#3A1F52" stroke="#B7F03C" strokeWidth={6} strokeLinejoin="round" />
    {[-35, 0, 35].map((dx) => (
      <line key={dx} x1={dx} y1={-30} x2={dx * 0.85} y2={95} stroke="#B7F03C" strokeWidth={5} opacity={0.6} />
    ))}
    <g transform={`translate(-95 -70) rotate(${-lid * 50})`}>
      <rect x={0} y={-16} width={190} height={22} rx={8} fill="#4A1D63" stroke="#B7F03C" strokeWidth={5} />
    </g>
  </g>
);

const Gummy: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#FF6B8B'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-30} cy={-55} r={22} fill={c} stroke="#1A1714" strokeWidth={5} />
    <circle cx={30} cy={-55} r={22} fill={c} stroke="#1A1714" strokeWidth={5} />
    <ellipse cx={0} cy={0} rx={55} ry={60} fill={c} stroke="#1A1714" strokeWidth={5} />
    <circle cx={-16} cy={-12} r={6} fill="#1A1714" />
    <circle cx={16} cy={-12} r={6} fill="#1A1714" />
    <ellipse cx={-26} cy={20} rx={10} ry={16} fill="#fff" opacity={0.45} />
  </g>
);

const Syrup: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-34} y={-150} width={68} height={40} rx={8} fill="#1A1714" />
    <path d="M-28 -110 L28 -110 L28 -80 Q80 -60 80 0 L80 120 Q80 140 60 140 L-60 140 Q-80 140 -80 120 L-80 0 Q-80 -60 -28 -80 Z" fill="#C2410C" stroke="#1A1714" strokeWidth={6} />
    <rect x={-60} y={10} width={120} height={80} rx={10} fill="#FFF4DE" stroke="#1A1714" strokeWidth={4} />
    <text y={60} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={28} fill="#1A1714">SIRUP</text>
  </g>
);

const Shoe: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 30 L-90 -30 Q-60 -40 -30 -20 L20 0 Q90 10 95 40 L95 55 L-90 55 Z" fill="#2C7BE5" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <rect x={-90} y={45} width={185} height={18} rx={8} fill="#fff" stroke="#1A1714" strokeWidth={5} />
    {[-50, -25, 0].map((dx) => (
      <line key={dx} x1={dx} y1={-15 + dx * -0.1} x2={dx + 18} y2={-5} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    ))}
  </g>
);

const Kid: React.FC<{x: number; y: number; s?: number; happy: number}> = ({x, y, s = 1, happy}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={80} fill="#F2C29B" stroke="#1A1714" strokeWidth={6} />
    <path d="M-80 -10 Q-80 -95 0 -95 Q80 -95 80 -10 Q60 -60 0 -62 Q-60 -60 -80 -10 Z" fill="#1A1714" />
    <circle cx={-28} cy={0} r={9} fill="#1A1714" />
    <circle cx={28} cy={0} r={9} fill="#1A1714" />
    <path d={`M-28 ${40} Q0 ${40 + lerp(-22, 22, happy)} 28 ${40}`} stroke="#1A1714" strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

// A LAIR: "jangan minum vitamin, nanti gemuk" 0 – V0
const A: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 1.95 * 30 && f < 2.5 * 30 ? Math.sin(f * 3) * 10 : 0;
  const rise = ez(f, 0.5, 1.8);
  const needle = interpolate(f, [1.9 * 30, 3.2 * 30], [0.1, 0.95], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) + Math.sin(f / 2) * 0.02 * (f > 58 ? 1 : 0);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2B1640 0%, #160A22 55%, #07030B 100%)', translate: `${shake}px 0px`}}>
      <Particles seed="a7" n={40} color={HX.spore} kind="dot" size={10} opacity={0.5} speed={0.5} />
      <Lair tint="#B7F03C" flashAt={[1.95]} />
      <Svg>
        <g transform="translate(720 820)">
          <circle r={230} fill="#B7F03C" opacity={0.07 + Math.sin(f / 8) * 0.03} />
          <Bottle x={0} y={lerp(140, -20, rise) + Math.sin(f / 10) * 12} s={lerp(0.4, 0.75, rise)} rot={8} evil />
          {Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + f / 25;
            return <circle key={i} cx={Math.cos(a) * 210} cy={Math.sin(a) * 120} r={8} fill="#B7F03C" opacity={rise * 0.8} />;
          })}
        </g>
        <Scale x={720} y={1150} s={0.8} needle={needle} evil label="GEMUK?!" />
        <Hoaksin x={260} y={1110} s={1.3} mood={f > 1.95 * 30 ? 'laugh' : 'menace'} megaphone={false} armL={140} />
      </Svg>
      <Pad>
        <Tag text="SALAH KAPRAH #7" at={0} color={HX.spore} bg="rgba(183,240,60,0.14)" />
        <div style={{height: 26}} />
        <Glitch text={'VITAMIN =\nBIKIN GEMUK?'} size={92} color={HX.spore} at={0.5} />
      </Pad>
    </AbsoluteFill>
  );
};

// B tablet jadi lemak, buang vitamin V0 – N0
const B: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - V0;
  const morph = ez(f, t(4.5), t(5.6));
  const throwP = ez(f, t(6.45), t(7.6));
  const lid = ez(f, t(6.3), t(6.6)) * (1 - ez(f, t(7.7), t(8.0)));
  const shake = f > t(5.4) * 30 && f < t(5.9) * 30 ? Math.sin(f * 2.6) * 12 : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #3E0A2A 0%, #1F0515 60%, #0A0207 100%)', translate: `${shake}px ${shake * 0.4}px`}}>
      <Particles seed="b7" n={36} color="#F2A7B5" kind="dot" size={10} opacity={0.35} />
      <Lair tint="#E8899B" flashAt={[t(5.4)]} />
      <AbsoluteFill style={{background: '#FF2E4D', opacity: (Math.sin(f / 6) * 0.5 + 0.5) * 0.06}} />
      <Svg>
        <g transform="translate(330 760)">
          <g opacity={1 - morph} transform={`scale(${1 - morph * 0.5}) rotate(${morph * 180})`}>
            <Tablet x={0} y={0} s={1.4} />
          </g>
          <g opacity={morph} transform={`scale(${0.3 + morph * 0.9})`}>
            <FatBlob x={0} y={0} s={1} />
          </g>
          <text y={200} textAnchor="middle" fontFamily={theme.mono} fontSize={32} fill="#F2A7B5" opacity={morph}>
            (kata Hoaksin)
          </text>
        </g>
        <Trash x={790} y={1000} s={1.1} lid={lid} />
        {throwP > 0.01 &&
          [0, 1, 2].map((i) => {
            const d = Math.min(1, Math.max(0, throwP * 1.4 - i * 0.18));
            const x = lerp(260, 790, d);
            const y = lerp(1080, 930, d) - Math.sin(d * Math.PI) * 300;
            return (
              <g key={i} opacity={d > 0.97 ? 0 : 1}>
                <Tablet x={x} y={y} s={0.55} rot={d * 360} fill={['#FFC21A', '#2EE6FF', '#FF6B8B'][i]} />
              </g>
            );
          })}
        <MythSpore x={560} y={1250} text="HOAKS" s={0.8} o={0.85} />
        <Hoaksin x={200} y={1190} s={0.95} mood="menace" megaphone={false} armL={120} />
      </Svg>
      <Pad>
        <Glitch text={'1 TABLET =\nJADI LEMAK!'} size={84} color="#F2A7B5" at={0.1} />
      </Pad>
    </AbsoluteFill>
  );
};

// C STOP + bukan sumber kalori N0 – C_END
const C_END = 12.6;
const C: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - N0;
  const fly = ez(f, 0, 0.45);
  const stamp = pop(f, 0.3, 30, 8);
  const card = ez(f, t(10.1), t(10.7));
  const zero = pop(f, t(11.4), 30, 10);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #1C7C94 0%, #0F5E73 55%, #083845 100%)'}}>
      <Particles seed="c7" n={30} color="#FFC21A" kind="star" size={12} opacity={0.5} />
      <Rings cx={700} cy={960} r={300} color="#FFC21A" o={0.16} />
      <Svg>
        {fly > 0.9 && <circle cx={220} cy={1080} r={(f - 13) * 40} fill="none" stroke="#FFC21A" strokeWidth={10} opacity={Math.max(0, 1 - (f - 13) / 18)} />}
        <Vimi x={lerp(-200, 210, fly)} y={lerp(1500, 1130, fly)} s={0.85} fly={fly < 1} tilt={fly < 1 ? 28 : 0} mood={fly < 1 ? 'wow' : 'think'} armR={fly < 1 ? 175 : 100} armL={35} glow={1} />
        <g transform={`translate(${lerp(1200, 640, card)} 840)`} opacity={card}>
          <rect x={-250} y={-280} width={500} height={560} rx={30} fill="#FFF4DE" stroke="#1A1714" strokeWidth={6} />
          <rect x={-250} y={-280} width={500} height={90} rx={30} fill="#1A1714" />
          <text y={-220} textAnchor="middle" fontFamily={theme.mono} fontSize={34} fill="#FFC21A" letterSpacing="0.1em">
            KALORI VITAMIN
          </text>
          <Tablet x={-130} y={-90} s={0.8} fill="#FFC21A" />
          <text x={-30} y={-75} fontFamily={theme.title} fontWeight={800} fontSize={42} fill="#1A1714">
            + mineral
          </text>
          <g transform={`translate(0 90) scale(${zero})`}>
            <text textAnchor="middle" y={40} fontFamily={theme.title} fontWeight={800} fontSize={150} fill="#1FA463">
              0
            </text>
            <text textAnchor="middle" y={120} fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#1FA463">
              kkal
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

// D FAO: kalori dari karbo, protein, lemak C_END – D_END
const D_END = 19.7;
const D: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - C_END;
  const items: [string, string, number, number, React.ReactNode, string][] = [
    ['Karbo', '4', 220, 14.64, <RiceBowl key="r" x={0} y={-10} s={0.8} />, '#FFC21A'],
    ['Protein', '4', 540, 15.38, <Egg key="e" x={0} y={0} s={0.72} />, '#FFC21A'],
    ['Lemak', '9', 860, 17.58, <Drop key="d" x={0} y={0} s={0.7} />, '#E23E57'],
  ];
  const v0 = pop(f, t(18.6), 30, 10);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #FFF8E6 0%, #FFE9B8 70%, #FFD98A 100%)'}}>
      <Particles seed="d7" n={18} color="#C2410C" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="FAO · SUMBER KALORI" at={0} color="#C2410C" bg="rgba(194,65,12,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Kalori datang\ndari makanan'} at={0.1} size={88} color="#2A1405" hi={['makanan']} hiColor="#C2410C" />
      </Pad>
      <Svg>
        {items.map(([lab, kc, x, at, node, col]) => {
          const p = pop(f, t(at), 30, 11);
          const num = pop(f, t(at === 15.38 ? 16.04 : at === 14.64 ? 16.04 : 18.18), 30, 10);
          return (
            <g key={lab} transform={`translate(${x} 760) scale(${p})`}>
              <circle r={115} fill="#fff" stroke="#2A1405" strokeWidth={5} />
              {node}
              <text y={160} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#2A1405">
                {lab}
              </text>
              <g transform={`translate(0 245) scale(${num})`}>
                <rect x={-95} y={-48} width={190} height={84} rx={20} fill={col} stroke="#1A1714" strokeWidth={5} />
                <text y={10} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#1A1714">
                  {kc} kkal/g
                </text>
              </g>
            </g>
          );
        })}
        <g transform={`translate(540 1180) scale(${v0})`}>
          <rect x={-300} y={-50} width={600} height={100} rx={50} fill="#1A1714" />
          <Tablet x={-220} y={0} s={0.45} fill="#B7F03C" />
          <text x={30} y={14} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#B7F03C">
            Vitamin: 0 kkal/g
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// E ENERGY BALANCE D_END – E_END
const E_END = 23.0;
const E: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - D_END;
  const inP = ez(f, t(20.7), t(21.4));
  const outP = ez(f, t(22.3), t(22.9));
  const tilt = lerp(0, -12, inP) + lerp(0, 0, outP);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 60% 35%, #2C5A94 0%, #1B3D6B 60%, #0F2647 100%)'}}>
      <Particles seed="e7" n={24} color="#FFC21A" kind="dot" size={10} opacity={0.35} />
      <Pad>
        <Tag text="KUNCI BERAT BADAN" at={0} color="#FFC21A" bg="rgba(255,194,26,0.14)" />
        <div style={{height: 18}} />
        <Words text={'Masuk > dipakai\n= berat naik'} at={0.3} size={86} color="#fff" hi={['naik']} hiColor="#FFC21A" />
      </Pad>
      <Svg>
        <g transform="translate(540 1000)">
          <path d="M-40 260 L40 260 L12 0 L-12 0 Z" fill="#9FB8D9" stroke="#1A1714" strokeWidth={5} />
          <circle r={20} fill="#FFC21A" stroke="#1A1714" strokeWidth={5} />
          <g transform={`rotate(${tilt})`}>
            <rect x={-360} y={-10} width={720} height={20} rx={10} fill="#FFF4DE" stroke="#1A1714" strokeWidth={5} />
            <g transform={`translate(-280 ${-10})`}>
              <path d="M-120 0 L120 0 L90 -40 L-90 -40 Z" fill="#FFF4DE" stroke="#1A1714" strokeWidth={5} />
              <g opacity={inP} transform={`translate(0 ${-90 - (1 - inP) * 200})`}>
                <Plate x={0} y={0} s={0.5} />
              </g>
              <text y={90} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#FFC21A">KALORI MASUK</text>
            </g>
            <g transform={`translate(280 ${-10})`}>
              <path d="M-120 0 L120 0 L90 -40 L-90 -40 Z" fill="#FFF4DE" stroke="#1A1714" strokeWidth={5} />
              <g opacity={outP} transform="translate(0 -80)">
                <Shoe x={0} y={0} s={0.7} />
              </g>
              <text y={90} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#9BE3A8">DIPAKAI</text>
            </g>
          </g>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// F ZINC & nafsu makan anak E_END – F_END
const F_END = 33.0;
const F: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - E_END;
  const r1 = pop(f, t(25.06), 30, 12);
  const down = ez(f, t(26.9), t(27.6));
  const r2 = pop(f, t(28.14), 30, 12);
  const up = ez(f, t(29.6), t(30.5));
  const note = pop(f, t(31.1), 30, 10);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #F4F1FF 0%, #DCD6F7 70%, #C5BCF0 100%)'}}>
      <Particles seed="f7" n={18} color="#6B5FB3" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="NIH ODS · ZINC" at={0} color="#4A3AA8" bg="rgba(74,58,168,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Kenapa jadi\nlahap makan?'} at={0.1} size={88} color="#1A1240" hi={['lahap']} hiColor="#E23E57" />
      </Pad>
      <Svg>
        <g opacity={Math.min(1, r1 * 1.3)} transform={`translate(${(1 - r1) * -60} 0)`}>
          <rect x={90} y={660} width={830} height={230} rx={26} fill="#fff" stroke="#1A1240" strokeWidth={4} />
          <Kid x={210} y={775} s={0.75} happy={0} />
          <text x={330} y={745} fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#1A1240">
            Anak kurang zinc
          </text>
          <text x={330} y={805} fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#E23E57" opacity={down}>
            nafsu makan turun ↓
          </text>
          <Scale x={815} y={830} s={0.35} needle={lerp(0.5, 0.25, down)} />
        </g>
        <g opacity={Math.min(1, r2 * 1.3)} transform={`translate(${(1 - r2) * -60} 0)`}>
          <rect x={90} y={920} width={830} height={230} rx={26} fill="#fff" stroke="#1A1240" strokeWidth={4} />
          <Kid x={210} y={1035} s={0.75} happy={up} />
          <text x={330} y={1005} fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#1A1240">
            Kekurangan teratasi
          </text>
          <text x={330} y={1065} fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#1FA463" opacity={up}>
            makan kembali normal ✓
          </text>
        </g>
        <g transform={`translate(540 1235) scale(${note})`}>
          <rect x={-400} y={-45} width={800} height={90} rx={45} fill="#1A1240" />
          <text y={14} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#FFC21A">
            Yang menambah berat = makanannya
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// G CEK LABEL F_END – G_END
const G_END = 37.2;
const G: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - F_END;
  const lab = ez(f, t(33.7), t(34.3));
  const gm = pop(f, t(34.72), 30, 10);
  const sy = pop(f, t(35.3), 30, 10);
  const hl = pop(f, t(36.28), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 40% 30%, #FFF1F4 0%, #FFD3DD 70%, #FFB3C4 100%)'}}>
      <Particles seed="g7" n={20} color="#E23E57" kind="dot" size={12} opacity={0.25} />
      <Pad>
        <Tag text="FDA · LABEL SUPLEMEN" at={0} color="#B3123A" bg="rgba(179,18,58,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Tapi cek\nlabelnya!'} at={0.4} size={92} color="#3A0613" hi={['labelnya!']} hiColor="#E23E57" />
      </Pad>
      <Svg>
        <Gummy x={200} y={800} s={1.1 * gm} c="#FF6B8B" />
        <Gummy x={300} y={880} s={0.8 * gm} c="#FFC21A" />
        <Syrup x={240} y={1110} s={0.8 * sy} />
        <g transform={`translate(${lerp(1100, 680, lab)} 960)`}>
          <rect x={-230} y={-260} width={460} height={520} rx={20} fill="#fff" stroke="#1A1714" strokeWidth={6} />
          <text x={-200} y={-200} fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#1A1714">Supplement Facts</text>
          <line x1={-205} y1={-175} x2={205} y2={-175} stroke="#1A1714" strokeWidth={10} />
          {[
            ['Kalori', '15', true],
            ['Gula', '3 g', true],
            ['Vitamin C', '✓', false],
            ['Vitamin D', '✓', false],
          ].map(([a, b, h], i) => {
            const y = -110 + i * 80;
            return (
              <g key={String(a)}>
                {h && <rect x={-215} y={y - 46} width={430} height={66} rx={12} fill="#FFE066" opacity={hl} />}
                <text x={-200} y={y} fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#1A1714">{a}</text>
                <text x={200} y={y} textAnchor="end" fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#1A1714">{b}</text>
                <line x1={-205} y1={y + 24} x2={205} y2={y + 24} stroke="#1A1714" strokeWidth={3} />
              </g>
            );
          })}
          <text y={225} textAnchor="middle" fontFamily={theme.mono} fontSize={26} fill="#6B6B6B">contoh label</text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// H CARA BENAR G_END – H_END
const H_END = 42.95;
const H: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - G_END;
  const rows: [string, string, number, React.ReactNode][] = [
    ['Makan seimbang', 'porsi cukup', 38.28, <Plate key="p" x={0} y={0} s={0.42} />],
    ['Aktif bergerak', 'tiap hari', 39.28, <Shoe key="s" x={0} y={0} s={0.55} />],
    ['Berat berubah drastis?', 'periksa ke dokter', 40.62, <Cross key="c" x={0} y={0} s={0.7} />],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)'}}>
      <Particles seed="h7" n={22} color="#FF9F1C" kind="plus" size={16} opacity={0.35} />
      <Pad>
        <Tag text="CARA YANG BENAR" at={0} color="#1FA463" bg="rgba(31,164,99,0.14)" />
        <div style={{height: 18}} />
        <Words text={'Fokus ke\npiring & gerak'} at={0.1} size={84} color="#0F2E1E" hi={['gerak']} hiColor="#1FA463" />
      </Pad>
      <Svg>
        {rows.map(([a, b, at, ic], i) => {
          const p = pop(f, t(at), 30, 12);
          const y = 700 + i * 170;
          return (
            <g key={a} opacity={Math.min(1, p * 1.3)} transform={`translate(${(1 - p) * -60} 0)`}>
              <rect x={90} y={y - 70} width={760} height={140} rx={26} fill="#fff" stroke="#0F2E1E" strokeWidth={4} />
              <g transform={`translate(180 ${y})`}>{ic}</g>
              <text x={290} y={y - 8} fontFamily={theme.title} fontWeight={800} fontSize={i === 2 ? 36 : 42} fill="#0F2E1E">
                {a}
              </text>
              <text x={290} y={y + 40} fontFamily={theme.title} fontWeight={800} fontSize={34} fill={i === 2 ? '#C2410C' : '#1FA463'}>
                {b}
              </text>
            </g>
          );
        })}
        <Vimi x={880} y={1170} s={0.42} mood="happy" armR={150} thumbR armL={30} glow={0.8} />
      </Svg>
    </AbsoluteFill>
  );
};

// I WIN H_END – END
const I: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - H_END;
  const crumble = ez(f, 0.2, 1.2);
  const follow = pop(f, t(44.2), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)'}}>
      <Particles seed="i7" n={34} color="#FFF4DE" kind="star" size={16} opacity={0.7} />
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
        <Hoaksin x={lerp(820, 880, crumble)} y={lerp(980, 1100, crumble)} s={0.8} mood="dizzy" megaphone={false} tilt={lerp(0, 75, crumble)} armL={10} />
        <g opacity={1 - crumble * 0.6}>
          <Scale x={lerp(820, 900, crumble)} y={lerp(1200, 1260, crumble)} s={0.35} needle={0.5} evil />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, textAlign: 'center'}}>
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
  [C_END, D_END, D, '#2A1405', [80, 30], false],
  [D_END, E_END, E, '#FFC21A', [20, 50], false],
  [E_END, F_END, F, '#1A1240', [80, 30], false],
  [F_END, G_END, G, '#3A0613', [20, 60], false],
  [G_END, H_END, H, '#0F2E1E', [80, 40], false],
  [H_END, END, I, '#1A1714', [50, 50], false],
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
        <div style={{fontFamily: theme.mono, fontSize: 28, color: col, opacity: 0.75, letterSpacing: '0.1em'}}>SALAH KAPRAH · EP 07</div>
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

export const Ep7: React.FC = () => (
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
      <Audio src={staticFile('ep7/hx_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(N0 * FPS)}>
      <Audio src={staticFile('ep7/nar_f.wav')} />
    </Sequence>
    <Audio src={staticFile('ep7/sfx.wav')} />
  </AbsoluteFill>
);

export const Ep7Comp: React.FC = () => <Composition id="Ep7" component={Ep7} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />;
