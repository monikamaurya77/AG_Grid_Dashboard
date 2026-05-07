import React, { useState, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import employees from './data/employees';
import StatCard from './components/StatCard';
import DeptBreakdown from './components/DeptBreakdown';
import {
  NameRenderer, DepartmentRenderer, RatingRenderer,
  SalaryRenderer, StatusRenderer, SkillsRenderer,
  ProjectsRenderer, DateRenderer,
} from './components/CellRenderers';

/* ── helpers ── */
const avg = (arr) => arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
const fmt$ = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const DEPT_OPTIONS = ['All Departments', ...Array.from(new Set(employees.map(e => e.department))).sort()];
const STATUS_OPTIONS = ['All Status', 'Active', 'Inactive'];

export default function App() {
  const gridRef = useRef();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [rowCount, setRowCount] = useState(employees.length);

  /* ── filtered data ── */
  const rowData = useMemo(() => {
    return employees.filter(e => {
      const matchDept = deptFilter === 'All Departments' || e.department === deptFilter;
      const matchStatus =
        statusFilter === 'All Status' ||
        (statusFilter === 'Active' && e.isActive) ||
        (statusFilter === 'Inactive' && !e.isActive);
      return matchDept && matchStatus;
    });
  }, [deptFilter, statusFilter]);

  /* ── KPI stats (from current filter, not global search) ── */
  const stats = useMemo(() => ({
    total:   rowData.length,
    active:  rowData.filter(e => e.isActive).length,
    avgSal:  avg(rowData.map(e => e.salary)),
    avgRat:  avg(rowData.map(e => e.performanceRating)),
    topEarner: rowData.reduce((best, e) => e.salary > (best?.salary || 0) ? e : best, null),
  }), [rowData]);

  /* ── AG Grid column defs ── */
  const columnDefs = useMemo(() => [
    {
      headerName: 'Employee',
      field: 'firstName',
      cellRenderer: NameRenderer,
      minWidth: 220,
      flex: 2,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains'],
        buttons: ['reset'],
      },
      valueGetter: p => `${p.data.firstName} ${p.data.lastName}`,
      pinned: 'left',
    },
    {
      headerName: 'Department',
      field: 'department',
      cellRenderer: DepartmentRenderer,
      minWidth: 140,
      flex: 1,
      sortable: true,
      filter: 'agSetColumnFilter',
    },
    {
      headerName: 'Position',
      field: 'position',
      minWidth: 180,
      flex: 1.5,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: { fontSize: 12, color: 'var(--ink2)' },
    },
    {
      headerName: 'Salary',
      field: 'salary',
      cellRenderer: SalaryRenderer,
      minWidth: 130,
      flex: 1,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
    },
    {
      headerName: 'Rating',
      field: 'performanceRating',
      cellRenderer: RatingRenderer,
      minWidth: 150,
      flex: 1.2,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
    },
    {
      headerName: 'Projects',
      field: 'projectsCompleted',
      cellRenderer: ProjectsRenderer,
      minWidth: 140,
      flex: 1.1,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
    },
    {
      headerName: 'Skills',
      field: 'skills',
      cellRenderer: SkillsRenderer,
      minWidth: 220,
      flex: 1.5,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Location',
      field: 'location',
      minWidth: 120,
      flex: 1,
      sortable: true,
      filter: 'agSetColumnFilter',
      cellStyle: { fontSize: 12, color: 'var(--ink2)' },
    },
    {
      headerName: 'Hired',
      field: 'hireDate',
      cellRenderer: DateRenderer,
      minWidth: 140,
      flex: 1.1,
      sortable: true,
      filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Status',
      field: 'isActive',
      cellRenderer: StatusRenderer,
      minWidth: 110,
      flex: 0.9,
      sortable: true,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [true, false],
        valueFormatter: p => p.value ? 'Active' : 'Inactive',
      },
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressMenu: false,
    floatingFilter: false,
    headerClass: 'ag-header-custom',
  }), []);

  /* ── quick search applies to visible grid via AG Grid API ── */
  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearch(val);
    gridRef.current?.api?.setGridOption('quickFilterText', val);
  }, []);

  const onFilterChanged = useCallback(() => {
    const count = gridRef.current?.api?.getDisplayedRowCount?.() ?? rowData.length;
    setRowCount(count);
  }, [rowData.length]);

  const onGridReady = useCallback(() => {
    setRowCount(rowData.length);
    if (search) gridRef.current?.api?.setGridOption('quickFilterText', search);
  }, [rowData.length, search]);

  const exportCSV = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: 'employees.csv' });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '0 0 40px' }}>

      {/* ── HEADER ── */}
      <header style={{
        padding: '28px 40px 0',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <div className="fade-in">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 6 }}>
              FactWise
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 38, fontWeight: 400,
              lineHeight: 1.1, color: 'var(--ink)',
              letterSpacing: '-0.5px',
            }}>
              People Dashboard
            </h1>
          </div>
          <div className="fade-in" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
              {rowCount} of {employees.length} employees
            </span>
            <button
              onClick={exportCSV}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: 'var(--ink)', color: 'white',
                border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
                letterSpacing: '0.2px', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.target.style.opacity = 0.8}
              onMouseLeave={e => e.target.style.opacity = 1}
            >
              ↓ Export CSV
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: '0 40px' }}>

        {/* ── KPI CARDS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(217px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}>
          <StatCard icon="👥" label="Total Employees" value={stats.total} sub={`${stats.active} active`} delay={0} />
          <StatCard icon="⭐" label="Avg Performance" value={stats.avgRat.toFixed(2)} sub="out of 5.0" delay={0.05} />
          <StatCard icon="💰" label="Avg Salary" value={fmt$(stats.avgSal)} sub="per year" delay={0.10} />
          <StatCard
            icon="🏆"
            label="Top Earner"
            value={stats.topEarner ? `${stats.topEarner.firstName} ${stats.topEarner.lastName}` : '—'}
            sub={stats.topEarner ? fmt$(stats.topEarner.salary) : ''}
            delay={0.15}
          />
          <DeptBreakdown employees={rowData} />
        </div>

        {/* ── FILTER BAR ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
          className="fade-in-3"
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
            <svg
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={onSearchChange}
              placeholder="Search employees…"
              style={{
                width: '100%', paddingLeft: 34, paddingRight: 14,
                height: 38, border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', fontSize: 13,
                background: 'var(--surface)', color: 'var(--ink)',
                fontFamily: 'var(--font-body)', outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,75,49,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Department filter */}
          <select
            value={deptFilter}
            onChange={e => { setDeptFilter(e.target.value); setRowCount(rowData.length); }}
            style={{
              height: 38, padding: '0 12px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', fontSize: 13, background: 'var(--surface)',
              color: deptFilter === 'All Departments' ? 'var(--ink3)' : 'var(--ink)',
              fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none',
              minWidth: 170,
            }}
          >
            {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              height: 38, padding: '0 12px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', fontSize: 13, background: 'var(--surface)',
              color: statusFilter === 'All Status' ? 'var(--ink3)' : 'var(--ink)',
              fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none',
              minWidth: 130,
            }}
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Reset */}
          {(deptFilter !== 'All Departments' || statusFilter !== 'All Status' || search) && (
            <button
              onClick={() => { setDeptFilter('All Departments'); setStatusFilter('All Status'); setSearch(''); gridRef.current?.api?.setGridOption('quickFilterText', ''); }}
              style={{
                height: 38, padding: '0 14px', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', fontSize: 12, background: 'transparent',
                color: 'var(--accent)', fontFamily: 'var(--font-body)', cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── AG GRID ── */}
        <div
          className="ag-theme-custom fade-in-4"
          style={{ height: 560, width: '100%' }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
            onFilterChanged={onFilterChanged}
            onGridReady={onGridReady}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            enableCellTextSelection={true}
            suppressCellFocus={false}
            getRowId={params => String(params.data.id)}
          />
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)',
          fontSize: 11, color: 'var(--ink3)', fontFamily: 'var(--font-mono)',
        }}>
          <span>FactWise People Dashboard · AG Grid Community · React 18</span>
          <span>Client-side rendering · {employees.length} records</span>
        </div>
      </div>
    </div>
  );
}
