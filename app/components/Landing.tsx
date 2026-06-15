'use client';

import Brand from './Brand';

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="app">
      <div className="topbar">
        <Brand />
      </div>
      <div className="splash-m">
        <div className="splash-core">
          <div className="splash-pill">Free &middot; AI Powered</div>
          <div className="splash-copy">
            <h1 className="splash-h1">Find universities abroad<br />that <span className="splash-hl">actually fit you</span>.</h1>
            <p className="splash-sub">A shortlist built around your grades, budget and goals, matched across 1,500+ universities</p>
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
    </div>
  );
}
