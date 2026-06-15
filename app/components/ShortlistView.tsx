'use client';

import { useState } from 'react';
import type { EvalResult, ScoredProgram } from '../lib/data';
import { whyText } from '../lib/data';

function UniCard({ p, ctx, delay }: { p: ScoredProgram; ctx: { phd: boolean; budget: number }; delay: number }) {
  const tags: [string, string][] = [];
  if (!ctx.phd && p.inBudget) tags.push(['budget', '✓ In budget']);
  if (p.profileGap >= 4) tags.push(['fit', 'Strong fit']);
  if (p.scholar) tags.push(['scholar', '★ Scholarship']);
  tags.push(['work', 'Work visa']);
  const shown = tags.slice(0, 3);
  const mid = p.band === 'reach';

  return (
    <div className="uni" style={{ animationDelay: delay + 'ms' }}>
      <div className="top">
        <div>
          <div className="nm">{p.uni}</div>
          <div className="uni-meta">
            <span className="uni-loc"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="#2f2f32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 14.667s5.333-4 5.333-8A5.333 5.333 0 0 0 2.667 6.667c0 4 5.333 8 5.333 8Z" stroke="#2f2f32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>{p.country}</span>
            <span className="uni-deg"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.667 11.333V5.333c0-.736 0-1.104.143-1.39a1.333 1.333 0 0 1 .467-.467c.286-.143.654-.143 1.39-.143h6.666c.736 0 1.104 0 1.39.143.201.1.366.266.467.467.143.286.143.654.143 1.39v6c0 .736 0 1.104-.143 1.39a1.333 1.333 0 0 1-.467.467c-.286.143-.654.143-1.39.143H4a1.333 1.333 0 0 1 0-2.667h8.333M5.333 3.333v5.334" stroke="#2f2f32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>{p.prog}</span>
          </div>
        </div>
        <div className={'score' + (mid ? ' mid' : '')}>
          Fit score: <b>{p.score}</b>
        </div>
      </div>
      <div className="tags">
        {shown.map(([cls, label]) => (
          <span key={cls} className={'tag ' + cls}>{label}</span>
        ))}
      </div>
    </div>
  );
}

type Tab = { key: string; label: string; color: string; items: ScoredProgram[] };

export default function ShortlistView({ r, ctx }: { r: EvalResult; ctx: { phd: boolean; budget: number } }) {
  const tabs: Tab[] = [
    { key: 'match', label: 'Strong matches', color: 'var(--green)', items: r.match },
    { key: 'safe', label: 'Safe picks', color: '#2a5bb8', items: r.safe },
    { key: 'reach', label: 'Reach', color: 'var(--amber)', items: r.reach },
  ].filter(t => t.items.length > 0);

  const [active, setActive] = useState(tabs[0]?.key ?? 'match');
  const current = tabs.find(t => t.key === active) ?? tabs[0];

  return (
    <>
      {tabs.length > 0 && (
        <>
          <div className="tab-bar">
            {tabs.map(t => (
              <button
                key={t.key}
                className={'tab-item' + (active === t.key ? ' active' : '')}
                onClick={() => setActive(t.key)}
              >
                {t.label}
                <span className="tab-count">{t.items.length}</span>
              </button>
            ))}
          </div>
          <div className="tab-cards">
            {current?.items.map((p, k) => (
              <UniCard key={p.id + current.key} p={p} ctx={ctx} delay={k * 70} />
            ))}
          </div>
        </>
      )}

      {!r.phd && r.unlock.length > 0 && (
        <div className="unlock">
          <div className="uhead">
            <div>
              <h3>{r.unlock.length} more open up with funding</h3>
              <p>Just above budget — reachable with a collateral-free Leap loan.</p>
            </div>
          </div>
          <div className="ulock">
            {r.unlock.map(p => (
              <div className="lockcard" key={p.id}>
                <div>
                  <div className="ln">{p.uni}</div>
                  <div className="lp">{p.prog} · ₹{p.tuition}L</div>
                </div>
                <div className="emi">
                  <b>₹{Math.round(p.tuition * 100000 * 0.013 / 1000)}k</b>
                  <span>/mo*</span>
                </div>
              </div>
            ))}
          </div>
          <div className="ufine">*Approx. EMI over ~10 yrs. A counsellor can confirm your eligibility.</div>
          <button className="btn btn-unlock">Request a callback</button>
        </div>
      )}
    </>
  );
}
