import { useEffect } from 'react';
import Lenis from 'lenis';
import Chrome from './components/Chrome';
import Page from './components/Scenes';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <>
      <div className="noise" />
      <div className="scan" />
      <div className="vig" />
      <Chrome />
      <main>
        <Page />
      </main>
    </>
  );
}
