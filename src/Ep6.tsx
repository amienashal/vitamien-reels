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
import words from './ep6_words.json';

const FPS = 30;
const END = 44.0;
const TR = 12;
const V0 = 7.2;
const N0 = 11.75;

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

const Battery: React.FC<{x: number; y: number; s?: number; level: number; w?: number; h?: number; label?: string; labelColor?: string; evil?: boolean}> = ({x, y, s = 1, level, w = 380, h = 170, label, labelColor = '#1A1714', evil = false}) => {
  const lv = Math.max(0, Math.min(1, level));
  const col = evil ? '#B7F03C' : lv > 0.6 ? '#1FA463' : lv > 0.3 ? '#FFC21A' : '#E23E57';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={28} fill={evil ? '#1A0F24' : '#fff'} stroke={evil ? '#B7F03C' : '#1A1714'} strokeWidth={8} />
      <rect x={w / 2} y={-h / 5} width={26} height={(h * 2) / 5} rx={8} fill={evil ? '#B7F03C' : '#1A1714'} />
      <rect x={-w / 2 + 16} y={-h / 2 + 16} width={(w - 32) * lv} height={h - 32} rx={16} fill={col} />
      <text y={h * 0.18} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={h * 0.42} fill={evil ? '#fff' : '#1A1714'}>
        {Math.round(lv * 100)}%
      </text>
      {label && (
        <text y={h / 2 + 56} textAnchor="middle" fontFamily={theme.mono} fontSize={34} fill={labelColor} letterSpacing="0.08em">
          {label}
        </text>
      )}
    </g>
  );
};

const XMark: React.FC<{x: number; y: number; s?: number; p?: number}> = ({x, y, s = 1, p = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * p})`} opacity={Math.min(1, p)}>
    <path d="M-80 -80 L80 80 M80 -80 L-80 80" stroke="#FF2E4D" strokeWidth={26} strokeLinecap="round" />
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
const Moon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M30 -80 A 82 82 0 1 0 70 50 A 66 66 0 1 1 30 -80 Z" fill="#FFE066" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <text x={40} y={-30} fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#B9C3FF">
      z
    </text>
    <text x={70} y={-70} fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#B9C3FF">
      z
    </text>
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

// A LAIR: Hoaksin + botol "energi instan" 0 – V0
const A: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 4.7 * 30 && f < 5.3 * 30 ? Math.sin(f * 3) * 10 : 0;
  const rise = ez(f, 1.8, 3.2);
  const charge = ez(f, 4.75, 6.0);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2B1640 0%, #160A22 55%, #07030B 100%)', translate: `${shake}px 0px`}}>
      <Particles seed="a6" n={40} color={HX.spore} kind="dot" size={10} opacity={0.5} speed={0.5} />
      <Lair tint="#B7F03C" flashAt={[4.75]} />
      <Svg>
        <g transform="translate(700 900)">
          <circle r={250} fill="#B7F03C" opacity={0.07 + Math.sin(f / 8) * 0.03} />
          <path d="M-170 200 L170 200 L130 300 L-130 300 Z" fill="#3A1F52" stroke="#1A1714" strokeWidth={6} />
          <Bottle x={0} y={lerp(160, 10, rise) + Math.sin(f / 10) * 12} s={lerp(0.45, 0.85, rise)} rot={8} evil />
          {Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + f / 25;
            return <circle key={i} cx={Math.cos(a) * 220} cy={Math.sin(a) * 130} r={8} fill="#B7F03C" opacity={rise * 0.8} />;
          })}
          {charge > 0.02 &&
            Array.from({length: 5}).map((_, i) => (
              <BoltP key={i} x={Math.cos(i * 1.3 + f / 6) * 180} y={Math.sin(i * 1.9 + f / 5) * 150} s={0.5} fill="#B7F03C" />
            ))}
        </g>
        <Battery x={720} y={660} s={0.6} level={charge} evil />
        <Hoaksin x={250} y={1110} s={1.3} mood={f > 4.7 * 30 ? 'laugh' : 'menace'} megaphone={false} armL={140} />
      </Svg>
      <Pad>
        <Tag text="SALAH KAPRAH #6" at={0} color={HX.spore} bg="rgba(183,240,60,0.14)" />
        <div style={{height: 26}} />
        <Glitch text={'1 TABLET =\nTENAGA PENUH?'} size={92} color={HX.spore} at={0.8} />
      </Pad>
    </AbsoluteFill>
  );
};

// B OM FORWARD: nggak usah makan & tidur V0 – N0
const B: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - V0;
  const xa = pop(f, t(7.7), 30, 9);
  const xb = pop(f, t(8.9), 30, 9);
  const send = interpolate(f, [t(9.69) * 30, t(11.75) * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = f > t(10.8) * 30 && f < t(11.3) * 30 ? Math.sin(f * 2.6) * 12 : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #3E0A2A 0%, #1F0515 60%, #0A0207 100%)', translate: `${shake}px ${shake * 0.4}px`}}>
      <Particles seed="b6" n={36} color="#F2A7B5" kind="dot" size={10} opacity={0.35} />
      <Lair tint="#E8899B" flashAt={[t(10.8)]} />
      <AbsoluteFill style={{background: '#FF2E4D', opacity: (Math.sin(f / 6) * 0.5 + 0.5) * 0.06}} />
      <Svg>
        <g transform={`translate(300 680) scale(${pop(f, t(7.33), 30, 11)})`}>
          <circle r={130} fill="#2A0617" stroke="#F2A7B5" strokeWidth={5} />
          <Plate x={0} y={-10} s={0.55} />
          <text y={175} textAnchor="middle" fontFamily={theme.mono} fontSize={30} fill="#F2A7B5">MAKAN</text>
        </g>
        <XMark x={300} y={680} s={0.9} p={xa} />
        <g transform={`translate(720 680) scale(${pop(f, t(8.47), 30, 11)})`}>
          <circle r={130} fill="#2A0617" stroke="#F2A7B5" strokeWidth={5} />
          <Moon x={-5} y={10} s={0.85} />
          <text y={175} textAnchor="middle" fontFamily={theme.mono} fontSize={30} fill="#F2A7B5">TIDUR</text>
        </g>
        <XMark x={720} y={680} s={0.9} p={xb} />
        {/* forwarded messages flying out */}
        {send > 0.01 &&
          Array.from({length: 9}).map((_, i) => {
            const d = Math.min(1, Math.max(0, send * 1.5 - i * 0.06));
            const ang = -2.9 + i * 0.32;
            const x = 640 + Math.cos(ang) * 430 * Math.sqrt(d);
            const y = 930 + Math.sin(ang) * 430 * Math.sqrt(d);
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${0.9 + d * 0.5})`} opacity={d > 0.995 ? 0 : 1}>
                <rect x={-60} y={-28} width={120} height={56} rx={28} fill="#25D366" stroke="#1A1714" strokeWidth={4} />
                <text y={10} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={26} fill="#fff">
                  FWD ⚡
                </text>
              </g>
            );
          })}
        <OmForward x={460} y={1090} s={1.7} />
      </Svg>
      <Pad>
        <Glitch text={'NGGAK USAH\nMAKAN & TIDUR!'} size={80} color="#F2A7B5" at={0.2} />
      </Pad>
    </AbsoluteFill>
  );
};

// C STOP + bukan sumber kalori N0 – C_END
const C_END = 17.0;
const C: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - N0;
  const fly = ez(f, 0, 0.45);
  const stamp = pop(f, 0.45, 30, 8);
  const card = ez(f, t(13.3), t(14.0));
  const no = pop(f, t(14.6), 30, 10);
  const verdict = pop(f, t(15.5), 30, 8);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #1C7C94 0%, #0F5E73 55%, #083845 100%)'}}>
      <Particles seed="c6" n={30} color="#FFC21A" kind="star" size={12} opacity={0.5} />
      <Rings cx={700} cy={960} r={300} color="#FFC21A" o={0.16} />
      <Svg>
        {fly > 0.9 && <circle cx={220} cy={1080} r={(f - 13) * 40} fill="none" stroke="#FFC21A" strokeWidth={10} opacity={Math.max(0, 1 - (f - 13) / 18)} />}
        <Vimi x={lerp(-200, 200, fly)} y={lerp(1500, 1110, fly)} s={0.9} fly={fly < 1} tilt={fly < 1 ? 28 : 0} mood={fly < 1 ? 'wow' : 'think'} armR={fly < 1 ? 175 : 100} armL={35} glow={1} />
        <g transform={`translate(${lerp(1200, 640, card)} 860)`} opacity={card}>
          <rect x={-250} y={-300} width={500} height={600} rx={30} fill="#FFF4DE" stroke="#1A1714" strokeWidth={6} />
          <rect x={-250} y={-300} width={500} height={90} rx={30} fill="#1A1714" />
          <text y={-240} textAnchor="middle" fontFamily={theme.mono} fontSize={34} fill="#FFC21A" letterSpacing="0.1em">
            SUMBER KALORI?
          </text>
          <Bottle x={-120} y={-80} s={0.5} />
          <text x={-10} y={-100} fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#1A1714">
            Vitamin
          </text>
          <g transform={`translate(80 -30) scale(${no})`}>
            <text textAnchor="middle" y={14} fontFamily={theme.title} fontWeight={800} fontSize={52} fill="#E23E57">
              BUKAN ✗
            </text>
          </g>
          <g transform={`translate(0 170) rotate(-6) scale(${verdict})`}>
            <rect x={-215} y={-62} width={430} height={116} rx={18} fill="none" stroke="#E23E57" strokeWidth={8} />
            <text y={-12} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#E23E57">
              BUKAN
            </text>
            <text y={34} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#E23E57">
              BAHAN BAKAR
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

// D ENERGI DARI MAKANAN C_END – D_END
const D_END = 21.0;
const D: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - C_END;
  const fill = ez(f, t(19.0), t(20.7));
  const foods: [string, number, number, React.ReactNode][] = [
    ['Karbohidrat', 230, 17.75, <RiceBowl key="r" x={0} y={0} s={0.85} />],
    ['Lemak', 540, 18.45, <Drop key="d" x={0} y={0} s={0.75} />],
    ['Protein', 830, 18.95, <Egg key="e" x={0} y={0} s={0.75} />],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #FFF8E6 0%, #FFE9B8 70%, #FFD98A 100%)'}}>
      <Particles seed="d6" n={18} color="#C2410C" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="SUMBER ENERGI" at={0} color="#C2410C" bg="rgba(194,65,12,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Energi dari\nmakanan'} at={0.1} size={92} color="#2A1405" hi={['makanan']} hiColor="#C2410C" />
      </Pad>
      <Svg>
        {foods.map(([lab, x, at, node], i) => {
          const p = pop(f, t(at), 30, 11);
          const flow = ez(f, t(19.0 + i * 0.15), t(19.8 + i * 0.15));
          return (
            <g key={lab}>
              <g transform={`translate(${x} 760) scale(${p})`}>
                <circle r={105} fill="#fff" stroke="#2A1405" strokeWidth={5} />
                {node}
                <text y={150} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={36} fill="#2A1405">
                  {lab}
                </text>
              </g>
              {flow > 0.02 && flow < 0.98 && <circle cx={lerp(x, 540, flow)} cy={lerp(930, 1110, flow)} r={18} fill="#FFC21A" stroke="#1A1714" strokeWidth={4} />}
            </g>
          );
        })}
        <g opacity={ez(f, t(18.9), t(19.3))}>
          <Battery x={520} y={1130} level={fill} w={420} h={160} />
          <BoltP x={820} y={1130} s={0.8 + Math.sin(f / 4) * 0.05 * fill} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// E BUSI, BUKAN BENSIN D_END – E_END
const E_END = 26.4;
const E: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - D_END;
  const pipe = ez(f, t(21.6), t(23.0));
  const plug = pop(f, t(24.31), 30, 10);
  const spark = f > t(24.5) * 30 ? (Math.sin(f / 1.5) > 0 ? 1 : 0.4) : 0;
  const fuelLab = pop(f, t(25.4), 30, 10);
  const out = ez(f, t(23.2), t(24.0));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 60% 35%, #2C5A94 0%, #1B3D6B 60%, #0F2647 100%)'}}>
      <Particles seed="e6" n={24} color="#FFC21A" kind="dot" size={10} opacity={0.35} />
      <Pad>
        <Tag text="PERAN VITAMIN B" at={0} color="#FFC21A" bg="rgba(255,194,26,0.14)" />
        <div style={{height: 18}} />
        <Words text={'Busi, bukan\nbensin!'} at={3.3} size={96} color="#fff" hi={['Busi']} hiColor="#FFC21A" />
      </Pad>
      <Svg>
        {/* fuel can = makanan */}
        <g transform="translate(230 900)">
          <path d="M-90 -110 L50 -110 L90 -70 L90 130 L-90 130 Z" fill="#E23E57" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
          <rect x={30} y={-150} width={40} height={44} rx={6} fill="#1A1714" />
          <Plate x={0} y={0} s={0.42} />
          <g transform={`scale(${fuelLab})`}>
            <rect x={-110} y={150} width={220} height={74} rx={16} fill="#FFF4DE" stroke="#1A1714" strokeWidth={4} />
            <text y={198} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#1A1714">
              BENSIN
            </text>
          </g>
          <text y={-130 - 40} textAnchor="middle" fontFamily={theme.mono} fontSize={30} fill="#FFF4DE">MAKANAN</text>
        </g>
        {/* pipe */}
        <path d="M320 960 L470 960" stroke="#9FB8D9" strokeWidth={22} strokeLinecap="round" />
        <path d="M320 960 L470 960" stroke="#FFC21A" strokeWidth={10} strokeLinecap="round" strokeDasharray="20 18" strokeDashoffset={-f * 4} opacity={pipe} />
        {/* engine */}
        <g transform="translate(620 960)">
          <rect x={-150} y={-110} width={300} height={240} rx={24} fill="#5C6B80" stroke="#1A1714" strokeWidth={6} />
          {[-90, -30, 30, 90].map((dx) => (
            <rect key={dx} x={dx - 18} y={-80} width={36} height={180} rx={10} fill="#3E4A5C" />
          ))}
          <circle r={50} cy={10} fill="#1A1714" opacity={0.25} />
          {/* spark plug = vitamin B */}
          <g transform={`translate(0 -110) scale(${plug})`}>
            <rect x={-18} y={-120} width={36} height={60} rx={6} fill="#FFF4DE" stroke="#1A1714" strokeWidth={5} />
            <rect x={-26} y={-60} width={52} height={44} rx={6} fill="#9FB8D9" stroke="#1A1714" strokeWidth={5} />
            <rect x={-8} y={-16} width={16} height={20} fill="#1A1714" />
            <rect x={-130} y={-230} width={260} height={74} rx={16} fill="#FFC21A" stroke="#1A1714" strokeWidth={4} />
            <text y={-182} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#1A1714">
              BUSI = VIT B
            </text>
          </g>
          {spark > 0 &&
            Array.from({length: 6}).map((_, i) => (
              <line key={i} x1={0} y1={-100} x2={Math.cos(i) * 70} y2={-100 + Math.sin(i * 2) * 50} stroke="#FFE066" strokeWidth={6} opacity={spark} strokeLinecap="round" />
            ))}
        </g>
        {/* output energy */}
        <g transform={`translate(620 1210)`} opacity={out}>
          <rect x={-160} y={-40} width={320} height={80} rx={40} fill="#1FA463" stroke="#1A1714" strokeWidth={4} />
          <text y={14} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#fff">
            ⚡ ENERGI
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// F NIH ODS B12 E_END – F_END
const F_END = 34.2;
const F: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - E_END;
  const r1 = pop(f, t(27.7), 30, 12);
  const add1 = ez(f, t(28.8), t(29.6));
  const no1 = pop(f, t(30.2), 30, 9);
  const r2 = pop(f, t(31.83), 30, 12);
  const ok2 = pop(f, t(33.2), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #F4F1FF 0%, #DCD6F7 70%, #C5BCF0 100%)'}}>
      <Particles seed="f6" n={18} color="#6B5FB3" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="NIH ODS · VITAMIN B12" at={0} color="#4A3AA8" bg="rgba(74,58,168,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Bukan\ntombol turbo'} at={0.1} size={92} color="#1A1240" hi={['turbo']} hiColor="#E23E57" />
      </Pad>
      <Svg>
        <g opacity={Math.min(1, r1 * 1.3)} transform={`translate(${(1 - r1) * -60} 0)`}>
          <rect x={90} y={720} width={830} height={240} rx={26} fill="#fff" stroke="#1A1240" strokeWidth={4} />
          <text x={125} y={780} fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#1A1240">
            Asupan sudah cukup
          </text>
          <Battery x={290} y={870} s={0.55} level={1} />
          <text x={470} y={885} fontFamily={theme.title} fontWeight={800} fontSize={42} fill="#4A3AA8" opacity={add1}>
            + B12
          </text>
          <g transform={`translate(720 860) scale(${no1})`}>
            <text textAnchor="middle" y={-6} fontFamily={theme.title} fontWeight={800} fontSize={34} fill="#E23E57">
              energi naik?
            </text>
            <text textAnchor="middle" y={40} fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#E23E57">
              ✗ TIDAK
            </text>
          </g>
        </g>
        <g opacity={Math.min(1, r2 * 1.3)} transform={`translate(${(1 - r2) * -60} 0)`}>
          <rect x={90} y={1000} width={830} height={240} rx={26} fill="#fff" stroke="#1A1240" strokeWidth={4} />
          <text x={125} y={1060} fontFamily={theme.title} fontWeight={800} fontSize={38} fill="#1A1240">
            Kalau memang kekurangan
          </text>
          <Battery x={290} y={1150} s={0.55} level={0.15 + 0.75 * ez(f, t(33.2), t(34.0))} />
          <g transform={`translate(660 1140) scale(${ok2})`}>
            <text textAnchor="middle" y={-6} fontFamily={theme.title} fontWeight={800} fontSize={34} fill="#1FA463">
              lemas bisa membaik
            </text>
            <text textAnchor="middle" y={40} fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#1FA463">
              ✓ setelah ditangani
            </text>
          </g>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// G CARA BENAR F_END – G_END
const G_END = 40.0;
const G: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - F_END;
  const rows: [string, string, number, React.ReactNode][] = [
    ['Makan bergizi', 'seimbang', 35.33, <Plate key="p" x={0} y={0} s={0.42} />],
    ['Tidur cukup', 'tiap malam', 36.77, <Moon key="m" x={0} y={0} s={0.6} />],
    ['Sering lemas?', 'periksa ke dokter', 37.9, <Cross key="c" x={0} y={0} s={0.7} />],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)'}}>
      <Particles seed="g6" n={22} color="#FF9F1C" kind="plus" size={16} opacity={0.35} />
      <Pad>
        <Tag text="CARA YANG BENAR" at={0} color="#1FA463" bg="rgba(31,164,99,0.14)" />
        <div style={{height: 18}} />
        <Words text={'Isi "bensin"\nyang asli'} at={0.1} size={84} color="#0F2E1E" hi={['asli']} hiColor="#1FA463" />
      </Pad>
      <Svg>
        {rows.map(([a, b, at, ic], i) => {
          const p = pop(f, t(at), 30, 12);
          const y = 700 + i * 170;
          return (
            <g key={a} opacity={Math.min(1, p * 1.3)} transform={`translate(${(1 - p) * -60} 0)`}>
              <rect x={90} y={y - 70} width={760} height={140} rx={26} fill="#fff" stroke="#0F2E1E" strokeWidth={4} />
              <g transform={`translate(180 ${y})`}>{ic}</g>
              <text x={290} y={y - 8} fontFamily={theme.title} fontWeight={800} fontSize={42} fill="#0F2E1E">
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

// H WIN G_END – END
const H: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - G_END;
  const crumble = ez(f, 0.2, 1.2);
  const follow = pop(f, t(41.5), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)'}}>
      <Particles seed="h6" n={34} color="#FFF4DE" kind="star" size={16} opacity={0.7} />
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
          <Bottle x={lerp(800, 900, crumble)} y={lerp(1180, 1250, crumble)} s={0.3} rot={crumble * 160} evil />
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
  [C_END, D_END, D, '#2A1405', [80, 30], false],
  [D_END, E_END, E, '#FFC21A', [20, 50], false],
  [E_END, F_END, F, '#1A1240', [80, 30], false],
  [F_END, G_END, G, '#0F2E1E', [20, 40], false],
  [G_END, END, H, '#1A1714', [50, 50], false],
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
        <div style={{fontFamily: theme.mono, fontSize: 28, color: col, opacity: 0.75, letterSpacing: '0.1em'}}>SALAH KAPRAH · EP 06</div>
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

export const Ep6: React.FC = () => (
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
      <Audio src={staticFile('ep6/hx_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(N0 * FPS)}>
      <Audio src={staticFile('ep6/nar_f.wav')} />
    </Sequence>
    <Audio src={staticFile('ep6/sfx.wav')} />
  </AbsoluteFill>
);

export const Ep6Comp: React.FC = () => <Composition id="Ep6" component={Ep6} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />;
