import { useState, useRef } from 'react';
import {
  Search, Download, Upload, Save, Plus,
  SlidersHorizontal, ChevronDown, X, RotateCcw,
  ChevronLeft, ChevronRight as ChevronRightIcon,
  ZoomIn,
  Trash2,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { useNavigate, useLocation } from 'react-router';

/* ── Plan 탭 목록 ─────────────────────────────────────── */
const PLAN_TABS = [
  { label: '충전/AI FCST',        path: '/plan/ai-fcst' },
  { label: '조립/포장 FCST',      path: '/plan/assembly-fcst' },
  { label: '조립/포장 요약 FCST', path: '/plan/assembly-summary' },
  { label: 'L&P FCST',            path: '/plan/lp-fcst' },
  { label: 'L&P 요약 FCST',       path: '/plan/lp-summary' },
  { label: 'PO 관리',             path: '/plan/po' },
];

/* ── Column definitions ──────────────────────────────── */
const COLUMNS = [
  { key: 'poNo',           label: 'PO No',          width: 110, align: 'left' as const },
  { key: 'process',        label: 'Process',        width: 70,  align: 'center' as const },
  { key: 'product',        label: 'Product',        width: 130, align: 'left' as const },
  { key: 'batchSize',      label: '배치 사이즈',     width: 90,  align: 'right' as const },
  { key: 'formulation',    label: '제형',            width: 70,  align: 'center' as const },
  { key: 'step',           label: '공정',            width: 80,  align: 'center' as const },
  { key: 'country',        label: '국가',            width: 50,  align: 'center' as const },
  { key: 'pack',           label: 'Pack',           width: 50,  align: 'center' as const },
  { key: 'orderQty',       label: '발주수량',        width: 90,  align: 'right' as const },
  { key: 'unitPrice',      label: '발주단가',        width: 90,  align: 'right' as const },
  { key: 'orderAmount',    label: '발주금액',        width: 110, align: 'right' as const },
  { key: 'mfRequestDate',  label: 'M/F 요청일',     width: 100, align: 'center' as const },
  { key: 'shipQty',        label: '출하 수량',       width: 80,  align: 'right' as const },
  { key: 'shipAmount',     label: '출하 금액',       width: 110, align: 'right' as const },
  { key: 'deliveryDueDate',label: '배송 예정 일자',   width: 100, align: 'center' as const },
  { key: 'deliveryDoneDate',label:'배송 완료 일자',   width: 100, align: 'center' as const },
  { key: 'invoiceIssued',  label: 'Invoice 발행',   width: 90,  align: 'center' as const },
  { key: 'invoiceFile',    label: '인보이스 파일',    width: 90,  align: 'center' as const },
  { key: 'batchStatus',    label: '배치 현황',       width: 80,  align: 'center' as const },
  { key: 'memo',           label: 'Memo',           width: 150, align: 'left' as const },
];

/* ── Types ────────────────────────────────────────────── */
type PORow = {
  poNo: string; process: string; product: string; batchSize: number | null;
  formulation: string; step: string; country: string; pack: number | null;
  orderQty: number; unitPrice: number; orderAmount: number;
  mfRequestDate: string; shipQty: number; shipAmount: number;
  deliveryDueDate: string; deliveryDoneDate: string;
  invoiceIssued: number; invoiceFile: boolean; batchStatus: boolean;
  memo: string;
};

/* ── Mock data ────────────────────────────────────────── */
const mockData: PORow[] = [
  {
    poNo: 'A0000001', process: '충전', product: 'CT-P13 120mg', batchSize: 20000,
    formulation: '', step: '', country: '', pack: null,
    orderQty: 35000, unitPrice: 1100, orderAmount: 20000000,
    mfRequestDate: '2026-03-25', shipQty: 19000, shipAmount: 16500000,
    deliveryDueDate: '2026-05-10', deliveryDoneDate: '2026-05-10',
    invoiceIssued: 0, invoiceFile: false, batchStatus: true, memo: '',
  },
  {
    poNo: 'A0000002', process: 'AI', product: 'CT-P17 25mg', batchSize: 20000,
    formulation: '', step: '', country: '', pack: null,
    orderQty: 35000, unitPrice: 1100, orderAmount: 20000000,
    mfRequestDate: '2026-03-25', shipQty: 19000, shipAmount: 16500000,
    deliveryDueDate: '2026-05-10', deliveryDoneDate: '2026-05-10',
    invoiceIssued: 0, invoiceFile: false, batchStatus: true, memo: '',
  },
  {
    poNo: 'A0000003', process: '충전', product: 'CT-P39 150mg', batchSize: null,
    formulation: 'PFS', step: '수동/충전', country: 'EU', pack: 1,
    orderQty: 100000, unitPrice: 3500, orderAmount: 250000000,
    mfRequestDate: '2026-01-25', shipQty: 99100, shipAmount: 242000000,
    deliveryDueDate: '2026-01-10', deliveryDoneDate: '2026-01-10',
    invoiceIssued: 5, invoiceFile: true, batchStatus: true, memo: '',
  },
  {
    poNo: 'A0000004', process: '충전', product: 'CT-P39 150mg', batchSize: null,
    formulation: 'AI', step: '수동 누적합', country: '', pack: 1,
    orderQty: 0, unitPrice: 0, orderAmount: 0,
    mfRequestDate: '2026-01-25', shipQty: 0, shipAmount: 0,
    deliveryDueDate: '2026-01-10', deliveryDoneDate: '2026-01-10',
    invoiceIssued: 0, invoiceFile: false, batchStatus: false, memo: '',
  },
  {
    poNo: 'A0000005', process: '충전', product: 'CT-P39 150mg', batchSize: null,
    formulation: 'PFS,L', step: '수동/누적합', country: 'CA', pack: 1,
    orderQty: 80000, unitPrice: 2500, orderAmount: 75000000,
    mfRequestDate: '2026-03-26', shipQty: 20000, shipAmount: 50000000,
    deliveryDueDate: '2026-03-30', deliveryDoneDate: '2026-09-01',
    invoiceIssued: 3, invoiceFile: true, batchStatus: false, memo: '',
  },
];

/* ── Filters ──────────────────────────────────────────── */
const FILTERS = [
  { key: 'requestMonth', label: '납기 요청 월',       options: ['전체','2025.11','2025.12','2026.01'] },
  { key: 'poNo',         label: 'PO No.',            options: ['전체','4500069625','A0000001','A0000002','A0000003'] },
  { key: 'process',      label: 'Process',           options: ['전체','충전','조립','포장','L&P'] },
  { key: 'formulation',  label: '제형 구분',          options: ['전체','PFS','PFS-S','AI','vial'] },
  { key: 'step',         label: '공정 구분',          options: ['전체','라벨링','AI 수동 라벨링','수동 라벨링','수동 카토닝'] },
  { key: 'country',      label: '국가 구분',          options: ['전체','CA','AU','TR','TW'] },
  { key: 'pack',         label: 'Pack 구분',         options: ['전체','1','2','3'] },
];

function fmt(v: number) { return v.toLocaleString('ko-KR'); }

/* ── Select ───────────────────────────────────────────── */
function Select({ label, options, value, onChange, isDark }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; isDark: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 110 }}>
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

/* ── Action Button ────────────────────────────────────── */
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

/* ── Mini Calendar Picker ─────────────────────────────── */
function MiniCalendar({ value, onChange, onClose }: {
  value: string; onChange: (v: string) => void; onClose: () => void;
}) {
  const today = new Date();
  const parsed = value ? new Date(value) : today;
  const [year, setYear] = useState(parsed.getFullYear());
  const [month, setMonth] = useState(parsed.getMonth());
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const selectedStr = value;
  const DAY_NAMES = ['일','월','화','수','목','금','토'];

  return (
    <div ref={calRef} style={{
      position: 'absolute', top: '100%', left: 0, zIndex: 10000,
      background: 'var(--surface-bg)', border: '1px solid var(--border-primary)',
      borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      padding: 12, width: 260, fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          {year}년 {month + 1}월
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}>
          <ChevronRightIcon size={16} />
        </button>
      </div>
      {/* Day names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginBottom: 2 }}>
        {DAY_NAMES.map((d, i) => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 10, fontWeight: 600, padding: '4px 0',
            color: i === 0 ? '#e74c3c' : i === 6 ? '#3498db' : 'var(--text-tertiary)',
          }}>{d}</div>
        ))}
      </div>
      {/* Days */}
      {weeks.map((w, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {w.map((d, di) => {
            if (d === null) return <div key={di} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = dateStr === selectedStr;
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <button key={di} onClick={() => { onChange(dateStr); onClose(); }} style={{
                width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: isSelected ? 700 : 400, border: 'none', cursor: 'pointer',
                borderRadius: '50%',
                background: isSelected ? 'var(--brand-primary)' : 'transparent',
                color: isSelected ? '#fff' : isToday ? 'var(--brand-primary)' : di === 0 ? '#e74c3c' : di === 6 ? '#3498db' : 'var(--text-primary)',
                outline: isToday && !isSelected ? '1.5px solid var(--brand-primary)' : 'none',
                fontFamily: 'inherit', transition: 'background 100ms',
              }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >{d}</button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ── Date Input with YYYY-MM-DD format ────────────────── */
function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    let formatted = '';
    if (raw.length <= 4) {
      formatted = raw;
    } else if (raw.length <= 6) {
      formatted = raw.slice(0, 4) + '-' + raw.slice(4);
    } else {
      formatted = raw.slice(0, 4) + '-' + raw.slice(4, 6) + '-' + raw.slice(6);
    }
    onChange(formatted);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder="YYYY-MM-DD"
      maxLength={10}
      style={{
        width: '100%', padding: '6px 6px', border: 'none', outline: 'none',
        background: 'transparent', fontSize: 12, color: 'var(--text-primary)',
        fontFamily: "'Noto Sans KR', sans-serif", textAlign: 'center',
      }}
    />
  );
}

/* ── 배치 현황 Popup (/report/ai DS 추적 스타일) ───────── */
function BatchStatusPopup({ row, onClose, isDark }: { row: PORow; onClose: () => void; isDark: boolean }) {
  const bdr = 'var(--border-primary)';
  const TH: React.CSSProperties = {
    padding: '8px 10px', fontSize: 11.5, fontWeight: 700,
    background: isDark ? 'rgba(0,176,80,0.12)' : '#e6f7ee',
    color: '#00B050', borderBottom: `1px solid ${bdr}`,
    borderRight: `1px solid ${bdr}`, whiteSpace: 'nowrap', textAlign: 'left',
  };
  const TD: React.CSSProperties = {
    padding: '8px 10px', fontSize: 12.5,
    color: 'var(--text-primary)', borderBottom: `1px solid ${bdr}`,
    borderRight: `1px solid ${bdr}`, whiteSpace: 'nowrap',
  };

  const detail = {
    batchStatus: row.batchStatus ? '포장' : '-',
    startDate: row.mfRequestDate || '-',
    endDate: row.deliveryDueDate || '-',
    coaComp: row.deliveryDoneDate || '-',
    shipPacket: row.shipQty ? String(row.shipQty) : '-',
    shipDate: row.deliveryDoneDate || '-',
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
        zIndex: 9999, minWidth: 940,
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
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>배치 현황</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: 2, borderRadius: 6,
          }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '16px 18px 20px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', border: `1px solid ${bdr}`, borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr>
                {['배치 현황', 'Product', 'Batch No', '배치 사이즈', '제형', '공정', '국가', 'Pack', 'Start Date', 'End Date', 'COA Comp.', '출하패킷전달', '선적 일자'].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={TD}>{detail.batchStatus}</td>
                <td style={TD}>{row.product}</td>
                <td style={TD}>{row.poNo}</td>
                <td style={TD}>{row.batchSize ? fmt(row.batchSize) : '-'}</td>
                <td style={TD}>{row.formulation || '-'}</td>
                <td style={TD}>{row.step || '-'}</td>
                <td style={TD}>{row.country || '-'}</td>
                <td style={TD}>{row.pack ?? '-'}</td>
                <td style={TD}>{detail.startDate}</td>
                <td style={TD}>{detail.endDate}</td>
                <td style={TD}>{detail.coaComp}</td>
                <td style={TD}>{detail.shipPacket}</td>
                <td style={{ ...TD, borderRight: 'none', fontWeight: 600, color: '#00B050' }}>{detail.shipDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ── PO Registration Modal ────────────────────────────── */
const MODAL_COLUMNS = [
  { key: 'process',      label: 'Process',    width: 80 },
  { key: 'product',      label: 'Product',    width: 120 },
  { key: 'batchSize',    label: '배치 사이즈', width: 90 },
  { key: 'formulation',  label: '제형',        width: 70 },
  { key: 'step',         label: '공정',        width: 80 },
  { key: 'country',      label: '국가',        width: 60 },
  { key: 'pack',         label: 'Pack',       width: 60 },
  { key: 'orderQty',     label: '발주수량',    width: 90 },
  { key: 'unitPrice',    label: '발주단가',    width: 90 },
  { key: 'orderAmount',  label: '발주금액',    width: 100 },
  { key: 'deliveryReq',  label: '납기 요청일', width: 100 },
  { key: 'invoiceAttach',label: '인보이스 첨부',width: 90 },
];

type ModalRow = Record<string, string>;

function emptyModalRow(): ModalRow {
  return { process: '', product: '', batchSize: '', formulation: '', step: '', country: '', pack: '', orderQty: '', unitPrice: '', orderAmount: '', deliveryReq: '', invoiceAttach: '' };
}

function toNum(v: string): number {
  const n = Number(v.replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
}

function poRowToModalRow(row: PORow): ModalRow {
  return {
    process: row.process ?? '',
    product: row.product ?? '',
    batchSize: row.batchSize ? String(row.batchSize) : '',
    formulation: row.formulation ?? '',
    step: row.step ?? '',
    country: row.country ?? '',
    pack: row.pack ? String(row.pack) : '',
    orderQty: row.orderQty ? String(row.orderQty) : '',
    unitPrice: row.unitPrice ? String(row.unitPrice) : '',
    orderAmount: row.orderAmount ? String(row.orderAmount) : '',
    deliveryReq: row.deliveryDueDate ?? '',
    invoiceAttach: row.invoiceFile ? '첨부됨' : '',
  };
}

function modalRowToPoRow(poNo: string, row: ModalRow, base?: PORow): PORow {
  return {
    poNo: poNo.trim(),
    process: row.process || base?.process || '',
    product: row.product || base?.product || '',
    batchSize: row.batchSize ? toNum(row.batchSize) : (base?.batchSize ?? null),
    formulation: row.formulation || base?.formulation || '',
    step: row.step || base?.step || '',
    country: row.country || base?.country || '',
    pack: row.pack ? toNum(row.pack) : (base?.pack ?? null),
    orderQty: row.orderQty ? toNum(row.orderQty) : (base?.orderQty ?? 0),
    unitPrice: row.unitPrice ? toNum(row.unitPrice) : (base?.unitPrice ?? 0),
    orderAmount: row.orderAmount ? toNum(row.orderAmount) : (base?.orderAmount ?? 0),
    mfRequestDate: base?.mfRequestDate ?? row.deliveryReq ?? '',
    shipQty: base?.shipQty ?? 0,
    shipAmount: base?.shipAmount ?? 0,
    deliveryDueDate: row.deliveryReq || base?.deliveryDueDate || '',
    deliveryDoneDate: base?.deliveryDoneDate ?? '',
    invoiceIssued: base?.invoiceIssued ?? 0,
    invoiceFile: row.invoiceAttach ? true : (base?.invoiceFile ?? false),
    batchStatus: base?.batchStatus ?? false,
    memo: base?.memo ?? '',
  };
}

function PoRegistrationModal({
  onClose, mode, initialPoNo, initialRows, onSubmit,
}: {
  onClose: () => void;
  mode: 'create' | 'edit';
  initialPoNo?: string;
  initialRows?: ModalRow[];
  onSubmit: (poNo: string, rows: ModalRow[]) => void;
}) {
  const [poNo, setPoNo] = useState(initialPoNo ?? '');
  const [rows, setRows] = useState<ModalRow[]>(() => initialRows && initialRows.length > 0 ? initialRows : Array.from({ length: 5 }, emptyModalRow));
  const [poFile, setPoFile] = useState<File | null>(null);
  const poFileRef = useRef<HTMLInputElement>(null);
  const invoiceRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const updateCell = (ri: number, key: string, val: string) => {
    setRows(prev => prev.map((r, i) => i === ri ? { ...r, [key]: val } : r));
  };
  const addRow = () => setRows(prev => [...prev, emptyModalRow()]);
  const removeRow = (ri: number) => { if (rows.length > 1) setRows(prev => prev.filter((_, i) => i !== ri)); };

  const handleSubmit = () => {
    if (!poNo.trim()) { alert('PO No를 입력해주세요.'); return; }
    onSubmit(poNo, rows);
    alert(`PO ${poNo} ${mode === 'edit' ? '수정' : '등록'}이 완료되었습니다. (${rows.length}건)`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '90%', maxWidth: 1100, maxHeight: '85vh',
        background: 'var(--surface-bg)', borderRadius: 16,
        border: '1px solid var(--border-primary)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: "'Noto Sans KR', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '2px solid var(--brand-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{mode === 'edit' ? 'PO 수정' : 'PO 등록'}</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)',
            display: 'flex', alignItems: 'center', padding: 4,
          }}><X size={18} /></button>
        </div>

        {/* PO No */}
        <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>PO No</label>
          <input value={poNo} onChange={e => setPoNo(e.target.value)} placeholder="PO 번호 입력" readOnly={mode === 'edit'}
            style={{
              padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 8,
              fontSize: 13, color: 'var(--text-primary)',
              background: mode === 'edit' ? 'var(--bg-faint)' : 'var(--input-bg)',
              outline: 'none', fontFamily: 'inherit', width: 200,
            }} />
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '0 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1050 }}>
            <thead>
              <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                {MODAL_COLUMNS.map(col => (
                  <th key={col.key} style={{
                    padding: '9px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
                    whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)',
                    textAlign: 'center', letterSpacing: '0.03em',
                    width: col.width,
                  }}>{col.label}</th>
                ))}
                <th style={{ width: 36, padding: '9px 4px', borderRight: 'none', background: 'var(--bg-faint)' }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  {MODAL_COLUMNS.map(col => (
                    <td key={col.key} style={{
                      padding: '4px 4px', borderRight: '1px solid var(--border-secondary)',
                    }}>
                      {col.key === 'invoiceAttach' ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                          <input ref={el => { invoiceRefs.current[ri] = el; }} type="file" style={{ display: 'none' }}
                            accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                            onChange={e => { if (e.target.files?.[0]) updateCell(ri, 'invoiceAttach', e.target.files[0].name); e.target.value = ''; }} />
                          <button onClick={() => invoiceRefs.current[ri]?.click()} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-primary)',
                            display: 'flex', alignItems: 'center', gap: 4, padding: '4px',
                          }}>
                            <Upload size={14} />
                            {row.invoiceAttach && <span style={{ fontSize: 10, maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.invoiceAttach}</span>}
                          </button>
                        </div>
                      ) : col.key === 'deliveryReq' ? (
                        <DateInput value={row[col.key]} onChange={v => updateCell(ri, col.key, v)} />
                      ) : (
                        <input value={row[col.key]} onChange={e => updateCell(ri, col.key, e.target.value)}
                          style={{
                            width: '100%', padding: '6px 6px', border: 'none', outline: 'none',
                            background: 'transparent', fontSize: 12, color: 'var(--text-primary)',
                            fontFamily: 'inherit',
                          }} />
                      )}
                    </td>
                  ))}
                  <td style={{ padding: '4px 2px', textAlign: 'center' }}>
                    <button onClick={() => removeRow(ri)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: rows.length > 1 ? 'var(--text-tertiary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2,
                    }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add row */}
        <div style={{ padding: '8px 24px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={addRow} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '7px 16px',
            background: 'var(--surface-bg)', border: '1px solid var(--border-primary)',
            borderRadius: 8, fontSize: 12, fontWeight: 600,
            color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 150ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Plus size={13} /> 추가
          </button>
        </div>

        {/* PO 첨부 + Submit */}
        <div style={{
          padding: '14px 24px 18px', borderTop: '1px solid var(--border-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>PO 첨부</label>
            <input ref={poFileRef} type="file" style={{ display: 'none' }}
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
              onChange={e => { if (e.target.files?.[0]) setPoFile(e.target.files[0]); e.target.value = ''; }} />
            <button onClick={() => poFileRef.current?.click()} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
              background: 'var(--surface-bg)', border: '1px solid var(--border-primary)',
              borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Upload size={13} />
              {poFile ? poFile.name : '파일 선택'}
            </button>
            {poFile && (
              <button onClick={() => setPoFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>

          <button onClick={handleSubmit} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 24px',
            background: 'var(--brand-primary)', border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 700, color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {mode === 'edit' ? 'PO 수정' : 'PO 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export function PoManagementPage() {
  const [poRows, setPoRows] = useState<PORow[]>(mockData);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [activeTags,   setActiveTags]   = useState<string[]>([]);
  const [keyword,      setKeyword]      = useState('');
  const [page,         setPage]         = useState(1);
  const [poModal, setPoModal] = useState<{ mode: 'create' | 'edit'; poNo?: string } | null>(null);
  const [memoValues,   setMemoValues]   = useState<Record<number, string>>({});
  const [inputBatch, setInputBatch] = useState(false);
  const [inputQty, setInputQty] = useState(true);
  const [statusPopupRow, setStatusPopupRow] = useState<PORow | null>(null);
  const { isDark } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<number | null>(null);

  const handleFileUpload = (rowIndex: number) => {
    setUploadTarget(rowIndex);
    fileInputRef.current?.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget !== null) {
      alert(`"${file.name}" 파일이 PO ${poRows[uploadTarget]?.poNo}에 업로드되었습니다.`);
    }
    e.target.value = '';
    setUploadTarget(null);
  };

  const ROWS_PER_PAGE = 20;

  const filtered = poRows.filter(row => {
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (
        !row.poNo.toLowerCase().includes(kw) &&
        !row.product.toLowerCase().includes(kw) &&
        !row.process.toLowerCase().includes(kw)
      ) return false;
    }
    for (const tag of activeTags) {
      const fv = filterValues[tag];
      if (!fv || fv === '전체') continue;
      if (tag === 'requestMonth') {
        const month = row.deliveryDueDate ? row.deliveryDueDate.slice(0, 7) : '';
        if (month !== fv) return false;
        continue;
      }
      if (tag === 'pack') {
        if (String(row.pack ?? '') !== fv) return false;
        continue;
      }
      if ((row as any)[tag] !== fv) return false;
    }
    return true;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const visibleRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const activeCount = activeTags.length;

  const handleFilterChange = (key: string, val: string) => {
    setFilterValues(prev => ({ ...prev, [key]: val }));
    if (val !== '전체' && !activeTags.includes(key)) setActiveTags(prev => [...prev, key]);
    else if (val === '전체') setActiveTags(prev => prev.filter(t => t !== key));
  };
  const removeTag = (key: string) => {
    setFilterValues(prev => ({ ...prev, [key]: '전체' }));
    setActiveTags(prev => prev.filter(t => t !== key));
  };
  const resetAll = () => { setFilterValues({}); setActiveTags([]); setKeyword(''); setInputBatch(false); setInputQty(true); };

  const openEditModal = (poNo: string) => setPoModal({ mode: 'edit', poNo });
  const openCreateModal = () => setPoModal({ mode: 'create' });

  const submitPoModal = (poNo: string, rows: ModalRow[]) => {
    const validRows = rows.filter(r => Object.values(r).some(v => String(v ?? '').trim() !== ''));
    if (validRows.length === 0) return;
    setPoRows(prev => {
      if (poModal?.mode === 'edit') {
        const existing = prev.filter(r => r.poNo === poNo);
        const rebuilt = validRows.map((r, i) => modalRowToPoRow(poNo, r, existing[i]));
        return [...prev.filter(r => r.poNo !== poNo), ...rebuilt];
      }
      const created = validRows.map(r => modalRowToPoRow(poNo, r));
      return [...prev, ...created];
    });
  };

  const modalInitialRows =
    poModal?.mode === 'edit' && poModal.poNo
      ? poRows.filter(r => r.poNo === poModal.poNo).map(poRowToModalRow)
      : undefined;

  const minTableWidth = COLUMNS.reduce((s, c) => s + c.width, 0);

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
          const f = FILTERS.find(fi => fi.key === key);
          return (
            <span key={key} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px 4px 10px',
              background: 'var(--nav-active-bg)', border: '1px solid rgba(0,176,80,0.25)',
              borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: 'var(--brand-primary)',
            }}>
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

        {/* Keyword search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px',
          border: '1px solid var(--border-primary)', borderRadius: 10, background: 'var(--input-bg)',
        }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input type="text" placeholder="PO No / Product 검색..." value={keyword} onChange={e => setKeyword(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12.5, color: 'var(--text-primary)', width: 180, fontFamily: 'inherit' }} />
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
        maxHeight: filterOpen ? '170px' : '0px', opacity: filterOpen ? 1 : 0,
        transition: 'max-height 250ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
        borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none',
        flexShrink: 0,
      }}>
        <div style={{ padding: '14px 24px 16px', display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <Select key={f.key} label={f.label} options={f.options}
              value={filterValues[f.key] ?? '전체'} onChange={v => handleFilterChange(f.key, v)} isDark={isDark} />
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 140 }}>
            <label style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              인보이스 발행 여부
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 33 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="themed-checkbox"
                  checked={inputBatch}
                  onChange={e => setInputBatch(e.target.checked)}
                  style={{ width: 15, height: 15, cursor: 'pointer' }}
                />
                O
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="themed-checkbox"
                  checked={inputQty}
                  onChange={e => setInputQty(e.target.checked)}
                  style={{ width: 15, height: 15, cursor: 'pointer' }}
                />
                X
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
              minWidth: minTableWidth,
            }}>
              <colgroup>
                {COLUMNS.map(c => <col key={c.key} style={{ width: c.width }} />)}
              </colgroup>

              <thead>
                <tr style={{ background: 'var(--bg-faint)', borderBottom: '2px solid var(--border-primary)' }}>
                  {COLUMNS.map(col => (
                    <th key={col.key} style={{
                      padding: '8px 8px', textAlign: col.align,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: ['poNo','process','product'].includes(col.key) ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                      whiteSpace: 'nowrap', borderRight: '1px solid var(--border-secondary)',
                      userSelect: 'none',
                    }}>{col.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row, ri) => (
                  <tr key={ri}
                    style={{ borderBottom: '1px solid var(--border-secondary)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {COLUMNS.map(col => {
                      const val = (row as any)[col.key];
                      let display: React.ReactNode = '';

                      if (col.key === 'invoiceFile') {
                        display = (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <Upload size={15} style={{ color: 'var(--brand-primary)', cursor: 'pointer' }}
                              onClick={(e) => { e.stopPropagation(); handleFileUpload(ri); }} />
                          </div>
                        );
                      } else if (col.key === 'batchStatus') {
                        display = val ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setStatusPopupRow(row); }}
                              title="배치 현황 보기"
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
                          </div>
                        ) : null;
                      } else if (col.key === 'memo') {
                        const globalIdx = (page - 1) * ROWS_PER_PAGE + ri;
                        display = (
                          <input
                            value={memoValues[globalIdx] ?? row.memo}
                            onChange={e => setMemoValues(prev => ({ ...prev, [globalIdx]: e.target.value }))}
                            onClick={e => e.stopPropagation()}
                            placeholder="메모 입력"
                            style={{
                              width: '100%', padding: '4px 6px', border: 'none', outline: 'none',
                              background: 'transparent', fontSize: 12, color: 'var(--text-primary)',
                              fontFamily: 'inherit',
                            }}
                          />
                        );
                      } else if (col.key === 'invoiceIssued') {
                        display = val ? 'O' : 'X';
                      } else if (typeof val === 'number') {
                        display = val === 0 ? '' : fmt(val);
                      } else {
                        display = val ?? '';
                      }

                      return (
                        <td key={col.key} style={{
                          padding: '7px 8px', fontSize: 12,
                          fontWeight: ['poNo','process','product'].includes(col.key) ? 600 : 400,
                          color: val === '' || val === null || val === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                          textAlign: col.key === 'invoiceFile' || col.key === 'batchStatus' ? 'center' : col.align,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          borderRight: '1px solid var(--border-secondary)',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {col.key === 'poNo' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(String(val)); }}
                              style={{
                                background: 'none', border: 'none', padding: 0, margin: 0,
                                color: 'var(--brand-primary)', cursor: 'pointer',
                                font: 'inherit', fontWeight: 700, textDecoration: 'underline',
                              }}
                            >
                              {display}
                            </button>
                          ) : display}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Empty rows to fill the grid */}
                {Array.from({ length: Math.max(0, ROWS_PER_PAGE - visibleRows.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    {COLUMNS.map(col => (
                      <td key={col.key} style={{
                        padding: '7px 8px', fontSize: 12,
                        borderRight: '1px solid var(--border-secondary)',
                      }}>&nbsp;</td>
                    ))}
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
        {/* Pagination */}
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

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ActionBtn label="PO 등록" icon={<Plus size={13} />} primary onClick={openCreateModal} />
          <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
          <ActionBtn label="Download" icon={<Download size={13} />} />
          <ActionBtn label="Save"     icon={<Save size={13} />} primary />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={onFileSelected}
        accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
      />

      {/* PO Registration Modal */}
      {poModal && (
        <PoRegistrationModal
          onClose={() => setPoModal(null)}
          mode={poModal.mode}
          initialPoNo={poModal.poNo}
          initialRows={modalInitialRows}
          onSubmit={submitPoModal}
        />
      )}
      {statusPopupRow && (
        <BatchStatusPopup row={statusPopupRow} onClose={() => setStatusPopupRow(null)} isDark={isDark} />
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