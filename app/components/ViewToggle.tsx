'use client';

export default function ViewToggle({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  return (
    <div className="viewtoggle" role="group" aria-label="Preview as desktop or mobile">
      <button className={mode === 'desktop' ? 'on' : ''} aria-pressed={mode === 'desktop'} onClick={() => setMode('desktop')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span>Desktop</span>
      </button>
      <button className={mode === 'mobile' ? 'on' : ''} aria-pressed={mode === 'mobile'} onClick={() => setMode('mobile')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        <span>Mobile</span>
      </button>
    </div>
  );
}
