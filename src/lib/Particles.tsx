import { useEffect, useRef } from 'react';

type Mode = 'snow' | 'firefly' | 'bubble' | 'marine' | 'star';

type P = {
  x: number; y: number; z: number; r: number;
  vx: number; vy: number; ph: number; sp: number;
};

const COLORS: Record<Mode, string[]> = {
  snow: ['#ffffff', '#e8f4ff', '#cfe4ff'],
  firefly: ['#fde68a', '#fef3c7', '#a3e635'],
  bubble: ['#a5f3fc', '#67e8f9', '#e0f2fe'],
  marine: ['#cbd5e1', '#94a3b8', '#e2e8f0'],
  star: ['#ffffff', '#bfdbfe', '#ddd6fe'],
};

/**
 * Canvas particles that also drift with the section scroll, so they sit
 * inside the parallax world instead of floating on top of it.
 */
export default function Particles({
  mode = 'snow',
  count = 60,
  speed = 0.25,
  color,
  className = '',
  opacity = 1,
}: {
  mode?: Mode;
  count?: number;
  speed?: number;
  color?: string;
  className?: string;
  opacity?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0, on = false;
    const palette = color ? [color] : COLORS[mode];

    const make = (n: number): P[] =>
      Array.from({ length: n }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.35 + Math.random() * 0.65,
        r: 0.6 + Math.random() * 1.9,
        vx: (Math.random() - 0.5) * 0.12,
        vy: mode === 'bubble' ? -(0.18 + Math.random() * 0.5) : mode === 'firefly' ? (Math.random() - 0.5) * 0.1 : 0.12 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 1.1,
      }));

    let ps = make(count);
    let scrollY = 0;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = cv.width = Math.max(1, Math.floor(r.width * dpr));
      h = cv.height = Math.max(1, Math.floor(r.height * dpr));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx / 100;
        p.y += p.vy / 100;
        if (mode === 'firefly') {
          p.x += Math.sin(t * 0.0006 * p.sp + p.ph) * 0.0016;
          p.y += Math.cos(t * 0.0005 * p.sp + p.ph) * 0.0012;
        }
        if (p.y > 1.1) { p.y = -0.1; p.x = Math.random(); }
        if (p.y < -0.1) { p.y = 1.1; p.x = Math.random(); }
        if (p.x > 1.1) p.x = -0.1;
        if (p.x < -0.1) p.x = 1.1;

        const sx = p.x * w;
        const sy = ((p.y * h + scrollY * speed * p.z) % (h + 40) + h + 40) % (h + 40) - 20;
        const rr = p.r * p.z * dpr;
        const c = palette[Math.floor(p.ph * 7) % palette.length];

        if (mode === 'firefly') {
          const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.0011 * p.sp + p.ph));
          ctx.beginPath();
          ctx.arc(sx, sy, rr * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.globalAlpha = a * 0.18;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(sx, sy, rr * 0.8, 0, Math.PI * 2);
          ctx.globalAlpha = a;
          ctx.fill();
        } else if (mode === 'bubble') {
          ctx.beginPath();
          ctx.arc(sx, sy, rr * 1.6, 0, Math.PI * 2);
          ctx.strokeStyle = c;
          ctx.globalAlpha = 0.55 * p.z;
          ctx.lineWidth = dpr * 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, rr, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.globalAlpha = (mode === 'marine' ? 0.5 : 0.9) * p.z;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const measure = () => {
      const scene = cv.closest<HTMLElement>('.scene');
      const r = scene ? scene.getBoundingClientRect() : null;
      if (!r) return;
      const vh = window.innerHeight;
      const total = Math.max(1, r.height - vh);
      scrollY = Math.min(Math.max(-r.top, 0), total);
    };

    const loop = (t: number) => { measure(); draw(t); };

    resize();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    }, { rootMargin: '20% 0px 20% 0px' });
    io.observe(cv);

    const onResize = () => { resize(); ps = make(count); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [mode, count, speed, color]);

  return (
    <canvas
      ref={canvas}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
