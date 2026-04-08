import { useState } from 'react';
import {
  Search, Download, Upload, Save,
  SlidersHorizontal, ChevronDown, ChevronRight, X, RotateCcw,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { useNavigate, useLocation } from 'react-router';

/* ── 탭 — 사이드바 레포트 그룹과 동일 ─────────────────── */
const REPORT_TABS = [
  { label: 'FCST 대비 공급 레포트', path: '/report/supply' },
  { label: '충전/AI Status',          path: '/report/ai' },
  { label: '조립/포장 Status',        path: '/report/assembly' },
  { label: 'DS Status',               path: '/report/ds' },
];

/* ── Month columns ──────────────────────────────────────── */
const MONTHS = [
  '25년 11월', '25년 12월',
  '26년 1월',  '26년 2월',  '26년 3월',  '26년 4월',
  '26년 5월',  '26년 6월',  '26년 7월',  '26년 8월',
  '26년 9월',  '26년 10월', '26년 11월',
];

/* ── 구분 row types ─────────────────────────────────────── */
const GU_BUN = ['FCST', '공급 계획', '최대', '소-중', '소-S'] as const;
type GuBun = (typeof GU_BUN)[number];
type MonthMap = Partial<Record<string, number>>;

interface ReportRow {
  id: string;
  process: string;
  product: string;
  batchSize: string;
  dosageForm: string;
  country: string;
  pack: string;
  공정: string;
  subData: Record<GuBun, MonthMap>;
}

function mkSub(
  fcst: MonthMap, supply: MonthMap, max: MonthMap,
  mid: MonthMap, s: MonthMap,
): Record<GuBun, MonthMap> {
  return { FCST: fcst, '공급 계획': supply, '최대': max, '소-중': mid, '소-S': s };
}

/* ── Mock Data ─────────────────────────────────────────── */
const DATA: ReportRow[] = [
  {
    id: 'r1', process: '충전', product: 'CT-P13 120mg',
    batchSize: '100,000', dosageForm: 'N/A', country: 'N/A', pack: 'N/A', 공정: '',
    subData: mkSub(
      { '25년 11월': 10000, '26년 1월': 20000, '26년 2월': 10000, '26년 4월': 20000, '26년 6월': 20000, '26년 7월': 10000, '26년 9월': 10000 },
      { '25년 11월': 10000, '26년 1월': 10000, '26년 2월': 10000, '26년 4월': 10000, '26년 6월': 10000, '26년 7월': 10000, '26년 9월': 10000 },
      { '25년 11월': 10000, '26년 1월': 10000, '26년 2월': 10000, '26년 4월': 10000, '26년 6월': 10000, '26년 7월': 10000, '26년 9월': 10000 },
      { '26년 2월': 30000 },
      {},
    ),
  },
  {
    id: 'r2', process: '포장', product: 'CT-P13 120mg',
    batchSize: '', dosageForm: '', country: '', pack: '', 공정: '',
    subData: mkSub(
      { '25년 11월': 20000, '26년 1월': 10000, '26년 2월': 40000, '26년 4월': 20000, '26년 9월': 10000 },
      { '25년 11월': 20000, '26년 1월': 10000, '26년 2월': 10000, '26년 4월': 10000, '26년 5월': 10000 },
      { '25년 11월': 20000, '26년 1월': 10000, '26년 2월': 10000, '26년 4월': 10000 },
      { '26년 2월': 30000 },
      {},
    ),
  },
  {
    id: 'r3', process: '충전', product: 'CT-P13 120mg',
    batchSize: '100,000', dosageForm: 'AI', country: 'N/A', pack: 'N/A', 공정: '',
    subData: mkSub(
      { '26년 1월': 10000, '26년 5월': 10000, '26년 7월': 10000 },
      { '26년 1월': 10000, '26년 5월': 10000, '26년 7월': 10000 },
      { '26년 1월': 10000, '26년 5월': 10000, '26년 7월': 10000 },
      {}, {},
    ),
  },
  {
    id: 'r4', process: '공급', product: 'CT-P14 120mg',
    batchSize: '', dosageForm: 'PFS', country: 'CA', pack: '1', 공정: '아별 가독',
    subData: mkSub(
      { '26년 1월': 10000, '26년 2월': 10000, '26년 4월': 10000, '26년 8월': 8000 },
      { '26년 1월': 10000, '26년 2월': 10000, '26년 4월': 10000 },
      { '26년 1월': 10000, '26년 2월': 10000, '26년 4월': 10000 },
      { '26년 4월': 10000, '26년 8월': 8000 },
      { '26년 10월': 20000 },
    ),
  },
  {
    id: 'r5', process: '공급', product: 'CT-P11 120mg',
    batchSize: '', dosageForm: 'PFS', country: 'KR', pack: '1', 공정: '오름아라반 가독',
    subData: mkSub(
      { '26년 1월': 10000, '26년 9월': 10000 },
      { '26년 1월': 10000, '26년 9월': 10000 },
      { '26년 1월': 10000 },
      { '26년 4월': 10000, '26년 9월': 10000 },
      {},
    ),
  },
  {
    id: 'r6', process: '공급', product: 'CT-P11 120mg',
    batchSize: '', dosageForm: 'PFS S', country: 'KR', pack: '1', 공정: '일방 교육사무',
    subData: mkSub(
      { '26년 1월': 10000 },
      { '26년 1월': 10000 },
      {}, {}, {},
    ),
  },
];

/* ── Filter config ─────────────────────────────────────── */
const FILTERS_CFG = [
  { key: 'process',    label: 'Process', options: ['전체', '충전', '포장', '공급'] },
  { key: 'product',    label: 'Product', options: ['전체', 'CT-P13 120mg', 'CT-P14 120mg', 'CT-P11 120mg'] },
  { key: 'dosageForm', label: '제형',    options: ['전체', 'N/A', 'PFS', 'AI', 'PFS S'] },
  { key: 'country',    label: '국가',    options: ['전체', 'N/A', 'CA', 'KR'] },
];

/* ── 구분 style helpers ─────────────────────────────────── */
function guBunBg(type: GuBun, isDark: boolean): string {
  if (type === 'FCST')      return isDark ? 'rgba(96,165,250,0.06)'  : '#f0f7ff';
  if (type === '공급 계획') return isDark ? 'rgba(0,176,80,0.07)'    : '#f0faf4';
  if (type === '최대')      return isDark ? 'rgba(217,119,6,0.07)'   : '#fefce8';
  if (type === '소-중')     return isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc';
  return isDark ? 'rgba(0,0,0,0.12)' : '#f1f5f9';
}
function guBunColor(type: GuBun): string {
  if (type === '공급 계획') return '#00B050';
  if (type === '최대')      return '#d97706';
  if (type === '소-중' || type === '소-S') return 'var(--text-primary)';
  return 'var(--text-secondary)';
}

/* ── Sub-components ────────────────────────────────────── */
function Select({ label, options, value, onChange, isDark }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; isDark: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
      <label style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
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
        <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function ActionBtn({ label, icon, primary, onClick }: {
  label: string; icon?: React.ReactNode; primary?: boolean; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 16px',
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

/* ── Page ──────────────────────────────────────────────── */
export function FcstSupplyReportPage() {
  const [expanded,     setExpanded]     = useState<Set<string>>(new Set());
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [activeTags,   setActiveTags]   = useState<string[]>([]);
  const [keyword,      setKeyword]      = useState('');
  const { isDark } = useTheme();
  const navigate   = useNavigate();
  const location   = useLocation();

  const toggle = (id: string) =>
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const handleFilterChange = (key: string, val: string) => {
    setFilterValues(prev => ({ ...prev, [key]: val }));
    if (val !== '전체' && !activeTags.includes(key)) setActiveTags(prev => [...prev, key]);
    else if (val === '전체') setActiveTags(prev => prev.filter(t => t !== key));
  };
  const removeTag = (key: string) => {
    setFilterValues(prev => ({ ...prev, [key]: '전체' }));
    setActiveTags(prev => prev.filter(t => t !== key));
  };
  const resetAll = () => { setFilterValues({}); setActiveTags([]); setKeyword(''); };

  /* ── Column layout ─────────────────────────────────── */
  const LEFT_COLS = [
    { key: 'process',    label: 'Process',   width: 82,  align: 'center' as const },
    { key: 'product',    label: 'Product',   width: 145, align: 'left'   as const },
    { key: 'batchSize',  label: '배치 사이즈', width: 90, align: 'right'  as const },
    { key: 'dosageForm', label: '제형',      width: 65,  align: 'center' as const },
    { key: 'country',    label: '국가',      width: 58,  align: 'center' as const },
    { key: 'pack',       label: 'Pack',      width: 52,  align: 'center' as const },
    { key: '공정',       label: '공정',      width: 110, align: 'left'   as const },
  ] as const;

  const GUBUN_W = 75;
  const MONTH_W = 80;
  const N = GU_BUN.length;

  /* ── Cell base styles ──────────────────────────────── */
  const TH: React.CSSProperties = {
    padding: '9px 10px', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.04em', textTransform: 'uppercase',
    color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
    borderRight: '1px solid var(--border-secondary)',
    userSelect: 'none', textAlign: 'center',
    position: 'sticky', top: 0, zIndex: 3,
    background: 'var(--bg-faint)',
  };
  const TD: React.CSSProperties = {
    padding: '8px 10px', fontSize: 12.5,
    color: 'var(--text-secondary)',
    borderRight: '1px solid var(--border-secondary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  };
  const MERGED_TD: React.CSSProperties = {
    ...TD,
    background: isDark ? 'rgba(255,255,255,0.03)' : '#f4f7fb',
    borderRight: '1px solid var(--border-primary)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div style={{ background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-primary)', padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
        {REPORT_TABS.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} style={{
              padding: '13px 18px 11px', fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
              background: 'transparent', border: 'none',
              borderBottom: `2px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
              transition: 'color 150ms, border-color 150ms',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Filter toolbar ───────────────────────────────── */}
      <div style={{ background: 'var(--surface-bg)', borderBottom: filterOpen ? 'none' : '1px solid var(--border-secondary)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button onClick={() => setFilterOpen(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
          background: filterOpen ? 'var(--nav-active-bg)' : 'var(--surface-bg)',
          border: `1px solid ${filterOpen ? 'rgba(0,176,80,0.35)' : 'var(--border-primary)'}`,
          borderRadius: 10, fontSize: 12.5, fontWeight: 600,
          color: filterOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', position: 'relative',
        }}>
          <SlidersHorizontal size={14} /> 필터
          {activeTags.length > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeTags.length}
            </span>
          )}
        </button>

        {activeTags.map(key => {
          const f = FILTERS_CFG.find(fi => fi.key === key);
          return (
            <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px 4px 10px', background: 'var(--nav-active-bg)', border: '1px solid rgba(0,176,80,0.25)', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: 'var(--brand-primary)' }}>
              {f?.label}: {filterValues[key]}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', border: '1px solid var(--border-primary)', borderRadius: 10, background: 'var(--input-bg)' }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input type="text" placeholder="키워드 검색..." value={keyword} onChange={e => setKeyword(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12.5, color: 'var(--text-primary)', width: 160, fontFamily: 'inherit' }} />
          {keyword && (
            <button onClick={() => setKeyword('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter panel ────────────────────────────────── */}
      <div style={{ background: 'var(--surface-bg)', overflow: 'hidden', maxHeight: filterOpen ? '110px' : '0px', opacity: filterOpen ? 1 : 0, transition: 'max-height 250ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease', borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none', flexShrink: 0 }}>
        <div style={{ padding: '14px 24px 16px', display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
          {FILTERS_CFG.map(f => (
            <Select key={f.key} label={f.label} options={f.options} value={filterValues[f.key] ?? '전체'} onChange={v => handleFilterChange(f.key, v)} isDark={isDark} />
          ))}
          <button onClick={resetAll} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', marginBottom: 1, background: 'transparent', border: '1px solid var(--border-primary)', borderRadius: 9, fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 120ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
            <RotateCcw size={12} /> 초기화
          </button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, padding: '16px 24px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: 'var(--surface-bg)', borderRadius: '14px 14px 0 0', border: '1px solid var(--border-primary)', borderBottom: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ height: '100%', overflowX: 'auto', overflowY: 'auto' }}>
            <table style={{
              borderCollapse: 'collapse', tableLayout: 'fixed',
              minWidth: LEFT_COLS.reduce((a, c) => a + c.width, 0) + GUBUN_W + MONTHS.length * MONTH_W,
            }}>
              <colgroup>
                {LEFT_COLS.map(c => <col key={c.key} style={{ width: c.width }} />)}
                <col style={{ width: GUBUN_W }} />
                {MONTHS.map(m => <col key={m} style={{ width: MONTH_W }} />)}
              </colgroup>

              {/* ── Header ─────────────────────────────── */}
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
                  {LEFT_COLS.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
                  <th style={TH}>구분</th>
                  {MONTHS.map(m => <th key={m} style={TH}>{m}</th>)}
                </tr>
              </thead>

              {/* ── Body ───────────────────────────────── */}
              <tbody>
                {DATA.flatMap(row => {
                  const isExpanded = expanded.has(row.id);
                  const subBg   = isDark ? 'rgba(0,176,80,0.03)' : '#f7fbf8';
                  const subBdr  = isDark ? 'rgba(0,176,80,0.18)' : 'rgba(0,176,80,0.15)';

                  /* ── Parent row (항상 표시) ────────── */
                  const parentRow = (
                    <tr
                      key={`${row.id}-parent`}
                      onClick={() => toggle(row.id)}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-faint)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      style={{
                        cursor: 'pointer',
                        borderBottom: isExpanded
                          ? `1px solid ${subBdr}`
                          : '1px solid var(--border-secondary)',
                        transition: 'background 100ms',
                        background: isExpanded
                          ? (isDark ? 'rgba(0,176,80,0.06)' : '#f0faf4')
                          : 'transparent',
                      }}
                    >
                      {/* Process — 펼침 아이콘 + 텍스트 */}
                      <td style={{ ...TD, textAlign: 'center', fontWeight: 700, color: 'var(--brand-primary)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 16, height: 16, borderRadius: 4,
                            background: isExpanded ? 'rgba(0,176,80,0.15)' : 'rgba(0,176,80,0.08)',
                            transition: 'background 150ms',
                          }}>
                            {isExpanded
                              ? <ChevronDown size={11} strokeWidth={2.5} />
                              : <ChevronRight size={11} strokeWidth={2.5} />
                            }
                          </span>
                          {row.process}
                        </span>
                      </td>
                      <td style={{ ...TD, fontWeight: 600, color: 'var(--text-primary)' }}>{row.product}</td>
                      <td style={{ ...TD, textAlign: 'right' }}>{row.batchSize}</td>
                      <td style={{ ...TD, textAlign: 'center' }}>{row.dosageForm}</td>
                      <td style={{ ...TD, textAlign: 'center' }}>{row.country}</td>
                      <td style={{ ...TD, textAlign: 'center' }}>{row.pack}</td>
                      <td style={TD}>{row.공정}</td>
                      {/* 구분·월 컬럼: 펼치면 힌트 숨김 */}
                      <td style={{ ...TD, color: 'var(--text-tertiary)', fontSize: 11, fontStyle: 'italic' }}>
                        {isExpanded ? '' : '▾ 상세 보기'}
                      </td>
                      {MONTHS.map(m => (
                        <td key={m} style={{ ...TD, textAlign: 'right', color: 'var(--text-tertiary)' }}>—</td>
                      ))}
                    </tr>
                  );

                  if (!isExpanded) return [parentRow];

                  /* ── Sub-rows (펼쳤을 때만 렌더) ──── */
                  const subRows = GU_BUN.map((type, ti) => {
                    const isLast    = ti === N - 1;
                    const rowBg     = guBunBg(type, isDark);
                    const isSummary = type === '소-중' || type === '소-S';

                    return (
                      <tr
                        key={`${row.id}-${type}`}
                        style={{
                          background: rowBg,
                          borderBottom: isLast
                            ? '2px solid var(--border-primary)'
                            : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        }}
                      >
                        {/* ── 왼쪽 cols: 빈칸 + 인덴트 라인 표시 ── */}
                        <td style={{
                          ...TD,
                          background: subBg,
                          borderRight: '1px solid var(--border-secondary)',
                          position: 'relative',
                          paddingLeft: 22,
                        }}>
                          {/* 세로 연결선 */}
                          <span style={{
                            position: 'absolute', left: 10, top: 0, bottom: isLast ? '50%' : 0,
                            width: 1.5, background: subBdr, borderRadius: 2,
                          }} />
                          {/* 가로 연결선 */}
                          <span style={{
                            position: 'absolute', left: 10, top: '50%',
                            width: 8, height: 1.5, background: subBdr,
                          }} />
                        </td>
                        {/* product ~ 공정: 빈 칸 */}
                        {(['product','batchSize','dosageForm','country','pack','공정'] as const).map(k => (
                          <td key={k} style={{ ...TD, background: subBg, color: 'transparent' }}>—</td>
                        ))}

                        {/* ── 구분 label ─── */}
                        <td style={{
                          ...TD,
                          fontSize: 11.5,
                          fontWeight: isSummary ? 700 : 500,
                          color: guBunColor(type),
                          background: rowBg,
                          borderLeft: `2px solid ${
                            type === 'FCST'      ? 'rgba(96,165,250,0.5)'  :
                            type === '공급 계획' ? 'rgba(0,176,80,0.5)'   :
                            type === '최대'      ? 'rgba(217,119,6,0.5)'  :
                            'rgba(150,150,150,0.3)'
                          }`,
                          borderRight: '1px solid var(--border-primary)',
                        }}>
                          {type}
                        </td>

                        {/* ── Month cells ─── */}
                        {MONTHS.map(m => {
                          const val = row.subData[type]?.[m];
                          return (
                            <td key={m} style={{
                              ...TD,
                              textAlign: 'right',
                              background: rowBg,
                              fontWeight: isSummary ? 600 : 400,
                              color: val != null
                                ? (isSummary ? 'var(--text-primary)' : 'var(--text-secondary)')
                                : 'var(--text-tertiary)',
                              fontSize: val != null ? 12.5 : 11.5,
                            }}>
                              {val != null ? val.toLocaleString() : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  });

                  return [parentRow, ...subRows];
                })}

                {/* ── 빈 행으로 여백 확보 ──────────────── */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ borderBottom: '1px solid var(--border-secondary)', height: 36 }}>
                    {LEFT_COLS.map(c => <td key={c.key} style={{ ...TD, color: 'transparent' }}>—</td>)}
                    <td style={{ ...TD, color: 'transparent' }}>—</td>
                    {MONTHS.map(m => <td key={m} style={{ ...TD, color: 'transparent' }}>—</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Bottom action bar ───────────────────────────── */}
      <div style={{
        margin: '0 24px', padding: '10px 18px',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderTop: '1px solid var(--border-secondary)',
        borderRadius: '0 0 14px 14px',
        marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 8, flexShrink: 0,
      }}>
        <ActionBtn label="Download" icon={<Download size={13} />} />
        <ActionBtn label="Upload"   icon={<Upload size={13} />} />
        <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
        <ActionBtn label="Save"     icon={<Save size={13} />} primary />
      </div>
    </div>
  );
}