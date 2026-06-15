'use client';

import { useState, useEffect } from 'react';
import ViewToggle from './components/ViewToggle';
import DesktopExperience from './components/DesktopExperience';
import MobileExperience from './components/MobileExperience';
import type { Answers } from './lib/data';

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width:1024px)');
    setD(mq.matches);
    const h = (e: MediaQueryListEvent) => setD(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return d;
}

export default function Home() {
  const auto = useIsDesktop();
  const [override, setOverride] = useState<string | null>(null);
  const desktop = override == null ? auto : override === 'desktop';
  const [answers, setAnswers] = useState<Answers>({});

  return (
    <>
      <ViewToggle mode={desktop ? 'desktop' : 'mobile'} setMode={setOverride} />
      {desktop
        ? <DesktopExperience answers={answers} setAnswers={setAnswers} />
        : <MobileExperience answers={answers} setAnswers={setAnswers} />
      }
    </>
  );
}
