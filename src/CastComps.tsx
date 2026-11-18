import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {theme} from './theme';
import {Vimi} from './Mascot';
import {Hoaksin} from './Villain';
import {Probi, Eri, Imu, Radikal, Viro, Cacing, OmForward} from './Cast';
import {Particles} from './kit';

type Slot = {name: string; role: string; draw: (x: number, y: number) => React.ReactNode};

const Row: React.FC<{y: number; h: number; bg: string; title: string; tColor: string; slots: Slot[]; nameColor: string; roleColor: string}> = ({y, h, bg, title, tColor, slots, nameColor, roleColor}) => (
  <div style={{position: 'absolute', left: 0, top: y, width: 1920, height: h, background: bg, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 60, top: 34, fontFamily: theme.mono, fontSize: 30, letterSpacing: '0.25em', color: tColor}}>{title}</div>
    <svg width={1920} height={h} style={{position: 'absolute'}}>
      {slots.map((sl, i) => {
        const cx = 210 + i * 375;
        return <g key={i}>{sl.draw(cx, h * 0.47)}</g>;
      })}
    </svg>
    {slots.map((sl, i) => {
      const cx = 210 + i * 375;
      return (
        <div key={i} style={{position: 'absolute', left: cx - 180, width: 360, top: h - 128, textAlign: 'center'}}>
          <div style={{fontFamily: theme.title, fontWeight: 800, fontSize: 44, color: nameColor, letterSpacing: '-0.02em'}}>{sl.name}</div>
          <div style={{fontFamily: theme.mono, fontSize: 19, color: roleColor, letterSpacing: "0.02em", marginTop: 2}}>{sl.role}</div>
        </div>
      );
    })}
  </div>
);

const Poster: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <Row
      y={0}
      h={600}
      bg="radial-gradient(circle at 20% 20%, #1C7C94 0%, #0F5E73 55%, #083845 100%)"
      title="TIM VITABOY · PAHLAWAN"
      tColor="#FFC21A"
      nameColor="#FFF4DE"
      roleColor="#9FD6E2"
      slots={[
        {name: 'Vitaboy', role: 'TOKOH UTAMA · pembasmi mitos', draw: (x, y) => <Vimi x={x} y={y + 30} s={0.8} mood="smug" armR={170} armL={35} glow={1} />},
        {name: 'Probi', role: 'SAHABAT · bakteri baik usus', draw: (x, y) => <Probi x={x} y={y} s={0.95} />},
        {name: 'Eri', role: 'SEKUTU · sel darah merah', draw: (x, y) => <Eri x={x} y={y} s={0.9} />},
        {name: 'Imu', role: 'PENJAGA · sel darah putih', draw: (x, y) => <Imu x={x - 20} y={y} s={0.85} />},
        {name: 'Om Forward', role: 'WARGA · korban hoaks', draw: (x, y) => <OmForward x={x - 20} y={y - 40} s={1.0} />},
      ]}
    />
    <Row
      y={600}
      h={600}
      bg="radial-gradient(circle at 80% 70%, #4A1D63 0%, #2A1238 60%, #170A1F 100%)"
      title="GENG HOAKSIN · PENJAHAT"
      tColor="#B7F03C"
      nameColor="#F3E9FF"
      roleColor="#C9B6DA"
      slots={[
        {name: 'Hoaksin', role: 'VILLAIN UTAMA · jamur hoaks', draw: (x, y) => <Hoaksin x={x + 10} y={y + 20} s={0.78} mood="laugh" shout={1} />},
        {name: 'Si Radikal', role: 'ANAK BUAH · pencuri elektron', draw: (x, y) => <Radikal x={x} y={y} s={0.9} />},
        {name: 'Viro', role: 'ANAK BUAH · virus penyusup', draw: (x, y) => <Viro x={x} y={y} s={0.9} />},
        {name: 'Cacing Licik', role: 'ANAK BUAH · pencuri zat besi', draw: (x, y) => <Cacing x={x - 10} y={y - 20} s={0.85} />},
        {name: '???', role: 'SEGERA HADIR', draw: (x, y) => (
          <g>
            <circle cx={x} cy={y} r={100} fill="#000" opacity={0.35} />
            <text x={x} y={y + 40} textAnchor="middle" fontFamily={theme.title} fontWeight={800} fontSize={130} fill="#B7F03C" opacity={0.7}>?</text>
          </g>
        )},
      ]}
    />
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <Particles seed="poster" n={20} color="#FFC21A" kind="star" size={10} opacity={0.25} speed={0.2} />
    </div>
  </AbsoluteFill>
);

export const CastComps: React.FC = () => <Composition id="CastPoster" component={Poster} durationInFrames={60} fps={30} width={1920} height={1200} />;
