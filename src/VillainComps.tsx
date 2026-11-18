import React from 'react';
import {AbsoluteFill, Composition, useCurrentFrame, interpolate, spring} from 'remotion';
import {theme} from './theme';
import {Hoaksin, HxMood, HX, MythSpore} from './Villain';
import {Vimi} from './Mascot';
import {Particles} from './kit';

const Sheet: React.FC = () => {
  const moods: [HxMood, string, Partial<React.ComponentProps<typeof Hoaksin>>][] = [
    ['smug', 'licik', {megaphone: false, armL: 60}],
    ['laugh', 'ketawa jahat', {megaphone: false, armL: 150}],
    ['angry', 'marah', {megaphone: false, armL: 120}],
    ['shock', 'kaget', {megaphone: false, armL: 160}],
    ['dizzy', 'kalah', {megaphone: false, armL: 10, tilt: -12}],
    ['laugh', 'sebar mitos', {shout: 1}],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #3A1A4D 0%, #24102F 70%, #170A1F 100%)'}}>
      <Particles seed="hxs" n={40} color={HX.spore} kind="dot" size={12} opacity={0.35} speed={0.4} />
      <div style={{position: 'absolute', left: 90, top: 80}}>
        <div style={{fontFamily: theme.mono, fontSize: 30, letterSpacing: '0.2em', color: HX.spore}}>VILLAIN · VITAMIEN.IO</div>
        <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 100, letterSpacing: '-0.04em', color: '#F3E9FF', lineHeight: 1}}>
          Awas, <span style={{color: HX.spore}}>Hoaksin</span>
        </div>
        <div style={{fontFamily: theme.title, fontWeight: 700, fontSize: 38, color: '#C9B6DA', marginTop: 14, width: 760}}>
          Jamur licik penyebar spora mitos kesehatan.
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <Hoaksin x={470} y={720} s={1.25} mood="laugh" shout={1} armL={120} />
        <MythSpore x={760} y={420} text="MITOS!" s={0.8} />
        <g fontFamily={theme.mono} fontSize={24} fill="#C9B6DA">
          <text x={90} y={1000}>payung bertotol = pabrik spora · megafon = penyebar hoaks</text>
        </g>
        {moods.map(([m, label, extra], i) => {
          const cx = 1080 + (i % 3) * 270;
          const cy = 330 + Math.floor(i / 3) * 400;
          return (
            <g key={i}>
              <rect x={cx - 120} y={cy - 220} width={240} height={395} rx={28} fill="#fff" opacity={0.08} />
              <Hoaksin x={cx - (extra.megaphone === false ? 0 : 30)} y={cy - 20} s={0.62} mood={m} {...extra} />
              <text x={cx} y={cy + 160} textAnchor="middle" fontFamily={theme.mono} fontSize={22} fill="#F3E9FF" letterSpacing={2}>
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const VS: React.FC = () => {
  const f = useCurrentFrame();
  const fps = 30;
  const left = spring({frame: f - 4, fps, config: {damping: 12}});
  const right = spring({frame: f - 14, fps, config: {damping: 12}});
  const vs = spring({frame: f - 28, fps, config: {damping: 8, stiffness: 180}});
  const shake = f > 28 && f < 40 ? Math.sin(f * 3) * 10 : 0;
  const spores = interpolate(f, [50, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{translate: `${shake}px 0px`}}>
      {/* split background */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="hero" cx="30%" cy="30%">
            <stop offset="0" stopColor="#1C7C94" />
            <stop offset="1" stopColor="#083845" />
          </radialGradient>
          <radialGradient id="vill" cx="70%" cy="70%">
            <stop offset="0" stopColor="#4A1D63" />
            <stop offset="1" stopColor="#170A1F" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#vill)" />
        <path d={`M0 0 L${1080 * left} 0 L${1080 * left} ${420 * left} L0 ${1450 * left} Z`} fill="url(#hero)" />
        <path d="M1180 324 L-100 1546" stroke="#FFC21A" strokeWidth={14 * vs} />
      </svg>
      <Particles seed="vs" n={30} color="#FFC21A" kind="star" size={12} opacity={0.4} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Vimi x={interpolate(left, [0, 1], [-300, 300])} y={640} s={1.55} mood="smug" armR={170} armL={35} glow={1} />
        <Hoaksin x={interpolate(right, [0, 1], [1400, 760])} y={1230} s={1.45} mood={f > 50 ? 'laugh' : 'smug'} shout={f > 50 ? 1 : 0} armL={60} />
        {[
          ['MITOS!', 620, 1560],
          ['HOAKS!', 900, 1660],
        ].map(([t, x, y], i) => (
          <MythSpore key={i} x={Number(x) - 300 * spores * (i + 1) * 0.4} y={Number(y) - 200 * spores} text={String(t)} s={0.95 * Math.min(1, spores * 2)} o={spores > 0 ? 1 : 0} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 80, top: 1000, fontFamily: theme.title, fontWeight: 800, fontSize: 80, color: '#FFC21A', opacity: left, letterSpacing: '-0.03em', textShadow: '0 6px 0 #083845'}}>VITABOY</div>
      <div style={{position: 'absolute', right: 140, top: 760, fontFamily: theme.title, fontWeight: 800, fontSize: 80, color: HX.spore, opacity: right, letterSpacing: '-0.03em', textShadow: '0 6px 0 #170A1F'}}>HOAKSIN</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, textAlign: 'center'}}>
        <span style={{display: 'inline-block', scale: `${vs}`, rotate: `${(1 - vs) * 30 - 8}deg`, fontFamily: theme.title, fontWeight: 800, fontSize: 180, color: '#fff', WebkitTextStroke: '8px #1A1714', letterSpacing: '-0.05em'}}>VS</span>
      </div>
    </AbsoluteFill>
  );
};

export const VillainComps: React.FC = () => (
  <>
    <Composition id="HoaksinSheet" component={Sheet} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="VitaboyVsHoaksin" component={VS} durationInFrames={120} fps={30} width={1080} height={1920} />
  </>
);
