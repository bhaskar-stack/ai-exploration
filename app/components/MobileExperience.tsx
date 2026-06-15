'use client';

import { useState } from 'react';
import Landing from './Landing';
import Agent from './Agent';
import Thinking from './Thinking';
import Results from './Results';
import type { Answers } from '../lib/data';

export default function MobileExperience({ answers, setAnswers }: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) {
  const [screen, setScreen] = useState<'landing' | 'agent' | 'thinking' | 'results'>('landing');

  return (
    <div style={{ minHeight: '100%', display: 'flex', justifyContent: 'center' }}>
      {screen === 'landing' && <Landing onStart={() => setScreen('agent')} />}
      {screen === 'agent' && (
        <Agent answers={answers} setAnswers={setAnswers} onDone={() => setScreen('thinking')} onBack={() => setScreen('landing')} />
      )}
      {screen === 'thinking' && <Thinking onDone={() => setScreen('results')} />}
      {screen === 'results' && (
        <Results answers={answers} setAnswers={setAnswers} onRestart={() => { setAnswers({}); setScreen('landing'); }} />
      )}
    </div>
  );
}
