'use client';

import { useState, useEffect, useRef } from 'react';

export default function AnimatedNumber({ value }: { value: number }) {
  const [disp, setDisp] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) { setDisp(to); return; }

    const t0 = performance.now();
    const dur = 520;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setDisp(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{disp.toLocaleString('en-IN')}</>;
}
