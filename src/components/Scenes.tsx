import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { useCursorParallax } from '../lib/parallax';
import { Reveal } from '../lib/reveal';
import { scrollToId } from '../lib/scroll';
import { CyborgFace, CyborgBody } from './Art';

/* ---------------- shared bits ---------------- */
function Words({ text, className = '', step = 70 }: { text: string; className?: string; step?: number }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      animate(el.querySelectorAll('.r-word'), {
        translateY: ['110%', '0%'], opacity: [0, 1],
        duration: 1150, delay: stagger(step), ease: 'outExpo',
      });
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [step]);
  return (
    <h2 ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="r-line mr-[0.24em]">
          <span className="r-word">{w}</span>
        </span>
      ))}
    </h2>
  );
}

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

/* ================= HERO ================= */
function HeroEyes({ color }: { color: string }) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const on = (e: PointerEvent) => {
      const el = svg.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = Math.max(-16, Math.min(16, ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 18));
      const y = Math.max(-8, Math.min(8, ((e.clientY - (r.top + r.height * 0.42)) / (r.height / 2)) * 10));
      el.querySelectorAll<SVGCircleElement>('[data-pupil]').forEach(p => {
        p.setAttribute('cx', String(x));
        p.setAttribute('cy', String(y));
      });
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);
  return (
    <svg ref={svg} viewBox="-170 -210 340 420" className="h-full w-full">
      <defs>
        <radialGradient id="pg3"><stop offset="0%" stopColor="#fff" /><stop offset="45%" stopColor={color} /><stop offset="100%" stopColor="#1a5f75" /></radialGradient>
      </defs>
      <path d="M -132 -158 C -142 -58, -130 62, -88 144 L 88 144 C 130 62, 142 -58, 132 -158 Z" fill="#0b1030" stroke="#2a3a66" strokeWidth="2" />
      <path d="M -112 -128 L 112 -128" stroke="#2a3a66" strokeWidth="0.8" opacity="0.6" />
      {[-50, 50].map(x => (
        <g key={x} transform={`translate(${x} -50)`}>
          <ellipse rx="45" ry="27" fill="#060a1c" stroke={color} strokeWidth="1.5" />
          <ellipse rx="45" ry="27" fill="none" stroke={color} strokeWidth="0.4" strokeDasharray="2 4" opacity="0.4" />
          <line x1="-52" y1="0" x2="-60" y2="0" stroke={color} strokeWidth="1.2" />
          <line x1="52" y1="0" x2="60" y2="0" stroke={color} strokeWidth="1.2" />
          <line x1="0" y1="-33" x2="0" y2="-41" stroke={color} strokeWidth="1.2" />
          <line x1="0" y1="33" x2="0" y2="41" stroke={color} strokeWidth="1.2" />
          <circle data-pupil cx="0" cy="0" r="14" fill="url(#pg3)" />
          <circle data-pupil cx="0" cy="0" r="5" fill="#fff" />
          <line x1="-40" y1="0" x2="40" y2="0" stroke={color} strokeWidth="0.6" opacity="0.45" className="sweep" />
        </g>
      ))}
      <path d="M -100 -80 L -10 -90" stroke={color} strokeWidth="1.4" fill="none" opacity="0.7" />
      <path d="M 100 -80 L 10 -90" stroke={color} strokeWidth="1.4" fill="none" opacity="0.7" />
      <rect x="-27" y="80" width="54" height="15" rx="2" fill="#060a1c" stroke="#8a7dff" strokeWidth="1" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={-22 + i * 6} y1="84" x2={-22 + i * 6} y2="91" stroke="#8a7dff" strokeWidth="0.8" opacity="0.6" />
      ))}
      <circle cx="0" cy="106" r="3" fill="#ff4dd2" className="pulse" />
      <g fontFamily="JetBrains Mono" fontSize="6.5" fill={color} opacity="0.7">
        <text x="-142" y="-162">SENSOR·7</text>
        <text x="96" y="-162">CPU·A10</text>
        <text x="-142" y="172">LINK·OK</text>
        <text x="118" y="172" textAnchor="end">v4.02</text>
      </g>
    </svg>
  );
}

function Hero({ onPulse }: { onPulse: () => void }) {
  const [hover, setHover] = useState(false);
  const face = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = title.current;
    if (!el) return;
    animate(el.querySelectorAll('.r-word'), {
      translateY: ['110%', '0%'], opacity: [0, 1],
      duration: 1200, delay: stagger(60, { start: 200 }), ease: 'outExpo',
    });
    animate('.h-fade', { opacity: [0, 1], translateY: [22, 0], duration: 900, delay: stagger(110, { start: 700 }), ease: 'outExpo' });
  }, []);
  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden pt-28 pb-16">
      <div className="gridbg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-cy/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full bg-mg/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-vi/25 blur-[100px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
        <div>
          <div className="h-fade glass mb-8 inline-flex items-center gap-3 rounded-full px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-cy pulse" />
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-cy">Now shipping · Generation IV</span>
          </div>
          <h1 ref={title} className="text-[13vw] font-semibold leading-[0.9] tracking-[-0.04em] sm:text-[9vw] lg:text-[6.2rem]">
            <span className="r-line block holo">HUMAN</span>
            <span className="r-line block stroke">BY DESIGN.</span>
            <span className="disp r-line mt-2 block text-[10vw] text-cy sm:text-[7vw] lg:text-[5rem]">NEXUS / 7</span>
          </h1>
          <p className="h-fade mt-8 max-w-xl leading-relaxed text-dim">
            The first mass market anthropomorphic cyborg. Carbon fibre composite, fourth generation neuromorphic silicon and a network that never sleeps. NEXUS/7 learns you in{' '}
            <span className="mono text-tx">3.7</span> seconds and runs for <span className="mono text-tx">144</span> hours.
          </p>
          <div className="h-fade mt-10 flex flex-col gap-4 sm:flex-row">
            <button onClick={() => document.getElementById('acquire')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-fill">
              Acquire unit <Arrow />
            </button>
            <button onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-out">Open datasheet</button>
          </div>
          <div className="h-fade mt-10 grid max-w-md grid-cols-3 gap-3">
            {[['WEIGHT', '78 KG'], ['PAYLOAD', '220 KG'], ['LATENCY', '0.4 MS']].map(([k, v]) => (
              <div key={k} className="hud glass rounded-sm px-3 py-2"><i />
                <div className="mono text-[9px] tracking-[0.2em] text-dim">{k}</div>
                <div className="disp mt-1 text-sm">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative h-[380px] sm:h-[520px] lg:h-[600px]"
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-square w-[86%] max-w-[520px]">
              <svg viewBox="0 0 100 100" className="spin absolute inset-0">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#6ee8ff" strokeWidth="0.3" strokeDasharray="2 3" opacity="0.5" />
              </svg>
              <svg viewBox="0 0 100 100" className="spin-rev absolute inset-0">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ff4dd2" strokeWidth="0.3" strokeDasharray="6 6" opacity="0.4" />
              </svg>
              <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-cy" />
              <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-mg" />
              <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-cy" />
              <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-mg" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full max-w-[420px] transition-transform duration-700" style={{ transform: hover ? 'scale(1.04)' : 'scale(1)' }}>
              <HeroEyes color={hover ? '#ff4dd2' : '#6ee8ff'} />
            </div>
          </div>
          {[
            ['FACING: NE', 'YAW 014.2°', 'top-3 left-3', 'text-cy'],
            ['SYS: OK', 'PWR 98%', 'top-3 right-3 text-right', 'text-mg'],
            ['BPM 72', 'RESP 16/MIN', 'bottom-3 left-3', 'text-cy'],
            ['NEXUS·07', 'UNIT 0421', 'bottom-3 right-3 text-right', 'text-faint'],
          ].map(([a, b, pos, c]) => (
            <div key={a} className={`mono absolute ${pos} text-[9px] tracking-[0.25em] ${c}`}>
              <div>{a}</div><div className="text-faint">{b}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-3 px-6">
        <button onClick={() => { onPulse(); if (face.current) animate(face.current, { scale: [1, 1.09, 1], duration: 800, ease: 'outExpo' }); }} className="mono h-fade glass rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-tx transition-colors hover:border-cy hover:text-cy">
          Send core pulse
        </button>
        <span className="mono h-fade glass rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-dim">
          Move the cursor to steer the eyes
        </span>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="mono block text-[9px] uppercase tracking-[0.3em] text-faint">Scroll</span>
        <span className="bob mx-auto mt-2 block h-10 w-px bg-gradient-to-b from-cy to-transparent" />
      </div>
    </section>
  );
}

/* ================= MARQUEE ================= */
function Ticker() {
  const items = ['NEUROMORPHIC CHIP', '4TH GEN', '144 HR RUNTIME', 'IP68 ARMOR', 'NEURAL LINK READY', '0.4 MS LATENCY', 'BUILT IN TOKYO'];
  const Row = ({ rev = false, outline = false }: { rev?: boolean; outline?: boolean }) => (
    <div className="flex overflow-hidden">
      <div className={`flex w-max gap-10 pr-10 ${rev ? 'mq-rev' : 'mq'}`}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={`disp flex items-center gap-10 whitespace-nowrap text-3xl tracking-[0.1em] sm:text-5xl ${outline ? 'stroke' : 'text-tx/90'}`}>
            {t}
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-cy"><path d="M7 0v14M0 7h14M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <div className="relative space-y-5 border-y hair bg-bg2/80 py-12 backdrop-blur-sm">
      <Row />
      <Row rev outline />
    </div>
  );
}

/* ================= METRICS ================= */
const METRICS = [
  { n: 3.7, d: 1, s: 's', l: 'Cold boot calibration' },
  { n: 144, d: 0, s: 'h', l: 'Continuous runtime' },
  { n: 99.97, d: 2, s: '%', l: 'Network uptime' },
  { n: 2400, d: 0, s: ' TF', l: 'Neural throughput' },
];

function Metrics() {
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      METRICS.forEach((m, i) => {
        const o = { v: 0 };
        animate(o, {
          v: m.n, duration: 2000, delay: 200 + i * 120, ease: 'outExpo',
          onUpdate: () => { const el = nums.current[i]; if (el) el.textContent = o.v.toFixed(m.d); },
        });
      });
      io.disconnect();
    }, { threshold: 0.2 });
    const el = document.getElementById('metrics');
    if (el) io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section id="metrics" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal><div className="label mb-3">// System metrics</div></Reveal>
            <Words className="text-4xl font-semibold tracking-tighter sm:text-5xl" text="Numbers we do not round up." />
          </div>
          <Reveal delay={120}><p className="max-w-sm text-sm leading-relaxed text-dim">Live readings from the NEXUS fleet, refreshed every six minutes by the global telematics network.</p></Reveal>
        </div>
        <div className="hud grid grid-cols-2 gap-px overflow-hidden rounded-sm border hair bg-[rgba(110,232,255,0.1)] lg:grid-cols-4">
          <i />
          {METRICS.map((m, i) => (
            <div key={m.l} className="group bg-bg p-8 transition-colors hover:bg-bg2 sm:p-10">
              <div className="mono mb-4 flex items-center justify-between text-[10px] tracking-[0.2em] text-dim">
                M.0{i + 1}
                <span className="h-2 w-2 rounded-full bg-cy opacity-0 transition-opacity group-hover:opacity-100 pulse" />
              </div>
              <div className="disp text-4xl tabular-nums sm:text-5xl lg:text-6xl">
                <span ref={el => { nums.current[i] = el; }}>0</span><span className="text-cy">{m.s}</span>
              </div>
              <div className="mt-3 text-sm font-medium text-dim">{m.l}</div>
              <div className="mt-4 h-px overflow-hidden bg-[rgba(110,232,255,0.12)]">
                <div className="h-full w-full bg-cy opacity-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= EVOLUTION (pinned) ================= */
const GENS = [
  { k: 'I', tag: '2018 · Prototype', t: 'First stand up.', d: 'A research rig. Thirty two hydraulic actuators, tethered compute, no vision. Built to prove the frame could walk.', c: '#8a7dff', stat: ['32', 'ACTUATORS'] },
  { k: 'II', tag: '2021 · Generation II', t: 'An on device brain.', d: 'First untethered run. Edge inference at 480 teraflops. It learned to hold a wine glass without breaking it.', c: '#6ee8ff', stat: ['480', 'TFLOPS'] },
  { k: 'III', tag: '2024 · Generation III', t: 'Mass production.', d: 'Carbon fibre frame, IP68 sealing, 96 hour runtime. The first unit someone actually took home.', c: '#ff4dd2', stat: ['96h', 'RUNTIME'] },
  { k: 'IV', tag: '2026 · Generation IV', t: 'NEXUS/7. Today.', d: 'Neuromorphic silicon, 144 hour runtime, 0.4 millisecond latency. The cyborg that disappears into the workflow.', c: '#ffb547', stat: ['0.4', 'MS LATENCY'] },
];

function UnitCard({ g, i }: { g: typeof GENS[number]; i: number }) {
  return (
    <div className="hud relative aspect-[3/4] w-[280px] shrink-0 overflow-hidden rounded-sm glass sm:w-[320px]">
      <i />
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${g.c}11, transparent 60%)` }} />
      <svg viewBox="0 0 200 280" className="absolute inset-0 h-full w-full p-6">
        <defs>
          <linearGradient id={`ug${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={g.c} stopOpacity="0.9" />
            <stop offset="100%" stopColor={g.c} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M 70 30 C 60 50, 60 80, 70 100 L 130 100 C 140 80, 140 50, 130 30 Z" fill="none" stroke={`url(#ug${i})`} strokeWidth="1.2" />
        <circle cx="88" cy="65" r="5" fill={g.c} opacity="0.8" />
        <circle cx="112" cy="65" r="5" fill={g.c} opacity="0.8" />
        <path d="M 65 100 L 60 175 L 140 175 L 135 100 Z" fill="none" stroke={`url(#ug${i})`} strokeWidth="1.2" />
        <path d="M 60 110 L 35 145 L 25 200" fill="none" stroke={g.c} strokeWidth="1" opacity="0.6" />
        <path d="M 140 110 L 165 145 L 175 200" fill="none" stroke={g.c} strokeWidth="1" opacity="0.6" />
        <path d="M 80 175 L 75 270" fill="none" stroke={g.c} strokeWidth="1.4" />
        <path d="M 120 175 L 125 270" fill="none" stroke={g.c} strokeWidth="1.4" />
        <path d="M 88 65 L 88 100 M 112 65 L 112 100 M 100 80 L 100 175" stroke={g.c} strokeWidth="0.6" opacity="0.5" fill="none" />
        <text x="100" y="266" textAnchor="middle" fill={g.c} fontFamily="JetBrains Mono" fontSize="9" opacity="0.8">REV {g.k}.{i}</text>
      </svg>
      <div className="mono absolute left-3 right-3 top-3 flex justify-between text-[9px] tracking-[0.2em]">
        <span className="text-faint">GEN</span><span style={{ color: g.c }}>{g.k}</span>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
        <div className="mono text-[9px] tracking-[0.2em] text-faint">{g.stat[1]}</div>
        <div className="disp text-2xl" style={{ color: g.c }}>{g.stat[0]}</div>
      </div>
    </div>
  );
}

function Evolution() {
  const [ref, p] = useProgress();
  const idx = Math.min(GENS.length - 1, Math.floor(p * (GENS.length + 0.6)));
  const g = GENS[idx];
  return (
    <section id="evolution" ref={ref} className="relative h-[400vh] bg-bg2">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 transition-colors duration-700"
          style={{ background: `radial-gradient(ellipse at 72% 50%, ${g.c}22, transparent 55%)` }} />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <div className="label mb-5">// Evolution timeline</div>
            <div className="relative h-[240px]">
              {GENS.map((gg, i) => {
                const local = Math.max(0, Math.min(1, (p - i / GENS.length) / (1 / GENS.length)));
                const active = i === idx;
                const enter = Math.min(1, local / 0.25);
                const exit = i === GENS.length - 1 ? 0 : Math.max(0, (local - 0.78) / 0.22);
                return (
                  <div key={gg.k} className="absolute inset-0" style={{ opacity: active ? Math.min(enter, 1 - exit) : 0, pointerEvents: active ? 'auto' : 'none' }}>
                    <div className="mono mb-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: gg.c }}>{gg.tag}</div>
                    <h3 className="text-3xl font-semibold tracking-tighter sm:text-5xl">{gg.t}</h3>
                    <p className="mt-4 max-w-md leading-relaxed text-dim">{gg.d}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex gap-2">
              {GENS.map((gg, i) => (
                <div key={gg.k} className="h-0.5 max-w-20 flex-1 overflow-hidden rounded-sm bg-[rgba(110,232,255,0.1)]">
                  <div className="h-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(1, (p - i / GENS.length) / (1 / GENS.length))) * 100}%`, background: gg.c }} />
                </div>
              ))}
            </div>
            <div className="mono mt-3 text-[10px] tracking-[0.2em] text-faint">
              {String(Math.min(GENS.length, idx + 1)).padStart(2, '0')} / 0{GENS.length}
            </div>
            <div className="mt-8 lg:hidden">
              <div className="w-[240px]">
                <UnitCard g={g} i={idx} />
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="pointer-events-none absolute -inset-12 opacity-30">
              <svg viewBox="0 0 400 500" className="h-full w-full">
                <defs><pattern id="evg" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0v20" fill="none" stroke="#6ee8ff" strokeWidth="0.3" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#evg)" />
              </svg>
            </div>
            <div className="relative h-[440px]">
              {GENS.map((gg, i) => {
                const local = Math.max(0, Math.min(1, (p - i / GENS.length) / (1 / GENS.length)));
                const active = i === idx;
                const scale = active ? 1.05 - local * 0.05 : 0.7 + local * 0.25;
                return (
                  <div key={gg.k} className="absolute left-1/2 top-1/2 transition-[transform,opacity] duration-500"
                    style={{
                      transform: `translate(-50%, calc(-50% + ${i * 4 + (active ? 0 : 14)}px)) scale(${scale}) perspective(1200px) translateZ(${active ? 0 : -60 * (i - idx)}px) rotate(${active ? 0 : (i - idx) * 6}deg)`,
                      zIndex: i, opacity: i <= idx ? 1 : 0.3,
                    }}>
                    <UnitCard g={gg} i={i} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useProgress<T extends HTMLElement = HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total)));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return [ref, p];
}

/* ================= CAPABILITIES ================= */
const CAPS = [
  { code: 'CAP/01', t: 'Neuromorphic Vision', d: 'Twin silicon retina sensors with event driven processing. Reads and labels a scene in 11 milliseconds.', tag: 'CV', span: 'lg:col-span-2' },
  { code: 'CAP/02', t: 'Neural Link Mesh', d: 'Bidirectional 256 channel interface. Pairs in 0.4 ms.', tag: 'NET' },
  { code: 'CAP/03', t: 'Adaptive Frame', d: 'Magnesium weave skeleton. Repairs micro fractures in 4 minutes.', tag: 'BIO' },
  { code: 'CAP/04', t: 'Edge Cognition', d: 'An on device model running 14 billion parameters with no cloud. Private by default.', tag: 'AI', span: 'lg:col-span-2' },
  { code: 'CAP/05', t: '144h Endurance', d: 'Solid state cell with adaptive draw. Field swappable in 90 seconds.', tag: 'PWR' },
  { code: 'CAP/06', t: 'Sovereign OS', d: 'NEXUS OS 4.2. Audited, open source, signed bootchain. Your data never leaves the unit.', tag: 'OS', span: 'lg:col-span-3' },
];

function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>('[data-r]');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      animate(items, { opacity: [0, 1], translateY: [50, 0], duration: 1000, delay: stagger(110), ease: 'outExpo' });
      io.disconnect();
    }, { threshold: 0.12 });
    io.observe(root);
    return () => io.disconnect();
  }, []);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section id="capabilities" ref={ref} className="relative border-t hair py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div data-r className="label mb-3">// Capability matrix</div>
            <Words className="text-4xl font-semibold tracking-tighter sm:text-6xl" text="Six subsystems. One mind." />
          </div>
          <Reveal delay={120}><p className="max-w-md text-sm leading-relaxed text-dim">Every module is field serviceable on its own. Tested across 1.2 million hours in Tokyo, Reykjavik and the Mojave.</p></Reveal>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPS.map(c => (
            <div key={c.code} data-r onPointerMove={onMove}
              className={`group relative min-h-[200px] overflow-hidden rounded-sm glass p-7 transition-all duration-500 hover:-translate-y-1 hover:border-cy/40 ${c.span ?? ''}`}
              style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <i />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgba(110,232,255,0.16), transparent 50%)' }} />
              <div className="relative flex items-center justify-between">
                <span className="mono text-[10px] tracking-[0.25em] text-cy">{c.code}</span>
                <span className="mono rounded-sm border border-[rgba(110,232,255,0.2)] px-1.5 py-0.5 text-[10px] tracking-[0.2em] text-faint">{c.tag}</span>
              </div>
              <div className="relative">
                <h3 className="mb-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-cy">{c.t}</h3>
                <p className="text-sm leading-relaxed text-dim">{c.d}</p>
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.04] transition-opacity group-hover:opacity-10">
                <svg width="140" height="140" viewBox="0 0 100 100" className="spin">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#6ee8ff" strokeWidth="0.4" strokeDasharray="3 5" />
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#6ee8ff" strokeWidth="0.4" strokeDasharray="2 3" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="#6ee8ff" strokeWidth="0.4" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CONFIGURATOR ================= */
const SLOTS = [
  {
    id: 'eyes', name: 'Optic Array', field: 'eyes',
    options: [
      { n: 'Standard Cyan', c: '#6ee8ff', p: 0, d: '240 Hz event driven pair' },
      { n: 'Thermal Rose', c: '#ff4dd2', p: 4200, d: 'Adds long wave infrared' },
      { n: 'Apex Gold', c: '#ffb547', p: 6800, d: 'Low light and 12x zoom' },
    ],
  },
  {
    id: 'jaw', name: 'Vocal Module', field: 'jaw',
    options: [
      { n: 'Grille V2', c: '#8a7dff', p: 0, d: 'Standard speech and sonar' },
      { n: 'Polyphonic', c: '#c1ff72', p: 2400, d: 'Four octave range' },
      { n: 'Sub Bass', c: '#ff4d6d', p: 3900, d: 'Felt through walls' },
    ],
  },
  {
    id: 'core', name: 'Power Core', field: 'core',
    options: [
      { n: 'Li Metal 144h', c: '#ff4dd2', p: 0, d: 'Solid state, 90 s swap' },
      { n: 'Fusion Cell', c: '#6ee8ff', p: 15000, d: 'Nine day runtime' },
      { n: 'Solar Weave', c: '#ffb547', p: 9200, d: 'Self charging shell' },
    ],
  },
];

function Configurator({ colors, setColors }: { colors: Record<string, string>; setColors: (c: Record<string, string>) => void }) {
  const [pick, setPick] = useState<Record<string, number>>({ eyes: 0, jaw: 0, core: 0 });
  const total = SLOTS.reduce((sum, s) => sum + s.options[pick[s.id]].p, 0);

  const choose = (slot: string, i: number) => {
    const next = { ...pick, [slot]: i };
    setPick(next);
    const c: Record<string, string> = {};
    SLOTS.forEach(s => { c[s.field] = s.options[next[s.id]].c; });
    setColors(c);
  };

  return (
    <section id="build" className="relative border-t hair py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <Reveal><div className="label mb-3">// Configure your unit</div></Reveal>
          <Words className="mx-auto max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl" text="Build the cyborg you want to be." />
          <Reveal delay={140}><p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-dim">Pick an optic array, a vocal module and a power core. The chassis updates live and the price follows.</p></Reveal>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto h-[400px] w-full max-w-md sm:h-[520px]">
            <div className="gridfine pointer-events-none absolute inset-0 opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CyborgFace eyes={colors.eyes} jaw={colors.jaw} core={colors.core} />
            </div>
            <div className="mono pointer-events-none absolute left-2 top-2 text-[9px] tracking-[0.25em] text-cy">LIVE PREVIEW</div>
            <div className="mono pointer-events-none absolute right-2 top-2 text-right text-[9px] tracking-[0.25em] text-faint">
              <div>SYNC OK</div><div>{(0.4).toFixed(1)} MS</div>
            </div>
          </div>

          <div className="space-y-5">
            {SLOTS.map(s => (
              <div key={s.id} className="hud glass rounded-sm p-5"><i />
                <div className="mono mb-4 flex items-center justify-between text-[10px] tracking-[0.25em]">
                  <span className="text-cy">{s.id.toUpperCase()}</span>
                  <span className="text-dim">{s.name}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {s.options.map((o, i) => {
                    const on = pick[s.id] === i;
                    return (
                      <button key={o.n} aria-pressed={on} onClick={() => choose(s.id, i)}
                        className="opt rounded-sm border border-white/10 p-3 text-left" style={{ color: o.c }}>
                        <div className="mono text-[10px] font-semibold tracking-[0.14em] uppercase">{o.n}</div>
                        <div className="mono mt-1 text-[9px] text-dim">{o.p === 0 ? 'Included' : `+ $${o.p.toLocaleString()}`}</div>
                        <div className="mt-2 text-[11px] leading-snug text-dim">{o.d}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="hud flex flex-col gap-4 rounded-sm border border-cy/30 bg-cy/5 p-5 sm:flex-row sm:items-center sm:justify-between"><i />
              <div>
                <div className="mono text-[10px] tracking-[0.25em] text-dim">Configured total</div>
                <div className="disp mt-1 text-3xl">${(240000 + total).toLocaleString()}</div>
              </div>
              <button className="btn btn-fill">Reserve this build <Arrow /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TERMINAL ================= */
const LOG = [
  ['$', 'nexus boot --unit 0421 --gen 4'],
  ['>', 'OK · BIOS v4.02 · self test pass'],
  ['>', 'OK · neuromorphic fabric 14B params · 41 C'],
  ['>', 'OK · vision link 2x silicon retina 240 Hz'],
  ['>', 'OK · uplink 6G mesh 0.4 ms RTT'],
  ['$', 'nexus pair --owner "akira.m"'],
  ['>', 'pairing 256 channel neural link · done in 0.4 ms'],
  ['>', 'calibrating gait, voice, grip · 3.7 s · 12/12 pass'],
  ['>', 'hello, akira. i am ready.'],
];

function Terminal() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let i = 0;
      const id = setInterval(() => { i++; setShown(i); if (i >= LOG.length) clearInterval(id); }, 620);
      io.disconnect();
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section id="terminal" ref={ref} className="relative border-y hair bg-bg2 py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <Reveal><div className="label mb-3">// First run</div></Reveal>
          <Words className="text-4xl font-semibold tracking-tighter sm:text-5xl" text="Cold steel to first hello in 3.7 seconds." />
          <Reveal delay={120}><p className="mt-5 max-w-md text-sm leading-relaxed text-dim">Boot is hands off. NEXUS/7 verifies every channel, calibrates the neural link and introduces itself without a single prompt.</p></Reveal>
          <div className="mono mt-8 space-y-3 text-xs text-dim">
            {[['No cloud dependency', 'bg-cy'], ['No telemetry by default', 'bg-mg'], ['Audited open source OS', 'bg-am']].map(([t, c]) => (
              <div key={t} className="flex items-center gap-3"><span className={`h-1.5 w-1.5 rounded-full ${c}`} />{t}</div>
            ))}
          </div>
        </div>
        <div className="hud overflow-hidden rounded-sm glass"><i />
          <div className="flex items-center justify-between border-b hair px-4 py-2.5">
            <div className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-mg" /><span className="h-2.5 w-2.5 rounded-full bg-am" /><span className="h-2.5 w-2.5 rounded-full bg-cy" />
            </div>
            <span className="mono text-[10px] tracking-[0.2em] text-dim">/dev/nexus · tty1</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cy pulse" />
          </div>
          <div className="mono min-h-[280px] bg-bg p-5 text-[12.5px] leading-relaxed sm:p-6">
            {LOG.slice(0, shown).map(([p, t], i) => (
              <div key={i} className="flex gap-2">
                <span className={p === '$' ? 'shrink-0 text-cy' : 'shrink-0 text-mg'}>{p}</span>
                <span className="text-tx">{t}</span>
              </div>
            ))}
            {shown < LOG.length && (
              <div className="mt-1 flex gap-2"><span className="text-cy">$</span><span className="inline-block h-4 w-2 animate-pulse bg-cy" /></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= SPECS ================= */
const ROWS: [string, string, string][] = [
  ['CPU', 'NEXUS A10 neuromorphic, 14B on die', '4.2 TFLOPS / W'],
  ['VISION', '2x silicon retina, 240 Hz, event driven', '1.2M px / s'],
  ['FRAME', 'Magnesium weave and carbon composite', 'IP68, 1.4 m drop'],
  ['BATTERY', 'Solid state Li metal, adaptive draw', '144 h, 90 s swap'],
  ['LINK', '256 channel bidirectional neural', '0.4 ms RTT'],
  ['OS', 'NEXUS OS 4.2, open source, signed boot', 'No telemetry'],
  ['NETWORK', '6G mesh with LEO satellite fallback', '99.97% uptime'],
  ['WEIGHT', '78 kg with a 220 kg payload', 'Serviceable in 4 min'],
];

function Specs() {
  const [ref] = useProgress<HTMLDivElement>();
  return (
    <section id="specs" className="relative">
      <div ref={ref} className="relative h-[200vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(110,232,255,0.12),transparent_60%)]" />
          <div className="relative h-[520px] w-[260px] sm:h-[620px] sm:w-[320px] lg:h-[680px] lg:w-[380px]">
            <CyborgBody />
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <div className="label mb-3">Anthropomorphic frame · 178 cm</div>
            <div className="disp text-2xl holo sm:text-4xl">NEXUS / 7</div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal><div className="label mb-3">// Technical datasheet</div></Reveal>
            <Words className="text-4xl font-semibold tracking-tighter sm:text-5xl" text="Every spec. On the record." />
          </div>
          <Reveal delay={120}><p className="max-w-sm text-sm leading-relaxed text-dim">Full disclosure. Compare against any anthropomorphic platform on the market. We publish what others redact.</p></Reveal>
        </div>
        <Reveal y={30}>
          <div className="hud overflow-hidden rounded-sm glass"><i />
            <div className="mono grid grid-cols-12 border-b hair px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-faint">
              <div className="col-span-4">Module</div><div className="col-span-5">Spec</div><div className="col-span-3 text-right">Headline</div>
            </div>
            {ROWS.map(([m, s, h]) => (
              <div key={m} className="mono grid grid-cols-12 items-center border-b hair px-6 py-5 transition-colors last:border-0 hover:bg-[rgba(110,232,255,0.03)]">
                <div className="col-span-12 text-[11px] uppercase tracking-[0.25em] text-cy sm:col-span-4">// {m}</div>
                <div className="col-span-12 mt-2 font-sans text-sm text-tx sm:col-span-5 sm:mt-0">{s}</div>
                <div className="disp col-span-12 mt-2 text-base sm:col-span-3 sm:mt-0 sm:text-right">{h}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= STATUS + CTA ================= */
const OPS = [
  ['NEXUS OPS', '0421', 'ONLINE', 'bg-cy'],
  ['NEURAL LINK', '256ch', 'STABLE', 'bg-mg'],
  ['GRID MESH', '6G', '99.97%', 'bg-am'],
  ['OS AUDIT', 'v4.02', 'SIGNED', 'bg-ac'],
];

function Acquire() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      animate(root.querySelectorAll('.r-word'), { translateY: ['110%', '0%'], opacity: [0, 1], duration: 1100, delay: stagger(90), ease: 'outExpo' });
      animate(root.querySelectorAll('.c-fade'), { opacity: [0, 1], translateY: [20, 0], duration: 900, delay: stagger(120, { start: 500 }), ease: 'outExpo' });
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(root);
    return () => io.disconnect();
  }, []);
  return (
    <section id="acquire" ref={ref} className="relative overflow-hidden border-t hair py-36 sm:py-48">
      <div className="gridbg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,77,210,0.16),transparent_55%),radial-gradient(ellipse_at_70%_50%,rgba(110,232,255,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="c-fade glass mb-10 inline-flex items-center gap-3 rounded-full px-4 py-2" style={{ opacity: 0 }}>
          <span className="h-1.5 w-1.5 rounded-full bg-mg pulse" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-mg">Allocation · 12 units remaining</span>
        </div>
        <h2 className="disp text-5xl font-black leading-[0.9] tracking-tighter sm:text-7xl lg:text-[7rem]">
          {['INITIATE', 'ACQUISITION', 'PROTOCOL.'].map((w, i) => (
            <span key={w} className="r-line mr-3 inline-block">
              <span className={`r-word ${i === 1 ? 'text-cy' : i === 2 ? 'holo' : ''}`}>{w}</span>
            </span>
          ))}
        </h2>
        <p className="c-fade mx-auto mt-8 max-w-xl text-dim" style={{ opacity: 0 }}>
          Pre orders ship in the second quarter of 2027. A 0.4 percent allocation deposit, fully refundable. Lifetime OS upgrades and a ten year frame warranty included.
        </p>
        <div className="c-fade mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ opacity: 0 }}>
          <a href="https://techfest.org" target="_blank" rel="noopener" className="btn btn-fill !text-sm !px-7 !py-4">Reserve a unit <Arrow /></a>
          <button onClick={() => document.getElementById('build')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-out">Reconfigure</button>
        </div>
        <div className="c-fade mono mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.2em] text-faint" style={{ opacity: 0 }}>
          <span>Ten year warranty</span><span>Free global shipping</span><span>Lifetime OS updates</span>
        </div>
      </div>
    </section>
  );
}

function StatusBar() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>('[data-r]');
    items.forEach(t => { t.style.opacity = '0'; t.style.transform = 'translateY(24px)'; });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      animate(items, { opacity: [0, 1], translateY: [24, 0], duration: 900, delay: stagger(90), ease: 'outExpo' });
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(root);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="relative border-t hair bg-bg2 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="hud grid grid-cols-2 gap-px overflow-hidden rounded-sm border hair bg-[rgba(110,232,255,0.1)] lg:grid-cols-4"><i />
          {OPS.map(([c, n, s, col]) => (
            <div key={c} data-r className="flex items-center justify-between bg-bg p-6 transition-colors hover:bg-[rgba(110,232,255,0.04)]">
              <div>
                <div className="mono text-[10px] tracking-[0.25em] text-faint">{c}</div>
                <div className="disp mt-1 text-lg">{n}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${col} pulse`} />
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-dim">{s}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div data-r>
            <div className="label mb-3">// Subscribe</div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Get the dispatch.</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-dim">Quarterly briefings from the engineering team. Hardware teardowns, software releases and field reports.</p>
            <form onSubmit={e => e.preventDefault()} className="mt-5 flex max-w-md gap-2">
              <input type="email" placeholder="you@domain.com" className="mono flex-1 rounded-sm border hair bg-bg px-4 py-3 text-sm placeholder:text-faint focus:border-cy focus:outline-none" />
              <button className="btn btn-fill !py-3 !px-5">Join</button>
            </form>
          </div>
          <div data-r className="mono flex flex-col justify-end gap-2 text-[10px] uppercase tracking-[0.2em] text-faint sm:items-end">
            <div>Built in Tokyo · Reykjavik · Mojave</div>
            <div>NEXUS Robotics, Inc.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */
function Foot() {
  const links: [string, string][] = [
    ['Instagram', 'https://www.instagram.com/techfest_iitbombay/'],
    ['X', 'https://x.com/Techfest_IITB'],
    ['LinkedIn', 'https://www.linkedin.com/company/techfest-iit-bombay/'],
    ['YouTube', 'https://www.youtube.com/@TechfestIITBombay'],
  ];
  return (
    <footer className="relative border-t hair bg-bg">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="disp pointer-events-none select-none text-[16vw] font-black leading-none tracking-tight stroke opacity-40 lg:text-[12rem]">NEXUS/7</div>
        <div className="mt-8 grid gap-8 border-t hair pt-8 md:grid-cols-3">
          <div>
            <div className="disp text-base font-bold tracking-[0.18em]">NEXUS<span className="text-cy">/</span>7</div>
            <p className="mono mt-3 max-w-xs text-xs leading-relaxed text-dim">Generation IV anthropomorphic platform. Designed in Tokyo, assembled in Reykjavik, audited in Berlin.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-[11px] uppercase tracking-[0.18em]">
            <div className="flex flex-col gap-2">
              <span className="mono text-faint">Product</span>
              <button onClick={() => scrollToId('specs')} className="text-left text-dim transition-colors hover:text-cy">Specs</button>
              <button onClick={() => scrollToId('evolution')} className="text-left text-dim transition-colors hover:text-cy">Evolution</button>
              <button onClick={() => scrollToId('capabilities')} className="text-left text-dim transition-colors hover:text-cy">Caps</button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="mono text-faint">Company</span>
              {links.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener" className="text-dim transition-colors hover:text-cy">{n}</a>)}
            </div>
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.18em] text-faint md:text-right">
            <div>Status: <span className="text-cy">Operational</span></div>
            <div className="mt-2">Latency 0.4 ms</div>
            <div className="mt-2">Uptime 99.97%</div>
          </div>
        </div>
      </div>
      <div className="border-t hair">
        <div className="mono mx-auto flex max-w-7xl flex-col justify-between gap-2 px-6 py-5 text-[10px] uppercase tracking-[0.18em] text-faint sm:flex-row">
          <span>NEXUS Robotics, Inc.</span>
          <span>Built for the next interface</span>
        </div>
      </div>
    </footer>
  );
}

/* ================= PAGE ================= */
export default function Page() {
  useCursorParallax();
  const [colors, setColors] = useState<Record<string, string>>({ eyes: '#6ee8ff', jaw: '#8a7dff', core: '#ff4dd2' });

  return (
    <>
      <Hero onPulse={() => window.dispatchEvent(new Event('nexus-pulse'))} />
      <Ticker />
      <Metrics />
      <Evolution />
      <Capabilities />
      <Configurator colors={colors} setColors={setColors} />
      <Terminal />
      <Specs />
      <StatusBar />
      <Acquire />
      <Foot />
    </>
  );
}
