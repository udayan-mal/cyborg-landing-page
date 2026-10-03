import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';

/* ------------------------------------------------------------------ *
 * A tiny parallax engine.
 * Every layer registers itself once. One requestAnimationFrame loop
 * writes transforms for the sections that are on screen, so scrolling
 * stays smooth even with dozens of layers.
 * ------------------------------------------------------------------ */

type LayerOpts = {
  /** vertical travel multiplier. small = far away, large = close to camera */
  speed?: number;
  /** horizontal drift multiplier */
  x?: number;
  /** extra shift from cursor position, in px */
  mouse?: number;
  /** rotation added across the whole section, in degrees */
  rot?: number;
  /** scale added across the whole section */
  scale?: number;
  /** blur at start and end of the section, for depth of field */
  blur?: [number, number];
  /** opacity at start and end of the section */
  op?: [number, number];
};

type Rec = {
  el: HTMLElement;
  speed: number;
  x: number;
  mouse: number;
  rot: number;
  scale: number;
  b0: number;
  b1: number;
  o0: number;
  o1: number;
};

type Section = { el: HTMLElement; layers: Rec[]; visible: boolean };

const registry: Section[] = [];
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
let raf = 0;
let started = false;
let listeners = 0;

/** Global intensity of every layer's travel. Changed by the depth control. */
export const depth = { scale: 1 };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function apply(r: Rec, y: number, p: number, mx: number, my: number) {
  const k = depth.scale;
  const ty = y * r.speed * k;
  const tx = y * r.x * k + mx * r.mouse * k;
  const sc = 1 + p * r.scale;
  const rot = p * r.rot;
  r.el.style.transform =
    `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${rot.toFixed(3)}deg) scale(${sc.toFixed(4)})`;

  if (r.b0 !== r.b1) {
    r.el.style.filter = `blur(${(r.b0 + p * (r.b1 - r.b0)).toFixed(2)}px)`;
  } else if (r.b0 !== 0) {
    r.el.style.filter = `blur(${r.b0}px)`;
  }
  if (r.o0 !== r.o1 || r.o0 !== 1) {
    r.el.style.opacity = (r.o0 + p * (r.o1 - r.o0)).toFixed(3);
  }
  void my;
}

function tick() {
  mouse.x += (mouse.tx - mouse.x) * 0.07;
  mouse.y += (mouse.ty - mouse.y) * 0.07;

  const vh = window.innerHeight;
  for (const s of registry) {
    if (!s.visible) continue;
    const r = s.el.getBoundingClientRect();
    const total = r.height - vh;
    if (total <= 0) continue;
    const y = clamp(-r.top, 0, total);
    const p = y / total;
    for (const l of s.layers) apply(l, y, p, mouse.x, mouse.y);
  }
  raf = requestAnimationFrame(tick);
}

function start() {
  if (started || reduced()) return;
  started = true;
  raf = requestAnimationFrame(tick);
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  started = false;
}

/* ------------------------------------------------------------------ */

const SectionCtx = createContext<Section | null>(null);

export function Scene({
  children,
  className = '',
  minHeight = 220,
  id,
}: {
  children: ReactNode;
  className?: string;
  /** section height in vh. more height means more room for parallax travel */
  minHeight?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const rec = useRef<Section | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s: Section = { el, layers: [], visible: false };
    rec.current = s;
    registry.push(s);

    const io = new IntersectionObserver(
      ([e]) => { s.visible = e.isIntersecting; },
      { rootMargin: '25% 0px 25% 0px' },
    );
    io.observe(el);
    listeners++;
    if (listeners === 1) start();

    return () => {
      io.disconnect();
      const i = registry.indexOf(s);
      if (i >= 0) registry.splice(i, 1);
      listeners--;
      if (listeners === 0) stop();
    };
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`scene ${className}`}
      style={{ height: `${minHeight}vh` }}
    >
      <SectionCtx.Provider value={rec.current}>{children}</SectionCtx.Provider>
    </section>
  );
}

export function Layer({
  children,
  className = '',
  speed = 0,
  x = 0,
  mouse = 0,
  rot = 0,
  scale = 0,
  blur,
  op,
  z = 0,
  pointerEvents = false,
}: LayerOpts & {
  children?: ReactNode;
  className?: string;
  z?: number;
  pointerEvents?: boolean;
}) {
  const parent = useContext(SectionCtx);
  const el = useRef<HTMLDivElement>(null);
  // keep the latest options in a ref so inline array props never re-register
  const opts = useRef({ speed, x, mouse, rot, scale, blur, op });
  opts.current = { speed, x, mouse, rot, scale, blur, op };

  useEffect(() => {
    const node = el.current;
    if (!node || !parent) return;
    const o = opts.current;
    const r: Rec = {
      el: node,
      speed: o.speed,
      x: o.x,
      mouse: o.mouse,
      rot: o.rot,
      scale: o.scale,
      b0: o.blur ? o.blur[0] : 0,
      b1: o.blur ? o.blur[1] : 0,
      o0: o.op ? o.op[0] : 1,
      o1: o.op ? o.op[1] : 1,
    };
    parent.layers.push(r);
    // paint the start state immediately so nothing flashes at the wrong offset
    apply(r, 0, 0, 0, 0);
    return () => {
      const i = parent.layers.indexOf(r);
      if (i >= 0) parent.layers.splice(i, 1);
    };
  }, [parent]);

  return (
    <div
      ref={el}
      className={`layer ${className}`}
      style={{ zIndex: z, pointerEvents: pointerEvents ? 'auto' : 'none' }}
    >
      {children}
    </div>
  );
}

/** Tracks cursor for the mouse parallax. Call once at app root. */
export function useCursorParallax() {
  useEffect(() => {
    const on = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);
}
