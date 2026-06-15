'use client';

export default function SocialProof({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="social" style={style}>
      <div className="faces">
        <span style={{ background: '#0E7C7B' }}>A</span>
        <span style={{ background: '#E8920C' }}>R</span>
        <span style={{ background: '#2a5bb8' }}>S</span>
        <span style={{ background: '#1B9E5A' }}>P</span>
      </div>
      <div>
        <div className="stars">★★★★★</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 500 }}>
          Trusted by 120K+ students across India &amp; South Asia
        </div>
      </div>
    </div>
  );
}
