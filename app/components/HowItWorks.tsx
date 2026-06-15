'use client';

export default function HowItWorks() {
  return (
    <div className="how">
      <h3>How it works</h3>
      <div className="steps">
        <div className="step">
          <div className="stepic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
            </svg>
          </div>
          <div className="stxt"><b>Answer a few questions</b></div>
        </div>
        <div className="step">
          <div className="stepic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="6" x2="20" y2="6" />
              <line x1="9" y1="12" x2="20" y2="12" />
              <line x1="9" y1="18" x2="20" y2="18" />
              <circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="stxt"><b>Get your shortlist</b></div>
        </div>
        <div className="step">
          <div className="stepic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stxt"><b>See why each one fits</b></div>
        </div>
      </div>
    </div>
  );
}
