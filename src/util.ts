import {interpolate, Easing, spring} from 'remotion';

const ez = Easing.bezier(0.16, 1, 0.3, 1);

// 0..1 progress from second `start` over `dur` seconds (frame is local, fps 30)
export const prog = (frame: number, start: number, dur = 0.45, fps = 30) =>
  interpolate(frame, [start * fps, (start + dur) * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ez,
  });

export const pop = (frame: number, start: number, fps = 30, damping = 12) =>
  spring({frame: frame - start * fps, fps, config: {damping, stiffness: 160, mass: 0.7}});

export const smooth = (frame: number, start: number, fps = 30) =>
  spring({frame: frame - start * fps, fps, config: {damping: 200}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
