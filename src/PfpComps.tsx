import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {Vimi} from './Mascot';

const Burst: React.FC<{bg: string; ray: string; o?: number}> = ({bg, ray, o = 0.18}) => (
  <AbsoluteFill style={{background: bg}}>
    <svg width={1080} height={1080} style={{position: 'absolute'}}>
      <g transform="translate(540 600)">
        {Array.from({length: 20}).map((_, i) => (
          <path key={i} d="M0 0 L-60 -1000 L60 -1000 Z" fill={ray} opacity={o} transform={`rotate(${i * 18})`} />
        ))}
      </g>
    </svg>
  </AbsoluteFill>
);

const A: React.FC = () => (
  <AbsoluteFill>
    <Burst bg="radial-gradient(circle at 50% 45%, #1C7C94 0%, #0F5E73 55%, #083845 100%)" ray="#FFC21A" />
    <svg width={1080} height={1080} style={{position: 'absolute'}}>
      <Vimi x={540} y={590} s={2.3} mood="smug" armR={150} armL={35} glow={1} thumbR />
    </svg>
  </AbsoluteFill>
);

const B: React.FC = () => (
  <AbsoluteFill>
    <Burst bg="radial-gradient(circle at 50% 45%, #FFE066 0%, #FFC21A 60%, #F5A400 100%)" ray="#FFF4DE" o={0.25} />
    <svg width={1080} height={1080} style={{position: 'absolute'}}>
      <Vimi x={540} y={600} s={2.3} mood="happy" armR={160} armL={30} glow={1} />
    </svg>
  </AbsoluteFill>
);

// face close-up: crop by scaling large
const C: React.FC = () => (
  <AbsoluteFill>
    <Burst bg="radial-gradient(circle at 50% 50%, #1C7C94 0%, #0F5E73 60%, #083845 100%)" ray="#FFC21A" o={0.15} />
    <svg width={1080} height={1080} style={{position: 'absolute'}}>
      <Vimi x={540} y={830} s={3.4} mood="wink" armR={20} armL={20} glow={1} />
    </svg>
  </AbsoluteFill>
);

export const PfpComps: React.FC = () => (
  <>
    <Composition id="PfpA" component={A} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="PfpB" component={B} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="PfpC" component={C} durationInFrames={1} fps={30} width={1080} height={1080} />
  </>
);
