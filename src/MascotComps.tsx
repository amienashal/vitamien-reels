import React from 'react';
import {AbsoluteFill, Composition, useCurrentFrame, interpolate, spring} from 'remotion';
import {theme} from './theme';
import {Vimi, VimiMood, VIMI} from './Mascot';
import {Particles} from './kit';

const Sheet: React.FC = () => {
  const moods: [VimiMood, string, Partial<React.ComponentProps<typeof Vimi>>][] = [
    ['smug', 'siap beraksi', {armL: 35, armR: 35}],
    ['happy', 'terbang', {fly: true, armR: 175, armL: 40, tilt: 18}],
    ['wow', 'kaget', {armL: 140, armR: 140}],
    ['think', 'mikir', {armR: 150, look: [1, -1]}],
    ['sad', 'sedih', {armL: 5, armR: 5}],
    ['wink', 'menang', {thumbR: true, armR: 150}],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 30%, #FFF8E8 0%, #FFE9BF 70%, #FFD98A 100%)'}}>
      <div style={{position: 'absolute', left: 90, top: 80}}>
        <div style={{fontFamily: theme.mono, fontSize: 30, letterSpacing: '0.2em', color: '#E07A00'}}>SUPERHERO · VITAMIEN.IO</div>
        <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 100, letterSpacing: '-0.04em', color: VIMI.ink, lineHeight: 1}}>
          Kenalin, <span style={{color: VIMI.top}}>Vitaboy</span>
        </div>
        <div style={{fontFamily: theme.title, fontWeight: 700, fontSize: 38, color: '#5A5148', marginTop: 14, width: 760}}>
          Pembasmi salah kaprah vitamin. Kekuatannya dari matahari.
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <Vimi x={560} y={700} s={1.3} mood="smug" armR={170} armL={30} glow={1} />
        <g fontFamily={theme.mono} fontSize={24} fill="#5A5148">
          <text x={90} y={458}>antena matahari = kekuatan</text>
          <line x1={480} y1={450} x2={545} y2={448} stroke="#5A5148" strokeWidth={2} />
          <text x={90} y={648}>topeng = identitas rahasia</text>
          <line x1={470} y1={640} x2={485} y2={640} stroke="#5A5148" strokeWidth={2} />
          <text x={90} y={848}>lencana "v" + jubah</text>
          <line x1={400} y1={840} x2={522} y2={826} stroke="#5A5148" strokeWidth={2} />
        </g>
        {moods.map(([m, label, extra], i) => {
          const cx = 1020 + (i % 3) * 290;
          const cy = 330 + Math.floor(i / 3) * 400;
          return (
            <g key={m}>
              <rect x={cx - 125} y={cy - 210} width={250} height={395} rx={28} fill="#fff" opacity={0.7} />
              <Vimi x={cx} y={cy - 10} s={0.62} mood={m} {...extra} />
              <text x={cx} y={cy + 168} textAnchor="middle" fontFamily={theme.mono} fontSize={22} fill={VIMI.ink} letterSpacing={2}>
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const fps = 30;
  const flyP = interpolate(f, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const land = spring({frame: f - 22, fps, config: {damping: 10, stiffness: 160}});
  const flying = f < 22;
  const x = flying ? interpolate(flyP, [0, 1], [-200, 540]) : 540;
  const y = flying ? interpolate(flyP, [0, 1], [1700, 760]) : interpolate(land, [0, 1], [760, 820]);
  const squash = f > 22 && f < 36 ? 1 - Math.sin(((f - 22) / 14) * Math.PI) * 0.16 : 1;
  const flash = interpolate(f, [22, 26, 40], [0, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const txt = spring({frame: f - 38, fps, config: {damping: 11}});
  const sub = spring({frame: f - 52, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1C7C94 0%, #0F5E73 55%, #083845 100%)'}}>
      <Particles seed="intro" n={34} color="#FFC21A" kind="star" size={14} opacity={0.6} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform="translate(540 820)">
          {Array.from({length: 18}).map((_, i) => (
            <path key={i} d="M0 0 L-46 -1300 L46 -1300 Z" fill="#FFC21A" opacity={0.14 * (1 - flash) * Math.min(1, f / 30)} transform={`rotate(${i * 20 + f * 0.5})`} />
          ))}
        </g>
        {/* speed lines while flying */}
        {flying &&
          Array.from({length: 10}).map((_, i) => (
            <line key={i} x1={x - 160 - i * 18} y1={y + 120 + i * 30} x2={x - 520 - i * 30} y2={y + 520 + i * 40} stroke="#FFF4DE" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
          ))}
        {/* landing dust */}
        {!flying &&
          [-1, 1].map((sd) => {
            const p = Math.min(1, (f - 22) / 18);
            return <ellipse key={sd} cx={540 + sd * (120 + p * 160)} cy={1240} rx={70 * (1 - p) + 10} ry={30 * (1 - p) + 4} fill="#FFF4DE" opacity={0.7 * (1 - p)} />;
          })}
        <Vimi
          x={x}
          y={y}
          s={2.1}
          squash={squash}
          fly={flying}
          tilt={flying ? 28 : 0}
          mood={flying ? 'wow' : 'smug'}
          armR={flying ? 175 : f > 60 ? 170 : 35}
          armL={flying ? 40 : 35}
          thumbR={f > 60}
          glow={flying ? 1 : 0.6 + Math.sin(f / 4) * 0.4}
        />
      </svg>
      <AbsoluteFill style={{background: '#FFF4DE', opacity: flash}} />
      <div style={{position: 'absolute', top: 1320, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 132, letterSpacing: '-0.04em', color: '#FFC21A', scale: `${txt}`, rotate: `${(1 - txt) * -10}deg`, textShadow: '0 8px 0 #083845'}}>
          VITABOY!
        </div>
        <div style={{fontFamily: theme.title, fontWeight: 700, fontSize: 44, color: '#FFF4DE', opacity: sub, translate: `0px ${(1 - sub) * 30}px`, marginTop: 6}}>
          Pembasmi salah kaprah vitamin
        </div>
        <div style={{fontFamily: theme.mono, fontSize: 32, letterSpacing: '0.15em', color: '#FFC21A', opacity: sub, marginTop: 14}}>@VITAMIEN.IO</div>
      </div>
    </AbsoluteFill>
  );
};

export const MascotComps: React.FC = () => (
  <>
    <Composition id="VitaboySheet" component={Sheet} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="VitaboyIntro" component={Intro} durationInFrames={120} fps={30} width={1080} height={1920} />
  </>
);
