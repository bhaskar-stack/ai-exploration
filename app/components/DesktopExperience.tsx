'use client';

import { useState, useEffect, useRef } from 'react';
import Brand from './Brand';
import SocialProof from './SocialProof';
import ShortlistView from './ShortlistView';
import AnimatedNumber from './AnimatedNumber';
import type { Answers, Question } from '../lib/data';
import { QUESTIONS, COUNTRY_NAME, getMeta, resultFor, answerLabel, liveCount } from '../lib/data';

function DeskLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="splash">
      <div className="splash-core">
        <div className="splash-pill">Free &middot; AI Powered</div>
        <div className="splash-copy">
          <h1 className="splash-h1">Find universities abroad<br />that <span className="splash-hl">actually fit you</span>.</h1>
          <p className="splash-sub">A shortlist built around your grades, budget and goals,<br />matched across 1,500+ universities</p>
        </div>
        <button className="splash-cta" onClick={onStart}>Evaluate my profile</button>
        <div className="splash-note">Free &middot; No signup &middot; 5 min</div>
      </div>
      <div className="splash-proof">
        <div className="splash-avatars">
          <span style={{ background: '#0E7C7B' }}>A</span>
          <span style={{ background: '#E8920C' }}>R</span>
          <span style={{ background: '#2a5bb8' }}>S</span>
          <span style={{ background: '#1B9E5A' }}>P</span>
          <span style={{ background: '#8B5CF6' }}>M</span>
        </div>
        <div className="splash-trust">Trusted by <b>120K+</b> students across India &amp; South Asia</div>
      </div>
    </div>
  );
}

function DeskQ1({ onAnswer }: { onAnswer: (v: string) => void }) {
  const Q = QUESTIONS[0];
  return (
    <div className="desk-q1">
      <div className="q1-inner">
        <span className="eyebrow">Question 1 of 6</span>
        <h1 className="q1-h">{Q.q}</h1>
        <p className="q1-sub">We'll tailor every question after this to your answer.</p>
        <div className="q1-opts">
          {Q.opts!.map(([v, l]) => (
            <button key={v} className="q1-chip" onClick={() => onAnswer(v)}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Composer({ Q, answers, setAnswers, onSingle, onAdvance }: {
  Q: Question;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onSingle: (v: string) => void;
  onAdvance: () => void;
}) {
  useEffect(() => {
    if (Q.kind === 'slider' && answers.budget == null) setAnswers(a => ({ ...a, budget: Q.def }));
  }, [Q.id]);

  const val = answers[Q.id];

  if (Q.kind === 'single') {
    return (
      <div className="chips comp-chips">
        {Q.opts!.map(([v, l]) => (
          <button key={v} className={'chip' + (val === v ? ' on' : '')} onClick={() => onSingle(v)}>{l}</button>
        ))}
      </div>
    );
  }

  if (Q.kind === 'multi') {
    const arr = Array.isArray(val) ? val : [];
    const toggle = (v: string) => setAnswers(a => {
      let x = Array.isArray(a[Q.id]) ? [...(a[Q.id] as string[])] : [];
      if (v === 'open') x = x.includes('open') ? [] : ['open'];
      else { x = x.filter(y => y !== 'open'); x.includes(v) ? x = x.filter(y => y !== v) : x.push(v); }
      return { ...a, [Q.id]: x };
    });
    return (
      <>
        <div className="chips comp-chips">
          {Q.opts!.map(([v, l]) => (
            <button key={v} className={'chip' + (arr.includes(v) ? ' on' : '')} onClick={() => toggle(v)}>
              {arr.includes(v) && <span className="ck">✓</span>}{l}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={arr.length === 0} onClick={onAdvance}>Send</button>
      </>
    );
  }

  const v = (val as number) ?? Q.def!;
  const fill = (v - Q.min!) / (Q.max! - Q.min!) * 100;
  return (
    <>
      <div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 24, color: 'var(--teal-deep)' }}>
        ₹{v}L <small style={{ fontSize: 13, color: 'var(--ink-mute)', fontWeight: 500 }}>total</small>
      </div>
      <input type="range" min={Q.min} max={Q.max} step={Q.step} value={v}
        style={{ '--fill': fill + '%', margin: '12px 0 4px' } as React.CSSProperties}
        onChange={e => setAnswers(a => ({ ...a, budget: +e.target.value }))}
        aria-label="Budget in lakhs"
      />
      <div className="scalelbl"><span>₹{Q.min}L</span><span>₹{Q.max}L+</span></div>
      <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={onAdvance}>See my matches</button>
    </>
  );
}

function DeskAdjust({ answers, setAnswers, onRestart }: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onRestart: () => void;
}) {
  const [open, setOpen] = useState(true);
  const setSingle = (k: string, v: string | number) => setAnswers(a => ({ ...a, [k]: v }));
  const toggleCountry = (v: string) => setAnswers(a => {
    let arr = Array.isArray(a.countries) ? [...a.countries] : [];
    if (v === 'open') arr = arr.includes('open') ? [] : ['open'];
    else { arr = arr.filter(x => x !== 'open'); arr.includes(v) ? arr = arr.filter(x => x !== v) : arr.push(v); }
    return { ...a, countries: arr };
  });

  const b = answers.budget ?? 28;
  const fill = (b - 8) / 52 * 100;

  const chip = (field: string | null, v: string, label: string, multi?: boolean) => {
    const on = multi ? (answers.countries || []).includes(v) : answers[field!] === v;
    return (
      <button key={v} className={'chip' + (on ? ' on' : '')}
        onClick={() => multi ? toggleCountry(v) : setSingle(field!, v)}>
        {on && <span className="ck">✓</span>}{label}
      </button>
    );
  };

  return (
    <div className="lever">
      <button className="lever-h" onClick={() => setOpen(o => !o)}>
        <span>Adjust answers <span className="lever-hint">— updates live</span></span>
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="lever-body">
          <div className="sheet-field">
            <div className="fl">Goal</div>
            <div className="chips">{([['ms', 'Master\u2019s'], ['phd', 'PhD'], ['unsure', 'Not sure']] as [string, string][]).map(([v, l]) => chip('degree', v, l))}</div>
          </div>
          <div className="sheet-field">
            <div className="fl">Field</div>
            <div className="chips">{([['cs', 'Computer Science'], ['data', 'Data / AI'], ['eng', 'Engineering'], ['business', 'Business'], ['other', 'Other']] as [string, string][]).map(([v, l]) => chip('field', v, l))}</div>
          </div>
          <div className="sheet-field">
            <div className="fl">Academic score</div>
            <div className="chips">{([['lt60', '<60%'], ['60-70', '60–70%'], ['70-75', '70–75%'], ['75-85', '75–85%'], ['85plus', '85%+']] as [string, string][]).map(([v, l]) => chip('band', v, l))}</div>
          </div>
          <div className="sheet-field">
            <div className="fl">IELTS / GRE</div>
            <div className="chips">{([['none', 'Not started'], ['prep', 'Preparing'], ['have', 'Have scores']] as [string, string][]).map(([v, l]) => chip('test', v, l))}</div>
          </div>
          <div className="sheet-field">
            <div className="fl">Destinations</div>
            <div className="chips">{([['CA', '🇨🇦 Canada'], ['AU', '🇦🇺 Australia'], ['IE', '🇮🇪 Ireland'], ['GB', '🇬🇧 UK'], ['US', '🇺🇸 USA'], ['DE', '🇩🇪 Germany'], ['open', 'Open']] as [string, string][]).map(([v, l]) => chip(null, v, l, true))}</div>
          </div>
          <div className="sheet-field">
            <div className="fl">Budget · ₹{b}L total</div>
            <input type="range" min="8" max="60" step="1" value={b}
              style={{ '--fill': fill + '%' } as React.CSSProperties}
              onChange={e => setSingle('budget', +e.target.value)} aria-label="Budget in lakhs" />
            <div className="scalelbl"><span>₹8L</span><span>₹60L+</span></div>
          </div>
          <button className="lever-restart" onClick={onRestart}>↺ Start over</button>
        </div>
      )}
    </div>
  );
}

function DeskChat({ answers, setAnswers, step, setStep, done, onRestart }: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  done: boolean;
  onRestart: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [step, done]);

  const Q = QUESTIONS[step < QUESTIONS.length ? step : QUESTIONS.length - 1];
  const onSingle = (v: string) => {
    setAnswers(a => ({ ...a, [Q.id]: v }));
    setTimeout(() => setStep(s => s + 1), 240);
  };
  const onAdvance = () => setStep(s => s + 1);
  const answeredCount = Math.min(step, QUESTIONS.length);

  return (
    <div className="desk-chat">
      <div className="chat-scroll" ref={scrollRef}>
        {QUESTIONS.slice(0, answeredCount).map(q => (
          <div key={q.id}>
            <div className="ai-msg"><div className="q">{q.q}</div></div>
            <div className="ubub">{answerLabel(q, answers)}</div>
          </div>
        ))}
        {!done && step < QUESTIONS.length && (
          <div className="ai-msg" key={'cur' + Q.id}>
            <div className="q">{Q.q}</div>
            {Q.help && <div className="help">{Q.help}</div>}
          </div>
        )}
        {done && (
          <div className="ai-msg">
            <div className="q">All set — your shortlist is on the right. Adjust anything below and it updates instantly.</div>
          </div>
        )}
        <div className="chat-composer">
          {!done && step < QUESTIONS.length && (
            <Composer Q={Q} answers={answers} setAnswers={setAnswers} onSingle={onSingle} onAdvance={onAdvance} />
          )}
          {done && <DeskAdjust answers={answers} setAnswers={setAnswers} onRestart={onRestart} />}
        </div>
      </div>
      <div className="chat-input-bar">
        <div className="chat-input-wrap">
          <input type="text" placeholder="Ask me anything about studying abroad..." readOnly />
          <button className="chat-send-btn" aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M8 4L4.5 7.5M8 4l3.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function DeskCanvas({ answers, done }: { answers: Answers; done: boolean }) {
  const m = getMeta(answers);

  if (done) {
    const r = resultFor(answers);
    const ctx = { phd: r.phd, budget: r.budget };
    const total = r.match.length + r.safe.length + r.reach.length;
    return (
      <div className="cv">
        <h2 className="cv-h2">{total} matches for you</h2>
        <ShortlistView r={r} ctx={ctx} />
      </div>
    );
  }

  const n = liveCount(answers);
  const inB = answers.budget != null ? Math.round(n * 0.58) : null;
  const sch = Math.round(n * 0.34);
  const answered = ['degree', 'field', 'band', 'test', 'countries', 'budget'].filter(k => {
    const v = answers[k];
    return v != null && !(Array.isArray(v) && v.length === 0);
  }).length;

  const rows: [string, string | null][] = [
    ['Goal', m.degreeName],
    ['Field', answers.field ? m.fieldName : null],
    ['Academic', m.gradeName !== '—' ? m.gradeName : null],
    ['Test', m.testName],
    ['Destinations', answers.countries && answers.countries.length ? m.countryName : null],
    ['Budget', answers.budget != null ? '₹' + answers.budget + 'L total' : null],
  ];

  return (
    <div className="cv">
      <h2 className="cv-h2"><AnimatedNumber value={n} /> programmes match your profile</h2>
      <p className="cv-sub">Narrowing from 1,500+ as you answer — the more you share, the sharper the shortlist.</p>
      <div className="cv-grid">
        <div className="statcard"><div className="num"><AnimatedNumber value={n} /></div><div className="lbl">in range now</div></div>
        <div className="statcard"><div className="num">{inB != null ? <AnimatedNumber value={inB} /> : '—'}</div><div className="lbl">within your budget</div></div>
        <div className="statcard"><div className="num"><AnimatedNumber value={sch} /></div><div className="lbl">with scholarships</div></div>
        <div className="statcard"><div className="num">{answered}<span style={{ fontSize: 18, color: 'var(--ink-mute)' }}>/6</span></div><div className="lbl">profile complete</div></div>
      </div>
      <div className="profilecard">
        <div className="pc-h">Your profile so far</div>
        {rows.map(([k, v]) => (
          <div className={'prow' + (v ? '' : ' ghost')} key={k}>
            <span className="pk">{k}</span>
            <span className="pv">{v || 'Pending…'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesktopExperience({ answers, setAnswers }: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) {
  const [dscreen, setDscreen] = useState<'landing' | 'q1' | 'chat'>('landing');
  const [step, setStep] = useState(1);
  const done = dscreen === 'chat' && step >= QUESTIONS.length;

  const answerQ1 = (v: string) => {
    setAnswers(a => ({ ...a, degree: v }));
    setStep(1);
    setDscreen('chat');
  };

  const restart = () => {
    setAnswers({});
    setStep(1);
    setDscreen('landing');
  };

  return (
    <div className="desk">
      <div className={`desk-nav${dscreen !== 'landing' ? ' has-border' : ''}`}>
        <Brand />
      </div>
      {dscreen === 'landing' && <DeskLanding onStart={() => setDscreen('q1')} />}
      {dscreen === 'q1' && <DeskQ1 onAnswer={answerQ1} />}
      {dscreen === 'chat' && (
        <div className="desk-split">
          <DeskChat answers={answers} setAnswers={setAnswers} step={step} setStep={setStep} done={done} onRestart={restart} />
          <div className="desk-canvas">
            <div className="canvas-topbar">
              <span>{done ? 'Personalized recommendation' : 'Profile evaluation'}</span>
              <span className="canvas-live"><span className="livedot" />LIVE</span>
            </div>
            <div className="canvas-scroll">
              <DeskCanvas answers={answers} done={done} />
            </div>
            {done && (
              <div className="counsel-bar">
                <div className="counsel-text">
                  <h3>Want a human to check this?</h3>
                  <p>A Leap counsellor can plan your applications and funding — free.</p>
                </div>
                <button className="btn btn-dark">Book a free call</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
