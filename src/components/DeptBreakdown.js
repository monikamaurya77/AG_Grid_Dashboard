import React from 'react';

const DEPT_COLORS = {
  Engineering: 'var(--dept-eng)',
  Marketing:   'var(--dept-mkt)',
  Sales:       'var(--dept-sales)',
  HR:          'var(--dept-hr)',
  Finance:     'var(--dept-fin)',
};

export default function DeptBreakdown({ employees }) {
  const depts = {};
  employees.forEach(e => {
    depts[e.department] = (depts[e.department] || 0) + 1;
  });
  const sorted = Object.entries(depts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow)',
      }}
      className="fade-in-2"
    >
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--ink3)', marginBottom: 16 }}>
        By Department
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(([dept, count]) => (
          <div key={dept}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>
              <span>{dept}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: DEPT_COLORS[dept] || 'var(--ink)' }}>{count}</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 100, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(count / max) * 100}%`,
                  background: DEPT_COLORS[dept] || 'var(--ink)',
                  borderRadius: 100,
                  transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
