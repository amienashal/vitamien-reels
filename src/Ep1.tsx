import React from 'react';
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, Caption} from '@remotion/captions';
import {theme} from './theme';
import {pop, lerp} from './util';
import {Person, Particles, Words, Tag, Rings, ez} from './kit';
import {Vimi} from './Mascot';
import {Hoaksin, MythSpore, HX} from './Villain';
import {OmForward} from './Cast';
import words from './ep1_words.json';

const FPS = 30;
const END = 35.6;
const TR = 14;
const NAR = 5.9;

// ---------------- scenes ----------------
const BG = {
  hook: 'radial-gradient(circle at 70% 30%, #5B2A78 0%, #2A1238 60%, #170A1F 100%)',
  hero: 'radial-gradient(circle at 30% 30%, #1C7C94 0%, #0F5E73 55%, #083845 100%)',
  dawn: 'linear-gradient(180deg, #2B2D6E 0%, #8E4B8C 35%, #F28C6B 70%, #FFC77A 100%)',
  noon: 'linear-gradient(180deg, #2E8BFF 0%, #66B6FF 50%, #BFE3FF 100%)',
  shadow: 'radial-gradient(circle at 50% 20%, #FFF3B0 0%, #FFD86B 50%, #F5B83D 100%)',
  tips: 'radial-gradient(circle at 70% 30%, #F1FBF4 0%, #CDEFD8 70%, #A8E2BC 100%)',
  win: 'radial-gradient(circle at 50% 35%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)',
};

const Pad: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{position: 'absolute', left: 90, right: 120, top: 280}}>{children}</div>;
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

// A: HOOK 0 – 5.9
const A: React.FC = () => {
  const f = useCurrentFrame();
  const big = pop(f, 0.6, 30, 11);
  const many = ez(f, 4.5, 5.4);
  return (
    <AbsoluteFill style={{background: BG.hook}}>
      <Particles seed="a" n={36} color={HX.spore} kind="dot" size={12} opacity={0.4} speed={0.6} />
      <Pad>
        <Tag text="SALAH KAPRAH #1" at={0} color={HX.spore} bg="rgba(183,240,60,0.14)" />
      </Pad>
      <Svg>
        <Hoaksin x={780} y={1010} s={1.25} mood={f < 1.5 * 30 ? 'smug' : 'laugh'} shout={f > 0.3 * 30 && f < 5 * 30 ? 1 : 0} armL={60} />
        <g opacity={ez(f, 0, 0.4)}>
          <OmForward x={240} y={1020} s={1.15} />
        </g>
        {/* the myth spore */}
        <g transform={`translate(${lerp(820, 470, ez(f, 0.6, 1.6))} ${lerp(800, 560, ez(f, 0.6, 1.6))}) scale(${big})`}>
          {Array.from({length: 12}).map((_, i) => (
            <circle key={i} cx={Math.cos((i / 12) * Math.PI * 2) * 340 * 0.95} cy={Math.sin((i / 12) * Math.PI * 2) * 140} r={70} fill={HX.spore} />
          ))}
          <ellipse rx={380} ry={160} fill={HX.spore} stroke={HX.ink} strokeWidth={8} />
          <text y={-34} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={58} fill={HX.ink} letterSpacing={-1}>
            Berjemur jam 7 pagi
          </text>
          <text y={40} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={58} fill={HX.ink} letterSpacing={-1}>
            = vitamin D maksimal!
          </text>
        </g>
        {/* spreading spores */}
        {[
          [160, 760, 'SHARE!'],
          [900, 600, 'FWD!'],
          [250, 1320, 'VIRAL!'],
          [880, 1380, 'SHARE!'],
        ].map(([x, y, t], i) => (
          <MythSpore key={i} x={Number(x)} y={Number(y)} text={String(t)} s={0.55 * Math.max(0, Math.min(1, many * 1.6 - i * 0.2))} />
        ))}
      </Svg>
    </AbsoluteFill>
  );
};

// B: VITABOY ARRIVES 5.9 – 9.36
const B: React.FC = () => {
  const f = useCurrentFrame();
  const S = 5.9;
  const t = (g: number) => g - S;
  const fly = ez(f, 0, 0.5);
  const burst = Math.max(0, Math.min(1, (f - 0.45 * 30) / 12));
  const stamp = pop(f, 0.55, 30, 8);
  const clock = pop(f, t(7.62), 30, 12);
  return (
    <AbsoluteFill style={{background: BG.hero}}>
      <Particles seed="b" n={30} color="#FFC21A" kind="star" size={12} opacity={0.5} />
      <Rings cx={540} cy={820} r={320} color="#FFC21A" o={0.2} />
      <Svg>
        {/* speed lines */}
        {fly < 1 &&
          Array.from({length: 8}).map((_, i) => (
            <line key={i} x1={lerp(-200, 540, fly) - 120 - i * 20} y1={lerp(1600, 760, fly) + 100 + i * 34} x2={lerp(-200, 540, fly) - 520} y2={lerp(1600, 760, fly) + 480 + i * 40} stroke="#FFF4DE" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
          ))}
        {/* burst of spore */}
        {burst > 0 &&
          burst < 1 &&
          Array.from({length: 16}).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={540 + Math.cos(a) * 420 * burst} cy={640 + Math.sin(a) * 420 * burst} r={30 * (1 - burst)} fill={HX.spore} />;
          })}
        <Vimi
          x={lerp(-200, f / 30 > t(7.5) ? 300 : 540, f / 30 > t(7.5) ? 1 : fly)}
          y={lerp(1600, f / 30 > t(7.5) ? 960 : 780, f / 30 > t(7.5) ? 1 : fly)}
          s={f / 30 > t(7.5) ? 1.35 : 1.8}
          fly={fly < 1}
          tilt={fly < 1 ? 28 : 0}
          mood={f / 30 > t(7.5) ? 'think' : 'smug'}
          armR={fly < 1 ? 175 : f / 30 > t(7.5) ? 150 : 35}
          armL={35}
          glow={1}
        />
      </Svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 330,
          textAlign: 'center',
          scale: `${stamp * (1 - ez(f, t(7.4), t(7.6)))}`,
          rotate: `${-6 + (1 - stamp) * 20}deg`,
        }}
      >
        <span style={{display: 'inline-block', background: '#E23E57', color: '#fff', fontFamily: theme.title, fontWeight: 800, fontSize: 110, padding: '10px 40px', borderRadius: 20, letterSpacing: '-0.03em', boxShadow: '0 12px 0 #8E1B30'}}>
          SALAH KAPRAH!
        </span>
      </div>
      {/* clock 07:00 + enak */}
      <Svg>
        <g transform={`translate(720 800) scale(${clock})`}>
          <circle r={170} fill="#FFF4DE" stroke="#1A1714" strokeWidth={12} />
          {Array.from({length: 12}).map((_, i) => (
            <rect key={i} x={-5} y={-152} width={10} height={24} rx={5} fill="#1A1714" transform={`rotate(${i * 30})`} />
          ))}
          <line x1={0} y1={0} x2={0} y2={-120} stroke="#1A1714" strokeWidth={12} strokeLinecap="round" />
          <line x1={0} y1={0} x2={-62} y2={36} stroke="#1A1714" strokeWidth={16} strokeLinecap="round" />
          <circle r={14} fill="#E23E57" />
          <text y={250} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={72} fill="#FFF4DE">
            07.00
          </text>
        </g>
        <g transform={`translate(860 590) scale(${pop(f, t(8.4))}) rotate(8)`}>
          <rect x={-110} y={-44} width={220} height={88} rx={44} fill="#B7F03C" stroke="#1A1714" strokeWidth={6} />
          <text y={18} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={48} fill="#1A1714">
            enak ✓
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// C: ATMOSPHERE 9.36 – 16.52
const C: React.FC = () => {
  const f = useCurrentFrame();
  const S = 9.36;
  const t = (g: number) => g - S;
  const rise = ez(f, 0, 1.2);
  const ray = ez(f, t(11.3), t(12.6));
  const absorb = ez(f, t(14.4), t(15.4));
  const sunX = 140;
  const sunY = lerp(1300, 1120, rise);
  return (
    <AbsoluteFill style={{background: BG.dawn}}>
      <Particles seed="c" n={24} color="#FFF4DE" kind="star" size={8} opacity={0.5} speed={0.2} />
      <Pad>
        <Tag text="KENAPA?" at={0} color="#FFF4DE" bg="rgba(255,255,255,0.18)" />
        <div style={{height: 20}} />
        <Words text={'Matahari pagi\nmasih rendah'} at={0.1} size={96} color="#FFF4DE" hi={['rendah']} hiColor="#FFC77A" />
      </Pad>
      <Svg>
        {/* atmosphere layer */}
        <path d="M-200 1700 Q540 700 1280 1700" fill="none" stroke="#9FD6FF" strokeWidth={180} opacity={0.22} />
        <path d="M-200 1700 Q540 700 1280 1700" fill="none" stroke="#FFF4DE" strokeWidth={4} strokeDasharray="12 14" opacity={0.6} />
        <text x={730} y={1000} fontFamily={theme.mono} fontSize={28} fill="#FFF4DE" letterSpacing={3}>
          ATMOSFER
        </text>
        {/* ground */}
        <path d="M-200 1760 Q540 1040 1280 1760 L1280 1920 L-200 1920 Z" fill="#2D1E4F" />
        {/* low sun */}
        <circle cx={sunX} cy={sunY} r={90} fill="#FFD166" />
        <circle cx={sunX} cy={sunY} r={130} fill="#FFD166" opacity={0.25} />
        {/* UVB ray: long oblique path, fading */}
        {Array.from({length: 7}).map((_, i) => {
          const p = Math.max(0, Math.min(1, ray * 1.4 - i * 0.12));
          const x = sunX + 90 + i * 70;
          const y = sunY - 30 + i * 18;
          const alive = i < 7 - absorb * 6;
          return (
            <g key={i} opacity={p * (alive ? 1 : 0.15)}>
              <circle cx={x} cy={y} r={20 - i * 1.8} fill="#B388FF" stroke="#1A1714" strokeWidth={3} />
              <text x={x} y={y + 6} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={14} fill="#fff">
                B
              </text>
            </g>
          );
        })}
        <g transform={`translate(${sunX + 560} ${sunY + 100}) scale(${pop(f, t(15.0))})`}>
          <rect x={-150} y={-40} width={300} height={80} rx={40} fill="#E23E57" />
          <text y={14} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#fff">
            UVB tersaring
          </text>
        </g>
        {/* tiny person waiting */}
        <Person x={860} y={1180} s={0.8} shirt="#3B6EA8" mood={absorb > 0.5 ? 'sad' : 'neutral'} armL={20} armR={20} />
        <text x={860} y={1060} textAnchor="middle" fontFamily={theme.mono} fontSize={24} fill="#FFF4DE" opacity={ez(f, t(14.6), t(15.0))}>
          vit D: sedikit...
        </text>
      </Svg>
      <Svg>
        <g opacity={ez(f, t(11.0), t(11.4))}>
          <Vimi x={900} y={720} s={0.7} mood="think" armR={150} look={[-1, 1]} glow={0.4} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// D: UVB CHART 16.52 – 20.27
const D: React.FC = () => {
  const f = useCurrentFrame();
  const S = 16.52;
  const t = (g: number) => g - S;
  const draw = ez(f, 0.1, 1.3);
  const band = ez(f, t(18.3), t(19.6));
  const W = 800;
  const x0 = 140;
  const y0 = 1230;
  const H = 430;
  const hx = (h: number) => x0 + ((h - 6) / 12) * W;
  const curve = (h: number) => Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)) ** 2.2;
  const pts = Array.from({length: 61}).map((_, i) => {
    const h = 6 + (i / 60) * 12;
    return [hx(h), y0 - curve(h) * H];
  });
  const path = 'M' + pts.map((p) => p.join(' ')).join(' L');
  const len = 1600;
  return (
    <AbsoluteFill style={{background: BG.noon}}>
      <Particles seed="d" n={14} color="#fff" kind="ring" size={26} opacity={0.35} speed={0.4} />
      <Pad>
        <Tag text="INTENSITAS UVB" at={0} color="#0B3D91" bg="rgba(255,255,255,0.5)" />
        <div style={{height: 20}} />
        <Words text={'Paling kuat\njam 9 – 15'} at={0.1} size={100} color="#0B1F3A" hi={['9', '15']} hiColor="#FFFFFF" />
      </Pad>
      <Svg>
        {/* highlight band */}
        {/* axis */}
        <line x1={x0} y1={y0} x2={x0 + W} y2={y0} stroke="#0B1F3A" strokeWidth={6} />
        {[6, 9, 12, 15, 18].map((h) => (
          <g key={h}>
            <line x1={hx(h)} y1={y0} x2={hx(h)} y2={y0 + 16} stroke="#0B1F3A" strokeWidth={5} />
            <text x={hx(h)} y={y0 + 60} textAnchor="middle" fontFamily={theme.mono} fontSize={32} fill="#0B1F3A">
              {String(h).padStart(2, '0')}
            </text>
          </g>
        ))}
        <path d={path + ` L${x0 + W} ${y0} L${x0} ${y0} Z`} fill="#7B4DFF" opacity={0.18 * draw} />
        <rect x={hx(9)} y={y0 - H - 20} width={(hx(15) - hx(9)) * band} height={H + 20} fill="#FFE27A" opacity={0.85} rx={20} />
        <path d={path} fill="none" stroke="#5B2DDF" strokeWidth={12} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        {/* 7am marker */}
        <g opacity={ez(f, 1.2, 1.6)}>
          <circle cx={hx(7)} cy={y0 - curve(7) * H} r={16} fill="#E23E57" stroke="#fff" strokeWidth={5} />
          <text x={hx(7) + 10} y={y0 - curve(7) * H - 36} fontFamily={theme.title} fontWeight={800} fontSize={34} fill="#E23E57">
            jam 7
          </text>
        </g>
        {/* sun travelling along curve */}
        {(() => {
          const h = lerp(6.5, 12, ez(f, 0.2, 3.5));
          const sx = hx(h);
          const sy = 720 - Math.sin(((h - 6) / 12) * Math.PI) * 80;
          return (
            <g transform={`translate(${sx} ${sy}) rotate(${f * 2})`}>
              {Array.from({length: 10}).map((_, i) => (
                <rect key={i} x={-5} y={-74} width={10} height={22} rx={5} fill="#FFB627" transform={`rotate(${i * 36})`} />
              ))}
              <circle r={46} fill="#FFD166" stroke="#F29A0C" strokeWidth={6} />
            </g>
          );
        })()}
        <text x={hx(12)} y={y0 - 40} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={44} fill="#0B1F3A" opacity={band}>
          ZONA UVB KUAT
        </text>
      </Svg>
    </AbsoluteFill>
  );
};

// E: SHADOW RULE 20.27 – 24.98
const E: React.FC = () => {
  const f = useCurrentFrame();
  const S = 20.27;
  const t = (g: number) => g - S;
  const up = ez(f, t(21.6), t(23.4));
  const ok = up > 0.95;
  const sunA = lerp(20, 70, up); // elevation deg
  const shadowLen = 260 / Math.tan((sunA * Math.PI) / 180); // person height 260
  const px = 420;
  const groundY = 1150;
  const sunX = px + Math.cos((sunA * Math.PI) / 180) * 560 * -1 + 520;
  const sunY = groundY - Math.sin((sunA * Math.PI) / 180) * 620;
  return (
    <AbsoluteFill style={{background: BG.shadow}}>
      <Particles seed="e" n={20} color="#fff" kind="dot" size={14} opacity={0.5} />
      <Pad>
        <Tag text="TRIK BAYANGAN" at={0} color="#7A4B00" bg="rgba(255,255,255,0.5)" />
        <div style={{height: 20}} />
        <Words text={'Bayangan pendek\n= UVB cukup'} at={0.1} size={92} color="#3A2400" hi={['pendek', 'cukup']} hiColor="#C2410C" />
      </Pad>
      <Svg>
        {/* sun */}
        <g transform={`translate(${sunX} ${sunY}) rotate(${f})`}>
          {Array.from({length: 12}).map((_, i) => (
            <rect key={i} x={-6} y={-96} width={12} height={28} rx={6} fill="#FF8A00" transform={`rotate(${i * 30})`} />
          ))}
          <circle r={62} fill="#FFF4B0" stroke="#FF8A00" strokeWidth={8} />
        </g>
        {/* ground */}
        <rect x={0} y={groundY} width={1080} height={300} fill="#8BC34A" />
        <rect x={0} y={groundY} width={1080} height={14} fill="#5E8E2A" />
        {/* shadow */}
        <ellipse cx={px + 30 + shadowLen / 2} cy={groundY + 22} rx={Math.max(30, shadowLen / 2)} ry={18} fill="#000" opacity={0.35} />
        <Person x={px} y={groundY - 215} s={1.0} shirt="#3B6EA8" mood={ok ? 'happy' : 'neutral'} armL={20} armR={ok ? 150 : 20} />
        {/* height vs shadow markers */}
        <g opacity={ez(f, t(21.8), t(22.2))}>
          <line x1={px - 110} y1={groundY} x2={px - 110} y2={groundY - 300} stroke="#1A1714" strokeWidth={5} />
          <text x={px - 128} y={groundY - 150} textAnchor="end" fontFamily={theme.mono} fontSize={26} fill="#1A1714">
            tinggi
          </text>
          <line x1={px + 30} y1={groundY + 60} x2={px + 30 + shadowLen} y2={groundY + 60} stroke="#1A1714" strokeWidth={5} />
          <text x={px + 30 + shadowLen / 2} y={groundY + 100} textAnchor="middle" fontFamily={theme.mono} fontSize={26} fill="#1A1714">
            bayangan
          </text>
        </g>
        {/* verdict */}
        <g transform={`translate(860 900) scale(${ok ? pop(f, t(23.5)) : 1})`}>
          <circle r={70} fill={ok ? '#1FA463' : '#E23E57'} stroke="#1A1714" strokeWidth={6} />
          {ok ? (
            <path d="M-28 2 L-6 24 L32 -20" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <g stroke="#fff" strokeWidth={14} strokeLinecap="round">
              <line x1={-24} y1={-24} x2={24} y2={24} />
              <line x1={24} y1={-24} x2={-24} y2={24} />
            </g>
          )}
          <text y={120} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#1A1714">
            {ok ? 'UVB cukup' : 'UVB kurang'}
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// F: TIPS 24.98 – 30.48
const F: React.FC = () => {
  const f = useCurrentFrame();
  const S = 24.98;
  const t = (g: number) => g - S;
  const timer = ez(f, 0.2, 2.2);
  const mins = Math.round(lerp(0, 15, timer));
  const limbs = pop(f, t(27.2), 30, 12);
  const warn = pop(f, t(28.7), 30, 10);
  return (
    <AbsoluteFill style={{background: BG.tips}}>
      <Particles seed="f" n={22} color="#1FA463" kind="plus" size={18} opacity={0.3} />
      <Pad>
        <Tag text="CARA AMAN" at={0} color="#1FA463" bg="rgba(31,164,99,0.14)" />
      </Pad>
      <Svg>
        {/* timer ring */}
        <g transform="translate(300 560)">
          <circle r={150} fill="#fff" stroke="#0F2E1E" strokeWidth={8} />
          <circle r={120} fill="none" stroke="#CDEFD8" strokeWidth={28} />
          <circle r={120} fill="none" stroke="#1FA463" strokeWidth={28} strokeLinecap="round" strokeDasharray={754} strokeDashoffset={754 * (1 - timer)} transform="rotate(-90)" />
          <text y={22} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={mins >= 10 ? 62 : 88} fill="#0F2E1E" style={{fontVariantNumeric: 'tabular-nums'}}>
            {mins >= 10 ? `10–${mins}` : mins}
          </text>
          <text y={80} textAnchor="middle" fontFamily={theme.mono} fontSize={30} fill="#4E7A61">
            MENIT
          </text>
        </g>
        {/* person exposing limbs */}
        <g>
          <Person x={760} y={790} s={1.25} shirt="#1FA463" skin="#E8B48C" mood="happy" armL={limbs > 0.5 ? 110 : 20} armR={limbs > 0.5 ? 110 : 20} />
          {limbs > 0.05 &&
            [
              [760 - 34 * 1.25 - 95, 790 + 40 * 1.25 - 30],
              [760 + 34 * 1.25 + 95, 790 + 40 * 1.25 - 30],
              [760 - 22, 790 + 230],
              [760 + 22, 790 + 230],
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${limbs})`}>
                <circle r={26} fill="none" stroke="#FFB627" strokeWidth={6} strokeDasharray="8 6" />
              </g>
            ))}
          <text x={760} y={1110} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={42} fill="#0F2E1E" opacity={limbs}>
            lengan &amp; kaki terbuka
          </text>
        </g>
        {/* warning */}
        <g transform={`translate(300 1000) scale(${warn})`}>
          <rect x={-230} y={-70} width={460} height={140} rx={30} fill="#E23E57" stroke="#1A1714" strokeWidth={6} />
          <path d="M-170 30 L-130 -40 L-90 30 Z" fill="#FFD166" stroke="#1A1714" strokeWidth={5} strokeLinejoin="round" />
          <text x={-130} y={20} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#1A1714">
            !
          </text>
          <text x={40} y={-6} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#fff">
            Jangan sampai
          </text>
          <text x={40} y={42} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={40} fill="#fff">
            terbakar
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

// G: WIN 30.48 – END
const G: React.FC = () => {
  const f = useCurrentFrame();
  const S = 30.48;
  const t = (g: number) => g - S;
  const fall = ez(f, 0.2, 1.2);
  const follow = pop(f, t(31.4), 30, 9);
  return (
    <AbsoluteFill style={{background: BG.win}}>
      <Particles seed="g" n={34} color="#FFF4DE" kind="star" size={16} opacity={0.7} />
      <Svg>
        <g transform="translate(540 820)">
          {Array.from({length: 16}).map((_, i) => (
            <path key={i} d="M0 0 L-50 -1300 L50 -1300 Z" fill="#FFF4DE" opacity={0.15} transform={`rotate(${i * 22.5 + f * 0.5})`} />
          ))}
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
        <span style={{display: 'inline-block', scale: `${pop(f, 0, 30, 8)}`, rotate: '-5deg', fontFamily: theme.title, fontWeight: 800, fontSize: 100, color: '#1A1714', letterSpacing: '-0.04em', whiteSpace: 'nowrap'}}>
          HOAKS TUMBANG!
        </span>
      </div>
      <Svg>
        <Vimi x={380} y={840} s={1.35} mood="wink" armR={150} thumbR armL={35} glow={1} />
        <Hoaksin x={lerp(820, 900, fall)} y={lerp(1000, 1120, fall)} s={0.95} mood="dizzy" megaphone={false} tilt={lerp(0, 70, fall)} armL={10} />
        <g transform={`translate(860 640) scale(${pop(f, 0.9)})`}>
          <rect x={-160} y={-44} width={320} height={88} rx={44} fill="#1FA463" stroke="#1A1714" strokeWidth={6} />
          <text y={16} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={42} fill="#fff">
            FAKTA ✓
          </text>
        </g>
      </Svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1200,
          textAlign: 'center',
        }}
      >
        <span style={{display: 'inline-block', scale: `${follow}`, background: '#1A1714', color: '#fff', borderRadius: 999, padding: '20px 44px', fontFamily: theme.title, fontWeight: 800, fontSize: 48, boxShadow: '0 10px 0 rgba(0,0,0,0.2)'}}>
          <span style={{color: '#FFC21A'}}>+</span> Follow @vitamien.io
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: [number, number, React.FC, string, [number, number]][] = [
  [0, NAR, A, '#F3E9FF', [50, 50]],
  [NAR, 9.36, B, '#FFF4DE', [50, 40]],
  [9.36, 16.52, C, '#FFF4DE', [10, 70]],
  [16.52, 20.27, D, '#0B1F3A', [90, 30]],
  [20.27, 24.98, E, '#3A2400', [50, 20]],
  [24.98, 30.48, F, '#0F2E1E', [15, 50]],
  [30.48, END, G, '#1A1714', [50, 50]],
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
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, left: 96, right: 120, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 26, height: 26, borderRadius: 13, background: col}} />
          <div style={{fontFamily: theme.mono, fontSize: 32, fontWeight: 500, color: col, letterSpacing: '0.08em'}}>vitamien.io</div>
        </div>
        <div style={{fontFamily: theme.mono, fontSize: 28, color: col, opacity: 0.75, letterSpacing: '0.1em'}}>SALAH KAPRAH · EP 01</div>
      </div>
      <div style={{position: 'absolute', top: 210, left: 96, right: 120, height: 6, borderRadius: 3, background: col, opacity: 0.25}} />
      <div style={{position: 'absolute', top: 210, left: 96, width: `${(f / durationInFrames) * (1080 - 216)}px`, height: 6, borderRadius: 3, background: col}} />
    </AbsoluteFill>
  );
};

type W = {w: string; s: number; e: number; who: string};
const ws: W[] = [];
for (const x of words as W[]) {
  if (x.w.startsWith('–') && ws.length) {
    ws[ws.length - 1].w += x.w;
    ws[ws.length - 1].e = x.e;
  } else ws.push({...x});
}
const caps: Caption[] = ws.map((x, i) => ({
  text: (i === 0 ? '' : ' ') + x.w,
  startMs: x.s * 1000,
  endMs: Math.min(x.e + 0.05, END) * 1000,
  timestampMs: x.s * 1000,
  confidence: x.who === 'hx' ? 0.5 : 1,
}));
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 700});

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const ms = (f / FPS) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;
  const isHx = ms < NAR * 1000;
  const s = interpolate(ms - page.startMs, [0, 120], [0.85, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 1340, left: 80, right: 140, textAlign: 'center', scale: `${s}`, fontFamily: theme.title, fontWeight: 800, fontSize: 74, lineHeight: 1.1, letterSpacing: '-0.02em'}}>
      <span style={{background: isHx ? '#2A1238' : '#111', border: isHx ? `4px solid ${HX.spore}` : 'none', padding: '8px 22px', borderRadius: 18, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>
        {page.tokens.map((tk) => {
          const active = ms >= tk.fromMs && ms < tk.toMs;
          return (
            <span key={tk.fromMs} style={{color: active ? (isHx ? HX.spore : '#FFC21A') : '#fff', whiteSpace: 'pre'}}>
              {tk.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export const Ep1: React.FC = () => (
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
    <Sequence from={6}>
      <Audio src={staticFile('ep1/hx_t.wav')} />
    </Sequence>
    <Sequence from={Math.round(NAR * FPS)}>
      <Audio src={staticFile('ep1/nar_f.wav')} />
    </Sequence>
    <Audio src={staticFile('ep1/sfx.wav')} />
  </AbsoluteFill>
);

export const Ep1Comp: React.FC = () => <Composition id="Ep1" component={Ep1} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} />;
