import { useState, useRef, useCallback } from 'react';
import {
  Search, Download, Upload, Save,
  SlidersHorizontal, ChevronDown, X, RotateCcw,
  ChevronLeft, ChevronRight as ChevronRightIcon,
  Paperclip, FileText, Trash2, CloudUpload, File,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { useNavigate, useLocation } from 'react-router';

/* ── 계획 정보 탭 목록 — 사이드바 sub-items와 동일 ────── */
const PLAN_TABS = [
  { label: '충전/AI FCST',        path: '/plan/ai-fcst' },
  { label: '조립/포장 FCST',      path: '/plan/assembly-fcst' },
  { label: '조립/포장 요약 FCST', path: '/plan/assembly-summary' },
  { label: 'L&P FCST',            path: '/plan/lp-fcst' },
  { label: 'L&P 요약 FCST',       path: '/plan/lp-summary' },
  { label: 'PO 관리',             path: '/plan/po' },
];

/* ── Month columns ───────────────────────────────────── */
const MONTHS = [
  '25년 11월','25년 12월',
  '26년 1월','26년 2월','26년 3월','26년 4월',
  '26년 5월','26년 6월','26년 7월','26년 8월',
  '26년 9월','26년 10월',
  '26년 11월','26년 12월',
];

/* ── Row type
   fullEnd  : 마지막 100% 바인딩 컬럼 index (inclusive), -1이면 없음
   semiEnd  : 마지막 Semi 바인딩 컬럼 index (inclusive), -1이면 없음
──────────────────────────────────────────────────────── */
interface Cell { v: number | null }
const n  = (val: number): Cell => ({ v: val });
const __ = (): Cell => ({ v: null });

type FcstRow = {
  process: string;
  product: string;
  batchSize: string;
  fullEnd: number;   // 100% binding ends here (inclusive)
  semiEnd: number;   // semi binding ends here (inclusive), > fullEnd
  cells: Cell[];
};

/* ── Mock data — 품목별로 바인딩 구간이 다름 ───────── */
const tableData: FcstRow[] = [
  {
    process: '충전', product: 'CT-P13 SC 25G', batchSize: '100K',
    fullEnd: 9, semiEnd: 11,
    cells: [n(500000),__(),n(100000),__(),n(300000),n(300000),n(200000),n(300000),n(300000),__(),n(300000),n(300000),__(),__()],
  },
  {
    process: '충전', product: 'CT-P13 SC 2PS', batchSize: '',
    fullEnd: 7, semiEnd: 9,
    cells: [__(),__(),n(100000),__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__()],
  },
  {
    process: '충전', product: 'CT-P17 25MG', batchSize: '37K',
    fullEnd: 5, semiEnd: 8,
    cells: [__(),__(),__(),__(),__(),__(),__(),__(),n(37000),__(),__(),__(),__(),__()],
  },
  {
    process: 'AI 요청', product: 'CT-P17 40MG', batchSize: '62K',
    fullEnd: 11, semiEnd: 13,
    cells: [n(656000),__(),n(492000),n(82000),n(410000),n(246000),__(),n(82000),n(246000),__(),n(410000),__(),n(410000),n(410000)],
  },
  {
    process: 'AI 요청', product: 'CT-P13 SC 25G', batchSize: '100K',
    fullEnd: 9, semiEnd: 11,
    cells: [n(200000),__(),n(100000),n(400000),n(100000),n(100000),n(20000),n(20000),__(),n(100000),n(400000),n(100000),__(),__()],
  },
  {
    process: 'AI', product: 'CT-P13 SC 2PS', batchSize: '100K',
    fullEnd: 6, semiEnd: 9,
    cells: [n(100000),__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__()],
  },
  {
    process: 'A 소한', product: 'CT-P17 40MG', batchSize: '82K',
    fullEnd: 11, semiEnd: 13,
    cells: [n(246000),__(),n(410000),n(1640000),__(),__(),__(),__(),n(1066000),n(984000),n(1066000),n(574000),__(),__()],
  },
  {
    process: 'A 소한', product: 'CT-P17 40MG', batchSize: '82K',
    fullEnd: 8, semiEnd: 11,
    cells: [__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__(),__()],
  },
  {
    process: 'AI 소한', product: 'CT-P38 100MG N', batchSize: '30K',
    fullEnd: 7, semiEnd: 10,
    cells: [__(),__(),__(),__(),__(),__(),__(),n(9500),n(36200),n(72700),__(),__(),n(80000),n(80000)],
  },
  {
    process: 'AI 소한', product: 'CT-P43 45MG N', batchSize: '20K',
    fullEnd: 9, semiEnd: 12,
    cells: [__(),__(),__(),__(),__(),__(),__(),__(),n(28000),__(),__(),__(),__(),__()],
  },
];

/* ── Binding cell background ─────────────────────────── */
const BG_FULL_L  = '#d6edd9';
const BG_SEMI_L  = '#fdf3c8';
const BG_FULL_D  = '#0d2e1a';
const BG_SEMI_D  = '#29270a';

function getCellBg(ci: number, row: FcstRow, isDark: boolean) {
  const full = isDark ? BG_FULL_D : BG_FULL_L;
  const semi = isDark ? BG_SEMI_D : BG_SEMI_L;
  if (ci <= row.fullEnd) return full;
  if (ci <= row.semiEnd) return semi;
  return 'transparent';
}

/* ── Tabs & Filters (UI 구성 — 목업 테이블 데이터는 변경 없음) ── */
const FCST_MONTH_OPTIONS = MONTHS.map(m => {
  const match = m.match(/^(\d+)년\s+(\d+)월$/);
  if (!match) return m;
  const yy = parseInt(match[1], 10);
  const mm = parseInt(match[2], 10);
  const yyyy = 2000 + yy;
  return `${yyyy}.${String(mm).padStart(2, '0')}`;
});
const DEFAULT_FCST_MONTH = FCST_MONTH_OPTIONS[0] ?? '2025.11';

const PROCESS_FILTER_OPTIONS = ['전체', '충전', '조립'];
const PRODUCT_FILTER_OPTIONS = ['전체', 'CT-P39 150mg', '유플라이마 40mg', 'CT-P39 300MG AI'];

const FILTER_LABELS: Record<string, string> = {
  fcstMonth: 'FCST 월',
  process: 'Process',
  product: 'Product',
};

function fmt(v: number) { return v.toLocaleString('ko-KR'); }

/* ── Select (라벨 상단 — 기존 필터 패널 가로 정렬) ──── */
function Select({ label, options, value, onChange, isDark, minWidth = 110 }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; isDark: boolean; minWidth?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth }}>
      <label style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)} style={{
          appearance: 'none', WebkitAppearance: 'none',
          padding: '7px 28px 7px 10px',
          border: '1px solid var(--border-primary)', borderRadius: 9,
          fontSize: 12.5, fontWeight: 500,
          color: 'var(--text-primary)', background: 'var(--input-bg)',
          outline: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
          colorScheme: isDark ? 'dark' : 'light',
        } as React.CSSProperties}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

/* ── Action Button ───────────────────────────────────── */
function ActionBtn({ label, icon, primary, onClick }: {
  label: string; icon?: React.ReactNode; primary?: boolean; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
      background: primary ? 'var(--brand-primary)' : 'var(--surface-bg)',
      border: primary ? 'none' : '1px solid var(--border-primary)',
      borderRadius: 10, fontSize: 13, fontWeight: 600,
      color: primary ? '#fff' : 'var(--text-primary)',
      cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'opacity 150ms',
    }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {icon}{label}
    </button>
  );
}

/* ── Page ────────────────────────────────────────────── */
export function ChargingAiFcstPage() {
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({ fcstMonth: DEFAULT_FCST_MONTH });
  const [activeTags,   setActiveTags]   = useState<string[]>([]);
  const [inputBatch,   setInputBatch]   = useState(false);
  const [inputQty,     setInputQty]     = useState(true);
  const [keyword,      setKeyword]      = useState('');
  const [page,         setPage]         = useState(1);
  const [attachOpen,   setAttachOpen]   = useState(false);
  const { isDark } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const ROWS_PER_PAGE = 10;

  const filtered = tableData.filter(row => {
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (!row.process.toLowerCase().includes(kw) && !row.product.toLowerCase().includes(kw)) return false;
    }
    const p = filterValues.process ?? '전체';
    const pr = filterValues.product ?? '전체';
    if (p !== '전체' && row.process !== p) return false;
    if (pr !== '전체' && row.product !== pr) return false;
    return true;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const visibleRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const activeCount = activeTags.length;

  const handleFilterChange = (key: string, val: string) => {
    setFilterValues(prev => ({ ...prev, [key]: val }));
    setActiveTags(prev => {
      if (key === 'fcstMonth') {
        if (val !== DEFAULT_FCST_MONTH) return prev.includes('fcstMonth') ? prev : [...prev, 'fcstMonth'];
        return prev.filter(t => t !== 'fcstMonth');
      }
      if (val !== '전체') return prev.includes(key) ? prev : [...prev, key];
      return prev.filter(t => t !== key);
    });
  };
  const removeTag = (key: string) => {
    if (key === 'fcstMonth') {
      setFilterValues(prev => ({ ...prev, fcstMonth: DEFAULT_FCST_MONTH }));
    } else {
      setFilterValues(prev => ({ ...prev, [key]: '전체' }));
    }
    setActiveTags(prev => prev.filter(t => t !== key));
  };
  const resetAll = () => {
    setFilterValues({ fcstMonth: DEFAULT_FCST_MONTH });
    setActiveTags([]);
    setInputBatch(false);
    setInputQty(true);
    setKeyword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0,
      }}>
        {PLAN_TABS.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} style={{
              padding: '13px 18px 11px', fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
              background: 'transparent', border: 'none',
              borderBottom: `2px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'color 150ms, border-color 150ms', fontFamily: 'inherit',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Slim toolbar ────────────────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)',
        borderBottom: filterOpen ? 'none' : '1px solid var(--border-secondary)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <button onClick={() => setFilterOpen(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
          background: filterOpen ? 'var(--nav-active-bg)' : 'var(--surface-bg)',
          border: `1px solid ${filterOpen ? 'rgba(0,176,80,0.35)' : 'var(--border-primary)'}`,
          borderRadius: 10, fontSize: 12.5, fontWeight: 600,
          color: filterOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', position: 'relative',
        }}>
          <SlidersHorizontal size={14} />필터
          {activeCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%',
              background: 'var(--brand-primary)', color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{activeCount}</span>
          )}
        </button>

        {activeTags.map(key => {
          const lbl = FILTER_LABELS[key];
          return (
            <span key={key} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px 4px 10px',
              background: 'var(--nav-active-bg)', border: '1px solid rgba(0,176,80,0.25)',
              borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: 'var(--brand-primary)',
            }}>
              {lbl}: {filterValues[key]}
              <button onClick={() => removeTag(key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', padding: 0 }}>
                <X size={10} />
              </button>
            </span>
          );
        })}
        {activeTags.length > 0 && (
          <button onClick={resetAll} style={{ fontSize: 11.5, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RotateCcw size={11} /> 초기화
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: BG_FULL_L, border: '1px solid #9ecda8', flexShrink: 0 }} />
            100% 바인딩
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: BG_SEMI_L, border: '1px solid #d6c46a', flexShrink: 0 }} />
            Semi 바인딩
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', border: '1px solid var(--border-primary)', borderRadius: 10, background: 'var(--input-bg)' }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input type="text" placeholder="키워드 검색..." value={keyword} onChange={e => setKeyword(e.target.value)} style={{
            background: 'transparent', border: 'none', outline: 'none',
            fontSize: 12.5, color: 'var(--text-primary)', width: 160, fontFamily: 'inherit',
          }} />
          {keyword && (
            <button onClick={() => setKeyword('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible filter panel ─────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)', overflow: 'hidden',
        maxHeight: filterOpen ? '160px' : '0px', opacity: filterOpen ? 1 : 0,
        transition: 'max-height 250ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
        borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none',
        flexShrink: 0,
      }}>
        <div style={{ padding: '14px 24px 16px', display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
          <Select
            label="FCST 월"
            options={FCST_MONTH_OPTIONS}
            value={filterValues.fcstMonth ?? DEFAULT_FCST_MONTH}
            onChange={v => handleFilterChange('fcstMonth', v)}
            isDark={isDark}
            minWidth={128}
          />
          <Select
            label="Process"
            options={PROCESS_FILTER_OPTIONS}
            value={filterValues.process ?? '전체'}
            onChange={v => handleFilterChange('process', v)}
            isDark={isDark}
            minWidth={118}
          />
          <Select
            label="Product"
            options={PRODUCT_FILTER_OPTIONS}
            value={filterValues.product ?? '전체'}
            onChange={v => handleFilterChange('product', v)}
            isDark={isDark}
            minWidth={168}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              입력 구분
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 33 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  className="themed-checkbox"
                  checked={inputBatch}
                  onChange={e => setInputBatch(e.target.checked)}
                  style={{ width: 15, height: 15, cursor: 'pointer' }}
                />
                배치
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  className="themed-checkbox"
                  checked={inputQty}
                  onChange={e => setInputQty(e.target.checked)}
                  style={{ width: 15, height: 15, cursor: 'pointer' }}
                />
                수량
              </label>
            </div>
          </div>
          <button onClick={resetAll} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', marginBottom: 1,
            background: 'transparent', border: '1px solid var(--border-primary)',
            borderRadius: 9, fontSize: 12, fontWeight: 500,
            color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 120ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            <RotateCcw size={12} /> 초기화
          </button>
        </div>
      </div>

      {/* ── Data grid ───────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '16px 24px 0' }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
          background: 'var(--surface-bg)', borderRadius: '14px 14px 0 0',
          border: '1px solid var(--border-primary)', borderBottom: 'none',
          overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
              minWidth: 90 + 160 + 90 + MONTHS.length * 100,
            }}>
              <colgroup>
                <col style={{ width: 90 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 90 }} />
                {MONTHS.map((_, i) => <col key={i} style={{ width: 100 }} />)}
              </colgroup>

              {/* ── Header — 색 없음, 텍스트만 ── */}
              <thead>
                <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                  {['Process', 'Product', 'Batch Size'].map((lbl, i) => (
                    <th key={lbl} style={{
                      padding: '10px 12px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      color: i < 2 ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                      whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)',
                      userSelect: 'none',
                    }}>{lbl}</th>
                  ))}
                  {MONTHS.map((m, i) => (
                    <th key={m} style={{
                      padding: '10px 12px', textAlign: 'right',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: 'var(--text-tertiary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      borderRight: '1px solid var(--border-secondary)',
                      userSelect: 'none',
                    }}>{m}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row, ri) => (
                  <tr key={ri}
                    style={{ borderBottom: '1px solid var(--border-secondary)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.96)')}
                    onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                  >
                    {/* Process */}
                    <td style={{
                      padding: '10px 12px', fontSize: 12.5, fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      borderRight: '1px solid var(--border-secondary)',
                    }}>{row.process}</td>

                    {/* Product */}
                    <td style={{
                      padding: '10px 12px', fontSize: 12.5, fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      borderRight: '1px solid var(--border-secondary)',
                    }}>{row.product}</td>

                    {/* Batch Size */}
                    <td style={{
                      padding: '10px 12px', fontSize: 12.5, fontWeight: 400,
                      color: 'var(--text-tertiary)', textAlign: 'center',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      borderRight: '1px solid var(--border-secondary)',
                    }}>{row.batchSize || '—'}</td>

                    {/* Month cells — 각 행의 fullEnd/semiEnd 기준으로만 색 칠함 */}
                    {row.cells.map((cell, ci) => {
                      const bg = getCellBg(ci, row, isDark);
                      // 100% → semi 경계에 구분선
                      const isFullSemiBorder = ci === row.fullEnd && row.semiEnd > row.fullEnd;
                      return (
                        <td key={ci} style={{
                          padding: '10px 12px', fontSize: 12.5,
                          background: bg,
                          color: cell.v !== null ? 'var(--text-primary)' : 'transparent',
                          fontWeight: cell.v !== null ? 600 : 400,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          borderRight: isFullSemiBorder
                            ? '2px solid #9ecda8'
                            : '1px solid var(--border-secondary)',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {cell.v !== null ? fmt(cell.v) : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────── */}
      <div style={{
        margin: '0 24px', padding: '10px 18px',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderTop: '1px solid var(--border-secondary)',
        borderRadius: '0 0 14px 14px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>
            총 <b style={{ color: 'var(--text-primary)' }}>{filtered.length}</b>건
          </span>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page === 1)}>
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 28, height: 28, borderRadius: 8, border: 'none', fontSize: 12, cursor: 'pointer',
              background: page === p ? 'var(--brand-primary)' : 'transparent',
              color: page === p ? '#fff' : 'var(--text-tertiary)',
              fontWeight: page === p ? 700 : 400, fontFamily: 'inherit', transition: 'background 120ms',
            } as React.CSSProperties}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}>
            <ChevronRightIcon size={13} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 2 }}>
            {page} / {totalPages} 페이지
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ActionBtn label="Download" icon={<Download size={13} />} />
          <ActionBtn label="Upload"   icon={<Upload size={13} />} />
          <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
          <ActionBtn label="첨부 파일" icon={<Paperclip size={13} />} onClick={() => setAttachOpen(true)} />
          <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
          <ActionBtn label="Save"     icon={<Save size={13} />}   primary />
        </div>
      </div>

      {/* ── Attachment Modal ─────────────────────────────── */}
      {attachOpen && (
        <AttachmentModal onClose={() => setAttachOpen(false)} isDark={isDark} />
      )}
    </div>
  );
}

function pageBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, border: 'none', background: 'transparent',
    color: disabled ? 'var(--border-primary)' : 'var(--text-tertiary)',
    cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
  };
}

/* ── Attached file type ──────────────────────────────── */
interface AttachedFile { id: string; name: string; size: string; date: string }

const INIT_FILES: AttachedFile[] = [
  { id: '1', name: '26년 3월 FCST 파일.PDF', size: '1.2 MB', date: '2026.03.01' },
  { id: '2', name: '26년 4월 FCST 파일.PDF', size: '980 KB', date: '2026.04.02' },
];

/* ── Attachment Modal ─────────────────────────────────── */
function AttachmentModal({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  const [files, setFiles] = useState<AttachedFile[]>(INIT_FILES);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const added: AttachedFile[] = Array.from(newFiles).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size > 1024 * 1024
        ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
        : `${Math.round(f.size / 1024)} KB`,
      date: new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date()).replace(/\. /g, '.').replace('.', '').slice(0, 10),
    }));
    setFiles(prev => [...prev, ...added]);
  }, []);

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const surf  = isDark ? '#1a2538' : '#ffffff';
  const bg    = isDark ? '#111c2a' : '#f5f8f6';
  const bdr   = isDark ? '#2a3a50' : '#d5dce6';
  const txt1  = isDark ? '#dce8f5' : '#1a2332';
  const txt2  = isDark ? '#7a9ab8' : '#4a5a6a';
  const txt3  = isDark ? '#4a6a88' : '#9aadbb';
  const dropBg = dragging
    ? (isDark ? '#0d2e1a' : '#e6f4ea')
    : (isDark ? '#151f2d' : '#f9fbfa');
  const dropBdr = dragging ? '#00B050' : bdr;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', zIndex: 50,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480, maxWidth: '95vw',
        background: surf,
        border: `1px solid ${bdr}`,
        borderRadius: 18,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        maxHeight: '80vh',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px 14px',
          borderBottom: `1px solid ${bdr}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Paperclip size={17} color="#00B050" />
            <span style={{ fontSize: 15, fontWeight: 700, color: txt1 }}>첨부 파일</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px',
              borderRadius: 20, background: '#00B050', color: '#fff',
            }}>{files.length}</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: txt3, display: 'flex', padding: 4, borderRadius: 8,
            transition: 'color 120ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = txt1)}
            onMouseLeave={e => (e.currentTarget.style.color = txt3)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drop zone */}
        <div style={{ padding: '16px 22px 0', flexShrink: 0 }}>
          <div
            style={{
              border: `2px dashed ${dropBdr}`,
              borderRadius: 12,
              background: dropBg,
              padding: '22px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'pointer',
              transition: 'border-color 180ms, background 180ms',
            }}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          >
            <CloudUpload size={32} color={dragging ? '#00B050' : txt3} strokeWidth={1.5} />
            <span style={{ fontSize: 13, fontWeight: 600, color: dragging ? '#00B050' : txt2 }}>
              {dragging ? '파일을 놓으세요' : '클릭하거나 파일을 끌어다 놓으세요'}
            </span>
            <span style={{ fontSize: 11.5, color: txt3 }}>
              PDF, Excel, Word 등 모든 파일 형식 지원
            </span>
            <input
              ref={inputRef} type="file" multiple
              style={{ display: 'none' }}
              onChange={e => addFiles(e.target.files)}
            />
          </div>
        </div>

        {/* File list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 20px' }}>
          {files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: txt3, fontSize: 13 }}>
              첨부된 파일이 없습니다
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {files.map((f, idx) => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  background: bg,
                  border: `1px solid ${bdr}`,
                  borderRadius: 10,
                  transition: 'border-color 130ms',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#00B050')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = bdr)}
                >
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: txt3, minWidth: 18, textAlign: 'right',
                  }}>{idx + 1}.</span>

                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: isDark ? '#1e3a28' : '#e6f4ea',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {f.name.toLowerCase().endsWith('.pdf')
                      ? <FileText size={16} color="#00B050" />
                      : <File size={16} color="#00B050" />
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12.5, fontWeight: 600, color: txt1,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: txt3, marginTop: 1 }}>
                      {f.size} · {f.date}
                    </div>
                  </div>

                  <button onClick={() => removeFile(f.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: txt3, display: 'flex', padding: 4, borderRadius: 6,
                    flexShrink: 0, transition: 'color 120ms',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e05252')}
                    onMouseLeave={e => (e.currentTarget.style.color = txt3)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px', borderTop: `1px solid ${bdr}`,
          display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: 10,
            border: `1px solid ${bdr}`, background: 'transparent',
            fontSize: 13, fontWeight: 600, color: txt2,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 140ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            닫기
          </button>
          <button onClick={() => inputRef.current?.click()} style={{
            padding: '8px 20px', borderRadius: 10,
            border: 'none', background: '#00B050',
            fontSize: 13, fontWeight: 600, color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 140ms',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Upload size={13} /> 파일 추가
          </button>
        </div>
      </div>
    </>
  );
}