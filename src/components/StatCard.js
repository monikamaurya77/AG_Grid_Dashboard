import React from 'react';

export default function StatCard({ icon, label, value, sub, accent, delay = 0, style = {} }) {
  return (
    <div
      style={{
        background: accent ? accent : 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        boxShadow: 'var(--shadow)',
        animationDelay: `${delay}s`,
        ...style,
      }}
      className="fade-in"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--ink3)' }}>
          {label}
        </span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div
        className="count-up"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}
