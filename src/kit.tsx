import React from 'react';
import {random, useCurrentFrame, interpolate, Easing} from 'remotion';
import {theme} from './theme';
import {pop} from './util';

// ---------- Original stylised person ----------
export type Mood = 'happy' | 'sad' | 'neutral' | 'wow';
export const Person: React.FC<{
  x: number;
  y: number;
  s?: number;
  shirt?: string;
  skin?: string;
  hair?: string;
  mood?: Mood;
  armL?: number; // degrees, 0 = down, positive = raise outward
  armR?: number;
  sit?: boolean;
  sweat?: boolean;
  flip?: boolean;
  bob?: number;
}> = ({x, y, s = 1, shirt = '#3B6EA8', skin = '#F2C29B', hair = '#1A1714', mood = 'neutral', armL = 10, armR = 10, sit = false, sweat = false, flip = false, bob = 1}) => {
  const f = useCurrentFrame();
  const blink = f % 95 > 90 ? 0.15 : 1;
  const by = Math.sin(f / 9) * 3 * bob;
  const mouth =
    mood === 'happy'
      ? 'M-14 8 Q0 22 14 8'
      : mood === 'sad'
        ? 'M-12 16 Q0 6 12 16'
        : mood === 'wow'
          ? ''
          : 'M-10 12 L10 12';
  return (
    <g transform={`translate(${x} ${y + by}) scale(${flip ? -s : s} ${s})`}>
      {/* legs */}
      {sit ? (
        <g stroke="#2A2622" strokeWidth={22} strokeLinecap="round" fill="none">
          <path d="M-14 120 L-14 150 L40 150 L40 205" />
          <path d="M14 120 L14 150 L66 150 L66 205" />
        </g>
      ) : (
        <g stroke="#2A2622" strokeWidth={22} strokeLinecap="round">
          <line x1={-16} y1={125} x2={-20} y2={215} />
          <line x1={16} y1={125} x2={20} y2={215} />
        </g>
      )}
      {/* arms */}
      <g stroke={skin} strokeWidth={18} strokeLinecap="round">
        <line x1={-34} y1={40} x2={-34 - Math.sin((armL * Math.PI) / 180) * 80} y2={40 + Math.cos((armL * Math.PI) / 180) * 80} />
        <line x1={34} y1={40} x2={34 + Math.sin((armR * Math.PI) / 180) * 80} y2={40 + Math.cos((armR * Math.PI) / 180) * 80} />
      </g>
      {/* torso */}
      <rect x={-42} y={20} width={84} height={115} rx={36} fill={shirt} />
      <path d="M-14 22 L0 42 L14 22" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={5} strokeLinecap="round" />
      {/* head */}
      <rect x={-9} y={-6} width={18} height={30} fill={skin} />
      <circle cx={0} cy={-40} r={44} fill={skin} />
      <path d="M-44 -46 Q-40 -92 4 -88 Q44 -86 44 -44 Q30 -62 4 -62 Q-26 -62 -44 -46 Z" fill={hair} />
      {/* face */}
      <g transform="translate(0 -36)">
        <ellipse cx={-15} cy={-4} rx={5.5} ry={7 * blink} fill="#1A1714" />
        <ellipse cx={15} cy={-4} rx={5.5} ry={7 * blink} fill="#1A1714" />
        {mood === 'wow' ? <ellipse cx={0} cy={14} rx={7} ry={9} fill="#1A1714" /> : <path d={mouth} stroke="#1A1714" strokeWidth={5} fill="none" strokeLinecap="round" />}
        <circle cx={-26} cy={8} r={7} fill="#F08A7A" opacity={0.45} />
        <circle cx={26} cy={8} r={7} fill="#F08A7A" opacity={0.45} />
      </g>
      {sweat && (
        <g>
          {[0, 1].map((i) => {
            const p = ((f + i * 20) % 40) / 40;
            return <path key={i} d="M0 0 C-7 10 -7 16 0 18 C7 16 7 10 0 0 Z" fill="#7CC6FF" transform={`translate(${46 + i * 8} ${-70 + p * 40})`} opacity={1 - p} />;
          })}
        </g>
      )}
    </g>
  );
};

// ---------- particles ----------
export const Particles: React.FC<{seed: string; n: number; color: string; kind?: 'dot' | 'ring' | 'plus' | 'cap' | 'star'; speed?: number; size?: number; opacity?: number}> = ({
  seed,
  n,
  color,
  kind = 'dot',
  speed = 1,
  size = 14,
  opacity = 0.5,
}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: n}).map((_, i) => {
        const rx = random(seed + 'x' + i) * 1080;
        const ry = random(seed + 'y' + i) * 1920;
        const sp = (0.4 + random(seed + 's' + i)) * speed;
        const sz = size * (0.5 + random(seed + 'z' + i));
        const y = (((ry - f * sp * 1.6) % 2000) + 2000) % 2000 - 40;
        const x = rx + Math.sin(f / 30 + i) * 18;
        const rot = f * sp * 2 + i * 30;
        const o = opacity * (0.5 + 0.5 * Math.sin(f / 20 + i));
        if (kind === 'ring') return <circle key={i} cx={x} cy={y} r={sz} fill="none" stroke={color} strokeWidth={3} opacity={o} />;
        if (kind === 'plus')
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
              <rect x={-sz / 2} y={-2.5} width={sz} height={5} rx={2.5} fill={color} />
              <rect x={-2.5} y={-sz / 2} width={5} height={sz} rx={2.5} fill={color} />
            </g>
          );
        if (kind === 'cap')
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
              <rect x={-sz} y={-sz / 2.2} width={sz * 2} height={sz / 1.1} rx={sz / 2.2} fill={color} />
            </g>
          );
        if (kind === 'star')
          return <path key={i} d={`M0 ${-sz} L${sz * 0.25} ${-sz * 0.25} L${sz} 0 L${sz * 0.25} ${sz * 0.25} L0 ${sz} L${-sz * 0.25} ${sz * 0.25} L${-sz} 0 L${-sz * 0.25} ${-sz * 0.25} Z`} transform={`translate(${x} ${y}) rotate(${rot / 3})`} fill={color} opacity={o} />;
        return <circle key={i} cx={x} cy={y} r={sz / 2} fill={color} opacity={o} />;
      })}
    </svg>
  );
};

// ---------- kinetic words ----------
export const Words: React.FC<{
  text: string;
  at: number; // seconds local
  size?: number;
  color: string;
  hi?: string[]; // words to highlight
  hiColor?: string;
  stagger?: number;
  weight?: number;
  align?: 'left' | 'center';
  lh?: number;
}> = ({text, at, size = 96, color, hi = [], hiColor = theme.sun, stagger = 0.06, weight = 800, align = 'left', lh = 1.02}) => {
  const f = useCurrentFrame();
  const lines = text.split('\n');
  let k = 0;
  return (
    <div style={{fontFamily: theme.title, fontWeight: weight, fontSize: size, lineHeight: lh, letterSpacing: '-0.035em', color, textAlign: align}}>
      {lines.map((ln, li) => (
        <div key={li} style={{overflow: 'visible'}}>
          {ln.split(' ').map((w, wi) => {
            const p = pop(f, at + k++ * stagger, 30, 13);
            const isHi = hi.includes(w.replace(/[,.?!]/g, ''));
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  marginRight: '0.24em',
                  opacity: Math.min(1, p * 1.4),
                  translate: `0px ${(1 - p) * 60}px`,
                  rotate: `${(1 - p) * 8}deg`,
                  color: isHi ? hiColor : color,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Tag: React.FC<{text: string; at: number; color: string; bg: string}> = ({text, at, color, bg}) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 30, 14);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 22px',
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: theme.mono,
        fontSize: 30,
        letterSpacing: '0.14em',
        scale: `${p}`,
        transformOrigin: 'left center',
      }}
    >
      <span style={{width: 12, height: 12, borderRadius: 6, background: color}} />
      {text}
    </div>
  );
};

// big rotating ring decoration
export const Rings: React.FC<{cx: number; cy: number; r: number; color: string; o?: number}> = ({cx, cy, r, color, o = 0.18}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(${cx} ${cy}) rotate(${f * 0.4})`} opacity={o}>
        <circle r={r} fill="none" stroke={color} strokeWidth={4} strokeDasharray="4 22" strokeLinecap="round" />
        <circle r={r * 0.72} fill="none" stroke={color} strokeWidth={3} />
        <circle r={r * 1.3} fill="none" stroke={color} strokeWidth={2} strokeDasharray="60 30" transform={`rotate(${-f * 0.9})`} />
      </g>
    </svg>
  );
};

export const ez = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a * 30, b * 30], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
