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
import words from './ep4_words.json';

const FPS = 30;
const END = 40.0;
const TR = 12;
const V0 = 6.45;
const N0 = 12.9;

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
const Leaf: React.FC<{x: number; y: number; s?: number; rot?: number; dark?: boolean}> = ({x, y, s = 1, rot = 0, dark = false}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 90 C -70 40 -80 -60 0 -120 C 80 -60 70 40 0 90 Z" fill={dark ? '#1E5B2A' : '#2FA34A'} stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <path d="M0 110 L0 -100" stroke={dark ? '#0F3A18' : '#9BE3A8'} strokeWidth={6} strokeLinecap="round" />
    {[-60, -20, 20].map((yy) => (
      <g key={yy}>
        <path d={`M0 ${yy} L-38 ${yy - 30}`} stroke={dark ? '#0F3A18' : '#9BE3A8'} strokeWidth={4} strokeLinecap="round" />
        <path d={`M0 ${yy} L38 ${yy - 30}`} stroke={dark ? '#0F3A18' : '#9BE3A8'} strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
  </g>
);

const Bowl: React.FC<{x: number; y: number; s?: number; glow?: string}> = ({x, y, s = 1, glow}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow && <ellipse cx={0} cy={-40} rx={200} ry={120} fill={glow} opacity={0.18} />}
    <Leaf x={-70} y={-70} s={0.7} rot={-30} dark />
    <Leaf x={60} y={-80} s={0.75} rot={25} dark />
    <Leaf x={0} y={-100} s={0.8} rot={0} dark />
    <path d="M-160 -30 L160 -30 Q150 110 0 120 Q-150 110 -160 -30 Z" fill="#5A3C7A" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <rect x={-170} y={-44} width={340} height={26} rx={13} fill="#7C55A8" stroke="#1A1714" strokeWidth={6} />
  </g>
);

const Fe: React.FC<{x: number; y: number; r?: number; o?: number; col?: string}> = ({x, y, r = 26, o = 1, col = '#B5452F'}) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} fill={col} stroke="#1A1714" strokeWidth={4} />
    <text x={x} y={y + r * 0.34} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={r * 0.85} fill="#fff">
      Fe
    </text>
  </g>
);

const Steak: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 -40 Q-40 -80 40 -60 Q100 -40 90 20 Q70 70 -10 60 Q-90 50 -80 -40 Z" fill="#C2413A" stroke="#1A1714" strokeWidth={6} />
    <path d="M-50 -30 Q0 -50 50 -30" stroke="#F4C7B8" strokeWidth={8} fill="none" strokeLinecap="round" />
    <circle cx={30} cy={10} r={14} fill="#F4E3D7" stroke="#1A1714" strokeWidth={4} />
  </g>
);
const Liver: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 -10 Q-80 -60 0 -55 Q90 -50 90 -10 Q80 40 10 55 Q-60 50 -90 -10 Z" fill="#7B2A2A" stroke="#1A1714" strokeWidth={6} />
    <path d="M0 -50 Q-10 0 10 50" stroke="#4D1414" strokeWidth={6} fill="none" />
  </g>
);
const Fish: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0 Q-30 -60 50 0 Q-30 60 -90 0 Z" fill="#5FA8D3" stroke="#1A1714" strokeWidth={6} />
    <path d="M50 0 L95 -40 L95 40 Z" fill="#5FA8D3" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
    <circle cx={-55} cy={-8} r={7} fill="#1A1714" />
  </g>
);
const Orange: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={90} fill="#FF9F1C" stroke="#1A1714" strokeWidth={6} />
    {Array.from({length: 8}).map((_, i) => (
      <line key={i} x1={0} y1={0} x2={Math.cos((i / 8) * Math.PI * 2) * 70} y2={Math.sin((i / 8) * Math.PI * 2) * 70} stroke="#FFD08A" strokeWidth={6} />
    ))}
    <circle r={70} fill="none" stroke="#FFD08A" strokeWidth={6} />
  </g>
);

// A LAIR: Hoaksin 0 – V0
const A: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 3.6 * 30 && f < 4.1 * 30 ? Math.sin(f * 3) * 10 : 0;
  const crown = pop(f, 3.2, 30, 10);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2B1640 0%, #160A22 55%, #07030B 100%)', translate: `${shake}px 0px`}}>
      <Particles seed="a4" n={40} color={HX.spore} kind="dot" size={10} opacity={0.5} speed={0.5} />
      <Lair tint="#B7F03C" flashAt={[3.65]} />
      <Svg>
        <g transform="translate(760 900)">
          <circle r={230} fill="#B7F03C" opacity={0.06 + Math.sin(f / 8) * 0.03} />
          <Bowl x={0} y={80} s={1.25} glow="#B7F03C" />
          {/* fake crown */}
          <g transform={`translate(0 ${-130 - crown * 20}) scale(${crown})`}>
            <path d="M-90 40 L-90 -30 L-45 10 L0 -50 L45 10 L90 -30 L90 40 Z" fill="#FFC21A" stroke="#1A1714" strokeWidth={6} strokeLinejoin="round" />
            <text y={30} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={34} fill="#1A1714">
              Fe
            </text>
          </g>
        </g>
        <Hoaksin x={290} y={1080} s={1.4} mood={f > 4.4 * 30 && f < 5.3 * 30 ? 'laugh' : 'menace'} megaphone={false} armL={140} />
      </Svg>
      <Pad>
        <Tag text="SALAH KAPRAH #4" at={0} color={HX.spore} bg="rgba(183,240,60,0.14)" />
        <div style={{height: 26}} />
        <Glitch text={'BAYAM =\nRAJA BESI?'} size={96} color={HX.spore} at={0.8} />
      </Pad>
    </AbsoluteFill>
  );
};

// B CACING LICIK V0 – N0
const B: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - V0;
  const rise = ez(f, 0, 1.2);
  const cross = ez(f, t(8.8), t(9.5));
  const leak = ez(f, t(9.9), t(11.0));
  const weak = ez(f, t(11.3), t(12.4));
  const shake = f > t(11.9) * 30 && f < t(12.4) * 30 ? Math.sin(f * 2.6) * 12 : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #3E0A2A 0%, #1F0515 60%, #0A0207 100%)', translate: `${shake}px ${shake * 0.4}px`}}>
      <Particles seed="b4" n={36} color="#F2A7B5" kind="dot" size={10} opacity={0.35} />
      <Lair tint="#E8899B" flashAt={[t(11.9)]} />
      <AbsoluteFill style={{background: '#FF2E4D', opacity: (Math.sin(f / 6) * 0.5 + 0.5) * 0.06}} />
      <Svg>
        {/* plate: spinach only, lauk crossed out */}
        <g transform="translate(300 900)">
          <ellipse rx={200} ry={70} fill="#F4F1EA" stroke="#1A1714" strokeWidth={6} />
          <Leaf x={-60} y={-30} s={0.5} rot={-60} dark />
          <Leaf x={20} y={-30} s={0.5} rot={50} dark />
          <g transform="translate(110 -200)" opacity={0.4 + 0.6 * (1 - cross * 0.5)}>
            <Steak x={0} y={0} s={0.8} />
            <line x1={-90} y1={-70} x2={lerp(-90, 90, cross)} y2={lerp(-70, 70, cross)} stroke="#FF2E4D" strokeWidth={16} strokeLinecap="round" />
            <line x1={90} y1={-70} x2={lerp(90, -90, cross)} y2={lerp(-70, 70, cross)} stroke="#FF2E4D" strokeWidth={16} strokeLinecap="round" />
          </g>
          {/* Fe slipping past */}
          {Array.from({length: 6}).map((_, i) => (
            <Fe key={i} x={lerp(-40 + i * 25, 120 + i * 90, leak)} y={lerp(-10, 380 + (i % 2) * 40, leak)} r={20} o={1 - leak * 0.8} />
          ))}
        </g>
        {/* blood drop shrinking */}
        <g transform={`translate(290 1220) scale(${lerp(1, 0.55, weak)})`} opacity={ez(f, t(11.2), t(11.5))}>
          <path d="M0 -90 C 40 -30 70 10 70 40 A70 70 0 0 1 -70 40 C -70 10 -40 -30 0 -90 Z" fill={weak > 0.5 ? '#E8899B' : '#C81E3A'} stroke="#1A1714" strokeWidth={6} />
        </g>
        <Cacing x={lerp(760, 720, rise)} y={lerp(1300, 900, rise)} s={lerp(0.8, 1.7, rise)} />
      </Svg>
      <Pad>
        <Glitch text={'TANPA LAUK?\nCUKUP BAYAM!'} size={84} color="#F2A7B5" at={0.3} />
      </Pad>
    </AbsoluteFill>
  );
};

// C STOP + mechanism N0 – 21.0
const C: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - N0;
  const fly = ez(f, 0, 0.45);
  const stamp = pop(f, 0.45, 30, 8);
  const zoom = ez(f, t(14.6), t(15.6));
  const tagNH = pop(f, t(16.8), 30, 12);
  const lock = ez(f, t(18.3), t(19.2));
  const few = ez(f, t(19.8), t(20.6));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #1C7C94 0%, #0F5E73 55%, #083845 100%)'}}>
      <Particles seed="c4" n={30} color="#FFC21A" kind="star" size={12} opacity={0.5} />
      <Rings cx={700} cy={960} r={300} color="#FFC21A" o={0.16} />
      <Svg>
        {fly > 0.9 && <circle cx={240} cy={1050} r={(f - 13) * 40} fill="none" stroke="#FFC21A" strokeWidth={10} opacity={Math.max(0, 1 - (f - 13) / 18)} />}
        <Vimi x={lerp(-200, 230, fly)} y={lerp(1500, 1060, fly)} s={1.0} fly={fly < 1} tilt={fly < 1 ? 28 : 0} mood={fly < 1 ? 'wow' : 'think'} armR={fly < 1 ? 175 : 100} armL={35} glow={1} />
        {/* zoom into spinach leaf */}
        <g transform="translate(700 900)" opacity={zoom}>
          <circle r={250} fill="#E9F7EC" stroke="#1A1714" strokeWidth={6} />
          <Leaf x={0} y={10} s={lerp(0.6, 1.7, zoom)} />
          <text y={-205} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#0F5E73">
            ZOOM: DAUN BAYAM
          </text>
          {Array.from({length: 6}).map((_, i) => {
            const a = (i / 6) * Math.PI * 2 + f / 50;
            const fx = Math.cos(a) * 120;
            const fy = Math.sin(a) * 120 + 10;
            const hx = Math.cos(a) * 260;
            const hy = Math.sin(a) * 260;
            const px = lerp(hx, fx + 30, lock);
            const py = lerp(hy, fy - 10, lock);
            return (
              <g key={i}>
                <Fe x={fx} y={fy} r={26} o={i === 5 ? 1 - few : 1} />
                <g opacity={lock}>
                  <rect x={px - 18} y={py - 18} width={36} height={36} rx={6} fill="#6B5FB3" stroke="#1A1714" strokeWidth={4} transform={`rotate(45 ${px} ${py})`} />
                </g>
                {i === 5 && few > 0 && <Fe x={fx} y={fy + few * 150} r={26} col="#1FA463" o={few} />}
              </g>
            );
          })}
          <g opacity={few} transform="translate(0 300)">
            <rect x={-200} y={-44} width={400} height={76} rx={20} fill="#E23E57" />
            <text y={12} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={42} fill="#fff">
              Terserap sedikit
            </text>
          </g>
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', scale: `${stamp}`, rotate: `${-5 + (1 - stamp) * 20}deg`}}>
        <span style={{display: 'inline-block', background: '#E23E57', color: '#fff', fontFamily: theme.title, fontWeight: 800, fontSize: 80, padding: '10px 34px', borderRadius: 20, boxShadow: '0 12px 0 #8E1B30', letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>STOP! SALAH KAPRAH!</span>
      </div>
      <div style={{position: 'absolute', left: 90, right: 140, top: 470, display: 'flex', justifyContent: 'center', gap: 20}}>
        <span style={{display: 'inline-block', scale: `${tagNH}`, background: '#FFF4DE', color: '#B5452F', fontFamily: theme.title, fontWeight: 800, fontSize: 48, padding: '8px 26px', borderRadius: 999, boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>Besi non-heme</span>
        <span style={{display: 'inline-block', scale: `${pop(f, t(18.4), 30, 12)}`, background: '#6B5FB3', color: '#fff', fontFamily: theme.title, fontWeight: 800, fontSize: 48, padding: '8px 26px', borderRadius: 999, boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>+ penghambat</span>
      </div>
    </AbsoluteFill>
  );
};

// D HEME vs NABATI 21.0 – 29.5
const D: React.FC = () => {
  const f = useCurrentFrame();
  const S = 21.0;
  const t = (g: number) => g - S;
  const b1 = ez(f, t(23.5), t(25.0));
  const b2 = ez(f, t(26.4), t(27.6));
  const BarH = 520;
  const foods: [number, React.ReactNode, string][] = [
    [21.84, <Steak key="s" x={0} y={0} s={0.7} />, 'Daging'],
    [22.58, <Liver key="l" x={0} y={0} s={0.7} />, 'Hati'],
    [23.06, <Fish key="f" x={0} y={0} s={0.75} />, 'Ikan'],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #F4F1FF 0%, #DCD6F7 70%, #C5BCF0 100%)'}}>
      <Particles seed="d4" n={18} color="#6B5FB3" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="NIH ODS · PISKIN DKK. 2022" at={0} color="#4A3AA8" bg="rgba(74,58,168,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Besi yang\nterserap'} at={0.1} size={88} color="#1A1240" hi={['terserap']} hiColor="#E23E57" />
      </Pad>
      <Svg>
        {foods.map(([at, icon, lab], i) => {
          const p = pop(f, t(at), 30, 11);
          return (
            <g key={lab} transform={`translate(${640 + (i % 2) * 190} ${560 + i * 120}) scale(${p})`}>
              <circle r={78} fill="#fff" stroke="#1A1240" strokeWidth={5} />
              {icon}
              <text x={0} y={112} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={30} fill="#1A1240">
                {lab}
              </text>
            </g>
          );
        })}
        {/* bars */}
        {[
          ['Heme', '#C2413A', b1, '15–35%', 0.7],
          ['Nabati', '#2FA34A', b2, '<10%', 0.2],
        ].map(([lab, col, k, val, hk], i) => {
          const x = 150 + i * 300;
          const h = BarH * Number(hk) * Number(k);
          return (
            <g key={String(lab)}>
              <rect x={x} y={1260 - h} width={200} height={h} rx={18} fill={String(col)} stroke="#1A1240" strokeWidth={5} />
              <text x={x + 100} y={1250 - h - 20} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={60} fill={String(col)} opacity={Number(k)}>
                {String(val)}
              </text>
              <text x={x + 100} y={1305} textAnchor="middle" fontFamily={theme.mono} fontSize={30} fill="#1A1240">
                {String(lab)}
              </text>
            </g>
          );
        })}
        <line x1={110} y1={1262} x2={720} y2={1262} stroke="#1A1240" strokeWidth={5} />
        <g transform={`translate(840 1080) scale(${pop(f, t(27.0), 30, 10)})`}>
          <Leaf x={0} y={0} s={0.9} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// E CARA BENAR 29.5 – 35.6
const E: React.FC = () => {
  const f = useCurrentFrame();
  const S = 29.5;
  const t = (g: number) => g - S;
  const plus1 = pop(f, t(31.8), 30, 11);
  const plus2 = pop(f, t(33.3), 30, 11);
  const boost = ez(f, t(34.4), t(35.2));
  const gauge = lerp(0.3, 0.82, boost);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)'}}>
      <Particles seed="e4" n={22} color="#FF9F1C" kind="plus" size={16} opacity={0.35} />
      <Pad>
        <Tag text="CARA YANG BENAR" at={0} color="#1FA463" bg="rgba(31,164,99,0.14)" />
        <div style={{height: 18}} />
        <Words text={'Bayam tetap\nsehat, kok!'} at={0.1} size={84} color="#0F2E1E" hi={['sehat,']} hiColor="#1FA463" />
      </Pad>
      <Svg>
        <Bowl x={200} y={820} s={0.7} />
        <text x={350} y={830} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={80} fill="#0F2E1E" opacity={plus1}>
          +
        </text>
        <g transform={`translate(470 790) scale(${plus1})`}>
          <circle r={88} fill="#fff" stroke="#0F2E1E" strokeWidth={5} />
          <Fish x={0} y={0} s={0.7} />
          <text y={130} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={34} fill="#0F2E1E">
            Lauk hewani
          </text>
        </g>
        <text x={610} y={830} textAnchor="middle" fontFamily={theme.mono} fontSize={34} fill="#0F2E1E" opacity={plus2}>
          atau
        </text>
        <g transform={`translate(760 790) scale(${plus2})`}>
          <Orange x={0} y={0} s={0.85} />
          <text y={130} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={34} fill="#C2410C">
            Vitamin C
          </text>
        </g>
        <Eri x={330} y={lerp(1180, 1110, boost)} s={0.8} />
        <g transform="translate(700 1000)">
          <rect x={0} y={0} width={220} height={60} rx={30} fill="#fff" stroke="#0F2E1E" strokeWidth={5} />
          <rect x={8} y={8} width={204 * gauge} height={44} rx={22} fill={gauge > 0.55 ? '#1FA463' : '#E23E57'} />
          <text x={110} y={100} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#0F2E1E">
            SERAPAN ↑
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// F WIN 35.6 – END
const F: React.FC = () => {
  const f = useCurrentFrame();
  const S = 35.6;
  const t = (g: number) => g - S;
  const crumble = ez(f, 0.2, 1.2);
  const follow = pop(f, t(36.9), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)'}}>
      <Particles seed="f4" n={34} color="#FFF4DE" kind="star" size={16} opacity={0.7} />
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
  [N0, 21.0, C, '#FFF4DE', [20, 70], false],
  [21.0, 29.5, D, '#1A1240', [80, 30], false],
  [29.5, 35.6, E, '#0F2E1E', [20, 40], false],
  [35.6, END, F, '#1A1714', [50, 50], false],
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
        <div style={{fontFamily: theme.mono, fontSize: 28, color: col, opacity: 0.75, letterSpacing: '0.1em'}}>SALAH KAPRAH · EP 04</div>
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

export const Ep4: React.FC = () => (
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
      <Audio src={staticFile('ep4/hx_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(V0 * FPS)}>
      <Audio src={staticFile('ep4/cac_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(N0 * FPS)}>
      <Audio src={staticFile('ep4/nar_f.wav')} />
    </Sequence>
    <Audio src={staticFile('ep4/sfx.wav')} />
  </AbsoluteFill>
);

export const Ep4Comp: React.FC = () => <Composition id="Ep4" component={Ep4} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />;
