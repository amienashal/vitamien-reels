import React from 'react';
import {useCurrentFrame} from 'remotion';

// "Vitaboy" — maskot superhero vitamien.io. Kapsul dua warna, jubah, topeng, antena matahari.
export type VimiMood = 'happy' | 'wow' | 'sad' | 'think' | 'wink' | 'smug';

export const VIMI = {
  cape: '#0F5E73',
  capeIn: '#0A4757',
  top: '#F29A0C',
  topDark: '#D97F00',
  bottom: '#FFF4DE',
  bottomDark: '#F1DDB8',
  ink: '#1A1714',
  cheek: '#FF7A6B',
  sun: '#FFC21A',
};

export const Vimi: React.FC<{
  hero?: boolean;
  fly?: boolean;
  x?: number;
  y?: number;
  s?: number;
  mood?: VimiMood;
  armL?: number; // deg, 0 = down, 90 = sideways, 160 = up
  armR?: number;
  look?: [number, number];
  glasses?: boolean;
  glow?: number; // antenna glow 0..1
  squash?: number; // 1 = normal
  tilt?: number;
  wave?: boolean;
  thumbR?: boolean;
}> = ({x = 0, y = 0, s = 1, mood = 'happy', armL = 20, armR = 20, look = [0, 0], glasses = false, hero = true, fly = false, glow = 0.6, squash = 1, tilt = 0, wave = false, thumbR = false}) => {
  const f = useCurrentFrame();
  const blink = f % 110 > 104 ? 0.12 : 1;
  const idle = Math.sin(f / 10) * 4;
  const aR = wave ? 150 + Math.sin(f / 3.2) * 22 : armR;
  const arm = (side: -1 | 1, deg: number) => {
    const r = (deg * Math.PI) / 180;
    const sx = side * 78;
    const sy = 20;
    const ex = sx + side * Math.sin(r) * 70;
    const ey = sy + Math.cos(r) * 70;
    return {sx, sy, ex, ey};
  };
  const L = arm(-1, armL);
  const R = arm(1, aR);
  const eye = (cx: number, isWink: boolean) =>
    isWink ? (
      <path d={`M${cx - 14} -46 Q${cx} -58 ${cx + 14} -46`} stroke={VIMI.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx} cy={-48} rx={20} ry={22 * blink} fill="#fff" />
        <ellipse cx={cx + look[0] * 7} cy={-46 + look[1] * 6} rx={10} ry={12 * blink} fill={VIMI.ink} />
        <circle cx={cx + look[0] * 7 + 4} cy={-51 + look[1] * 6} r={3.5 * blink} fill="#fff" />
      </g>
    );
  const mouth = {
    happy: <path d="M-20 -10 Q0 14 20 -10 Z" fill={VIMI.ink} />,
    wow: <ellipse cx={0} cy={-4} rx={11} ry={14} fill={VIMI.ink} />,
    sad: <path d="M-16 2 Q0 -12 16 2" stroke={VIMI.ink} strokeWidth={6} fill="none" strokeLinecap="round" />,
    think: <path d="M-12 -4 L14 -8" stroke={VIMI.ink} strokeWidth={6} fill="none" strokeLinecap="round" />,
    wink: <path d="M-18 -8 Q0 12 18 -8" stroke={VIMI.ink} strokeWidth={6} fill="none" strokeLinecap="round" />,
    smug: <path d="M-16 -4 Q6 8 20 -10" stroke={VIMI.ink} strokeWidth={6} fill="none" strokeLinecap="round" />,
  }[mood];
  const brow = mood === 'sad' ? [-12, 12] : mood === 'think' ? [8, -10] : mood === 'wow' ? [-6, 6] : [0, 0];
  return (
    <g transform={`translate(${x} ${y + idle * s}) rotate(${tilt}) scale(${s * (2 - squash)} ${s * squash})`}>
      {/* shadow */}
      <ellipse cx={0} cy={200 - idle} rx={70} ry={12} fill="#000" opacity={0.12} />
      {hero && (
        <g>
          <path
            d={`M-62 -40 Q-140 ${90 + Math.sin(f / 6) * 14} ${-150 + Math.sin(f / 5) * 12} ${fly ? 120 : 200} Q-40 ${fly ? 150 : 215 + Math.sin(f / 4) * 8} 40 ${fly ? 160 : 205} Q${120 + Math.sin(f / 6) * 10} ${fly ? 110 : 180} 62 -40 Z`}
            fill={VIMI.cape}
            stroke={VIMI.ink}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <path d={`M-40 -20 Q-90 80 -100 ${fly ? 120 : 190}`} stroke={VIMI.capeIn} strokeWidth={10} fill="none" opacity={0.6} />
        </g>
      )}
      {/* legs */}
      <g fill={VIMI.ink}>
        <rect x={-38} y={130} width={18} height={50} rx={9} />
        <rect x={20} y={130} width={18} height={50} rx={9} />
        <ellipse cx={-34} cy={182} rx={22} ry={11} />
        <ellipse cx={34} cy={182} rx={22} ry={11} />
      </g>
      {/* arms */}
      <g stroke={VIMI.ink} strokeWidth={14} strokeLinecap="round">
        <line x1={L.sx} y1={L.sy} x2={L.ex} y2={L.ey} />
        <line x1={R.sx} y1={R.sy} x2={R.ex} y2={R.ey} />
      </g>
      <circle cx={L.ex} cy={L.ey} r={15} fill="#fff" stroke={VIMI.ink} strokeWidth={6} />
      <circle cx={R.ex} cy={R.ey} r={15} fill="#fff" stroke={VIMI.ink} strokeWidth={6} />
      {thumbR && <rect x={R.ex - 6} y={R.ey - 34} width={12} height={24} rx={6} fill="#fff" stroke={VIMI.ink} strokeWidth={5} />}
      {/* antenna sun */}
      <line x1={0} y1={-140} x2={6} y2={-182} stroke={VIMI.ink} strokeWidth={7} strokeLinecap="round" />
      <g transform={`translate(8 -196) rotate(${f * 1.2})`}>
        <circle r={30 + glow * 10} fill={VIMI.sun} opacity={0.25 * glow + 0.05} />
        {Array.from({length: 8}).map((_, i) => (
          <rect key={i} x={-3.5} y={-30} width={7} height={11} rx={3.5} fill={VIMI.sun} transform={`rotate(${i * 45})`} />
        ))}
        <circle r={15} fill={VIMI.sun} stroke={VIMI.ink} strokeWidth={5} />
      </g>
      {/* body capsule */}
      <clipPath id="vimiBody">
        <rect x={-80} y={-145} width={160} height={290} rx={80} />
      </clipPath>
      <g clipPath="url(#vimiBody)">
        <rect x={-80} y={-145} width={160} height={290} fill={VIMI.bottom} />
        <path d="M-90 -145 L90 -145 L90 22 Q45 34 0 22 Q-45 10 -90 22 Z" fill={VIMI.top} />
        <rect x={40} y={-145} width={50} height={290} fill="#000" opacity={0.07} />
        <rect x={-58} y={-118} width={22} height={70} rx={11} fill="#fff" opacity={0.45} />
      </g>
      <rect x={-80} y={-145} width={160} height={290} rx={80} fill="none" stroke={VIMI.ink} strokeWidth={7} />
      <path d="M-80 22 Q-45 10 0 22 Q45 34 80 22" fill="none" stroke={VIMI.ink} strokeWidth={5} />
      {hero && (
        <g>
          <path d="M-80 30 Q0 50 80 30 L80 52 Q0 72 -80 52 Z" fill={VIMI.ink} />
          <rect x={-18} y={36} width={36} height={26} rx={6} fill={VIMI.sun} stroke={VIMI.ink} strokeWidth={4} />
        </g>
      )}
      {/* belly badge: "v" */}
      <circle cx={0} cy={96} r={30} fill={VIMI.top} stroke={VIMI.ink} strokeWidth={5} />
      <path d="M-13 84 L0 110 L13 84" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      {/* face */}
      <g>
        {eye(-30, false)}
        {eye(30, mood === 'wink')}
        {hero && (
          <path
            d="M-74 -62 Q-30 -82 0 -64 Q30 -82 74 -62 L80 -50 Q60 -20 30 -24 Q8 -28 0 -38 Q-8 -28 -30 -24 Q-60 -20 -80 -50 Z"
            fill={VIMI.cape}
            stroke={VIMI.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        )}
        {hero && eye(-30, false)}
        {hero && eye(30, mood === 'wink')}
        {glasses && (
          <g fill="none" stroke={VIMI.ink} strokeWidth={6}>
            <circle cx={-30} cy={-48} r={28} />
            <circle cx={30} cy={-48} r={28} />
            <path d="M-2 -52 Q0 -58 2 -52" />
          </g>
        )}
        <line x1={-44} y1={-88 + brow[0] * 0.4} x2={-16} y2={-88 - brow[0] * 0.4} stroke={VIMI.ink} strokeWidth={6} strokeLinecap="round" />
        <line x1={16} y1={-88 - brow[1] * 0.4} x2={44} y2={-88 + brow[1] * 0.4} stroke={VIMI.ink} strokeWidth={6} strokeLinecap="round" />
        <g transform="translate(0 0)">{mouth}</g>
        <ellipse cx={-56} cy={-14} rx={11} ry={7} fill={VIMI.cheek} opacity={0.6} />
        <ellipse cx={56} cy={-14} rx={11} ry={7} fill={VIMI.cheek} opacity={0.6} />
      </g>
    </g>
  );
};
