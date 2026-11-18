import React from 'react';
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, random} from 'remotion';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, Caption} from '@remotion/captions';
import {theme} from './theme';
import {pop, lerp} from './util';
import {Particles, Tag, Words, Rings, ez} from './kit';
import {Vimi} from './Mascot';
import {Hoaksin, HX} from './Villain';
import {Viro, Imu, OmForward} from './Cast';
import words from './ep2_words.json';

const FPS = 30;
const END = 45.2;
const TR = 12;
const V0 = 5.35;
const N0 = 11.0;
const n = (t: number) => N0 + t / 1.12; // narrator local -> global

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

// A LAIR: Hoaksin 0 – 5.35
const A: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 3.3 * 30 && f < 3.8 * 30 ? Math.sin(f * 3) * 10 : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #1E3B1E 0%, #0E1A0E 55%, #050805 100%)', translate: `${shake}px 0px`}}>
      <Particles seed="a2" n={40} color={HX.spore} kind="dot" size={10} opacity={0.5} speed={0.5} />
      <Lair tint="#B7F03C" flashAt={[3.35]} />
      {/* monitor showing Om Forward */}
      <Svg>
        <g transform={`translate(760 780) scale(${pop(f, 0.8, 30, 14)})`}>
          <rect x={-190} y={-150} width={380} height={300} rx={18} fill="#0A1A0A" stroke="#B7F03C" strokeWidth={6} />
          <rect x={-170} y={-130} width={340} height={260} fill="#132813" />
          <clipPath id="mon">
            <rect x={-170} y={-130} width={340} height={260} />
          </clipPath>
          <g clipPath="url(#mon)">
            <OmForward x={-40} y={-10} s={0.75} />
            {/* pile of pills */}
            {Array.from({length: 7}).map((_, i) => (
              <ellipse key={i} cx={80 + (i % 3) * 22} cy={90 - Math.floor(i / 3) * 14} rx={14} ry={7} fill="#FF9F1C" stroke="#000" strokeWidth={2} />
            ))}
            {Array.from({length: 26}).map((_, i) => (
              <rect key={i} x={-170} y={-130 + i * 10} width={340} height={2} fill="#B7F03C" opacity={0.08} />
            ))}
          </g>
          <circle cx={150} cy={-115} r={8} fill="#FF2E4D" opacity={f % 30 < 15 ? 1 : 0.2} />
          <text x={-160} y={-112} fontFamily={theme.mono} fontSize={20} fill="#B7F03C">
            TARGET: WARGA
          </text>
        </g>
        <Hoaksin x={340} y={1060} s={1.45} mood="menace" megaphone={false} armL={140} />
      </Svg>
      <Pad>
        <Tag text="SALAH KAPRAH #2" at={0} color={HX.spore} bg="rgba(183,240,60,0.14)" />
        <div style={{height: 26}} />
        <Glitch text={'VIT C 1000 mg\n= KEBAL FLU'} size={84} color={HX.spore} at={1.0} />
      </Pad>
    </AbsoluteFill>
  );
};

// B VIRO 5.35 – 11.0
const B: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - V0;
  const rise = ez(f, 0, 1.2);
  const swarm = ez(f, t(9.6), t(10.9));
  const shake = f > t(8.4) * 30 && f < t(9.3) * 30 ? Math.sin(f * 2.6) * 12 : swarm > 0 ? Math.sin(f * 3) * 8 * swarm : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #4A0E14 0%, #230609 60%, #0A0203 100%)', translate: `${shake}px ${shake * 0.4}px`}}>
      <Particles seed="b2" n={36} color="#FF2E4D" kind="dot" size={10} opacity={0.4} />
      <Lair tint="#FF2E4D" flashAt={[t(9.0)]} local={0} />
      {/* alarm sweep */}
      <AbsoluteFill style={{background: '#FF2E4D', opacity: (Math.sin(f / 5) * 0.5 + 0.5) * 0.08}} />
      <Svg>
        <Viro x={540} y={lerp(1400, 900, rise)} s={lerp(1.0, 2.6, rise)} menace />
        {Array.from({length: 10}).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const r = lerp(0, 430 + (i % 3) * 60, swarm);
          return <Viro key={i} x={540 + Math.cos(a) * r} y={900 + Math.sin(a) * r * 1.3} s={0.45 * swarm} menace />;
        })}
      </Svg>
      <Pad>
        <Glitch text={'VIRO\nSIAP MENYERANG'} size={88} color="#FF6B7F" at={0.3} />
      </Pad>
    </AbsoluteFill>
  );
};

// C STOP + Cochrane 11.0 – n(6.92)
const C: React.FC = () => {
  const f = useCurrentFrame();
  const t = (g: number) => g - N0;
  const fly = ez(f, 0, 0.45);
  const stamp = pop(f, 0.45, 30, 8);
  const card = pop(f, t(n(2.04)), 30, 12);
  const trials = Math.round(interpolate(f, [t(n(3.06)) * 30, t(n(3.06)) * 30 + 20], [0, 29], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const ppl = Math.round(interpolate(f, [t(n(5.56)) * 30, t(n(5.56)) * 30 + 22], [0, 11306], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #1C7C94 0%, #0F5E73 55%, #083845 100%)'}}>
      <Particles seed="c2" n={30} color="#FFC21A" kind="star" size={12} opacity={0.5} />
      <Rings cx={540} cy={900} r={330} color="#FFC21A" o={0.18} />
      <Svg>
        {/* shockwave */}
        {fly > 0.9 && <circle cx={300} cy={980} r={(f - 13) * 40} fill="none" stroke="#FFC21A" strokeWidth={10} opacity={Math.max(0, 1 - (f - 13) / 18)} />}
        <Vimi x={lerp(-200, 300, fly)} y={lerp(1500, 980, fly)} s={1.3} fly={fly < 1} tilt={fly < 1 ? 28 : 0} mood={fly < 1 ? 'wow' : 'smug'} armR={fly < 1 ? 175 : 100} armL={35} glow={1} />
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', scale: `${stamp}`, rotate: `${-5 + (1 - stamp) * 20}deg`}}>
        <span style={{display: 'inline-block', background: '#E23E57', color: '#fff', fontFamily: theme.title, fontWeight: 800, fontSize: 80, padding: '10px 34px', borderRadius: 20, boxShadow: '0 12px 0 #8E1B30', letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>STOP! SALAH KAPRAH!</span>
      </div>
      {/* evidence card */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 560,
          width: 470,
          background: '#FFF4DE',
          borderRadius: 30,
          padding: 30,
          scale: `${card}`,
          rotate: `${(1 - card) * 10 + 3}deg`,
          boxShadow: '0 16px 0 rgba(0,0,0,0.3)',
        }}
      >
        <div style={{fontFamily: theme.mono, fontSize: 24, color: '#0F5E73', letterSpacing: '0.12em'}}>TINJAUAN COCHRANE</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 12}}>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 110, color: '#1A1714', fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{trials}</div>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 38, color: '#1A1714'}}>uji klinis</div>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8}}>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 80, color: '#0F5E73', fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{ppl.toLocaleString('id-ID')}</div>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 34, color: '#0F5E73'}}>orang</div>
        </div>
        {/* little people icons */}
        <svg width={410} height={60} style={{marginTop: 10}}>
          {Array.from({length: 14}).map((_, i) => (
            <g key={i} opacity={i < (ppl / 11306) * 14 ? 1 : 0.15} transform={`translate(${14 + i * 29} 8)`}>
              <circle cx={0} cy={8} r={8} fill="#1A1714" />
              <rect x={-9} y={18} width={18} height={26} rx={9} fill="#1A1714" />
            </g>
          ))}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// D RESULT n(6.92) – n(16.26)
const D: React.FC = () => {
  const f = useCurrentFrame();
  const S = n(6.92);
  const t = (g: number) => g - S;
  const bars = ez(f, t(n(8.14)), t(n(9.9)));
  const same = pop(f, t(n(9.9)), 30, 10);
  const dur = ez(f, t(n(11.96)), t(n(14.6)));
  const BarH = 380;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #F4F1FF 0%, #DCD6F7 70%, #C5BCF0 100%)'}}>
      <Particles seed="d2" n={18} color="#6B5FB3" kind="plus" size={16} opacity={0.25} />
      <Pad>
        <Tag text="HASILNYA" at={0} color="#4A3AA8" bg="rgba(74,58,168,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Risiko kena flu?\nSama saja.'} at={0.1} size={88} color="#1A1240" hi={['Sama', 'saja.']} hiColor="#E23E57" />
      </Pad>
      <Svg>
        {/* incidence bars */}
        {[
          ['Placebo', '#9A93C9', 0],
          ['Vit C rutin', '#FF9F1C', 1],
        ].map(([lab, col, i]) => {
          const x = 150 + Number(i) * 230;
          const h = BarH * 0.6 * bars;
          return (
            <g key={String(lab)}>
              <rect x={x} y={1150 - h} width={170} height={h} rx={16} fill={String(col)} stroke="#1A1240" strokeWidth={5} />
              <text x={x + 85} y={1200} textAnchor="middle" fontFamily={theme.mono} fontSize={26} fill="#1A1240">
                {String(lab)}
              </text>
            </g>
          );
        })}
        <text x={380} y={720} textAnchor="middle" fontFamily={theme.mono} fontSize={26} fill="#4A3AA8" opacity={bars}>
          RISIKO KENA FLU
        </text>
        <g transform={`translate(380 870) scale(${same}) rotate(-6)`}>
          <rect x={-90} y={-40} width={180} height={80} rx={20} fill="#E23E57" />
          <text y={16} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={48} fill="#fff">
            =
          </text>
        </g>
        {/* duration card */}
        <g transform={`translate(800 ${lerp(1250, 900, ez(f, t(n(10.8)), t(n(11.5))))})`} opacity={ez(f, t(n(10.8)), t(n(11.3)))}>
          <rect x={-170} y={-240} width={340} height={430} rx={30} fill="#fff" stroke="#1A1240" strokeWidth={5} />
          <text y={-190} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#4A3AA8">
            LAMA FLU (DEWASA)
          </text>
          {/* 7 day bar shrinking 8% */}
          <rect x={-130} y={-140} width={260} height={50} rx={12} fill="#DCD6F7" />
          <rect x={-130} y={-140} width={260 * (1 - 0.08 * dur)} height={50} rx={12} fill="#FF9F1C" />
          <text y={-20} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={110} fill="#1A1240">
            -{Math.round(8 * dur)}%
          </text>
          <text y={50} textAnchor="middle" fontFamily={theme.title} fontWeight={700} fontSize={34} fill="#4A3AA8">
            ≈ setengah hari
          </text>
          <text y={95} textAnchor="middle" fontFamily={theme.title} fontWeight={700} fontSize={34} fill="#4A3AA8">
            lebih singkat
          </text>
          <text y={160} textAnchor="middle" fontFamily={theme.mono} fontSize={20} fill="#6B5FB3">
            (dari ~7 hari)
          </text>
        </g>
        {/* Viro peeking smug */}
        <g opacity={0.95}>
          <Viro x={900} y={1220 + Math.sin(f / 10) * 8} s={0.5} menace />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// E ABSORPTION n(16.26) – n(23.3)
const E: React.FC = () => {
  const f = useCurrentFrame();
  const S = n(16.26);
  const t = (g: number) => g - S;
  const pour = ez(f, t(n(17.5)), t(n(19.4)));
  const gauge = lerp(0.9, 0.45, ez(f, t(n(18.92)), t(n(20.6))));
  const flush = ez(f, t(n(21.14)), t(n(22.6)));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #FFF8E8 0%, #FFE9BF 70%, #FFD98A 100%)'}}>
      <Particles seed="e2" n={16} color="#F5B21E" kind="cap" size={20} opacity={0.3} />
      <Pad>
        <Tag text="DOSIS SUPER TINGGI" at={0} color="#C2410C" bg="rgba(194,65,12,0.12)" />
        <div style={{height: 18}} />
        <Words text={'Diserap?\nKurang dari separuh.'} at={0.1} size={84} color="#3A2400" hi={['separuh.']} hiColor="#C2410C" />
      </Pad>
      <Svg>
        {/* falling pills into body funnel */}
        {Array.from({length: 14}).map((_, i) => {
          const p = Math.max(0, Math.min(1, pour * 1.8 - i * 0.06));
          return <ellipse key={i} cx={360 + (i % 5) * 18 - 36} cy={lerp(560, 900, p) - (i % 3) * 10} rx={20} ry={10} fill="#FF9F1C" stroke="#3A2400" strokeWidth={3} opacity={p > 0 && p < 1 ? 1 : p >= 1 ? 0 : 0} transform={`rotate(${i * 30 + f * 3} ${360 + (i % 5) * 18 - 36} ${lerp(560, 900, p)})`} />;
        })}
        {/* funnel/stomach */}
        <path d="M200 860 L520 860 L420 1060 L300 1060 Z" fill="#fff" stroke="#3A2400" strokeWidth={6} strokeLinejoin="round" />
        <text x={360} y={960} textAnchor="middle" fontFamily={theme.mono} fontSize={26} fill="#3A2400">
          USUS
        </text>
        {/* gauge */}
        <g transform="translate(760 760)">
          <rect x={-70} y={0} width={140} height={400} rx={30} fill="#fff" stroke="#3A2400" strokeWidth={6} />
          <rect x={-56} y={14 + 372 * (1 - gauge)} width={112} height={372 * gauge} rx={20} fill={gauge < 0.5 ? '#E23E57' : '#1FA463'} />
          <line x1={-90} y1={14 + 372 * 0.5} x2={90} y2={14 + 372 * 0.5} stroke="#3A2400" strokeWidth={4} strokeDasharray="10 8" />
          <text x={100} y={14 + 372 * 0.5 + 10} fontFamily={theme.mono} fontSize={24} fill="#3A2400">
            50%
          </text>
          <text y={-24} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={56} fill="#3A2400">
            {Math.round(gauge * 100)}%
          </text>
          <text y={450} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#3A2400">
            DISERAP
          </text>
        </g>
        {/* flush: excess to urine flask */}
        <g opacity={flush}>
          <path d={`M360 1060 Q360 ${1120} ${lerp(360, 560, flush)} 1150`} stroke="#F2D43D" strokeWidth={18} fill="none" strokeLinecap="round" />
          <g transform="translate(560 1110)">
            <path d="M-50 -40 L50 -40 L64 70 Q0 96 -64 70 Z" fill="#FFF7C2" stroke="#3A2400" strokeWidth={5} />
            <rect x={-56} y={20 - 50 * flush} width={112} height={50 * flush + 40} fill="#F2D43D" opacity={0.8} />
            <text y={130} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={32} fill="#3A2400">
              dibuang
            </text>
          </g>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// F WARNING n(23.3) – n(28.62)
const F: React.FC = () => {
  const f = useCurrentFrame();
  const S = n(23.3);
  const t = (g: number) => g - S;
  const lim = Math.round(interpolate(f, [5, 30], [0, 2000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const c1 = pop(f, t(n(25.68)), 30, 11);
  const c2 = pop(f, t(n(26.98)), 30, 11);
  const blink = Math.sin(f / 4) * 0.5 + 0.5;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #3A0D12 0%, #1F0609 70%, #0A0203 100%)'}}>
      <AbsoluteFill style={{background: '#FF2E4D', opacity: blink * 0.07}} />
      <Particles seed="f2" n={20} color="#FF6B7F" kind="dot" size={8} opacity={0.4} />
      <Pad>
        <Tag text="AWAS BERLEBIHAN" at={0} color="#FF6B7F" bg="rgba(255,46,77,0.15)" />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 20}}>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 60, color: '#FFE0E5'}}>&gt;</div>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 170, color: '#FF2E4D', letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{lim.toLocaleString('id-ID')}</div>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 54, color: '#FFE0E5'}}>mg/hari</div>
        </div>
      </Pad>
      <Svg>
        {/* diare card */}
        <g transform={`translate(300 900) scale(${c1}) rotate(-3)`}>
          <rect x={-200} y={-170} width={400} height={340} rx={30} fill="#FFF4DE" stroke="#000" strokeWidth={6} />
          <g transform="translate(0 -40)">
            <path d="M-70 -50 Q-90 40 -20 70 Q60 90 80 20 Q90 -60 20 -70 Q-40 -75 -70 -50 Z" fill="#F4A3A8" stroke="#000" strokeWidth={5} />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${-40 + i * 30} -20 q 10 ${15 + Math.sin(f / 3 + i) * 6} 0 30`} stroke="#000" strokeWidth={4} fill="none" />
            ))}
            <path d="M-110 -40 l20 10 M-115 0 l22 0 M-110 40 l20 -10" stroke="#E23E57" strokeWidth={6} strokeLinecap="round" />
          </g>
          <text y={120} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={48} fill="#1A1714">
            Diare
          </text>
        </g>
        {/* kidney stone card */}
        <g transform={`translate(780 900) scale(${c2}) rotate(3)`}>
          <rect x={-200} y={-170} width={400} height={340} rx={30} fill="#FFF4DE" stroke="#000" strokeWidth={6} />
          <g transform="translate(0 -40)">
            <path d="M-20 -80 Q-90 -80 -90 0 Q-90 80 -20 80 Q20 80 20 40 Q-10 20 -10 0 Q-10 -20 20 -40 Q20 -80 -20 -80 Z" fill="#C94F6D" stroke="#000" strokeWidth={5} />
            <g transform={`translate(-40 10) rotate(${f * 4})`}>
              <polygon points="0,-18 16,-6 12,14 -10,16 -18,-4" fill="#9E9E9E" stroke="#000" strokeWidth={3} />
            </g>
          </g>
          <text y={110} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={42} fill="#1A1714">
            Batu ginjal
          </text>
          <text y={145} textAnchor="middle" fontFamily={theme.mono} fontSize={20} fill="#6B6158">
            (bila ada riwayat)
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// G DEFENSE n(28.62) – n(34.14)
const G: React.FC = () => {
  const f = useCurrentFrame();
  const S = n(28.62);
  const t = (g: number) => g - S;
  const block = ez(f, 0.2, 0.8);
  const dis = ez(f, t(n(33.4)), t(n(34.1)));
  const items: [string, number, React.ReactNode][] = [
    [
      'Tidur cukup',
      n(30.12),
      <g key="m">
        <path d="M10 -30 A34 34 0 1 0 30 26 A26 26 0 1 1 10 -30 Z" fill="#FFC21A" stroke="#1A1714" strokeWidth={4} />
        <text x={30} y={-20} fontFamily={theme.title} fontWeight={800} fontSize={22} fill="#1A1714">
          z
        </text>
      </g>,
    ],
    [
      'Cuci tangan',
      n(31.12),
      <g key="h">
        <rect x={-30} y={-20} width={60} height={46} rx={20} fill="#E8B48C" stroke="#1A1714" strokeWidth={4} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-24 + i * 22} cy={-30 - ((f + i * 10) % 30)} r={8} fill="#BDE6FF" stroke="#1A1714" strokeWidth={2} opacity={1 - ((f + i * 10) % 30) / 30} />
        ))}
      </g>,
    ],
    [
      'Buah & sayur',
      n(32.3),
      <g key="b">
        <circle cx={-14} cy={4} r={24} fill="#FF9F1C" stroke="#1A1714" strokeWidth={4} />
        <circle cx={20} cy={-6} r={14} fill="#3FA34D" stroke="#1A1714" strokeWidth={4} />
        <circle cx={30} cy={10} r={12} fill="#3FA34D" stroke="#1A1714" strokeWidth={4} />
        <rect x={20} y={10} width={8} height={24} fill="#3FA34D" stroke="#1A1714" strokeWidth={3} />
      </g>,
    ],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)'}}>
      <Particles seed="g2" n={22} color="#1FA463" kind="plus" size={16} opacity={0.3} />
      <Pad>
        <Tag text="PERTAHANAN TERBAIK" at={0} color="#1FA463" bg="rgba(31,164,99,0.14)" />
      </Pad>
      <Svg>
        <Imu x={300} y={700} s={1.15} />
        {/* shield beam */}
        <path d={`M400 700 L${lerp(400, 820, block)} ${lerp(700, 640, block)}`} stroke="#5DA9FF" strokeWidth={22} strokeLinecap="round" opacity={0.6} />
        <Viro x={lerp(1100, 830, block)} y={630} s={0.8} menace dissolve={dis} />
        {dis > 0 &&
          Array.from({length: 18}).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <circle key={i} cx={830 + Math.cos(a) * 260 * dis} cy={630 + Math.sin(a) * 260 * dis} r={10 * (1 - dis)} fill="#E07A5F" />;
          })}
        {items.map(([lab, at, icon], i) => {
          const p = pop(f, t(at), 30, 12);
          const y = 960 + i * 120;
          return (
            <g key={lab} transform={`translate(${lerp(-400, 0, p)} 0)`} opacity={Math.min(1, p * 1.5)}>
              <rect x={100} y={y - 50} width={640} height={100} rx={50} fill="#fff" stroke="#0F2E1E" strokeWidth={4} />
              <g transform={`translate(170 ${y})`}>{icon}</g>
              <text x={240} y={y + 16} fontFamily={theme.title} fontWeight={800} fontSize={46} fill="#0F2E1E">
                {lab}
              </text>
            </g>
          );
        })}
      </Svg>
    </AbsoluteFill>
  );
};

// H WIN n(34.14) – END
const H: React.FC = () => {
  const f = useCurrentFrame();
  const S = n(34.14);
  const t = (g: number) => g - S;
  const crumble = ez(f, 0.2, 1.2);
  const follow = pop(f, t(n(35.46)), 30, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)'}}>
      <Particles seed="h2" n={34} color="#FFF4DE" kind="star" size={16} opacity={0.7} />
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
        <Vimi x={330} y={840} s={1.25} mood="wink" armR={150} thumbR armL={35} glow={1} />
        <Imu x={600} y={900} s={0.7} />
        <Hoaksin x={lerp(860, 930, crumble)} y={lerp(1000, 1130, crumble)} s={0.9} mood="dizzy" megaphone={false} tilt={lerp(0, 75, crumble)} armL={10} />
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
  [V0, N0, B, '#FF6B7F', [50, 55], true],
  [N0, n(6.92), C, '#FFF4DE', [20, 70], false],
  [n(6.92), n(16.26), D, '#1A1240', [80, 30], false],
  [n(16.26), n(23.3), E, '#3A2400', [50, 50], false],
  [n(23.3), n(28.62), F, '#FFE0E5', [50, 20], false],
  [n(28.62), n(34.14), G, '#0F2E1E', [20, 40], false],
  [n(34.14), END, H, '#1A1714', [50, 50], false],
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
        <div style={{fontFamily: theme.mono, fontSize: 28, color: col, opacity: 0.75, letterSpacing: '0.1em'}}>SALAH KAPRAH · EP 02</div>
      </div>
      <div style={{position: 'absolute', top: 210, left: 96, right: 120, height: 6, borderRadius: 3, background: col, opacity: 0.25}} />
      <div style={{position: 'absolute', top: 210, left: 96, width: `${(f / durationInFrames) * (1080 - 216)}px`, height: 6, borderRadius: 3, background: col}} />
    </AbsoluteFill>
  );
};

type W = {w: string; s: number; e: number; who: string};
const ws = words as W[];
const caps: Caption[] = ws.map((x, i) => ({text: (i === 0 ? '' : ' ') + x.w, startMs: x.s * 1000, endMs: Math.min(x.e + 0.05, END) * 1000, timestampMs: x.s * 1000, confidence: 1}));
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 700});

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const ms = (f / FPS) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;
  const who = ms < V0 * 1000 ? 'hx' : ms < N0 * 1000 ? 'viro' : 'n';
  const st = {hx: {bg: '#0E1A0E', bd: HX.spore, act: HX.spore}, viro: {bg: '#2A0609', bd: '#FF2E4D', act: '#FF6B7F'}, n: {bg: '#111', bd: 'transparent', act: '#FFC21A'}}[who];
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

export const Ep2: React.FC = () => (
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
      <Audio src={staticFile('ep2/hx_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(V0 * FPS)}>
      <Audio src={staticFile('ep2/viro_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(N0 * FPS)}>
      <Audio src={staticFile('ep2/nar_f.wav')} />
    </Sequence>
    <Audio src={staticFile('ep2/sfx.wav')} />
  </AbsoluteFill>
);

export const Ep2Comp: React.FC = () => <Composition id="Ep2" component={Ep2} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />;
