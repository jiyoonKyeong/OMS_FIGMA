import { useState } from 'react';
import {
  Search, Download, Upload, Save,
  SlidersHorizontal, X, RotateCcw, ZoomIn,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { useNavigate, useLocation } from 'react-router';

/* ── 탭 ─────────────────────────────────────────────────── */
const REPORT_TABS = [
  { label: 'FCST 대비 공급 레포트', path: '/report/supply' },
  { label: '충전/AI Status',         path: '/report/ai' },
  { label: '조립/포장 Status',       path: '/report/assembly' },
  { label: 'DS Status',              path: '/report/ds' },
];

/* ── Types ───────────────────────────────────────────────── */
interface DsLot { process: string; product: string; batchNo: string; dsLot: string; }
interface StatusRow {
  id: string;
  process: string;
  product: string;
  batchNo: string;
  deviation: string;
  poNo: string;
  납기: string;
  요청일: string;
  startDate: string;
  endDate: string;
  coaComp: string;
  coC: string;
  출하패킷: string;
  dsLots: DsLot[];
  shipDate: string;
  sampling: string;
  memo: string;
}

/* ── Mock Data ───────────────────────────────────────────── */
const DATA: StatusRow[] = [
  {
    id: 'r01', process: '충전', product: 'CT-P39 150mg', batchNo: '5M5P23',
    deviation: '', poNo: '4500068840', 납기: '2025-10-05', 요청일: '2025-10-23',
    startDate: '2025-09-28', endDate: '2025-09-28', coaComp: '2025-10-01', coC: '2025-10-02',
    출하패킷: '2025-10-02',
    dsLots: [{ process: '포장', product: 'CT-P39 150mg', batchNo: '5M5P23', dsLot: '22200P001' }],
    shipDate: '2025-11-20', sampling: '2025-09-12', memo: '',
  },
  {
    id: 'r02', process: '충전', product: '유플라이머 40mg', batchNo: '5LAP22',
    deviation: '', poNo: '4500067172', 납기: '2025-10-05', 요청일: '2025-08-28',
    startDate: '2025-09-03', endDate: '2025-09-08', coaComp: '2025-10-01', coC: '2025-10-02',
    출하패킷: '2025-10-02', dsLots: [],
    shipDate: '2025-11-20', sampling: '2025-09-12', memo: '',
  },
  {
    id: 'r03', process: '충전', product: 'CT-P39 150mg S/Up', batchNo: '5M5P14T1',
    deviation: '', poNo: '4500069625', 납기: '2025-10-15', 요청일: '2025-09-22',
    startDate: '2025-09-28', endDate: '2025-09-28', coaComp: '2025-10-01', coC: '',
    출하패킷: '',
    dsLots: [{ process: '포장', product: 'CT-P39 150mg', batchNo: '5M5P14T1', dsLot: '22200P002' }],
    shipDate: '2025-11-21', sampling: '2025-09-15', memo: '',
  },
  {
    id: 'r04', process: '조립', product: '램시마 120mg 2KG', batchNo: '5B4P14T1',
    deviation: '', poNo: '4500067858', 납기: '2025-10-15', 요청일: '2025-09-22',
    startDate: '2025-09-28', endDate: '2025-09-28', coaComp: '2025-10-01', coC: '2025-10-13',
    출하패킷: '2025-10-13', dsLots: [],
    shipDate: '2025-11-22', sampling: '2025-09-28', memo: '',
  },
  {
    id: 'r05', process: '조립', product: '유플라이머 20mg', batchNo: '5UP03',
    deviation: '', poNo: '4500055986', 납기: '2025-10-15', 요청일: '2025-09-29',
    startDate: '2025-09-06', endDate: '2025-10-13', coaComp: '2025-10-13', coC: '2025-10-14',
    출하패킷: '2025-10-14', dsLots: [],
    shipDate: '2025-11-23', sampling: '2025-09-15', memo: '',
  },
  {
    id: 'r06', process: '조립', product: '램시마 120mg 2KG', batchNo: '5B4P1ST3',
    deviation: '', poNo: '4500070131', 납기: '2025-10-15', 요청일: '2025-09-24',
    startDate: '2025-09-26', endDate: '2025-10-02', coaComp: '2025-10-13', coC: '',
    출하패킷: '', dsLots: [],
    shipDate: '-', sampling: '2025-09-30', memo: '',
  },
  {
    id: 'r07', process: '충전', product: '램시마 120mg 2KG', batchNo: '5B4P18',
    deviation: '', poNo: '4500068411', 납기: '2025-10-15', 요청일: '2025-08-31',
    startDate: '2025-09-08', endDate: '2025-10-15', coaComp: '2025-10-15', coC: '',
    출하패킷: '',
    dsLots: [{ process: '포장', product: '램시마 120mg', batchNo: '5B4P18', dsLot: '22200P003' }],
    shipDate: '-', sampling: '2025-09-19', memo: '',
  },
  {
    id: 'r08', process: '조립', product: 'CT-P47 162mg S/Up', batchNo: '5TFP03T1',
    deviation: '', poNo: '4500067365', 납기: '2025-10-20', 요청일: '2025-09-26',
    startDate: '2025-09-30', endDate: '2025-10-14', coaComp: '2025-10-16', coC: '2025-10-16',
    출하패킷: '', dsLots: [],
    shipDate: '-', sampling: '2025-10-04', memo: '',
  },
  {
    id: 'r09', process: '조립', product: '램시마 120mg 2KG', batchNo: '5B4P06',
    deviation: 'O',
    poNo: '4500061691', 납기: '2025-04-21', 요청일: '2025-05-02',
    startDate: '2025-10-14', endDate: '2025-10-21', coaComp: '2025-10-21', coC: '',
    출하패킷: '',
    dsLots: [{ process: '충전', product: '램시마 120mg', batchNo: '5B4P06', dsLot: '22201P005' }],
    shipDate: '-', sampling: '2025-05-06', memo: '',
  },
  {
    id: 'r10', process: '조립', product: '램시마 120mg 2KG', batchNo: '5B4P06T1',
    deviation: '', poNo: '4500068078', 납기: '2025-10-20', 요청일: '2025-05-12',
    startDate: '2025-05-15', endDate: '2025-10-17', coaComp: '2025-10-17', coC: '',
    출하패킷: '', dsLots: [],
    shipDate: '-', sampling: '2025-05-19', memo: '',
  },
  {
    id: 'r11', process: '조립', product: 'CT-P47 162mg S/Up', batchNo: '5TFP04T1',
    deviation: '', poNo: '4500067366', 납기: '2025-10-20', 요청일: '2025-10-01',
    startDate: '2025-10-02', endDate: '2025-10-17', coaComp: '2025-10-20', coC: '2025-10-20',
    출하패킷: '', dsLots: [],
    shipDate: '-', sampling: '2025-10-06', memo: '',
  },
  {
    id: 'r12', process: '조립', product: 'CT-P47 162mg S/Up', batchNo: '5TFP03T1',
    deviation: '', poNo: '4500067367', 납기: '2025-10-30', 요청일: '2025-10-02',
    startDate: '2025-10-13', endDate: '2025-10-17', coaComp: '2025-10-21', coC: '2025-10-21',
    출하패킷: '', dsLots: [],
    shipDate: '-', sampling: '2025-10-17', memo: '',
  },
  {
    id: 'r13', process: '조립', product: 'CT-P39 150mg', batchNo: '5M5P27S11',
    deviation: '', poNo: '4500071648', 납기: '2025-10-30', 요청일: '2025-10-14',
    startDate: '2025-10-18', endDate: '2025-10-21', coaComp: '', coC: '',
    출하패킷: '',
    dsLots: [{ process: '포장', product: 'CT-P39 150mg', batchNo: '5M5P27S11', dsLot: '22200P003' }],
    shipDate: '-', sampling: '2025-10-18', memo: '',
  },
];

/* ── DS 추적 Popup ──────────────────────────────────────── */
function DsPopup({ row, onClose, isDark }: { row: StatusRow; onClose: () => void; isDark: boolean }) {
  const bdr = 'var(--border-primary)';
  const TH: React.CSSProperties = {
    padding: '8px 12px', fontSize: 11.5, fontWeight: 700,
    background: isDark ? 'rgba(0,176,80,0.12)' : '#e6f7ee',
    color: '#00B050', borderBottom: `1px solid ${bdr}`,
    borderRight: `1px solid ${bdr}`, whiteSpace: 'nowrap', textAlign: 'left',
  };
  const TD: React.CSSProperties = {
    padding: '8px 12px', fontSize: 12.5,
    color: 'var(--text-primary)', borderBottom: `1px solid ${bdr}`,
    borderRight: `1px solid ${bdr}`, whiteSpace: 'nowrap',
  };
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999, minWidth: 480,
        background: 'var(--surface-bg)',
        border: `1px solid ${bdr}`,
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          background: isDark ? 'rgba(0,176,80,0.10)' : '#f0faf4',
          borderBottom: `1px solid ${bdr}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ZoomIn size={16} style={{ color: '#00B050' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>DS 추적</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: 2, borderRadius: 6,
          }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '16px 18px 20px' }}>
          {row.dsLots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
              DS LOT 정보가 없습니다.
            </div>
          ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%', border: `1px solid ${bdr}`, borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr>
                  {['Process', 'Product', 'Batch No', 'DS LOT'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {row.dsLots.map((lot, i) => (
                  <tr key={i}>
                    <td style={TD}>{lot.process}</td>
                    <td style={TD}>{lot.product}</td>
                    <td style={TD}>{lot.batchNo}</td>
                    <td style={{ ...TD, borderRight: 'none', fontWeight: 600, color: '#00B050' }}>{lot.dsLot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Helper ──────────────────────────────────────────────── */
function FilterLabel({ label }: { label: string }) {
  return (
    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function dateInputStyle(isDark: boolean): React.CSSProperties {
  return {
    flex: 1, padding: '6px 8px',
    border: '1px solid var(--border-primary)', borderRadius: 7,
    fontSize: 12, color: 'var(--text-primary)', background: 'var(--input-bg)',
    outline: 'none', fontFamily: 'inherit', minWidth: 0,
    colorScheme: isDark ? 'dark' : 'light',
  };
}

const PRODUCTS = ['CT-P39 150mg', '유플라이머 40mg', '유플라이머 20mg', '램시마 120mg 2KG', 'CT-P47 162mg S/Up', 'CT-P39 150mg S/Up'];

/* ── Main Page ───────────────────────────────────────────── */
export function AiStatusReportPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [keyword,    setKeyword]    = useState('');
  const [popupRow,   setPopupRow]   = useState<StatusRow | null>(null);

  // Filter state
  const [fProcess,   setFProcess]   = useState('');   // '' = 전체
  const [fProduct,   setFProduct]   = useState('');   // '' = 전체
  const [fBatchNo,   setFBatchNo]   = useState('');
  const [fDeviation, setFDeviation] = useState<'all' | 'yes' | 'no'>('all');
  const [fStartFrom, setFStartFrom] = useState('');
  const [fEndFrom,   setFEndFrom]   = useState('');

  const { isDark } = useTheme();
  const navigate   = useNavigate();
  const location   = useLocation();

  const resetFilters = () => {
    setFProcess(''); setFProduct(''); setFBatchNo('');
    setFDeviation('all'); setFStartFrom('');
    setFEndFrom('');
  };

  /* ── Active badges ───────────────────────────────────── */
  const activeBadges: { label: string; onRemove: () => void }[] = [];
  if (fProcess)             activeBadges.push({ label: `Process: ${fProcess}`,   onRemove: () => setFProcess('') });
  if (fProduct)             activeBadges.push({ label: `Product: ${fProduct}`,   onRemove: () => setFProduct('') });
  if (fBatchNo)             activeBadges.push({ label: `Batch No: ${fBatchNo}`,  onRemove: () => setFBatchNo('') });
  if (fDeviation !== 'all') activeBadges.push({ label: `Deviation: ${fDeviation === 'yes' ? 'Yes' : 'No'}`, onRemove: () => setFDeviation('all') });
  if (fStartFrom) activeBadges.push({ label: `Start Date: ${fStartFrom}`, onRemove: () => setFStartFrom('') });
  if (fEndFrom)   activeBadges.push({ label: `End Date: ${fEndFrom}`,     onRemove: () => setFEndFrom('') });

  /* ── Columns ─────────────────────────────────────────── */
  const COLS = [
    { key: 'process',   label: 'Process',      w: 58,  align: 'center' as const },
    { key: 'product',   label: 'Product',      w: 145, align: 'left'   as const },
    { key: 'batchNo',   label: 'Batch No',     w: 90,  align: 'center' as const },
    { key: 'deviation', label: 'Deviation',    w: 68,  align: 'center' as const },
    { key: 'poNo',      label: 'PO No.',       w: 106, align: 'center' as const },
    { key: '납기',      label: '납기',         w: 86,  align: 'center' as const },
    { key: '요청일',    label: '요청일',       w: 86,  align: 'center' as const },
    { key: 'startDate', label: 'Start Date',   w: 86,  align: 'center' as const },
    { key: 'endDate',   label: 'End Date',     w: 86,  align: 'center' as const },
    { key: 'coaComp',   label: 'COA Comp.',    w: 86,  align: 'center' as const },
    { key: 'coC',       label: 'CoC',          w: 86,  align: 'center' as const },
    { key: '출하패킷',  label: '출하패킷전달', w: 90,  align: 'center' as const },
    { key: 'ds',        label: 'DS 추적',      w: 68,  align: 'center' as const },
    { key: 'shipDate',  label: 'Ship Date',    w: 86,  align: 'center' as const },
    { key: 'sampling',  label: 'Sampling',     w: 86,  align: 'center' as const },
    { key: 'memo',      label: 'Memo',         w: 160, align: 'left'   as const },
  ] as const;

  /* ── Cell styles ─────────────────────────────────────── */
  const TH: React.CSSProperties = {
    padding: '9px 8px', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.03em', color: 'var(--text-tertiary)',
    borderRight: '1px solid var(--border-secondary)',
    textAlign: 'center', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, zIndex: 3,
    background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f2f5',
    userSelect: 'none',
  };
  const baseTD: React.CSSProperties = {
    padding: '7px 8px', fontSize: 12,
    color: 'var(--text-secondary)',
    borderRight: '1px solid var(--border-secondary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    textAlign: 'center',
  };

  /* ── Filtered rows ───────────────────────────────────── */
  const rows = DATA.filter(r => {
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (![r.process, r.product, r.batchNo, r.poNo].some(v => v.toLowerCase().includes(kw))) return false;
    }
    if (fProcess && r.process !== fProcess) return false;
    if (fProduct && r.product !== fProduct) return false;
    if (fBatchNo && !r.batchNo.toLowerCase().includes(fBatchNo.toLowerCase())) return false;
    if (fDeviation === 'yes' && r.deviation !== 'O') return false;
    if (fDeviation === 'no'  && r.deviation === 'O') return false;
    if (fStartFrom && r.startDate < fStartFrom) return false;
    if (fEndFrom   && r.endDate   < fEndFrom)   return false;
    return true;
  });

  const inputBase: React.CSSProperties = {
    padding: '6px 8px', fontSize: 12,
    border: '1px solid var(--border-primary)', borderRadius: 7,
    background: 'var(--input-bg)', color: 'var(--text-primary)',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0,
      }}>
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
      <div style={{
        background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-secondary)',
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
          {activeBadges.length > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              width: 16, height: 16, borderRadius: '50%',
              background: '#00B050', color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{activeBadges.length}</span>
          )}
        </button>

        {/* 활성 필터 배지 */}
        {activeBadges.map(b => (
          <div key={b.label} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 8px 4px 10px',
            background: isDark ? 'rgba(0,176,80,0.15)' : '#edfaf3',
            border: '1px solid rgba(0,176,80,0.35)',
            borderRadius: 20, flexShrink: 0,
          }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#00B050', whiteSpace: 'nowrap' }}>{b.label}</span>
            <button onClick={b.onRemove} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', color: '#00B050', opacity: 0.7,
            }}>
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
            type="text" placeholder="Process / Product / Batch No / PO No 검색..."
            value={keyword} onChange={e => setKeyword(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 12.5, color: 'var(--text-primary)', width: 260, fontFamily: 'inherit',
            }}
          />
          {keyword && (
            <button onClick={() => setKeyword('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter panel (drop-down) ──────────────────────── */}
      <div style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : '#f7f8fa',
        borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none',
        overflow: 'hidden',
        maxHeight: filterOpen ? '200px' : '0px',
        opacity: filterOpen ? 1 : 0,
        transition: 'max-height 260ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '14px 24px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap',
        }}>

          {/* ── Process select ─────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="Process" />
            <select
              value={fProcess} onChange={e => setFProcess(e.target.value)}
              style={{
                padding: '6px 28px 6px 10px', fontSize: 12.5,
                border: `1px solid ${fProcess ? '#00B050' : 'var(--border-primary)'}`,
                borderRadius: 8, background: fProcess ? (isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3') : 'var(--input-bg)',
                color: fProcess ? '#00B050' : 'var(--text-primary)',
                outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                appearance: 'none', WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
                minWidth: 90, colorScheme: isDark ? 'dark' : 'light',
                fontWeight: fProcess ? 600 : 400,
              } as React.CSSProperties}
            >
              <option value="">전체</option>
              <option value="충전">충전</option>
              <option value="조립">조립</option>
            </select>
          </div>

          {/* ── Product select ─────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="Product" />
            <select
              value={fProduct} onChange={e => setFProduct(e.target.value)}
              style={{
                padding: '6px 28px 6px 10px', fontSize: 12.5,
                border: `1px solid ${fProduct ? '#00B050' : 'var(--border-primary)'}`,
                borderRadius: 8, background: fProduct ? (isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3') : 'var(--input-bg)',
                color: fProduct ? '#00B050' : 'var(--text-primary)',
                outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                appearance: 'none', WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
                minWidth: 160, colorScheme: isDark ? 'dark' : 'light',
                fontWeight: fProduct ? 600 : 400,
              } as React.CSSProperties}
            >
              <option value="">전체</option>
              {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* ── Batch No ───────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="Batch No" />
            <input
              type="text" value={fBatchNo} onChange={e => setFBatchNo(e.target.value)}
              placeholder="입력..."
              style={{
                ...inputBase, width: 110,
                border: `1px solid ${fBatchNo ? '#00B050' : 'var(--border-primary)'}`,
                background: fBatchNo ? (isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3') : 'var(--input-bg)',
                color: fBatchNo ? '#00B050' : 'var(--text-primary)',
              }}
            />
          </div>

          {/* ── Deviation ──────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="Deviation" />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', height: 32 }}>
              {([['all', '전체'], ['yes', 'Yes'], ['no', 'No']] as const).map(([val, lbl]) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                  <input type="radio" name="dev_filter" value={val}
                    checked={fDeviation === val}
                    onChange={() => setFDeviation(val)}
                    style={{ accentColor: '#00B050', width: 13, height: 13, cursor: 'pointer' }} />
                  <span style={{
                    fontSize: 12.5,
                    color: val === 'yes' ? '#dc2626' : 'var(--text-primary)',
                    fontWeight: val === 'yes' ? 600 : 400,
                  }}>{lbl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Start Date ─────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="Start Date" />
            <input type="date" value={fStartFrom} onChange={e => setFStartFrom(e.target.value)}
              style={{ ...dateInputStyle(isDark), flex: 'none', width: 130 }} />
          </div>

          {/* ── End Date ───────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="End Date" />
            <input type="date" value={fEndFrom} onChange={e => setFEndFrom(e.target.value)}
              style={{ ...dateInputStyle(isDark), flex: 'none', width: 130 }} />
          </div>

          {/* ── 초기화 ─────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
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

      {/* ── Table ───────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, padding: '16px 24px 0', display: 'flex', flexDirection: 'column' }}>
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
              minWidth: COLS.reduce((a, c) => a + c.w, 0),
              width: '100%',
            }}>
              <colgroup>
                {COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}
              </colgroup>

              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
                  {COLS.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, ri) => {
                  const isDeviation = row.deviation === 'O';
                  const rowBg = ri % 2 === 1
                    ? (isDark ? 'rgba(255,255,255,0.015)' : '#fafbfc')
                    : 'transparent';

                  const cellStyle = (key: string): React.CSSProperties => ({
                    ...baseTD,
                    background: rowBg,
                    textAlign: key === 'product' || key === 'memo' ? 'left' : 'center',
                    color: key === 'process' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: key === 'process' || key === 'batchNo' ? 600 : 400,
                  });

                  return (
                    <tr
                      key={row.id}
                      style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'filter 80ms' }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.97)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                      {/* Process */}
                      <td style={cellStyle('process')}>
                        <span style={{
                          display: 'inline-block', padding: '2px 7px',
                          borderRadius: 5, fontSize: 11, fontWeight: 700,
                          background: row.process === '충전'
                            ? (isDark ? 'rgba(96,165,250,0.15)' : '#eff6ff')
                            : (isDark ? 'rgba(0,176,80,0.15)' : '#f0faf4'),
                          color: row.process === '충전' ? '#3b82f6' : '#00B050',
                        }}>
                          {row.process}
                        </span>
                      </td>

                      {/* Product */}
                      <td style={cellStyle('product')} title={row.product}>{row.product}</td>

                      {/* Batch No */}
                      <td style={cellStyle('batchNo')}>{row.batchNo}</td>

                      {/* Deviation — 해당 셀만 빨간색 */}
                      <td style={{
                        ...baseTD,
                        background: isDeviation
                          ? (isDark ? 'rgba(239,68,68,0.25)' : '#fecaca')
                          : rowBg,
                        textAlign: 'center',
                      }}>
                        {row.deviation === 'O' ? (
                          <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#fca5a5' : '#dc2626' }}>O</span>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>—</span>
                        )}
                      </td>

                      <td style={cellStyle('poNo')}>{row.poNo}</td>
                      <td style={cellStyle('납기')}>{row.납기}</td>
                      <td style={cellStyle('요청일')}>{row.요청일}</td>
                      <td style={cellStyle('startDate')}>{row.startDate}</td>
                      <td style={cellStyle('endDate')}>{row.endDate}</td>
                      <td style={cellStyle('coaComp')}>{row.coaComp || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                      <td style={cellStyle('coC')}>{row.coC || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                      <td style={cellStyle('출하패킷')}>{row.출하패킷 || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>

                      {/* DS 추적 */}
                      <td style={{ ...cellStyle('ds'), background: rowBg }}>
                        {row.dsLots.length > 0 ? (
                          <button
                            onClick={() => setPopupRow(row)}
                            title="DS 추적 보기"
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                              borderRadius: 6, display: 'inline-flex', alignItems: 'center',
                              color: 'var(--brand-primary)', transition: 'background 120ms',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,176,80,0.12)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                          >
                            <ZoomIn size={15} strokeWidth={2} />
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>—</span>
                        )}
                      </td>

                      <td style={cellStyle('shipDate')}>
                        {row.shipDate === '-' ? <span style={{ color: 'var(--text-tertiary)' }}>—</span> : row.shipDate}
                      </td>
                      <td style={cellStyle('sampling')}>{row.sampling || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                      <td style={{ ...cellStyle('memo'), color: 'var(--text-tertiary)' }}>{row.memo || ''}</td>
                    </tr>
                  );
                })}

                {/* 빈 행 */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ borderBottom: '1px solid var(--border-secondary)', height: 34 }}>
                    {COLS.map(c => <td key={c.key} style={{ ...baseTD, color: 'transparent' }}>—</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Bottom action bar ───────────────────────────── */}
      <div style={{
        margin: '0 24px 20px', padding: '10px 18px',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderTop: '1px solid var(--border-secondary)',
        borderRadius: '0 0 14px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 8, flexShrink: 0,
      }}>
        {[{ label: 'Download', icon: <Download size={13} /> }, { label: 'Upload', icon: <Upload size={13} /> }].map(btn => (
          <button key={btn.label} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'var(--surface-bg)', border: '1px solid var(--border-primary)',
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {btn.icon}{btn.label}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: 'var(--brand-primary)', border: 'none',
          borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Save size={13} /> Save
        </button>
      </div>

      {/* DS 추적 Popup */}
      {popupRow && <DsPopup row={popupRow} onClose={() => setPopupRow(null)} isDark={isDark} />}
    </div>
  );
}