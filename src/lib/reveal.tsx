import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { animate, stagger } from 'animejs';

/** Fades and lifts children into view the first time they are seen. */
export function Reveal({
  children,
  delay = 0,
  y = 34,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 1100,
        delay,
        ease: 'outExpo',
      });
      io.disconnect();
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y]);
  return (
    <Tag ref={ref} className={`r-fade ${className}`}>
      {children}
    </Tag>
  );
}

/** Splits a heading into words that slide up out of a mask. */
export function RevealWords({
  text,
  className = '',
  delay = 0,
  step = 90,
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>('.r-word');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      animate(words, {
        translateY: ['110%', '0%'],
        opacity: [0, 1],
        duration: 1150,
        delay: stagger(step, { start: delay }),
        ease: 'outExpo',
      });
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay, step]);
  return (
    <Tag ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="r-line inline-block">
          <span className="r-word">{w}</span>
          {i < text.split(' ').length - 1 && <span className="r-word">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
