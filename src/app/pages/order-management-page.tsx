import { useState } from 'react';
import {
  Search, Download, Upload, Save,
  SlidersHorizontal, ChevronDown, X, RotateCcw,
  ChevronLeft, ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { useNavigate, useLocation } from 'react-router';

/* ── 라우트 그룹별 탭 정의 — 사이드바와 동일 ─────────── */
const PLAN_TABS = [
  { label: '충전/AI FCST',        path: '/plan/ai-fcst' },
  { label: '조립/포장 FCST',      path: '/plan/assembly-fcst' },
  { label: '조립/포장 요약 FCST', path: '/plan/assembly-summary' },
  { label: 'L&P FCST',            path: '/plan/lp-fcst' },
  { label: 'L&P 요약 FCST',       path: '/plan/lp-summary' },
  { label: 'PO 관리',             path: '/plan/po' },
];
const SUPPLY_TABS = [
  { label: '충전/AI 공급계획',   path: '/supply/ai' },
  { label: '조립/포장 공급계획', path: '/supply/assembly' },
  { label: 'L&P 공급계획',       path: '/supply/lp' },
];
const REPORT_TABS = [
  { label: 'FCST 대비 공급 레포트', path: '/report/supply' },
  { label: '충전/AI Status',         path: '/report/ai' },
  { label: '조립/포장 Status',       path: '/report/assembly' },
  { label: 'DS Status',              path: '/report/ds' },
];
// /order-management 전용 로컬 탭 (라우트 없음)
const ORDER_LOCAL_TABS = [
  '출입/AI FCST', '출입/출품 구분 FCST', '출입/출품 과년 FCST', 'L&P FCST',
];

/** 현재 경로에 맞는 탭 목록 반환 */
function resolveTabGroup(pathname: string) {
  if (pathname.startsWith('/plan/'))   return { type: 'route', tabs: PLAN_TABS };
  if (pathname.startsWith('/supply/')) return { type: 'route', tabs: SUPPLY_TABS };
  if (pathname.startsWith('/report/')) return { type: 'route', tabs: REPORT_TABS };
  return { type: 'local', tabs: ORDER_LOCAL_TABS };
}

/* ── Types ─────────────────────────────────────────── */
type TableRow = {
  fcstId: string; product: string; 제형: string; 국가: string; pack: string;
  상세공정: string; qtyEqualTyping: string; qtyPackH: number; qtyPackL: number;
  expectedDate: string; desiredDelivery: string; binding: string;
  adpAllocation: string; 기준시점: string; allocationId: string;
  대응기반: string; 비고: string;
};

/* ── Mock data ──────────────────────────────────────── */
const tableData: TableRow[] = Array.from({ length: 20 }, (_, i) => ({
  fcstId:         ['CT-P13 120mg','CT-P13 120mg','CT-P06','CT-P39','CT-P47'][i % 5],
  product:        ['CT-P13 120mg','유글리마 40mg','필아마 120mg','CT-P39 150mg','CT-P47'][i % 5],
  제형:           ['PFS','VIAL','A12-G','PFS','VIAL'][i % 5],
  국가:           ['US','EU','CA','AU','TW'][i % 5],
  pack:           String((i % 4) + 1),
  상세공정:       ['조립/라벨링','Charge','Assembly','L&P','재포장'][i % 5],
  qtyEqualTyping: i % 3 === 0 ? '소진됨' : '',
  qtyPackH:       100 + i * 12,
  qtyPackL:       100 + i * 37,
  expectedDate:   `2026.0${(i % 9) + 1}.01`,
  desiredDelivery:`2026.0${(i % 9) + 1}.15`,
  binding:        ['100%','80%','60%','95%','75%'][i % 5],
  adpAllocation:  i % 4 === 0 ? '소진됨' : i % 4 === 1 ? '재포장' : '-',
  기준시점:       `2025.0${(i % 9) + 1}.21`,
  allocationId:   `ELV10${59 + i}`,
  대응기반:       `2026.0${(i % 9) + 1}.29`,
  비고:           i % 2 === 0 ? '-' : `비고 ${i + 1}`,
}));

const HEADERS: { key: keyof TableRow; label: string; width?: number; pin?: boolean }[] = [
  { key: 'fcstId',         label: 'FCST 월',         width: 120, pin: true },
  { key: 'product',        label: 'Product',          width: 150 },
  { key: '제형',           label: '제형',             width: 70  },
  { key: '국가',           label: '국가',             width: 60  },
  { key: 'pack',           label: 'Pack',             width: 55  },
  { key: '상세공정',       label: '상세 공정',        width: 120 },
  { key: 'qtyEqualTyping', label: 'QtyEqualTyping',   width: 120 },
  { key: 'qtyPackH',       label: 'QtyPackH',         width: 90  },
  { key: 'qtyPackL',       label: 'QtyPackL',         width: 90  },
  { key: 'expectedDate',   label: 'Expected L&P',     width: 120 },
  { key: 'desiredDelivery',label: 'Desired Delivery', width: 130 },
  { key: 'binding',        label: 'Binding',          width: 80  },
  { key: 'adpAllocation',  label: 'aDP Allocation',   width: 120 },
  { key: '기준시점',       label: '기준시점',         width: 110 },
  { key: 'allocationId',   label: 'Allocation ID',    width: 110 },
  { key: '대응기반',       label: '대응기반(UP)',      width: 120 },
  { key: '비고',           label: '비고',             width: 90  },
];

const FILTERS = [
  { key: 'fcstMonth', label: 'FCST 월',   options: ['전체','2025.11 Y','2025.12 Y','2026.01 Y'] },
  { key: 'product',   label: 'Product',   options: ['전체','CT-P13 120mg','CT-P06','CT-P39','CT-P47'] },
  { key: '제형',      label: '제형 구분', options: ['전체','PFS','VIAL','A12-G'] },
  { key: '국가',      label: '국가 구분', options: ['전체','US','EU','CA','AU','TW'] },
  { key: 'pack',      label: 'Pack',      options: ['전체','1','2','3','4'] },
];

/* ── Select ─────────────────────────────────────────── */
function Select({ label, options, value, onChange, isDark }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; isDark: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
      <label style={{
        fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--text-tertiary)',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            appearance: 'none', WebkitAppearance: 'none',
            padding: '7px 28px 7px 10px',
            border: '1px solid var(--border-primary)', borderRadius: 9,
            fontSize: 12.5, fontWeight: 500,
            color: 'var(--text-primary)', background: 'var(--input-bg)',
            outline: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
            colorScheme: isDark ? 'dark' : 'light',
          } as React.CSSProperties}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-tertiary)', pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

/* ── Action Button ──────────────────────────────────── */
function ActionBtn({ label, icon, primary, onClick }: {
  label: string; icon?: React.ReactNode; primary?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px',
        background: primary ? 'var(--brand-primary)' : 'var(--surface-bg)',
        border: primary ? 'none' : '1px solid var(--border-primary)',
        borderRadius: 10, fontSize: 13, fontWeight: 600,
        color: primary ? '#fff' : 'var(--text-primary)',
        cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
        transition: 'opacity 150ms',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {icon}{label}
    </button>
  );
}

/* ── Page ─────────────��─────────────────────────────── */
export function OrderManagementPage() {
  const [activeTab,     setActiveTab]     = useState(0);
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [filterValues,  setFilterValues]  = useState<Record<string, string>>({});
  const [activeTags,    setActiveTags]    = useState<string[]>([]);
  const [keyword,       setKeyword]       = useState('');
  const [page,          setPage]          = useState(1);
  const { isDark } = useTheme();

  const ROWS_PER_PAGE = 10;
  const totalPages    = Math.ceil(tableData.length / ROWS_PER_PAGE);
  const visibleRows   = tableData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const activeCount = activeTags.length;

  const handleFilterChange = (key: string, val: string) => {
    setFilterValues(prev => ({ ...prev, [key]: val }));
    if (val !== '전체' && !activeTags.includes(key)) {
      setActiveTags(prev => [...prev, key]);
    } else if (val === '전체') {
      setActiveTags(prev => prev.filter(t => t !== key));
    }
  };

  const removeTag = (key: string) => {
    setFilterValues(prev => ({ ...prev, [key]: '전체' }));
    setActiveTags(prev => prev.filter(t => t !== key));
  };

  const resetAll = () => {
    setFilterValues({});
    setActiveTags([]);
    setKeyword('');
  };

  const location = useLocation();
  const navigate = useNavigate();
  const tabGroup = resolveTabGroup(location.pathname);
  const tabs = tabGroup.type === 'route' ? tabGroup.tabs.map(t => t.label) : tabGroup.tabs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Tab bar ────────────────────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        flexShrink: 0,
      }}>
        {tabs.map((tab, i) => {
          const isActive = tabGroup.type === 'route'
            ? location.pathname === tabGroup.tabs[i].path
            : activeTab === i;
          return (
            <button
              key={tab}
              onClick={() => {
                if (tabGroup.type === 'route') {
                  navigate(tabGroup.tabs[i].path);
                } else {
                  setActiveTab(i);
                }
              }}
              style={{
                padding: '13px 18px 11px',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 150ms, border-color 150ms',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Slim toolbar: filter toggle + keyword search ─ */}
      <div style={{
        background: 'var(--surface-bg)',
        borderBottom: filterOpen ? 'none' : '1px solid var(--border-secondary)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        {/* Filter toggle button */}
        <button
          onClick={() => setFilterOpen(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 14px',
            background: filterOpen ? 'var(--nav-active-bg)' : 'var(--surface-bg)',
            border: `1px solid ${filterOpen ? 'rgba(0,176,80,0.35)' : 'var(--border-primary)'}`,
            borderRadius: 10, fontSize: 12.5, fontWeight: 600,
            color: filterOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 150ms',
            position: 'relative',
          }}
        >
          <SlidersHorizontal size={14} />
          필터
          {activeCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -6, right: -6,
              width: 16, height: 16,
              borderRadius: '50%',
              background: 'var(--brand-primary)',
              color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {activeCount}
            </span>
          )}
        </button>

        {/* Active filter chips */}
        {activeTags.map(key => {
          const f = FILTERS.find(fi => fi.key === key);
          return (
            <span key={key} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 8px 4px 10px',
              background: 'var(--nav-active-bg)',
              border: '1px solid rgba(0,176,80,0.25)',
              borderRadius: 20,
              fontSize: 11.5, fontWeight: 600,
              color: 'var(--brand-primary)',
            }}>
              {f?.label}: {filterValues[key]}
              <button onClick={() => removeTag(key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'inherit', display: 'flex', alignItems: 'center', padding: 0,
              }}>
                <X size={10} />
              </button>
            </span>
          );
        })}

        {activeTags.length > 0 && (
          <button onClick={resetAll} style={{
            fontSize: 11.5, color: 'var(--text-tertiary)', background: 'none',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <RotateCcw size={11} /> 초기화
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Keyword search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '7px 12px',
          border: '1px solid var(--border-primary)', borderRadius: 10,
          background: 'var(--input-bg)',
        }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="키워드 검색..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 12.5, color: 'var(--text-primary)', width: 160, fontFamily: 'inherit',
            }}
          />
          {keyword && (
            <button onClick={() => setKeyword('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', display: 'flex', padding: 0,
            }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible filter panel ─────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)',
        overflow: 'hidden',
        maxHeight: filterOpen ? '120px' : '0px',
        opacity: filterOpen ? 1 : 0,
        transition: 'max-height 250ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
        borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '14px 24px 16px',
          display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap',
        }}>
          {FILTERS.map(f => (
            <Select
              key={f.key}
              label={f.label}
              options={f.options}
              value={filterValues[f.key] ?? '전체'}
              onChange={v => handleFilterChange(f.key, v)}
              isDark={isDark}
            />
          ))}
          <button
            onClick={resetAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', marginBottom: 1,
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: 9, fontSize: 12, fontWeight: 500,
              color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'color 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            <RotateCcw size={12} /> 초기화
          </button>
        </div>
      </div>

      {/* ── Data grid ──────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        padding: '16px 24px 0',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          background: 'var(--surface-bg)',
          borderRadius: '14px 14px 0 0',
          border: '1px solid var(--border-primary)',
          borderBottom: 'none',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
              minWidth: HEADERS.reduce((a, h) => a + (h.width ?? 100), 0),
            }}>
              <colgroup>
                {HEADERS.map(h => <col key={h.key} style={{ width: h.width ?? 100 }} />)}
              </colgroup>
              <thead>
                <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                  {HEADERS.map(h => (
                    <th key={h.key} style={{
                      padding: '10px 12px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      color: h.pin ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      borderRight: '1px solid var(--border-secondary)',
                      userSelect: 'none',
                    }}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, ri) => (
                  <tr
                    key={ri}
                    style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'background 100ms', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-faint)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {HEADERS.map((h, ci) => {
                      const val = String(row[h.key] ?? '');
                      const isEmpty = val === '' || val === '-';
                      return (
                        <td key={ci} style={{
                          padding: '10px 12px', fontSize: 12.5,
                          color: isEmpty ? 'var(--text-tertiary)' : ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: ci === 0 ? 600 : 400,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          borderRight: '1px solid var(--border-secondary)',
                        }}>
                          {isEmpty ? '—' : val}
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

      {/* ── Bottom bar: pagination (left) + actions (right) ─ */}
      <div style={{
        margin: '0 24px',
        padding: '10px 18px',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderTop: '1px solid var(--border-secondary)',
        borderRadius: '0 0 14px 14px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: 12,
      }}>
        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>
            총 <b style={{ color: 'var(--text-primary)' }}>{tableData.length}</b>건
          </span>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={pageBtn(page === 1)}
          >
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 28, height: 28, borderRadius: 8, border: 'none',
                fontSize: 12, cursor: 'pointer',
                background: page === p ? 'var(--brand-primary)' : 'transparent',
                color: page === p ? '#fff' : 'var(--text-tertiary)',
                fontWeight: page === p ? 700 : 400,
                fontFamily: 'inherit',
                transition: 'background 120ms',
              } as React.CSSProperties}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={pageBtn(page === totalPages)}
          >
            <ChevronRightIcon size={13} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 2 }}>
            {page} / {totalPages} 페이지
          </span>
        </div>

        {/* Action buttons — right side */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ActionBtn label="Download" icon={<Download size={13} />} />
          <ActionBtn label="Upload"   icon={<Upload size={13} />} />
          <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
          <ActionBtn label="Save"     icon={<Save size={13} />}     primary />
        </div>
      </div>
    </div>
  );
}

function pageBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 28, height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, border: 'none', background: 'transparent',
    color: disabled ? 'var(--border-primary)' : 'var(--text-tertiary)',
    cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
  };
}