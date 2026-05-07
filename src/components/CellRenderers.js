import React from 'react';

const DEPT_COLORS = {
  Engineering: { bg: '#eef3fb', text: '#0c447c', dot: '#2563a8' },
  Marketing:   { bg: '#fdf1ec', text: '#712b13', dot: '#c84b31' },
  Sales:       { bg: '#eaf4ef', text: '#085041', dot: '#2d6a4f' },
  HR:          { bg: '#f3effe', text: '#3c3489', dot: '#7c3aed' },
  Finance:     { bg: '#fdf8e8', text: '#633806', dot: '#d4a017' },
};

const pillBase = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '3px 10px', borderRadius: 100,
  fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
  lineHeight: 1, whiteSpace: 'nowrap',
};

export function NameRenderer({ data }) {
  const initials = `${data.firstName[0]}${data.lastName[0]}`;
  const dept = DEPT_COLORS[data.department] || { bg: '#f0f0f0', text: '#444', dot: '#888' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: dept.bg, color: dept.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 400,
        flexShrink: 0, border: `1.5px solid ${dept.dot}30`,
      }}>
        {initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.25, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
          {data.firstName} {data.lastName}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink3)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.email}
        </div>
      </div>
    </div>
  );
}

export function DepartmentRenderer({ value }) {
  const s = DEPT_COLORS[value] || { bg: '#f0f0f0', text: '#444', dot: '#888' };
  return (
    <span style={{ ...pillBase, background: s.bg, color: s.text, border: `1px solid ${s.dot}25` }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0, display: 'inline-block' }} />
      {value}
    </span>
  );
}

export function RatingRenderer({ value }) {
  const filled = Math.round(value);
  const color = value >= 4.5 ? '#2d6a4f' : value >= 4.0 ? '#2563a8' : value >= 3.5 ? '#d4a017' : '#c84b31';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color, minWidth: 28 }}>
        {value.toFixed(1)}
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} width="10" height="10" viewBox="0 0 10 10">
            <polygon
              points="5,1 6.18,3.59 9,3.90 6.91,5.88 7.51,8.69 5,7.25 2.49,8.69 3.09,5.88 1,3.90 3.82,3.59"
              fill={i <= filled ? color : '#ddd8cf'}
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

export function SalaryRenderer({ value }) {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const color = value >= 130000 ? 'var(--green)' : value >= 90000 ? 'var(--blue)' : 'var(--ink2)';
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color }}>
      {formatted}
    </span>
  );
}

export function StatusRenderer({ value }) {
  const cfg = value
    ? { bg: '#eaf4ef', text: '#085041', dot: '#2d6a4f', label: 'Active' }
    : { bg: '#fef2f2', text: '#791f1f', dot: '#dc2626', label: 'Inactive' };
  return (
    <span style={{ ...pillBase, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.dot}25` }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}

export function SkillsRenderer({ value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap', overflow: 'hidden' }}>
      {value.slice(0, 2).map(skill => (
        <span key={skill} style={{
          background: 'var(--bg)', border: '1px solid var(--border2)',
          color: 'var(--ink2)', padding: '2px 7px', borderRadius: 4,
          fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap', lineHeight: 1.4,
        }}>
          {skill}
        </span>
      ))}
      {value.length > 2 && (
        <span style={{ fontSize: 10, color: 'var(--ink3)', flexShrink: 0 }}>
          +{value.length - 2}
        </span>
      )}
    </div>
  );
}

export function ProjectsRenderer({ value }) {
  const max = 25;
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= 15 ? 'var(--green)' : value >= 10 ? 'var(--blue)' : value >= 6 ? 'var(--yellow)' : 'var(--ink3)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, color, minWidth: 22, textAlign: 'right' }}>
        {value}
      </span>
      <div style={{ flex: 1, height: 4, background: 'var(--bg2)', borderRadius: 100 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 100 }} />
      </div>
    </div>
  );
}

export function DateRenderer({ value }) {
  const d = new Date(value);
  const now = new Date();
  const years = Math.floor((now - d) / (365.25 * 24 * 3600 * 1000));
  const tenure = years < 1 ? '< 1 yr' : `${years} yr${years !== 1 ? 's' : ''}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.3 }}>
      <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 400 }}>
        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
      <span style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>
        {tenure}
      </span>
    </div>
  );
}
