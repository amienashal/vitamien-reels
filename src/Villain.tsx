import React from 'react';
import {useCurrentFrame, random} from 'remotion';

// "Hoaksin" — villain vitamien.io. Jamur ungu licik penyebar spora mitos, bawa megafon.
export const HX = {
  cap: '#6B2D8C',
  capDark: '#4A1D63',
  spot: '#B7F03C',
  stem: '#E9E2CF',
  stemDark: '#CFC5AB',
  ink: '#1A1714',
  spore: '#B7F03C',
  mega: '#E23E57',
};

export type HxMood = 'smug' | 'laugh' | 'angry' | 'shock' | 'dizzy' | 'menace';

export const Hoaksin: React.FC<{
  x?: number;
  y?: number;
  s?: number;
  mood?: HxMood;
  megaphone?: boolean;
  shout?: number; // 0..1 spore burst intensity
  armL?: number;
  tilt?: number;
  squash?: number;
}> = ({x = 0, y = 0, s = 1, mood = 'smug', megaphone = true, shout = 0, armL = 25, tilt = 0, squash = 1}) => {
  const f = useCurrentFrame();
  const blink = f % 120 > 114 ? 0.15 : 1;
  const sway = Math.sin(f / 14) * 3;
  const laughShake = mood === 'laugh' ? Math.sin(f * 1.6) * 3 : 0;
  const eyes = () => {
    if (mood === 'menace') {
      const pulse = 0.7 + Math.sin(f / 4) * 0.3;
      return (
        <g>
          {[-26, 26].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy={-12} rx={26} ry={16} fill="#FF2E4D" opacity={0.35 * pulse} />
              <path d={`M${cx - 18} ${-4} L${cx + 18} ${cx < 0 ? -16 : -4} L${cx + 18} ${-2} Q${cx} ${8} ${cx - 18} ${-4} Z`} transform={cx > 0 ? `translate(${2 * cx} 0) scale(-1 1)` : ''} fill="#FF2E4D" stroke={HX.ink} strokeWidth={4} strokeLinejoin="round" />
              <circle cx={cx + 4} cy={-6} r={3.5} fill="#FFF8D6" />
            </g>
          ))}
        </g>
      );
    }
    if (mood === 'dizzy')
      return (
        <g stroke={HX.ink} strokeWidth={6} strokeLinecap="round">
          {[-26, 26].map((cx) => (
            <g key={cx} transform={`translate(${cx} -10) rotate(${f * 8})`}>
              <line x1={-10} y1={-10} x2={10} y2={10} />
              <line x1={10} y1={-10} x2={-10} y2={10} />
            </g>
          ))}
        </g>
      );
    if (mood === 'laugh')
      return (
        <g stroke={HX.ink} strokeWidth={6} fill="none" strokeLinecap="round">
          <path d="M-38 -8 Q-26 -22 -14 -8" />
          <path d="M14 -8 Q26 -22 38 -8" />
        </g>
      );
    const r = mood === 'shock' ? 17 : 14;
    return (
      <g>
        {[-26, 26].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy={-10} rx={r} ry={r * 1.1 * blink} fill="#FFF8D6" stroke={HX.ink} strokeWidth={4} />
            <circle cx={cx + (mood === 'shock' ? 0 : 4)} cy={-8} r={mood === 'shock' ? 5 : 7 * blink} fill={HX.ink} />
          </g>
        ))}
      </g>
    );
  };
  const brows =
    mood === 'angry' || mood === 'smug' || mood === 'laugh' || mood === 'menace' ? (
      <g stroke={HX.ink} strokeWidth={7} strokeLinecap="round">
        <line x1={-44} y1={-34} x2={-12} y2={-24} />
        <line x1={12} y1={-24} x2={44} y2={-34} />
      </g>
    ) : mood === 'shock' ? (
      <g stroke={HX.ink} strokeWidth={6} strokeLinecap="round">
        <line x1={-40} y1={-40} x2={-14} y2={-44} />
        <line x1={14} y1={-44} x2={40} y2={-40} />
      </g>
    ) : null;
  const mouth = {
    smug: (
      <g>
        <path d="M-24 26 Q4 44 30 18" stroke={HX.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M14 30 L18 42 L23 28 Z" fill="#fff" stroke={HX.ink} strokeWidth={3} strokeLinejoin="round" />
      </g>
    ),
    laugh: (
      <g>
        <path d="M-28 18 Q0 62 28 18 Z" fill={HX.ink} />
        <path d="M-14 46 Q0 54 14 46 Q0 40 -14 46 Z" fill={HX.mega} />
      </g>
    ),
    angry: <path d="M-22 34 Q0 18 22 34" stroke={HX.ink} strokeWidth={6} fill="none" strokeLinecap="round" />,
    shock: <ellipse cx={0} cy={32} rx={12} ry={16} fill={HX.ink} />,
    menace: (
      <g>
        <path d="M-36 18 Q0 66 38 14 Q0 34 -36 18 Z" fill={HX.ink} />
        {[-26, -14, -2, 10, 22].map((tx, i) => (
          <path key={i} d={`M${tx} ${20 + Math.abs(tx) * 0.05} l6 ${12 - Math.abs(tx) * 0.12} l6 ${-12 + Math.abs(tx) * 0.12} Z`} fill="#FFF8D6" />
        ))}
      </g>
    ),
    dizzy: <path d="M-20 32 Q-10 24 0 32 Q10 40 20 32" stroke={HX.ink} strokeWidth={6} fill="none" strokeLinecap="round" />,
  }[mood];
  const capSpots: [number, number, number][] = [
    [-80, -110, 18],
    [-20, -150, 14],
    [50, -128, 20],
    [100, -88, 12],
    [-120, -70, 10],
    [10, -100, 9],
  ];
  return (
    <g transform={`translate(${x + laughShake} ${y}) rotate(${tilt + sway * 0.4}) scale(${s * (2 - squash)} ${s * squash})`}>
      <ellipse cx={0} cy={198} rx={80} ry={12} fill="#000" opacity={0.15} />
      {/* root feet */}
      <g fill={HX.stemDark} stroke={HX.ink} strokeWidth={5} strokeLinejoin="round">
        <path d="M-46 150 Q-60 186 -96 190 Q-60 200 -24 186 Z" />
        <path d="M46 150 Q60 186 96 190 Q60 200 24 186 Z" />
      </g>
      {/* stem body */}
      <path d="M-58 -40 Q-70 60 -54 150 Q0 172 54 150 Q72 60 58 -40 Z" fill={HX.stem} stroke={HX.ink} strokeWidth={6} />
      <path d="M30 -30 Q44 60 34 140" stroke={HX.stemDark} strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* skirt ring */}
      <path d="M-62 46 Q0 70 62 46 Q66 66 54 72 Q0 92 -54 72 Q-66 66 -62 46 Z" fill={HX.stemDark} stroke={HX.ink} strokeWidth={5} />
      {/* arms */}
      <g stroke={HX.ink} strokeWidth={13} strokeLinecap="round" fill="none">
        <path d={`M-56 20 Q${-90 - Math.sin((armL * Math.PI) / 180) * 30} ${40} ${-56 - Math.sin((armL * Math.PI) / 180) * 70} ${20 + Math.cos((armL * Math.PI) / 180) * 70}`} />
        {megaphone ? <path d="M56 20 Q100 10 118 -12" /> : <path d="M56 20 Q90 60 110 80" />}
      </g>
      <circle cx={-56 - Math.sin((armL * Math.PI) / 180) * 70} cy={20 + Math.cos((armL * Math.PI) / 180) * 70} r={14} fill={HX.cap} stroke={HX.ink} strokeWidth={5} />
      {/* megaphone */}
      {megaphone && (
        <g transform={`translate(118 -20) rotate(${-25 + shout * -6})`}>
          <path d="M0 -14 L80 -46 L80 40 L0 14 Z" fill={HX.mega} stroke={HX.ink} strokeWidth={6} strokeLinejoin="round" />
          <rect x={-22} y={-16} width={26} height={32} rx={6} fill={HX.ink} />
          <ellipse cx={80} cy={-3} rx={10} ry={43} fill="#B82A41" stroke={HX.ink} strokeWidth={6} />
          {/* sound waves */}
          {shout > 0 &&
            [0, 1, 2].map((i) => {
              const p = ((f + i * 8) % 24) / 24;
              return <path key={i} d={`M${100 + p * 80} -40 Q${125 + p * 90} -3 ${100 + p * 80} 34`} stroke={HX.spore} strokeWidth={7} fill="none" strokeLinecap="round" opacity={(1 - p) * shout} />;
            })}
        </g>
      )}
      {megaphone && <circle cx={118} cy={-12} r={14} fill={HX.cap} stroke={HX.ink} strokeWidth={5} />}
      {/* face */}
      <g>
        {eyes()}
        {brows}
        {mouth}
        <ellipse cx={-44} cy={16} rx={9} ry={6} fill="#C86BD6" opacity={0.55} />
        <ellipse cx={44} cy={16} rx={9} ry={6} fill="#C86BD6" opacity={0.55} />
      </g>
      {/* cap */}
      <g transform={`rotate(${-6 + sway})`}>
        <path d="M-150 -40 Q-160 -110 -90 -160 Q0 -210 90 -160 Q160 -110 150 -40 Q120 -58 100 -36 Q70 -60 40 -40 Q0 -62 -40 -40 Q-70 -60 -100 -36 Q-120 -58 -150 -40 Z" fill={HX.cap} stroke={HX.ink} strokeWidth={7} strokeLinejoin="round" />
        <path d="M-120 -120 Q-80 -170 -20 -175" stroke="#fff" strokeWidth={10} fill="none" opacity={0.2} strokeLinecap="round" />
        {capSpots.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={HX.spot} stroke={HX.ink} strokeWidth={4} />
        ))}
        {/* gills */}
        <g stroke={HX.capDark} strokeWidth={4}>
          {[-110, -70, -30, 10, 50, 90].map((gx) => (
            <line key={gx} x1={gx} y1={-44} x2={gx + 8} y2={-36} />
          ))}
        </g>
      </g>
      {/* idle spores leaking from cap */}
      {Array.from({length: 6}).map((_, i) => {
        const p = ((f + i * 13) % 70) / 70;
        const sx = -120 + random('sp' + i) * 240;
        return <circle key={i} cx={sx + Math.sin(f / 8 + i) * 10} cy={-60 - p * 160} r={5 + random('r' + i) * 5} fill={HX.spore} opacity={(1 - p) * 0.7} />;
      })}
    </g>
  );
};

// spore that carries a myth label
export const MythSpore: React.FC<{x: number; y: number; text: string; s?: number; o?: number}> = ({x, y, text, s = 1, o = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 7 + x) * 6}) scale(${s})`} opacity={o}>
      {Array.from({length: 9}).map((_, i) => (
        <circle key={i} cx={Math.cos((i / 9) * Math.PI * 2) * 70} cy={Math.sin((i / 9) * Math.PI * 2) * 34} r={26} fill={HX.spore} />
      ))}
      <ellipse rx={92} ry={46} fill={HX.spore} stroke={HX.ink} strokeWidth={5} />
      <text y={12} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={34} fill={HX.ink}>
        {text}
      </text>
    </g>
  );
};
