import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {theme} from './theme';
import {pop, smooth, lerp} from './util';
import {Person, Particles, Words, Tag, Rings, ez} from './kit';

export const PAL = {
  s1: {bg: 'radial-gradient(circle at 80% 18%, #FFD166 0%, #FF9F1C 45%, #F3722C 100%)', fg: '#1F0F00', sub: '#FFF4DE'},
  s2: {bg: 'radial-gradient(circle at 30% 20%, #17616C 0%, #0E3B43 60%, #082A30 100%)', fg: '#F5F1E8', sub: '#FFB627'},
  s3: {bg: 'radial-gradient(circle at 50% 40%, #4A3AA8 0%, #2B1E5C 60%, #1A1240 100%)', fg: '#FFFFFF', sub: '#FFB627'},
  s4: {bg: 'linear-gradient(180deg, #0B1226 0%, #16213E 60%, #1E2D52 100%)', fg: '#FFFFFF', sub: '#5DA9FF'},
  s5: {bg: 'radial-gradient(circle at 50% 35%, #FFF8E8 0%, #FFE9BF 70%, #FFD98A 100%)', fg: '#1A1714', sub: '#E07A00'},
  s6: {bg: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)', fg: '#0F2E1E', sub: '#1FA463'},
  s7: {bg: 'radial-gradient(circle at 50% 30%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)', fg: '#1A1714', sub: '#1A1714'},
};

const Pad: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{position: 'absolute', left: 90, right: 120, top: 280}}>{children}</div>;

// ===== S1 HOOK (0 – 5.6) =====
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const P = PAL.s1;
  const sunP = pop(f, 0, 30, 14);
  const gauge = lerp(0.9, 0.18, ez(f, 2.0, 3.2));
  const stamp = pop(f, 3.6, 30, 9);
  const mood = f / 30 < 2.0 ? 'happy' : f / 30 < 3.6 ? 'sad' : 'wow';
  return (
    <AbsoluteFill style={{background: P.bg}}>
      {/* sunburst */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(860 470) rotate(${f * 0.5}) scale(${sunP})`}>
          {Array.from({length: 18}).map((_, i) => (
            <path key={i} d="M0 0 L-60 -1400 L60 -1400 Z" fill="#FFF4DE" opacity={0.12} transform={`rotate(${i * 20})`} />
          ))}
          <circle r={190} fill="#FFE29A" opacity={0.5} />
          <circle r={150} fill="#FFF4DE" />
        </g>
      </svg>
      <Particles seed="s1" n={26} color="#FFF4DE" kind="dot" size={16} opacity={0.55} />
      {/* palm leaves */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(-40 1260) rotate(${Math.sin(f / 18) * 3})`} fill="#1F0F00" opacity={0.85}>
          {[-60, -30, 0, 30].map((a, i) => (
            <path key={i} d="M0 0 Q140 -80 300 -20 Q150 -40 0 0 Z" transform={`rotate(${a - 20})`} />
          ))}
        </g>
      </svg>
      <Pad>
        <Tag text="NEGARA TROPIS" at={0} color={P.fg} bg="rgba(255,244,222,0.6)" />
        <div style={{height: 26}} />
        <Words text={'Matahari\nmelimpah,'} at={0.1} size={112} color={P.fg} />
        <div style={{height: 14}} />
        <Words text={'tapi kurang\nvitamin D?'} at={1.6} size={112} color={P.fg} hi={['vitamin', 'D?']} hiColor="#FFF4DE" />
      </Pad>
      {/* person + gauge */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g opacity={ez(f, 0.5, 1.0)}>
          <Person x={400} y={1030} s={1.2} shirt="#3B6EA8" mood={mood} armL={f / 30 < 2 ? 150 + Math.sin(f / 3) * 15 : 15} armR={20} sweat />
        </g>
        {/* vertical gauge */}
        <g transform="translate(700 900)" opacity={ez(f, 1.8, 2.2)}>
          <rect x={0} y={0} width={90} height={320} rx={45} fill="rgba(255,244,222,0.35)" stroke={P.fg} strokeWidth={6} />
          <rect x={12} y={12 + 296 * (1 - gauge)} width={66} height={296 * gauge} rx={33} fill={gauge < 0.4 ? '#C1121F' : '#FFF4DE'} />
          <text x={45} y={370} textAnchor="middle" fontFamily={theme.mono} fontSize={28} fill={P.fg}>
            VIT D
          </text>
          <text x={120} y={30 + 280 * (1 - gauge)} fontFamily={theme.title} fontWeight={800} fontSize={44} fill={P.fg}>
            {Math.round(gauge * 100)}%
          </text>
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 1190,
          scale: `${stamp}`,
          rotate: `${-7 + (1 - stamp) * 25}deg`,
          padding: '16px 34px',
          background: '#1F0F00',
          color: '#FFD166',
          borderRadius: 16,
          fontFamily: theme.title,
          fontWeight: 800,
          fontSize: 64,
        }}
      >
        UMUM BANGET!
      </div>
    </AbsoluteFill>
  );
};

// ===== S2 HORMONE / SKIN (5.6 – 11.75) =====
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const P = PAL.s2;
  const S = 5.6;
  const t = (g: number) => g - S;
  const lens = pop(f, t(8.6), 30, 14);
  const rays = ez(f, t(10.4), t(11.0));
  const make = ez(f, t(10.9), t(11.7));
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Particles seed="s2" n={22} color="#5FD3C4" kind="ring" size={22} opacity={0.35} speed={0.6} />
      <Rings cx={900} cy={420} r={220} color="#5FD3C4" />
      <Pad>
        <Tag text="FAKTA 01" at={0} color={P.sub} bg="rgba(255,182,39,0.15)" />
        <div style={{height: 24}} />
        <Words text={'Vitamin D itu\nlebih mirip hormon'} at={0.1} size={92} color={P.fg} hi={['hormon']} hiColor={P.sub} />
      </Pad>
      {/* hormone messenger icon */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(150 640) scale(${pop(f, t(7.7))})`}>
          <circle r={70} fill={P.sub} />
          <path d="M-34 -18 h68 v40 h-68 Z M-34 -18 L0 8 L34 -18" fill="none" stroke="#0E3B43" strokeWidth={7} strokeLinejoin="round" />
          <circle r={90 + (f % 30) * 2} fill="none" stroke={P.sub} strokeWidth={3} opacity={1 - (f % 30) / 30} />
        </g>
        {/* person + magnifier line */}
        <g opacity={ez(f, t(8.4), t(8.9))}>
          <Person x={200} y={930} s={1.25} shirt="#FFB627" skin="#E8B48C" mood="happy" armR={70} />
          <line x1={330} y1={960} x2={lerp(330, 470, lens)} y2={lerp(960, 960, lens)} stroke={P.sub} strokeWidth={5} strokeDasharray="10 8" />
          <circle cx={326} cy={963} r={22} fill="none" stroke={P.sub} strokeWidth={5} />
        </g>
        {/* lens view */}
        <g transform={`translate(720 990) scale(${lens})`}>
          <clipPath id="lens">
            <circle r={250} />
          </clipPath>
          <g clipPath="url(#lens)">
            <rect x={-260} y={-260} width={520} height={520} fill="#0B2F35" />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={-180 + i * 90} y1={-260} x2={-180 + i * 90 + 40 * rays} y2={-260 + 260 * rays} stroke="#FFD166" strokeWidth={10} strokeLinecap="round" strokeDasharray="18 14" strokeDashoffset={-f * 4} opacity={rays} />
            ))}
            <path d={`M-260 20 Q-130 ${-10 + Math.sin(f / 10) * 8} 0 20 T 260 20 L260 260 L-260 260 Z`} fill="#F4C9A2" />
            <rect x={-260} y={110} width={520} height={150} fill="#E8A57E" />
            {Array.from({length: 7}).map((_, i) => {
              const c = Math.max(0, Math.min(1, (make - i * 0.08) * 1.7));
              const x = -180 + i * 60;
              const y = 50 - c * 110 + Math.sin(f / 7 + i) * 6;
              return (
                <g key={i} opacity={c} transform={`translate(${x} ${y}) scale(${0.6 + c * 0.4})`}>
                  <circle r={26} fill="#FFB627" />
                  <text y={9} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={22} fill="#0E3B43">
                    D3
                  </text>
                </g>
              );
            })}
          </g>
          <circle r={250} fill="none" stroke={P.sub} strokeWidth={12} />
          <text x={-250} y={-275} fontFamily={theme.mono} fontSize={28} fill={P.sub} letterSpacing={3} opacity={rays}>
            SINAR UVB → KULIT
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ===== S3 ACTIVATION PATHWAY (11.75 – 19.3) =====
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const P = PAL.s3;
  const S = 11.75;
  const t = (g: number) => g - S;
  const ps = 1.9;
  const ox = 540;
  const oy = 640;
  const hand = {x: ox + 91, y: oy + 226};
  const liver = {x: ox - 40, y: oy + 140};
  const kid = {x: ox + 34, y: oy + 205};
  const g1 = ez(f, t(12.0), t(12.6));
  const g2 = ez(f, t(12.8), t(13.6));
  const act = ez(f, t(14.3), t(14.9));
  const px = g2 > 0 ? lerp(liver.x, kid.x, g2) : lerp(hand.x, liver.x, g1);
  const py = g2 > 0 ? lerp(liver.y, kid.y, g2) : lerp(hand.y, liver.y, g1);
  const c1 = smooth(f, t(15.9));
  const c2 = smooth(f, t(17.8));
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Particles seed="s3" n={28} color="#B9AEFF" kind="plus" size={20} opacity={0.4} speed={0.7} />
      <Rings cx={540} cy={850} r={360} color="#B9AEFF" o={0.15} />
      <Pad>
        <Tag text="FAKTA 02 · JALUR AKTIVASI" at={0} color={P.sub} bg="rgba(255,182,39,0.15)" />
        <div style={{height: 20}} />
        <Words text={'Diaktifkan hati & ginjal'} at={0.05} size={70} color={P.fg} hi={['hati', 'ginjal']} hiColor={P.sub} />
      </Pad>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g opacity={ez(f, 0, 0.5)}>
          <Person x={ox} y={oy} s={ps} shirt="rgba(255,255,255,0.16)" skin="#D9A57F" hair="#120C2E" mood="happy" bob={0} />
          {/* liver */}
          <path d={`M${liver.x - 50} ${liver.y - 10} Q${liver.x - 40} ${liver.y - 45} ${liver.x + 20} ${liver.y - 35} Q${liver.x + 55} ${liver.y - 30} ${liver.x + 40} ${liver.y} Q${liver.x} ${liver.y + 30} ${liver.x - 50} ${liver.y - 10} Z`} fill="#B5543C" opacity={0.4 + 0.6 * ez(f, t(12.2), t(12.6))} stroke={g1 >= 1 ? '#FFB627' : 'none'} strokeWidth={5} />
          {/* kidneys */}
          {[-1, 1].map((sd) => (
            <ellipse key={sd} cx={ox + sd * 36} cy={kid.y} rx={20} ry={30} fill="#C94F6D" opacity={0.4 + 0.6 * ez(f, t(12.9), t(13.3))} stroke={act > 0.5 ? '#FFB627' : 'none'} strokeWidth={5} />
          ))}
          {/* activation glow */}
          <circle cx={kid.x - 34} cy={kid.y} r={60 + act * 40 + Math.sin(f / 4) * 6 * act} fill="#FFB627" opacity={act * 0.25} />
        </g>
        {/* travelling D3 */}
        <g opacity={f / 30 > t(11.9) && act < 1 ? 1 : 0} transform={`translate(${px} ${py})`}>
          <circle r={24} fill="#FFB627" />
          <text y={8} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={20} fill="#2B1E5C">
            D
          </text>
        </g>
        {/* labels */}
        <g opacity={ez(f, t(12.3), t(12.7))}>
          <line x1={liver.x - 50} y1={liver.y - 10} x2={250} y2={700} stroke="#fff" strokeWidth={3} />
          <text x={90} y={690} fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#fff">
            HATI
          </text>
        </g>
        <g opacity={ez(f, t(13.0), t(13.4))}>
          <line x1={kid.x + 20} y1={kid.y} x2={820} y2={760} stroke="#fff" strokeWidth={3} />
          <text x={830} y={770} fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#fff">
            GINJAL
          </text>
        </g>
        <g transform={`translate(${kid.x + 40} ${kid.y + 70}) scale(${pop(f, t(14.5))})`}>
          <rect x={-10} y={-34} width={300} height={56} rx={28} fill="#FFB627" />
          <text x={140} y={4} textAnchor="middle" fontFamily={theme.mono} fontWeight={500} fontSize={26} fill="#2B1E5C">
            BENTUK AKTIF ✓
          </text>
        </g>
      </svg>
      {/* outcome cards */}
      <div style={{position: 'absolute', left: 60, top: 1010, width: 400, opacity: c1, translate: `${(1 - c1) * -200}px 0px`}}>
        <div style={{background: '#fff', borderRadius: 28, padding: '22px 26px', boxShadow: '0 20px 0 rgba(0,0,0,0.18)'}}>
          <div style={{fontFamily: theme.mono, fontSize: 24, color: '#6B5FB3', letterSpacing: '0.12em'}}>MEMBANTU</div>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 44, color: '#1A1240', lineHeight: 1.05}}>Serap kalsium</div>
          <svg width={340} height={80}>
            <g fill="#F4ECFF" stroke="#1A1240" strokeWidth={5}>
              <rect x={40} y={26} width={250} height={28} rx={14} />
              <circle cx={36} cy={28} r={18} />
              <circle cx={36} cy={54} r={18} />
              <circle cx={296} cy={28} r={18} />
              <circle cx={296} cy={54} r={18} />
            </g>
            {Array.from({length: 7}).map((_, i) => {
              const p = Math.max(0, Math.min(1, (f - (t(16.3) * 30 + i * 5)) / 16));
              return <circle key={i} cx={70 + i * 32} cy={lerp(-12, 40, p)} r={8} fill="#FFB627" opacity={p > 0 ? 1 : 0} />;
            })}
          </svg>
        </div>
      </div>
      <div style={{position: 'absolute', right: 120, top: 1010, width: 360, opacity: c2, translate: `${(1 - c2) * 200}px 0px`}}>
        <div style={{background: '#fff', borderRadius: 28, padding: '22px 26px', boxShadow: '0 20px 0 rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 18}}>
          <svg width={96} height={110} viewBox="0 0 140 160">
            <path d="M70 8 L130 30 L130 80 Q130 130 70 152 Q10 130 10 80 L10 30 Z" fill="#FFB627" stroke="#1A1240" strokeWidth={6} />
            <path d="M42 80 L62 100 L100 58" fill="none" stroke="#1A1240" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - ez(f, t(18.4), t(18.9)))} />
          </svg>
          <div>
            <div style={{fontFamily: theme.mono, fontSize: 24, color: '#6B5FB3', letterSpacing: '0.12em'}}>MENDUKUNG</div>
            <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 44, color: '#1A1240', lineHeight: 1.05}}>Sistem imun</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===== S4 INDOOR (19.3 – 27.9) =====
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const P = PAL.s4;
  const S = 19.3;
  const t = (g: number) => g - S;
  const blinds = ez(f, t(22.6), t(23.4));
  const sunX = lerp(700, 980, ez(f, 0, t(27.9)));
  const drain = ez(f, t(24.6), t(27.0));
  const level = lerp(0.9, 0.12, drain);
  const minim = pop(f, t(27.1), 30, 9);
  const clockSpin = f * 8;
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Particles seed="s4" n={30} color="#9CC7FF" kind="star" size={9} opacity={0.5} speed={0.3} />
      <Pad>
        <Tag text="MASALAHNYA" at={0} color="#FF7A59" bg="rgba(255,122,89,0.15)" />
        <div style={{height: 22}} />
        <Words text={'Kita jarang\nkena matahari'} at={0.1} size={100} color={P.fg} hi={['matahari']} hiColor="#FFD166" />
      </Pad>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {/* room wall */}
        <g opacity={ez(f, t(21.0), t(21.6))} transform={`translate(0 ${(1 - ez(f, t(21.0), t(21.6))) * 80})`}>
          <rect x={60} y={640} width={900} height={560} rx={30} fill="#22305A" />
          {/* window */}
          <clipPath id="win">
            <rect x={600} y={690} width={300} height={260} rx={10} />
          </clipPath>
          <g clipPath="url(#win)">
            <rect x={600} y={690} width={300} height={260} fill="#7EC8FF" />
            <circle cx={sunX} cy={770} r={52} fill="#FFD166" />
            <circle cx={sunX} cy={770} r={70 + Math.sin(f / 5) * 4} fill="#FFD166" opacity={0.3} />
            {Array.from({length: 8}).map((_, i) => (
              <rect key={i} x={600} y={690 + i * 33} width={300} height={31 * blinds} fill="#2D4C8A" />
            ))}
          </g>
          <rect x={600} y={690} width={300} height={260} rx={10} fill="none" stroke="#0B1226" strokeWidth={10} />
          {/* clock */}
          <g transform="translate(250 740)">
            <circle r={62} fill="#F5F1E8" stroke="#0B1226" strokeWidth={8} />
            <line x1={0} y1={0} x2={0} y2={-42} stroke="#0B1226" strokeWidth={6} strokeLinecap="round" transform={`rotate(${clockSpin})`} />
            <line x1={0} y1={0} x2={0} y2={-28} stroke="#0B1226" strokeWidth={8} strokeLinecap="round" transform={`rotate(${clockSpin / 12})`} />
          </g>
          {/* desk + person sitting + laptop glow */}
          <rect x={150} y={1050} width={460} height={18} rx={9} fill="#0B1226" />
          <rect x={190} y={1068} width={14} height={130} fill="#0B1226" />
          <rect x={556} y={1068} width={14} height={130} fill="#0B1226" />
          <Person x={300} y={895} s={1.0} shirt="#5DA9FF" mood={drain > 0.3 ? 'sad' : 'neutral'} armL={60} armR={70} sit flip />
          <path d="M380 1050 L420 960 L540 960 L520 1050 Z" fill="#9AA8C7" />
          <path d="M300 1050 L470 960 L560 1050 Z" fill="#9CC7FF" opacity={0.12 + Math.sin(f / 6) * 0.03} />
        </g>
        {/* no-sun badge */}
        <g transform={`translate(860 590) scale(${pop(f, t(22.7))})`}>
          <circle r={64} fill="#FF7A59" />
          <circle r={26} fill="#FFD166" />
          {Array.from({length: 8}).map((_, i) => (
            <rect key={i} x={-4} y={-50} width={8} height={14} rx={4} fill="#FFD166" transform={`rotate(${i * 45})`} />
          ))}
          <line x1={-44} y1={-44} x2={-44 + 88 * ez(f, t(23.2), t(23.6))} y2={-44 + 88 * ez(f, t(23.2), t(23.6))} stroke="#0B1226" strokeWidth={10} strokeLinecap="round" />
        </g>
        {/* battery */}
        <g transform="translate(110 1110)" opacity={ez(f, t(24.5), t(24.9))}>
          <rect x={0} y={0} width={340} height={70} rx={16} fill="#0B1226" stroke="#F5F1E8" strokeWidth={5} />
          <rect x={340} y={22} width={14} height={26} rx={4} fill="#F5F1E8" />
          <rect x={9} y={9} width={322 * level} height={52} rx={10} fill={level < 0.35 ? '#FF5A36' : '#7CE38B'} />
          <text x={380} y={50} fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#fff">
            {Math.round(level * 100)}%
          </text>
          <text x={0} y={-16} fontFamily={theme.mono} fontSize={26} fill="#9CC7FF" letterSpacing={3}>
            PRODUKSI VIT D · ilustrasi
          </text>
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          right: 140,
          top: 1110,
          scale: `${minim}`,
          rotate: '-8deg',
          fontFamily: theme.title,
          fontWeight: 800,
          fontSize: 66,
          color: '#fff',
          background: '#FF5A36',
          padding: '8px 30px',
          borderRadius: 14,
        }}
      >
        MINIM
      </div>
    </AbsoluteFill>
  );
};

// ===== softgel =====
const Softgel: React.FC<{w: number; rot?: number}> = ({w, rot = 0}) => (
  <svg width={w} height={w * 0.56} viewBox="0 0 200 112" style={{rotate: `${rot}deg`, overflow: 'visible'}}>
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE9A8" />
        <stop offset="0.55" stopColor="#F5B21E" />
        <stop offset="1" stopColor="#C97A00" />
      </linearGradient>
    </defs>
    <ellipse cx={100} cy={56} rx={96} ry={52} fill="url(#sg)" />
    <ellipse cx={72} cy={32} rx={44} ry={12} fill="#fff" opacity={0.6} />
  </svg>
);

// ===== S5 D3 + PRODUCT (27.9 – 35.6) =====
export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const P = PAL.s5;
  const S = 27.9;
  const t = (g: number) => g - S;
  const d3 = pop(f, t(29.9), 30, 9);
  const card = smooth(f, t(32.4));
  const iu = Math.round(interpolate(f, [t(34.0) * 30, t(35.0) * 30], [0, 1000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Particles seed="s5" n={18} color="#F5B21E" kind="cap" size={22} opacity={0.35} speed={0.8} />
      {/* hex molecule */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(820 640) rotate(${f * 0.4}) scale(${pop(f, t(30.9))})`} stroke="#E07A00" strokeWidth={6} fill="none" opacity={0.55}>
          {[
            [0, 0],
            [104, 60],
            [104, -60],
            [-104, 60],
          ].map(([x, y], i) => (
            <polygon key={i} points="60,0 30,52 -30,52 -60,0 -30,-52 30,-52" transform={`translate(${x} ${y})`} />
          ))}
          <circle cx={208} cy={0} r={14} fill="#E07A00" />
          <line x1={164} y1={0} x2={194} y2={0} />
        </g>
      </svg>
      <Pad>
        <Tag text="KALAU BUTUH SUPLEMEN" at={0} color={P.sub} bg="rgba(224,122,0,0.12)" />
        <div style={{position: 'absolute', top: 90, opacity: 1 - ez(f, t(29.5), t(29.85))}}>
          <Words text={'Pilih bentuk\nyang tepat'} at={0.1} size={110} color={P.fg} hi={['tepat']} hiColor={P.sub} />
          <div style={{marginTop: 60, marginLeft: 200, rotate: `${f * 1.5}deg`, scale: `${pop(f, 0.4)}`, width: 360}}>
            <Softgel w={360} />
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 30, opacity: d3 > 0.01 ? 1 : 0}}>
          <div style={{scale: `${d3}`, rotate: `${(1 - d3) * -20}deg`, fontFamily: theme.title, fontWeight: 800, fontSize: 230, color: P.sub, letterSpacing: '-0.05em', lineHeight: 1}}>D3</div>
        </div>
        <div style={{marginTop: 6}}>
          <Words text={'= kolekalsiferol'} at={t(30.9)} size={64} color={P.fg} stagger={0.05} />
        </div>
      </Pad>
      {/* product card */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 110,
          top: 760,
          height: 450,
          borderRadius: 40,
          background: '#1A1714',
          padding: 44,
          opacity: card,
          translate: `0px ${(1 - card) * 400}px`,
          rotate: `${(1 - card) * 6}deg`,
          overflow: 'hidden',
          boxShadow: '0 24px 0 rgba(224,122,0,0.35)',
        }}
      >
        <div style={{position: 'absolute', right: -120, top: -120, width: 420, height: 420, borderRadius: 210, background: 'radial-gradient(circle, rgba(245,178,30,0.45), rgba(245,178,30,0))'}} />
        <div style={{fontFamily: theme.mono, fontSize: 26, color: '#FFD98A', letterSpacing: '0.2em'}}>CONTOHNYA</div>
        <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 70, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.02, marginTop: 10}}>
          Blackmores
          <br />
          Vitamin D3
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 10}}>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 120, color: '#F5B21E', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em'}}>{iu}</div>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 56, color: '#F5B21E'}}>IU</div>
        </div>
        <div style={{fontFamily: theme.mono, fontSize: 26, color: '#CFC6BA'}}>25 mcg kolekalsiferol / kapsul</div>
        {[0, 1, 2].map((i) => {
          const p = pop(f, t(32.8) + i * 0.15, 30, 9);
          return (
            <div key={i} style={{position: 'absolute', right: 30 + i * 60, top: 60 + i * 110 + Math.sin(f / 12 + i) * 12, scale: `${p}`}}>
              <Softgel w={190 - i * 30} rot={-20 + i * 25 + Math.sin(f / 18 + i) * 8} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===== S6 HOW TO (35.6 – 42.4) =====
const Chip: React.FC<{at: number; big: string; small: string; icon: React.ReactNode}> = ({at, big, small, icon}) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 30, 13);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        background: '#fff',
        borderRadius: 26,
        padding: '18px 24px',
        opacity: Math.min(1, p * 1.5),
        translate: `${(1 - p) * -160}px 0px`,
        rotate: `${(1 - p) * -4}deg`,
        marginBottom: 18,
        width: 600,
        boxShadow: '0 12px 0 rgba(15,46,30,0.12)',
      }}
    >
      <div style={{width: 92, height: 92, borderRadius: 22, background: '#E3F6EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
      <div>
        <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 44, color: '#0F2E1E', letterSpacing: '-0.02em', lineHeight: 1.05}}>{big}</div>
        <div style={{fontFamily: theme.mono, fontSize: 22, color: '#4E7A61', marginTop: 4}}>{small}</div>
      </div>
    </div>
  );
};

const Check: React.FC<{at: number; fill?: string}> = ({at, fill = '#1FA463'}) => {
  const f = useCurrentFrame();
  return (
    <svg width={64} height={64} viewBox="0 0 70 70">
      <circle cx={35} cy={35} r={30} fill={fill} style={{scale: `${pop(f, at)}`, transformOrigin: '35px 35px'}} />
      <path d="M20 36 L31 47 L51 24" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - ez(f, at + 0.2, at + 0.6))} />
    </svg>
  );
};

export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const P = PAL.s6;
  const S = 35.6;
  const t = (g: number) => g - S;
  const thumbs = f / 30 > t(38.8);
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Particles seed="s6" n={24} color="#1FA463" kind="plus" size={18} opacity={0.3} />
      <Rings cx={860} cy={1000} r={240} color="#1FA463" o={0.2} />
      <Pad>
        <Tag text="CARA PAKAI" at={0} color={P.sub} bg="rgba(31,164,99,0.14)" />
        <div style={{height: 28}} />
        <Chip at={t(35.8)} big="1 kapsul / hari" small="sesuai aturan pakai" icon={<Softgel w={74} rot={-20} />} />
        <Chip at={t(37.4)} big="Terdaftar BPOM" small="SI204309461" icon={<Check at={t(37.6)} />} />
        <Chip at={t(38.8)} big="Halal" small="cek label kemasan" icon={<Check at={t(39.0)} fill="#0F2E1E" />} />
        <Chip
          at={t(39.6)}
          big="Setelah makan"
          small="larut lemak → serap lebih baik"
          icon={
            <svg width={80} height={80} viewBox="0 0 90 90">
              <ellipse cx={45} cy={60} rx={38} ry={13} fill="#fff" stroke="#0F2E1E" strokeWidth={5} />
              <circle cx={33} cy={52} r={9} fill="#F4A261" />
              <circle cx={52} cy={50} r={10} fill="#2A9D8F" />
              <path d="M45 6 C 37 20 33 26 33 32 A12 12 0 0 0 57 32 C57 26 53 20 45 6 Z" fill="#F5B21E" style={{translate: `0px ${ez(f, t(41.1), t(41.8)) * 18}px`, opacity: 1 - ez(f, t(41.1), t(41.8)) * 0.8}} />
            </svg>
          }
        />
      </Pad>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g opacity={ez(f, 0.2, 0.7)}>
          <Person x={860} y={930} s={1.35} shirt="#1FA463" skin="#E8B48C" mood={thumbs ? 'happy' : 'neutral'} armR={thumbs ? 150 : 20} armL={15} />
          {thumbs && (
            <g transform={`translate(${860 + 34 * 1.35 + Math.sin((150 * Math.PI) / 180) * 80 * 1.35} ${930 + 40 * 1.35 + Math.cos((150 * Math.PI) / 180) * 80 * 1.35}) scale(${pop(f, t(38.8))})`}>
              <circle r={22} fill="#E8B48C" />
              <rect x={-7} y={-46} width={14} height={30} rx={7} fill="#E8B48C" />
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ===== S7 CTA (42.4 – end) =====
export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const P = PAL.s7;
  const S = 42.4;
  const t = (g: number) => g - S;
  const phone = smooth(f, 0);
  const tap = ez(f, t(43.0), t(43.5));
  const tapRing = (f - t(43.0) * 30) / 20;
  const disc = pop(f, t(44.0), 30, 14);
  const follow = pop(f, t(48.0), 30, 9);
  const tap2 = (f - t(48.4) * 30) / 20;
  return (
    <AbsoluteFill style={{background: P.bg}}>
      <Particles seed="s7" n={26} color="#FFF4DE" kind="star" size={16} opacity={0.6} />
      <Pad>
        <Tag text="CEK SEKARANG" at={0} color={P.fg} bg="rgba(255,255,255,0.5)" />
        <div style={{height: 20}} />
        <Words text={'Cek keranjang\nkuning'} at={0.1} size={100} color={P.fg} hi={['kuning']} hiColor="#FFFFFF" />
      </Pad>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {/* phone */}
        <g transform={`translate(610 ${lerp(1300, 660, phone)}) rotate(${(1 - phone) * 10 + Math.sin(f / 25) * 1.5})`}>
          <rect x={0} y={0} width={340} height={600} rx={44} fill="#1A1714" />
          <rect x={14} y={14} width={312} height={572} rx={34} fill="#2E2A26" />
          <rect x={30} y={60} width={280} height={330} rx={20} fill="#FFF6E8" />
          <circle cx={170} cy={210} r={60} fill="#F29A0C" />
          <text x={170} y={226} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={46} fill="#fff">
            D3
          </text>
          {/* cart button */}
          <g transform={`translate(30 420) scale(${1 - tap * 0.06 + (tap >= 1 ? 0.06 : 0)})`}>
            <rect x={0} y={0} width={280} height={86} rx={20} fill="#FFC21A" />
            <path d="M28 26 L42 26 L52 60 L92 60 L100 36 L46 36" fill="none" stroke="#1A1714" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={58} cy={70} r={6} fill="#1A1714" />
            <circle cx={86} cy={70} r={6} fill="#1A1714" />
            <text x={120} y={56} fontFamily={theme.title} fontWeight={800} fontSize={34} fill="#1A1714">
              Beli
            </text>
          </g>
          {tapRing > 0 && tapRing < 1 && <circle cx={170} cy={463} r={20 + tapRing * 90} fill="none" stroke="#fff" strokeWidth={8} opacity={1 - tapRing} />}
          {/* finger */}
          <g transform={`translate(${lerp(420, 190, ez(f, t(42.6), t(43.0)))} ${lerp(700, 480, ez(f, t(42.6), t(43.0)))})`}>
            <circle r={30} fill="#E8B48C" stroke="#1A1714" strokeWidth={5} />
          </g>
        </g>
        {/* pointing person */}
        <g opacity={ez(f, 0.3, 0.8)}>
          <Person x={260} y={960} s={1.3} shirt="#1A1714" skin="#E8B48C" mood="happy" armR={100 + Math.sin(f / 6) * 6} armL={15} />
        </g>
      </svg>
      {/* disclaimer */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 560,
          width: 440,
          opacity: 1 - ez(f, t(47.6), t(47.95)),
          background: '#1A1714',
          color: '#FFF4DE',
          borderRadius: 24,
          padding: '20px 26px',
          scale: `${disc}`,
          transformOrigin: 'left top',
          fontFamily: theme.title,
          fontWeight: 700,
          fontSize: 32,
          lineHeight: 1.2,
        }}
      >
        <span style={{color: '#FFC21A', fontFamily: theme.mono, fontSize: 22, letterSpacing: '0.15em'}}>PENTING</span>
        <br />
        Punya kondisi khusus? Konsultasikan dulu dengan tenaga kesehatan.
      </div>
      {/* follow pill */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 570,
          scale: `${follow}`,
          transformOrigin: 'left center',
          background: '#1A1714',
          color: '#fff',
          borderRadius: 999,
          padding: '20px 40px',
          fontFamily: theme.title,
          fontWeight: 800,
          fontSize: 40,
          boxShadow: '0 10px 0 rgba(0,0,0,0.2)',
        }}
      >
        <span style={{color: '#FFC21A'}}>+</span> Follow @vitamien.io
        {tap2 > 0 && tap2 < 1 && <div style={{position: 'absolute', right: 40, top: '50%', width: 40 + tap2 * 120, height: 40 + tap2 * 120, marginTop: -(20 + tap2 * 60), marginRight: -(tap2 * 60), borderRadius: 999, border: '6px solid #fff', opacity: 1 - tap2}} />}
      </div>
    </AbsoluteFill>
  );
};
