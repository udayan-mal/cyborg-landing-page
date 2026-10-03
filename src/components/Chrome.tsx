import { useEffect, useRef, useState } from 'react';
import { createTimeline } from 'animejs';
import { scrollToId } from '../lib/scroll';

const SECTIONS = [
  { id: 'hero', label: 'Core' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'capabilities', label: 'Caps' },
  { id: 'build', label: 'Build' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'acquire', label: 'Acquire' },
];

/* ---------------- boot sequence ---------------- */
function Preloader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const o = { v: 0 };
    const num = document.getElementById('pl-num')!;
    createTimeline({ defaults: { ease: 'outExpo' } })
      .add(o, {
        v: 100, duration: 1500, ease: 'inOutQuart',
        onUpdate: () => { num.textContent = String(Math.round(o.v)).padStart(3, '0'); },
      })
      .add('#pl-bar', { scaleX: [0, 1], duration: 1500, ease: 'inOutQuart' }, 0)
      .add('#pl-ring', { rotate: [0, 360], duration: 1500, ease: 'inOutQuart' }, 0)
      .add('#pl-inner', { opacity: [1, 0], y: [0, -16], duration: 420 })
      .add('#pl', { opacity: [1, 0], duration: 650, onComplete: () => setGone(true) }, '-=120');
  }, []);
  if (gone) return null;
  return (
    <div id="pl" className="fixed inset-0 z-[100] flex items-center justify-center bg-bg">
      <div className="gridfine absolute inset-0 opacity-40" />
      <div id="pl-inner" className="relative flex flex-col items-center">
        <div className="relative h-24 w-24">
          <svg id="pl-ring" viewBox="0 0 100 100" className="absolute inset-0">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#6ee8ff" strokeWidth="1" strokeDasharray="6 10" opacity="0.5" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="#8a7dff" strokeWidth="1.5" strokeDasharray="40 30" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 rounded-full bg-cy shadow-[0_0_30px_8px_rgba(110,232,255,0.7)]" />
          </div>
        </div>
        <div className="disp mt-7 text-sm font-bold tracking-[0.3em] text-cy">NEXUS / 7</div>
        <div className="mono mt-2 text-[10px] uppercase tracking-[0.3em] text-dim">Charging the core</div>
        <div className="mt-6 h-px w-56 overflow-hidden bg-white/10">
          <div id="pl-bar" className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cy via-vi to-mg" />
        </div>
        <div id="pl-num" className="mono mt-3 text-xs text-dim">000</div>
      </div>
    </div>
  );
}

/* ---------------- nav ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [utc, setUtc] = useState('');
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 70);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setUtc(new Date().toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`mx-auto transition-all duration-500 ${scrolled ? 'max-w-5xl pt-3' : 'max-w-7xl pt-0'}`}>
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'glass rounded-full px-4 py-2' : 'px-6 py-5'}`}>
          <button onClick={() => scrollToId('hero')} className="group flex items-center gap-3">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <svg viewBox="0 0 32 32" className="spin absolute inset-0">
                <circle cx="16" cy="16" r="14" fill="none" stroke="#6ee8ff" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
              </svg>
              <span className="h-2.5 w-2.5 rounded-full bg-cy shadow-[0_0_14px_3px_rgba(110,232,255,0.8)]" />
            </span>
            <span className="text-left leading-none">
              <span className="disp block text-sm font-bold tracking-[0.18em]">NEXUS<span className="text-cy">/</span>7</span>
              <span className="mono mt-1 block text-[9px] tracking-[0.25em] text-dim">UNIT 0421 · GEN IV</span>
            </span>
          </button>
          <nav className="hidden items-center gap-1 lg:flex">
            {SECTIONS.slice(1).map(s => (
              <button key={s.id} onClick={() => scrollToId(s.id)}
                className="mono rounded-full px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-dim transition-colors hover:bg-white/10 hover:text-tx">
                {s.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="mono hidden text-[10px] tracking-[0.2em] text-faint xl:inline">{utc} UTC</span>
            <button onClick={() => scrollToId('acquire')} className="btn btn-fill !px-4 !py-2 !text-[10px]">Acquire</button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- rail ---------------- */
function Rail() {
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    const on = () => {
      const mid = window.innerHeight / 2;
      let active = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) active = i;
      });
      dots.current.forEach((d, i) => {
        if (!d) return;
        d.style.height = i === active ? '26px' : '7px';
        d.style.background = i === active ? '#6ee8ff' : 'rgba(227,236,255,0.3)';
        d.style.boxShadow = i === active ? '0 0 14px rgba(110,232,255,0.8)' : 'none';
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
      {SECTIONS.map((s, i) => (
        <button key={s.id} onClick={() => scrollToId(s.id)} className="group relative flex items-center" aria-label={s.label}>
          <span className="mono pointer-events-none absolute right-6 whitespace-nowrap rounded-full bg-black/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-tx opacity-0 transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
          <span ref={el => { dots.current[i] = el; }} className="block w-[3px] rounded-full transition-all duration-500" />
        </button>
      ))}
    </div>
  );
}

/* ---------------- hud ---------------- */
function Hud() {
  const idx = useRef<HTMLSpanElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const mid = window.innerHeight / 2;
      let active = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) active = i;
      });
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (idx.current) idx.current.textContent = `0${active + 1}`;
      if (name.current) name.current.textContent = SECTIONS[active].label.toUpperCase();
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
      if (bar.current) bar.current.style.width = `${p * 100}%`;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden md:block">
      <div className="hud glass rounded-sm px-4 py-3"><i />
        <div className="flex items-center gap-3">
          <span ref={idx} className="disp text-2xl font-bold tabular-nums">01</span>
          <span className="h-7 w-px bg-white/20" />
          <span>
            <span className="mono block text-[9px] uppercase tracking-[0.3em] text-dim">System</span>
            <span ref={name} className="mono mt-0.5 block text-[11px] uppercase tracking-[0.2em] text-cy">CORE</span>
          </span>
        </div>
        <div className="mt-3 h-px w-36 overflow-hidden bg-white/15">
          <div ref={bar} className="h-full w-0 bg-cy" />
        </div>
        <div className="mono mt-2 text-[10px] text-dim">
          Diagnostics <span ref={pct} className="tabular-nums text-tx">0%</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- cursor ---------------- */
export function useCursorLabel() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => { document.body.style.cursor = label ? 'pointer' : ''; }, [label]);
  const node = (
    <div ref={ring} className="cursor pointer-events-none fixed left-0 top-0 z-[90]">
      <div className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
        label ? 'h-20 w-20 border-cy bg-cy/10 backdrop-blur-sm' : 'h-8 w-8 border-white/40'
      }`}>
        <span className={`mono text-[9px] tracking-[0.2em] text-cy transition-opacity ${label ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
      </div>
    </div>
  );
  return { node, setLabel };
}

export default function Chrome() {
  const cursor = useCursorLabel();
  return (
    <>
      <Preloader />
      <Nav />
      <Rail />
      <Hud />
      {cursor.node}
    </>
  );
}
