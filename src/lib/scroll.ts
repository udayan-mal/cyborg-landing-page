/** Smooth programmatic scrolling that keeps working with Lenis active. */
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export function scrollToY(target: number, duration = 1400) {
  const start = window.scrollY;
  const delta = target - start;
  if (Math.abs(delta) < 2) return;
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + delta * easeOutQuint(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function scrollToEl(el: HTMLElement | null, duration = 1400) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(Math.max(0, top), duration);
}

export function scrollToId(id: string, duration = 1400) {
  scrollToEl(document.getElementById(id), duration);
}
