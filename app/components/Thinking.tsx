'use client';

import { useState, useEffect } from 'react';
import Brand from './Brand';

export default function Thinking({ onDone }: { onDone: () => void }) {
  const lines = ['Reading your profile', 'Matching 1,500+ programmes', 'Checking budget & visas', 'Ranking by fit'];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < lines.length) {
      const t = setTimeout(() => setStep(step + 1), 560);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 450);
    return () => clearTimeout(t);
  }, [step, lines.length, onDone]);

  return (
    <div className="app">
      <div className="topbar"><Brand /></div>
      <div className="think">
        <h3>Building your shortlist…</h3>
        {lines.map((l, k) => (
          <div key={k} className={'tline' + (k <= step ? ' on' : '') + (k < step ? ' done' : '')}>
            {k < step ? <span className="tick">✓</span> :
              k === step ? <span className="spin" /> :
              <span style={{ width: 16 }} />}
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
