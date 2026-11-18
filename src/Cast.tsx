import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Person} from './kit';

const INK = '#1A1714';

const Eyes: React.FC<{dx?: number; y?: number; r?: number; gap?: number; mood?: 'ok' | 'mad' | 'sly'}> = ({dx = 0, y = 0, r = 14, gap = 26, mood = 'ok'}) => {
  const f = useCurrentFrame();
  const b = f % 100 > 95 ? 0.15 : 1;
  return (
    <g>
      {[-gap, gap].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={y} rx={r} ry={r * 1.1 * b} fill="#fff" stroke={INK} strokeWidth={4} />
          <circle cx={cx + dx} cy={y + 2} r={r * 0.5 * b} fill={INK} />
        </g>
      ))}
      {mood === 'mad' && (
        <g stroke={INK} strokeWidth={6} strokeLinecap="round">
          <line x1={-gap - r} y1={y - r - 10} x2={-gap + r} y2={y - r} />
          <line x1={gap - r} y1={y - r} x2={gap + r} y2={y - r - 10} />
        </g>
      )}
      {mood === 'sly' && (
        <g fill="#000" opacity={0.85}>
          <rect x={-gap - r - 2} y={y - r - 4} width={r * 2 + 4} height={r} />
          <rect x={gap - r - 2} y={y - r - 4} width={r * 2 + 4} height={r} />
        </g>
      )}
    </g>
  );
};

// ---------- ALLIES ----------
export const Probi: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 9) * 4;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${s})`}>
      <ellipse cy={150} rx={60} ry={10} fill="#000" opacity={0.12} />
      {Array.from({length: 10}).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const px = Math.cos(a) * 70;
        const py = Math.sin(a) * 110;
        const w = Math.sin(f / 4 + i) * 10;
        return <path key={i} d={`M${px} ${py} q${px * 0.3 + w} ${py * 0.15} ${px * 0.5} ${py * 0.35 + w}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
      <rect x={-62} y={-110} width={124} height={220} rx={62} fill="#4CC38A" stroke={INK} strokeWidth={6} />
      <rect x={-40} y={-90} width={16} height={60} rx={8} fill="#fff" opacity={0.4} />
      <circle cx={20} cy={50} r={8} fill="#2E9A68" />
      <circle cx={-24} cy={70} r={6} fill="#2E9A68" />
      <Eyes y={-30} r={15} gap={24} />
      <path d="M-18 6 Q0 24 18 6" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={-42} cy={-6} rx={9} ry={6} fill="#FF7A6B" opacity={0.5} />
      <ellipse cx={42} cy={-6} rx={9} ry={6} fill="#FF7A6B" opacity={0.5} />
      <g stroke={INK} strokeWidth={10} strokeLinecap="round">
        <line x1={-60} y1={20} x2={-92} y2={-10 + Math.sin(f / 5) * 10} />
        <line x1={60} y1={20} x2={90} y2={50} />
      </g>
    </g>
  );
};

export const Eri: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 10) * 4;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${s})`}>
      <ellipse cy={150} rx={70} ry={10} fill="#000" opacity={0.12} />
      <g stroke={INK} strokeWidth={9} strokeLinecap="round">
        <line x1={-30} y1={90} x2={-36} y2={140} />
        <line x1={30} y1={90} x2={36} y2={140} />
      </g>
      <circle r={110} fill="#E2414F" stroke={INK} strokeWidth={6} />
      <ellipse cx={0} cy={18} rx={60} ry={48} fill="#C22F3C" />
      <path d="M-70 -60 Q-40 -96 10 -100" stroke="#fff" strokeWidth={10} fill="none" opacity={0.35} strokeLinecap="round" />
      <Eyes y={-40} r={15} gap={30} />
      <path d="M-16 -8 Q0 6 16 -8" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* carrying O2 bubble */}
      <g stroke={INK} strokeWidth={10} strokeLinecap="round">
        <line x1={-80} y1={40} x2={-30} y2={60} />
        <line x1={80} y1={40} x2={30} y2={60} />
      </g>
      <g transform={`translate(0 ${58 + Math.sin(f / 6) * 3})`}>
        <circle r={34} fill="#7CC6FF" stroke={INK} strokeWidth={5} />
        <text y={10} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={28} fill={INK}>
          O₂
        </text>
      </g>
    </g>
  );
};

export const Imu: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const pts = Array.from({length: 14}).map((_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = 105 + Math.sin(f / 6 + i * 1.7) * 9 + (i % 2) * 8;
    return [Math.cos(a) * r, Math.sin(a) * r * 1.05];
  });
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L') + ' Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cy={150} rx={70} ry={10} fill="#000" opacity={0.12} />
      <path d={d} fill="#F3F1FF" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-40 30 Q-10 10 20 40 Q40 60 10 70 Q-30 70 -40 30 Z" fill="#C9C1F2" />
      {/* guard helmet */}
      <path d="M-78 -46 Q-70 -120 0 -124 Q70 -120 78 -46 Z" fill="#3B6EA8" stroke={INK} strokeWidth={6} />
      <rect x={-8} y={-140} width={16} height={22} rx={6} fill="#FFC21A" stroke={INK} strokeWidth={4} />
      <Eyes y={-18} r={14} gap={28} mood="mad" />
      <path d="M-14 24 L14 24" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {/* shield */}
      <g transform="translate(100 40) rotate(8)">
        <path d="M0 -50 L44 -34 L44 6 Q44 44 0 62 Q-44 44 -44 6 L-44 -34 Z" fill="#3B6EA8" stroke={INK} strokeWidth={6} />
        <path d="M-6 -20 h12 v14 h14 v12 h-14 v14 h-12 v-14 h-14 v-12 h14 Z" fill="#fff" />
      </g>
    </g>
  );
};

// ---------- HENCHMEN ----------
export const Radikal: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const a = f / 6;
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 7) * 5}) scale(${s})`}>
      <ellipse cy={150} rx={60} ry={10} fill="#000" opacity={0.15} />
      <ellipse rx={150} ry={56} fill="none" stroke="#FFC21A" strokeWidth={3} strokeDasharray="8 10" transform="rotate(-20)" />
      {Array.from({length: 12}).map((_, i) => (
        <path key={i} d="M-14 -80 L0 -128 L14 -80 Z" fill="#B3261E" stroke={INK} strokeWidth={5} strokeLinejoin="round" transform={`rotate(${i * 30 + Math.sin(f / 5) * 4})`} />
      ))}
      <circle r={88} fill="#D63A2F" stroke={INK} strokeWidth={6} />
      <Eyes y={-18} r={15} gap={28} mood="mad" dx={4} />
      <path d="M-30 26 Q0 50 32 20" stroke={INK} strokeWidth={6} fill="#fff" strokeLinejoin="round" />
      <path d="M-20 30 L-14 40 M-6 34 L-2 44 M8 34 L10 44 M20 28 L24 38" stroke={INK} strokeWidth={3} />
      {/* lonely unpaired electron */}
      <circle cx={Math.cos(a) * 150 * 0.94 + Math.sin(a) * 56 * 0.34} cy={Math.sin(a) * 56 * 0.94 - Math.cos(a) * 150 * 0.34} r={12} fill="#FFC21A" stroke={INK} strokeWidth={4} />
      <g stroke={INK} strokeWidth={10} strokeLinecap="round">
        <path d="M-80 40 Q-120 60 -126 30" fill="none" />
        <path d="M80 40 Q120 60 126 30" fill="none" />
      </g>
    </g>
  );
};

export const Viro: React.FC<{x: number; y: number; s?: number; menace?: boolean; dissolve?: number}> = ({x, y, s = 1, menace = false, dissolve = 0}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 8) * 6}) rotate(${Math.sin(f / 20) * 6 + dissolve * 40}) scale(${s * (1 - dissolve * 0.6)})`} opacity={1 - dissolve}>
      <ellipse cy={150} rx={60} ry={10} fill="#000" opacity={0.15} />
      {Array.from({length: 14}).map((_, i) => (
        <g key={i} transform={`rotate(${i * (360 / 14)})`}>
          <line x1={0} y1={-90} x2={0} y2={-122} stroke={INK} strokeWidth={6} />
          <circle cy={-128} r={13} fill="#E07A5F" stroke={INK} strokeWidth={5} />
        </g>
      ))}
      <circle r={92} fill="#7A9E7E" stroke={INK} strokeWidth={6} />
      <circle cx={-40} cy={40} r={12} fill="#5E8263" />
      <circle cx={46} cy={-50} r={9} fill="#5E8263" />
      {menace ? (
        <g>
          {[-28, 28].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy={-16} rx={30} ry={18} fill="#FF2E4D" opacity={0.35 + Math.sin(f / 4) * 0.15} />
              <path d={`M${cx - 20} -10 L${cx + 20} ${cx < 0 ? -24 : -24} L${cx + 16} -6 Z`} transform={cx > 0 ? `translate(${2 * cx} 0) scale(-1 1)` : ''} fill="#FF2E4D" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            </g>
          ))}
          <path d="M-44 20 Q0 74 44 20 Q0 40 -44 20 Z" fill={INK} />
          {[-32, -18, -4, 10, 24].map((tx, i) => (
            <path key={i} d={`M${tx} 26 l7 14 l7 -14 Z`} fill="#fff" />
          ))}
        </g>
      ) : (
        <g>
          <Eyes y={-14} r={15} gap={28} mood="sly" />
          <path d="M-34 26 Q0 56 34 26 Z" fill={INK} />
          <path d="M-24 30 L-18 40 L-12 31 M12 31 L18 40 L24 30" fill="#fff" stroke={INK} strokeWidth={2} />
        </g>
      )}
    </g>
  );
};

export const Cacing: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const segs = 7;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cy={150} rx={110} ry={10} fill="#000" opacity={0.12} />
      {Array.from({length: segs}).map((_, k) => {
        const i = segs - 1 - k;
        const px = -120 + i * 34;
        const py = 110 - i * 18 + Math.sin(f / 6 - i * 0.8) * 14;
        const r = 32 - i * 0.5;
        return <circle key={i} cx={px} cy={py} r={r} fill={i % 2 ? '#F2A7B5' : '#E8899B'} stroke={INK} strokeWidth={5} />;
      })}
      {/* head */}
      <g transform={`translate(${-120 + segs * 34 + 10} ${110 - segs * 18 - 10 + Math.sin(f / 6 - segs * 0.8) * 14})`}>
        <circle r={56} fill="#F2A7B5" stroke={INK} strokeWidth={6} />
        <Eyes y={-10} r={12} gap={20} mood="sly" dx={-4} />
        <path d="M-20 22 Q0 32 24 14" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* stolen iron sack */}
        <g transform="translate(-80 40) rotate(-10)">
          <path d="M-34 -10 Q-40 40 0 44 Q40 40 34 -10 Q20 -24 0 -22 Q-20 -24 -34 -10 Z" fill="#8D6E63" stroke={INK} strokeWidth={5} />
          <text y={22} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={26} fill="#fff">
            Fe
          </text>
        </g>
      </g>
    </g>
  );
};

// ---------- CIVILIAN ----------
export const OmForward: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Person x={x} y={y} s={s} shirt="#8D5A3B" skin="#D9A57F" hair="#3A3A3A" mood="wow" armR={150} armL={20} />
      {/* batik dots */}
      <g fill="#F2C14E" opacity={0.8}>
        {[
          [-20, 50],
          [18, 64],
          [-14, 90],
          [22, 104],
        ].map(([dx, dy], i) => (
          <circle key={i} cx={x + dx * s} cy={y + dy * s + Math.sin(f / 9) * 3} r={5 * s} />
        ))}
      </g>
      {/* mustache */}
      <path d={`M${x - 22 * s} ${y - 28 * s + Math.sin(f / 9) * 3} q${11 * s} ${-8 * s} ${22 * s} 0 q${11 * s} ${-8 * s} ${22 * s} 0`} stroke="#3A3A3A" strokeWidth={7 * s} fill="none" strokeLinecap="round" />
      {/* phone with forward arrow */}
      <g transform={`translate(${x + 34 * s + Math.sin((150 * Math.PI) / 180) * 80 * s} ${y + 40 * s + Math.cos((150 * Math.PI) / 180) * 80 * s + Math.sin(f / 9) * 3 - 30 * s}) rotate(10)`}>
        <rect x={-22 * s} y={-38 * s} width={44 * s} height={76 * s} rx={8 * s} fill={INK} />
        <rect x={-17 * s} y={-31 * s} width={34 * s} height={58 * s} rx={4 * s} fill="#25D366" />
        <path d={`M${-8 * s} ${4 * s} q${8 * s} ${-14 * s} ${18 * s} ${-12 * s} m${-6 * s} ${-6 * s} l${6 * s} ${6 * s} l${-6 * s} ${6 * s}`} stroke="#fff" strokeWidth={4 * s} fill="none" strokeLinecap="round" />
      </g>
      {/* notification bubbles */}
      {[0, 1, 2].map((i) => {
        const p = ((f + i * 15) % 45) / 45;
        return (
          <g key={i} opacity={1 - p} transform={`translate(${x + 120 * s + i * 14} ${y - 120 * s - p * 80})`}>
            <rect x={-26} y={-16} width={52} height={32} rx={16} fill="#25D366" />
            <text y={7} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={18} fill="#fff">
              FWD
            </text>
          </g>
        );
      })}
    </g>
  );
};
