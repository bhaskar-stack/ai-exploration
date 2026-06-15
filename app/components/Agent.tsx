'use client';

import { useState, useEffect, useRef } from 'react';
import Brand from './Brand';
import type { Answers, Question } from '../lib/data';
import { QUESTIONS, answerLabel } from '../lib/data';

function Slider({ Q, val, setVal }: { Q: Question; val: number | undefined; setVal: (v: number) => void }) {
  const v = val ?? Q.def!;
  useEffect(() => {
    if (val == null) setVal(Q.def!);
  }, []);
  const fill = (v - Q.min!) / (Q.max! - Q.min!) * 100;

  return (
    <div className="slidebox">
      <div className="slideval">₹{v}L <small>total</small></div>
      <input
        type="range" min={Q.min} max={Q.max} step={Q.step} value={v}
        style={{ '--fill': fill + '%' } as React.CSSProperties}
        onChange={e => setVal(+e.target.value)}
        aria-label="Budget in lakhs"
      />
      <div className="scalelbl">
        <span>₹{Q.min}L</span>
        <span>₹{Q.max}L+</span>
      </div>
    </div>
  );
}

export default function Agent({ answers, setAnswers, onDone, onBack }: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onDone: () => void;
  onBack: () => void;
}) {
  const [i, setI] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const Q = QUESTIONS[i];
  const val = answers[Q.id];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [i]);

  const choose = (v: string) => {
    if (Q.kind === 'multi') {
      let arr = Array.isArray(val) ? [...val] : [];
      if (v === 'open') {
        arr = arr.includes('open') ? [] : ['open'];
      } else {
        arr = arr.filter(x => x !== 'open');
        arr.includes(v) ? arr = arr.filter(x => x !== v) : arr.push(v);
      }
      setAnswers(a => ({ ...a, [Q.id]: arr }));
    } else {
      setAnswers(a => ({ ...a, [Q.id]: v }));
      setTimeout(() => {
        i < QUESTIONS.length - 1 ? setI(i + 1) : onDone();
      }, 230);
    }
  };

  const ready = Q.kind === 'single' ? !!val :
    Q.kind === 'multi' ? Array.isArray(val) && val.length > 0 : true;

  return (
    <div className="app">
      <div className="topbar">
        <Brand />
      </div>
      <div className="progress">
        <button className="backbtn" onClick={() => i === 0 ? onBack() : setI(i - 1)}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div className="pbar">
          <i style={{ width: `${(i + 1) / QUESTIONS.length * 100}%` }} />
        </div>
        <span className="pstep">{i + 1}/{QUESTIONS.length}</span>
      </div>

      <div className="mchat-scroll" ref={scrollRef}>
        {QUESTIONS.slice(0, i).map(q => (
          <div key={q.id}>
            <div className="ai-msg"><div className="q">{q.q}</div></div>
            <div className="ubub">{answerLabel(q, answers)}</div>
          </div>
        ))}

        <div className="ai-msg" key={'cur' + Q.id}>
          <div className="q">{Q.q}</div>
          {Q.help && <div className="help">{Q.help}</div>}
        </div>

        {(Q.kind === 'single' || Q.kind === 'multi') && (
          <div className="chips" key={Q.id + 'c'}>
            {Q.opts!.map(([v, label]) => {
              const on = Q.kind === 'multi'
                ? Array.isArray(val) && val.includes(v)
                : val === v;
              return (
                <button key={v} className={'chip' + (on ? ' on' : '')} onClick={() => choose(v)}>
                  {on && <svg className="ck" width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L8.5 15L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {Q.kind === 'slider' && (
          <Slider
            Q={Q}
            val={val as number | undefined}
            setVal={v => setAnswers(a => ({ ...a, budget: v }))}
          />
        )}
      </div>

      <div className="agentcta">
        {Q.kind !== 'single' && (
          <button
            className="btn btn-primary"
            disabled={!ready}
            style={{ opacity: ready ? 1 : .5 }}
            onClick={() => i < QUESTIONS.length - 1 ? setI(i + 1) : onDone()}
          >
            {i < QUESTIONS.length - 1 ? 'Continue' : 'See my matches'}
          </button>
        )}
      </div>
    </div>
  );
}
