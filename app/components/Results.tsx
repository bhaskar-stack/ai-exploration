'use client';

import { useState } from 'react';
import Brand from './Brand';
import ShortlistView from './ShortlistView';
import AdjustSheet from './AdjustSheet';
import type { Answers } from '../lib/data';
import { evaluate, COUNTRY_NAME } from '../lib/data';

export default function Results({ answers, setAnswers, onRestart }: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onRestart: () => void;
}) {
  const [sheet, setSheet] = useState(false);

  const r = evaluate({
    degree: answers.degree === 'phd' ? 'phd' : 'ms',
    field: answers.field,
    band: answers.band,
    test: answers.test,
    countries: answers.countries || [],
    budget: answers.budget ?? 28,
  });

  const ctx = { phd: r.phd, budget: r.budget };
  const total = r.reach.length + r.match.length + r.safe.length;

  const fieldName: Record<string, string> = { cs: 'Computer Science', data: 'Data / AI', eng: 'Engineering', business: 'Business', other: 'Your field' };
  const gradeName: Record<string, string> = { lt60: '<60%', '60-70': '60–70%', '70-75': '70–75%', '75-85': '75–85%', '85plus': '85%+' };
  const countryLabel = (answers.countries || []).filter(c => c !== 'open').map(c => COUNTRY_NAME[c]).join(', ') || 'Open';

  return (
    <div className="app">
      <div className="topbar">
        <Brand />
        <button className="adjust" onClick={() => setSheet(true)}>Adjust</button>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, padding: 20 }}>
        <div className="rhead">
          <h2>{total} matches for you</h2>
        </div>

        <ShortlistView r={r} ctx={ctx} />

        <div className="footer">
          Demo · matches from sample data.<br />
          <button onClick={onRestart} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', marginTop: 8, fontSize: 12.5 }}>
            ↺ Start over
          </button>
        </div>
      </div>

      {sheet && (
        <AdjustSheet
          answers={answers}
          onClose={() => setSheet(false)}
          onApply={d => { setAnswers(d); setSheet(false); }}
        />
      )}
    </div>
  );
}
