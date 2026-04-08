import { useState } from 'react';
import {
  Search, Download, Upload, Save,
  SlidersHorizontal, X, RotateCcw,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

/* ── Types ───────────────────────────────────────────────── */
interface DsRow {
  id:           string;
  구분:         string;
  제품명:       string;
  batchNo:      string;
  출진시작일:   string;
  poNo:         string;
  dsLot:        string;
  dsCtDate:     string;   // DS 운송 예정일 (CT)
  dsCtphDate:   string;   // DS 입고 가능 날짜 (CTPH)
  여부:         'OK' | 'NG' | '';  // 입고 가능 여부
  fullFact:     string;
  memo:         string;
}

/* ── Mock Data ───────────────────────────────────────────── */
const DATA: DsRow[] = [
  { id: 'd01', 구분: '상업', 제품명: 'CT-P47 160mg 5tap',  batchNo: 'STIP10', 출진시작일: '2025-11-10', poNo: '4000069520', dsLot: '',                          dsCtDate: '2025-10-30', dsCtphDate: '2026-10-31', 여부: 'OK', fullFact: 'TBD', memo: '' },
  { id: 'd02', 구분: '상업', 제품명: 'CT-P47 162mg X4ap',  batchNo: 'STIP11', 출진시작일: '2025-11-12', poNo: '4000067362', dsLot: '25300T009, 25300T010',       dsCtDate: '2025-10-30', dsCtphDate: '2025-10-30', 여부: 'NG', fullFact: 'TBD', memo: '' },
  { id: 'd03', 구분: '상업', 제품명: 'CT-F41 60mg',         batchNo: 'SFIP16', 출진시작일: '2025-11-19', poNo: '4000069560', dsLot: '25300P008, 25300P003',       dsCtDate: '2025-10-16', dsCtphDate: '',           여부: '',   fullFact: 'TBD', memo: '' },
  { id: 'd04', 구분: '상업', 제품명: 'CT-F41 80mg',         batchNo: 'SFIP20', 출진시작일: '2025-11-19', poNo: '4000069861', dsLot: '22200P006, 22200P003',       dsCtDate: '2025-11-03', dsCtphDate: '',           여부: '',   fullFact: 'TBD', memo: '' },
  { id: 'd05', 구분: '상업', 제품명: 'CT-F41 80mg',         batchNo: 'SFIP21', 출진시작일: '2025-11-20', poNo: '4000069862', dsLot: '22200P006, 22200P003',       dsCtDate: '2025-11-03', dsCtphDate: '',           여부: '',   fullFact: 'TBD', memo: '' },
  { id: 'd06', 구분: '상업', 제품명: 'CT-F41 80mg',         batchNo: 'SFIP21', 출진시작일: '2025-11-21', poNo: '4000069863', dsLot: '22200P002',                  dsCtDate: '2025-11-03', dsCtphDate: '',           여부: '',   fullFact: 'TBD', memo: '' },
  { id: 'd07', 구분: '상업', 제품명: 'CT-F47 160mg X4ap',  batchNo: 'SFIP14', 출진시작일: '2025-11-23', poNo: '4000069R10', dsLot: '25300T011, 25300T012',       dsCtDate: '2025-11-13', dsCtphDate: '',           여부: '',   fullFact: 'TBD', memo: '' },
  { id: 'd08', 구분: '상업', 제품명: 'CT-F43 90mg',         batchNo: '#4',     출진시작일: '2025-11-24', poNo: '4000071086', dsLot: '25200N001',                  dsCtDate: '2025-11-14', dsCtphDate: '',           여부: '',   fullFact: 'TBD', memo: '' },
  { id: 'd09', 구분: '상업', 제품명: 'CT-F43 90mg',         batchNo: '#25',    출진시작일: '2025-11-25', poNo: '4000071487', dsLot: '25200N001',                  dsCtDate: '2025-11-14', dsCtphDate: '',           여부: '',   fullFact: 'TBD', memo: '' },
];

const PRODUCTS  = [...new Set(DATA.map(d => d.제품명))];
const DIVISIONS = ['상업', '임상'];
const YEOBOO    = ['OK', 'NG'];

/* ── Helpers ─────────────────────────────────────────────── */
function FilterLabel({ label }: { label: string }) {
  return <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</span>;
}

function selectStyle(active: boolean, isDark: boolean): React.CSSProperties {
  return {
    padding: '6px 28px 6px 10px', fontSize: 12.5,
    border: `1px solid ${active ? '#00B050' : 'var(--border-primary)'}`,
    borderRadius: 8,
    background: active ? (isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3') : 'var(--input-bg)',
    color: active ? '#00B050' : 'var(--text-primary)',
    outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
    colorScheme: isDark ? 'dark' : 'light',
    fontWeight: active ? 600 : 400,
  } as React.CSSProperties;
}

/* ── Editable cell for Memo & CtphDate ─────────────────── */
function EditableCell({
  value, onChange, placeholder, align = 'center',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; align?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [local,   setLocal]   = useState(value);

  if (editing) {
    return (
      <input
        autoFocus
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={() => { onChange(local); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') { onChange(local); setEditing(false); } if (e.key === 'Escape') { setLocal(value); setEditing(false); } }}
        style={{
          width: '100%', background: 'var(--input-bg)',
          border: '1px solid rgba(0,176,80,0.5)', borderRadius: 5,
          padding: '3px 6px', fontSize: 12, color: 'var(--text-primary)',
          outline: 'none', fontFamily: 'inherit', textAlign: align as any,
          boxSizing: 'border-box',
        }}
      />
    );
  }
  return (
    <div
      onClick={() => setEditing(true)}
      title="클릭하여 편집"
      style={{
        cursor: 'text', minHeight: 20, color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
        fontSize: 12, textAlign: align as any,
        padding: '1px 4px', borderRadius: 4,
        transition: 'background 120ms',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,176,80,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {value || <span style={{ opacity: 0.45 }}>{placeholder ?? '—'}</span>}
    </div>
  );
}

/* ── 여부 Cell ─────────────────────────────────────────── */
function YeobooCell({ value, onChange, isDark }: { value: 'OK' | 'NG' | ''; onChange: (v: 'OK' | 'NG' | '') => void; isDark: boolean }) {
  const cycle: ('OK' | 'NG' | '')[] = ['', 'OK', 'NG'];
  const next = () => onChange(cycle[(cycle.indexOf(value) + 1) % 3]);

  const bg =
    value === 'OK' ? '#00B050' :
    value === 'NG' ? '#ef4444' : 'transparent';
  const fg = value ? '#fff' : 'var(--text-tertiary)';

  return (
    <div onClick={next} title="클릭하여 전환 (OK / NG)" style={{
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 22, borderRadius: 5, margin: '0 auto',
      background: bg, border: `1px solid ${value === 'OK' ? '#00B050' : value === 'NG' ? '#ef4444' : 'var(--border-primary)'}`,
      fontSize: 11, fontWeight: 700, color: fg,
      transition: 'background 150ms, border-color 150ms',
      userSelect: 'none',
    }}>
      {value || '—'}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export function DsSchedulePage() {
  const { isDark } = useTheme();

  const [filterOpen, setFilterOpen] = useState(false);
  const [keyword,    setKeyword]    = useState('');
  const [fDiv,       setFDiv]       = useState('');
  const [fProduct,   setFProduct]   = useState('');
  const [fYeoboo,    setFYeoboo]    = useState('');

  // 인라인 편집을 위한 local state
  const [tableData, setTableData] = useState<DsRow[]>(DATA);

  function updateRow(id: string, patch: Partial<DsRow>) {
    setTableData(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  }

  const resetFilters = () => { setFDiv(''); setFProduct(''); setFYeoboo(''); };

  const badges: { label: string; onRemove: () => void }[] = [];
  if (fDiv)     badges.push({ label: `구분: ${fDiv}`,       onRemove: () => setFDiv('') });
  if (fProduct) badges.push({ label: `제품명: ${fProduct}`, onRemove: () => setFProduct('') });
  if (fYeoboo)  badges.push({ label: `여부: ${fYeoboo}`,   onRemove: () => setFYeoboo('') });

  const rows = tableData.filter(r => {
    if (fDiv     && r.구분 !== fDiv) return false;
    if (fProduct && r.제품명 !== fProduct) return false;
    if (fYeoboo  && r.여부 !== fYeoboo) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (![r.구분, r.제품명, r.batchNo, r.poNo, r.dsLot, r.dsCtDate].some(v => v.toLowerCase().includes(kw))) return false;
    }
    return true;
  });

  /* ── Table styles ──────────────────────────────────────── */
  const TH: React.CSSProperties = {
    padding: '8px 8px', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.02em', color: 'var(--text-tertiary)',
    borderRight: '1px solid var(--border-secondary)',
    textAlign: 'center', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, zIndex: 3,
    background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f2f5',
    userSelect: 'none',
  };
  const TD: React.CSSProperties = {
    padding: '6px 8px', fontSize: 12,
    color: 'var(--text-secondary)',
    borderRight: '1px solid var(--border-secondary)',
    whiteSpace: 'nowrap', textAlign: 'center',
  };

  const COLS: { key: string; label: string; w: number; sub?: string }[] = [
    { key: '구분',       label: '구분',                    w: 52  },
    { key: '제품명',     label: '제품명',                  w: 148 },
    { key: 'batchNo',    label: 'Batch No.',               w: 72  },
    { key: '출진시작일', label: '출진 시작일',              w: 100 },
    { key: 'poNo',       label: 'PO No.',                  w: 108 },
    { key: 'dsLot',      label: 'DS Lot 번호',             w: 168 },
    { key: 'dsCtDate',   label: 'DS 운송 예정일',          w: 108, sub: '(CT)'   },
    { key: 'dsCtphDate', label: 'DS 입고 가능 날짜',       w: 120, sub: '(CTPH)' },
    { key: '여부',       label: '여부',                    w: 60  },
    { key: 'fullFact',   label: 'Full fact 여부',          w: 96  },
    { key: 'memo',       label: 'Memo',                    w: 160 },
  ];

  const EMPTY_ROWS = 14;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── 페이지 헤더 ────────────────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px', display: 'flex', alignItems: 'flex-end', flexShrink: 0,
      }}>
        <div style={{
          padding: '13px 18px 11px', fontSize: 13, fontWeight: 700,
          color: 'var(--brand-primary)', borderBottom: '2px solid var(--brand-primary)',
          whiteSpace: 'nowrap',
        }}>
          DS 일정 협의
        </div>
      </div>

      {/* ── 필터 툴바 ─────────────────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)',
        borderBottom: filterOpen ? 'none' : '1px solid var(--border-secondary)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        {/* 필터 버튼 */}
        <button onClick={() => setFilterOpen(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
          background: filterOpen ? 'var(--nav-active-bg)' : 'var(--surface-bg)',
          border: `1px solid ${filterOpen ? 'rgba(0,176,80,0.35)' : 'var(--border-primary)'}`,
          borderRadius: 10, fontSize: 12.5, fontWeight: 600,
          color: filterOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', flexShrink: 0,
          position: 'relative',
        }}>
          <SlidersHorizontal size={14} /> 필터
          {badges.length > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              width: 16, height: 16, borderRadius: '50%',
              background: '#00B050', color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{badges.length}</span>
          )}
        </button>

        {/* 활성 배지 */}
        {badges.map(b => (
          <div key={b.label} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px 4px 10px',
            background: isDark ? 'rgba(0,176,80,0.15)' : '#edfaf3',
            border: '1px solid rgba(0,176,80,0.35)', borderRadius: 20, flexShrink: 0,
          }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#00B050', whiteSpace: 'nowrap' }}>{b.label}</span>
            <button onClick={b.onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#00B050', opacity: 0.7 }}>
              <X size={11} />
            </button>
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {/* 검색창 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px',
          border: '1px solid var(--border-primary)', borderRadius: 10, background: 'var(--input-bg)',
        }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text" placeholder="제품명 / Batch No. / PO No. 검색..."
            value={keyword} onChange={e => setKeyword(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12.5, color: 'var(--text-primary)', width: 230, fontFamily: 'inherit' }}
          />
          {keyword && (
            <button onClick={() => setKeyword('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── 필터 패널 ─────────────────────────────────── */}
      <div style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : '#f7f8fa',
        borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none',
        overflow: 'hidden', maxHeight: filterOpen ? '120px' : '0px', opacity: filterOpen ? 1 : 0,
        transition: 'max-height 260ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease', flexShrink: 0,
      }}>
        <div style={{ padding: '14px 24px 16px', display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="구분" />
            <select value={fDiv} onChange={e => setFDiv(e.target.value)} style={{ ...selectStyle(!!fDiv, isDark), minWidth: 80 }}>
              <option value="">전체</option>
              {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="제품명" />
            <select value={fProduct} onChange={e => setFProduct(e.target.value)} style={{ ...selectStyle(!!fProduct, isDark), minWidth: 160 }}>
              <option value="">전체</option>
              {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="여부" />
            <select value={fYeoboo} onChange={e => setFYeoboo(e.target.value)} style={{ ...selectStyle(!!fYeoboo, isDark), minWidth: 80 }}>
              <option value="">전체</option>
              {YEOBOO.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button onClick={resetFilters} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
              background: 'none', border: '1px solid var(--border-primary)', borderRadius: 7,
              fontSize: 12, color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <RotateCcw size={11} /> 초기화
            </button>
          </div>
        </div>
      </div>

      {/* ── 데이터 그리드 ─────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '16px 24px 0' }}>
        <div style={{
          flex: 1, minHeight: 0, overflow: 'hidden',
          background: 'var(--surface-bg)',
          borderRadius: '14px 14px 0 0',
          border: '1px solid var(--border-primary)', borderBottom: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ height: '100%', overflowX: 'auto', overflowY: 'auto' }}>
            <table style={{
              borderCollapse: 'collapse', tableLayout: 'fixed',
              minWidth: COLS.reduce((a, c) => a + c.w, 0), width: '100%',
            }}>
              <colgroup>
                {COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
                  {COLS.map(c => (
                    <th key={c.key} style={TH}>
                      <div>{c.label}</div>
                      {c.sub && <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, marginTop: 1 }}>{c.sub}</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 데이터 행 */}
                {rows.map((row, ri) => {
                  const rowBg = ri % 2 === 1
                    ? (isDark ? 'rgba(255,255,255,0.015)' : '#fafbfc')
                    : 'transparent';

                  return (
                    <tr key={row.id}
                      style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'filter 80ms' }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.97)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                      {/* 구분 */}
                      <td style={{ ...TD, background: rowBg }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 6px', borderRadius: 4,
                          fontSize: 11, fontWeight: 700,
                          background: isDark ? 'rgba(96,165,250,0.15)' : '#eff6ff',
                          color: '#3b82f6',
                        }}>
                          {row.구분}
                        </span>
                      </td>

                      {/* 제품명 */}
                      <td style={{ ...TD, background: rowBg, textAlign: 'left', color: 'var(--text-primary)', fontWeight: 500 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {row.제품명}
                        </span>
                      </td>

                      {/* Batch No. */}
                      <td style={{ ...TD, background: rowBg, color: 'var(--text-primary)', fontWeight: 500 }}>{row.batchNo}</td>

                      {/* 출진 시작일 */}
                      <td style={{ ...TD, background: rowBg }}>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{row.출진시작일}</span>
                      </td>

                      {/* PO No. */}
                      <td style={{ ...TD, background: rowBg, color: 'var(--text-primary)' }}>{row.poNo}</td>

                      {/* DS Lot 번호 */}
                      <td style={{ ...TD, background: rowBg, textAlign: 'left' }}>
                        <EditableCell
                          value={row.dsLot}
                          onChange={v => updateRow(row.id, { dsLot: v })}
                          placeholder="DS Lot 입력"
                          align="left"
                        />
                      </td>

                      {/* DS 운송 예정일 (CT) */}
                      <td style={{ ...TD, background: rowBg }}>
                        <EditableCell
                          value={row.dsCtDate}
                          onChange={v => updateRow(row.id, { dsCtDate: v })}
                          placeholder="날짜 입력"
                        />
                      </td>

                      {/* DS 입고 가능 날짜 (CTPH) */}
                      <td style={{ ...TD, background: rowBg }}>
                        <EditableCell
                          value={row.dsCtphDate}
                          onChange={v => updateRow(row.id, { dsCtphDate: v })}
                          placeholder="날짜 입력"
                        />
                      </td>

                      {/* 여부 — 클릭으로 OK / NG / 빈값 순환 */}
                      <td style={{ ...TD, background: rowBg, padding: '4px 6px' }}>
                        <YeobooCell
                          value={row.여부}
                          onChange={v => updateRow(row.id, { 여부: v })}
                          isDark={isDark}
                        />
                      </td>

                      {/* Full fact 여부 */}
                      <td style={{ ...TD, background: rowBg }}>
                        <EditableCell
                          value={row.fullFact}
                          onChange={v => updateRow(row.id, { fullFact: v })}
                          placeholder="TBD"
                        />
                      </td>

                      {/* Memo */}
                      <td style={{ ...TD, background: rowBg, textAlign: 'left' }}>
                        <EditableCell
                          value={row.memo}
                          onChange={v => updateRow(row.id, { memo: v })}
                          placeholder="메모 입력..."
                          align="left"
                        />
                      </td>
                    </tr>
                  );
                })}

                {/* 빈 행 */}
                {Array.from({ length: Math.max(0, EMPTY_ROWS - rows.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ borderBottom: '1px solid var(--border-secondary)', height: 34 }}>
                    {COLS.map(c => (
                      <td key={c.key} style={{ ...TD, color: 'transparent' }}>—</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 하단 액션바 ─────────────────────────────────── */}
      <div style={{
        margin: '0 24px 20px', padding: '10px 18px',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderTop: '1px solid var(--border-secondary)',
        borderRadius: '0 0 14px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 8, flexShrink: 0,
      }}>
        {[
          { label: 'Download', icon: <Download size={13} /> },
          { label: 'Upload',   icon: <Upload   size={13} /> },
        ].map(btn => (
          <button key={btn.label} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'var(--surface-bg)', border: '1px solid var(--border-primary)',
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >{btn.icon}{btn.label}</button>
        ))}
        <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: '#00B050', border: 'none', borderRadius: 10,
          fontSize: 13, fontWeight: 600, color: '#fff',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Save size={13} /> Save
        </button>
      </div>
    </div>
  );
}
