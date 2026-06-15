'use client';

import { useState } from 'react';
import type { Answers } from '../lib/data';

export default function AdjustSheet({ answers, onApply, onClose }: {
  answers: Answers;
  onApply: (d: Answers) => void;
  onClose: () => void;
}) {
  const [d, setD] = useState<Answers>({
    degree: answers.degree || 'ms',
    field: answers.field || 'cs',
    band: answers.band || '70-75',
    test: answers.test || 'prep',
    countries: answers.countries || ['CA', 'AU'],
    budget: answers.budget ?? 28,
  });

  const setSingle = (k: string, v: string | number) => setD(s => ({ ...s, [k]: v }));

  const toggleCountry = (v: string) => setD(s => {
    let arr = [...(s.countries || [])];
    if (v === 'open') {
      arr = arr.includes('open') ? [] : ['open'];
    } else {
      arr = arr.filter(x => x !== 'open');
      arr.includes(v) ? arr = arr.filter(x => x !== v) : arr.push(v);
    }
    return { ...s, countries: arr };
  });

  const fill = ((d.budget ?? 28) - 8) / (60 - 8) * 100;

  const chip = (field: string | null, v: string, label: string, multi?: boolean) => {
    const on = multi ? (d.countries || []).includes(v) : d[field!] === v;
    return (
      <button key={v} className={'chip' + (on ? ' on' : '')}
        onClick={() => multi ? toggleCountry(v) : setSingle(field!, v)}>
        {on && <svg className="ck" width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L8.5 15L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {label}
      </button>
    );
  };

  return (
    <div className="sheetwrap">
      <div className="sheetbd" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="Adjust your inputs">
        <div className="grab" />
        <div className="sheet-h">
          <h3>Adjust your inputs</h3>
          <button className="sheet-x" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="sheet-body">
          <div className="sheet-field">
            <div className="fl">Goal</div>
            <div className="chips">
              {([['ms', 'Master\u2019s'], ['phd', 'PhD'], ['unsure', 'Not sure']] as [string, string][]).map(([v, l]) => chip('degree', v, l))}
            </div>
          </div>
          <div className="sheet-field">
            <div className="fl">Field</div>
            <div className="chips">
              {([['cs', 'Computer Science'], ['data', 'Data / AI'], ['eng', 'Engineering'], ['business', 'Business'], ['other', 'Other']] as [string, string][]).map(([v, l]) => chip('field', v, l))}
            </div>
          </div>
          <div className="sheet-field">
            <div className="fl">Academic score</div>
            <div className="chips">
              {([['lt60', '<60%'], ['60-70', '60–70%'], ['70-75', '70–75%'], ['75-85', '75–85%'], ['85plus', '85%+']] as [string, string][]).map(([v, l]) => chip('band', v, l))}
            </div>
          </div>
          <div className="sheet-field">
            <div className="fl">IELTS / GRE</div>
            <div className="chips">
              {([['none', 'Not started'], ['prep', 'Preparing'], ['have', 'Have scores']] as [string, string][]).map(([v, l]) => chip('test', v, l))}
            </div>
          </div>
          <div className="sheet-field">
            <div className="fl">Destinations</div>
            <div className="chips">
              {([['CA', '🇨🇦 Canada'], ['AU', '🇦🇺 Australia'], ['IE', '🇮🇪 Ireland'], ['GB', '🇬🇧 UK'], ['US', '🇺🇸 USA'], ['DE', '🇩🇪 Germany'], ['open', 'Open']] as [string, string][]).map(([v, l]) => chip(null, v, l, true))}
            </div>
          </div>
          <div className="sheet-field">
            <div className="fl">Budget · ₹{d.budget}L total</div>
            <input
              type="range" min="8" max="60" step="1" value={d.budget ?? 28}
              style={{ '--fill': fill + '%' } as React.CSSProperties}
              onChange={e => setSingle('budget', +e.target.value)}
              aria-label="Budget in lakhs"
            />
            <div className="scalelbl"><span>₹8L</span><span>₹60L+</span></div>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn btn-primary" onClick={() => onApply(d)}>Update matches</button>
        </div>
      </div>
    </div>
  );
}
