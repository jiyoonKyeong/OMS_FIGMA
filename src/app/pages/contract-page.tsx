import { useState, useRef } from 'react';
import {
  Search, Download, Upload, Save,
  SlidersHorizontal, X, RotateCcw, FileText, Paperclip, CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

/* ── Types ───────────────────────────────────────────────── */
interface ContractRow {
  id: string;
  구분: string;
  계약서명: string;
  체결일: string;
  종료일: string;
  자동갱신: string;
  담당자: string;
}

interface Registration {
  fileName: string;
  detail: string;
  registeredAt: string; // "YYYY.MM.DD HH:mm"
}

/* ── Mock Data ───────────────────────────────────────────── */
const DATA: ContractRow[] = [
  { id: 'c01', 구분: '충전', 계약서명: '상업 공급 계약 (PFS 충전)',           체결일: '2022.02.01', 종료일: '2024.02.01', 자동갱신: '2년', 담당자: '김성환' },
  { id: 'c02', 구분: '충전', 계약서명: '상업 공급 계약 (PFS 충전) 1차 개정',  체결일: '2023.10.01', 종료일: '2025.10.01', 자동갱신: '2년', 담당자: '김성환' },
  { id: 'c03', 구분: '충전', 계약서명: '상업 공급 계약 (PFS 충전) 2차 개정',  체결일: '2023.12.01', 종료일: '2025.12.01', 자동갱신: '2년', 담당자: '김성환' },
  { id: 'c04', 구분: '조립', 계약서명: '상업 공급 계약 (조립/포장)',           체결일: '2021.06.01', 종료일: '2023.06.01', 자동갱신: '1년', 담당자: '이지현' },
  { id: 'c05', 구분: '조립', 계약서명: '상업 공급 계약 (조립/포장) 1차 개정', 체결일: '2023.05.15', 종료일: '2025.05.15', 자동갱신: '1년', 담당자: '이지현' },
  { id: 'c06', 구분: 'L&P', 계약서명: 'L&P 공급 기본 계약',                  체결일: '2022.09.01', 종료일: '2024.09.01', 자동갱신: '2년', 담당자: '박준호' },
  { id: 'c07', 구분: 'L&P', 계약서명: 'L&P 공급 기본 계약 1차 개정',          체결일: '2024.08.01', 종료일: '2026.08.01', 자동갱신: '2년', 담당자: '박준호' },
  { id: 'c08', 구분: '충전', 계약서명: '원료 공급 계약 (Bulk DS)',              체결일: '2020.03.01', 종료일: '2023.03.01', 자동갱신: '3년', 담당자: '김성환' },
  { id: 'c09', 구분: '조립', 계약서명: '품질 기술 협약서',                     체결일: '2021.11.01', 종료일: '2024.11.01', 자동갱신: '3년', 담당자: '최수민' },
  { id: 'c10', 구분: 'L&P', 계약서명: '라벨링·포장 서비스 계약',              체결일: '2023.04.01', 종료일: '2025.04.01', 자동갱신: '2년', 담당자: '최수민' },
];

const PROCESSES = ['충전', '조립', 'L&P'];
const MANAGERS  = ['김성환', '이지현', '박준호', '최수민'];

/* ── Helpers ─────────────────────────────────────────────── */
function now(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function tagColor(g: string) { return g === '충전' ? '#3b82f6' : g === '조립' ? '#00B050' : '#9333ea'; }
function tagBg(g: string, isDark: boolean) {
  return g === '충전'
    ? (isDark ? 'rgba(96,165,250,0.15)' : '#eff6ff')
    : g === '조립'
    ? (isDark ? 'rgba(0,176,80,0.15)' : '#f0faf4')
    : (isDark ? 'rgba(168,85,247,0.15)' : '#f5f0ff');
}

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

/* ─────────────────────────────────────────────────────────
   계약서 등록 모달
───────────────────────────────────────────────────────── */
function ContractUploadModal({
  row, isDark, existing, onRegister, onClose,
}: {
  row: ContractRow;
  isDark: boolean;
  existing?: Registration;
  onRegister: (reg: Registration) => void;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState(existing?.detail ?? '');
  const [file,   setFile]   = useState<File | null>(null);
  const fileRef             = useRef<HTMLInputElement>(null);

  // 표시할 파일명: 새로 선택했으면 그걸, 아니면 기존 등록 파일명
  const displayFileName = file?.name ?? existing?.fileName ?? null;

  const TH: React.CSSProperties = {
    padding: '8px 12px', fontSize: 11.5, fontWeight: 700, color: 'var(--text-tertiary)',
    background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f2f5',
    borderRight: '1px solid var(--border-secondary)',
    borderBottom: '2px solid var(--border-primary)',
    textAlign: 'center', whiteSpace: 'nowrap',
  };
  const TD: React.CSSProperties = {
    padding: '9px 12px', fontSize: 12.5,
    borderRight: '1px solid var(--border-secondary)',
    textAlign: 'center', whiteSpace: 'nowrap', color: 'var(--text-secondary)',
  };

  function handleSubmit() {
    const fileName = displayFileName ?? '(파일 없음)';
    onRegister({ fileName, detail, registeredAt: now() });
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 780, maxWidth: '96vw',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderRadius: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>

        {/* 헤더 */}
        <div style={{
          padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '2px solid var(--border-primary)',
          background: isDark ? 'rgba(255,255,255,0.03)' : '#f7f8fa',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            계약서 등록{existing ? ' (수정)' : ''}
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            display: 'flex', alignItems: 'center', borderRadius: 6, color: 'var(--text-tertiary)',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* 계약 정보 미니 테이블 */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ border: '1px solid var(--border-primary)', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 68 }} /><col /><col style={{ width: 100 }} />
                <col style={{ width: 100 }} /><col style={{ width: 82 }} />
                <col style={{ width: 78 }} /><col style={{ width: 110 }} />
              </colgroup>
              <thead>
                <tr>
                  {['구분','계약서명','체결일','종료일','자동 갱신','담당자','계약서 첨부'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: tagBg(row.구분, isDark), color: tagColor(row.구분) }}>{row.구분}</span>
                  </td>
                  <td style={{ ...TD, textAlign: 'left', color: '#00B050', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={13} style={{ color: '#00B050', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.계약서명}</span>
                    </div>
                  </td>
                  <td style={TD}>{row.체결일}</td>
                  <td style={TD}>{row.종료일}</td>
                  <td style={TD}>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3', color: '#00B050' }}>{row.자동갱신}</span>
                  </td>
                  <td style={{ ...TD, color: 'var(--text-primary)', fontWeight: 500 }}>{row.담당자}</td>
                  <td style={TD}>
                    <button onClick={() => fileRef.current?.click()} style={{
                      background: displayFileName ? (isDark ? 'rgba(0,176,80,0.15)' : '#edfaf3') : 'none',
                      border: `1px solid ${displayFileName ? '#00B050' : 'var(--border-primary)'}`,
                      cursor: 'pointer', borderRadius: 7,
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 9px', fontFamily: 'inherit',
                      fontSize: 11.5, fontWeight: 600,
                      color: displayFileName ? '#00B050' : 'var(--text-tertiary)',
                      transition: 'all 150ms', maxWidth: 100, overflow: 'hidden',
                    }}>
                      <Paperclip size={12} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayFileName
                          ? (displayFileName.length > 8 ? displayFileName.slice(0, 8) + '…' : displayFileName)
                          : '파일 선택'}
                      </span>
                    </button>
                    <input ref={fileRef} type="file" style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx,.hwp,.xlsx"
                      onChange={e => setFile(e.target.files?.[0] ?? null)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 계약 상세 내용 */}
        <div style={{ padding: '16px 22px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>계약 상세 내용</label>
          <textarea
            value={detail} onChange={e => setDetail(e.target.value)}
            placeholder="계약서의 주요 내용, 특이사항, 조건 등을 입력하세요..."
            style={{
              width: '100%', height: 130, resize: 'vertical',
              padding: '12px 14px', fontSize: 12.5,
              border: '1px solid var(--border-primary)', borderRadius: 10,
              background: 'var(--input-bg)', color: 'var(--text-primary)',
              outline: 'none', fontFamily: 'inherit', lineHeight: 1.7,
              boxSizing: 'border-box', transition: 'border-color 150ms',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,176,80,0.6)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
          />
          {existing && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              최종 등록일시: {existing.registeredAt}
            </span>
          )}
        </div>

        {/* 하단 액션 */}
        <div style={{
          padding: '12px 22px 18px', display: 'flex', justifyContent: 'flex-end', gap: 8,
          borderTop: '1px solid var(--border-secondary)',
        }}>
          <button onClick={onClose} style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 600,
            background: 'none', border: '1px solid var(--border-primary)', borderRadius: 10,
            color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >취소</button>
          <button onClick={handleSubmit} style={{
            padding: '9px 24px', fontSize: 13, fontWeight: 700,
            background: '#00B050', border: 'none', borderRadius: 10,
            color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >등록</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   계약서 상세 조회 모달
───────────────────────────────────────────────────────── */
function ContractDetailModal({
  row, isDark, reg, onEdit, onClose,
}: {
  row: ContractRow;
  isDark: boolean;
  reg: Registration;
  onEdit: () => void;
  onClose: () => void;
}) {
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
    letterSpacing: '0.04em', marginBottom: 4,
  };
  const valueStyle: React.CSSProperties = {
    fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500,
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 600, maxWidth: '96vw',
        background: 'var(--surface-bg)',
        border: '1px solid var(--border-primary)',
        borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>

        {/* 헤더 */}
        <div style={{
          padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '2px solid var(--border-primary)',
          background: isDark ? 'rgba(255,255,255,0.03)' : '#f7f8fa',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} color="#00B050" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>계약서 상세</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6, color: 'var(--text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* 본문 */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 계약 기본 정보 */}
          <div style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f7f8fa',
            border: '1px solid var(--border-secondary)',
            borderRadius: 12, padding: '16px 20px',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 20px',
          }}>
            <div>
              <div style={labelStyle}>구분</div>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: tagBg(row.구분, isDark), color: tagColor(row.구분) }}>{row.구분}</span>
            </div>
            <div style={{ gridColumn: '2 / 4' }}>
              <div style={labelStyle}>계약서명</div>
              <div style={{ ...valueStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={13} style={{ color: '#00B050', flexShrink: 0 }} />
                {row.계약서명}
              </div>
            </div>
            <div>
              <div style={labelStyle}>체결일</div>
              <div style={valueStyle}>{row.체결일}</div>
            </div>
            <div>
              <div style={labelStyle}>종료일</div>
              <div style={valueStyle}>{row.종료일}</div>
            </div>
            <div>
              <div style={labelStyle}>자동 갱신</div>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3', color: '#00B050' }}>{row.자동갱신}</span>
            </div>
            <div>
              <div style={labelStyle}>담당자</div>
              <div style={valueStyle}>{row.담당자}</div>
            </div>
          </div>

          {/* 첨부 파일 */}
          <div>
            <div style={labelStyle}>첨부 파일</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 9,
              background: isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3',
              border: '1px solid rgba(0,176,80,0.3)',
            }}>
              <Paperclip size={13} color="#00B050" />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#00B050' }}>{reg.fileName}</span>
            </div>
          </div>

          {/* 상세 내용 */}
          <div>
            <div style={labelStyle}>계약 상세 내용</div>
            <div style={{
              padding: '14px 16px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.75,
              color: 'var(--text-primary)',
              background: isDark ? 'rgba(255,255,255,0.03)' : '#fafbfc',
              border: '1px solid var(--border-secondary)',
              minHeight: 80, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {reg.detail || <span style={{ color: 'var(--text-tertiary)' }}>(상세 내용 없음)</span>}
            </div>
          </div>

          {/* 등록 일시 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              최종 등록: {reg.registeredAt}
            </span>
          </div>
        </div>

        {/* 하단 */}
        <div style={{
          padding: '12px 22px 18px', display: 'flex', justifyContent: 'flex-end', gap: 8,
          borderTop: '1px solid var(--border-secondary)',
        }}>
          <button onClick={onClose} style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 600,
            background: 'none', border: '1px solid var(--border-primary)', borderRadius: 10,
            color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
          }}>닫기</button>
          <button onClick={() => { onClose(); onEdit(); }} style={{
            padding: '9px 22px', fontSize: 13, fontWeight: 700,
            background: '#00B050', border: 'none', borderRadius: 10,
            color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
          }}>수정</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────── */
export function ContractPage() {
  const { isDark } = useTheme();

  const [filterOpen, setFilterOpen] = useState(false);
  const [keyword,    setKeyword]    = useState('');
  const [fProcess,   setFProcess]   = useState('');
  const [fManager,   setFManager]   = useState('');
  const [fName,      setFName]      = useState('');

  // 등록 state: rowId → Registration
  const [registrations, setRegistrations] = useState<Record<string, Registration>>({});

  // 모달 state
  const [uploadRow, setUploadRow]   = useState<ContractRow | null>(null); // 등록 모달
  const [detailRow, setDetailRow]   = useState<ContractRow | null>(null); // 상세 모달

  const resetFilters = () => { setFProcess(''); setFManager(''); setFName(''); };

  const badges: { label: string; onRemove: () => void }[] = [];
  if (fProcess) badges.push({ label: `구분: ${fProcess}`,   onRemove: () => setFProcess('') });
  if (fManager) badges.push({ label: `담당자: ${fManager}`, onRemove: () => setFManager('') });
  if (fName)    badges.push({ label: `계약명: ${fName}`,    onRemove: () => setFName('') });

  const rows = DATA.filter(r => {
    if (fProcess && r.구분 !== fProcess) return false;
    if (fManager && r.담당자 !== fManager) return false;
    if (fName    && !r.계약서명.includes(fName)) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (![r.구분, r.계약서명, r.담당자, r.체결일, r.종료일].some(v => v.toLowerCase().includes(kw))) return false;
    }
    return true;
  });

  function handleRegister(rowId: string, reg: Registration) {
    setRegistrations(prev => ({ ...prev, [rowId]: reg }));
  }

  const TH: React.CSSProperties = {
    padding: '9px 10px', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.03em', color: 'var(--text-tertiary)',
    borderRight: '1px solid var(--border-secondary)',
    textAlign: 'center', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, zIndex: 3,
    background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f2f5',
    userSelect: 'none',
  };
  const baseTD: React.CSSProperties = {
    padding: '8px 10px', fontSize: 12.5,
    color: 'var(--text-secondary)',
    borderRight: '1px solid var(--border-secondary)',
    whiteSpace: 'nowrap', textAlign: 'center',
  };
  const inputBase: React.CSSProperties = {
    padding: '6px 8px', fontSize: 12,
    border: '1px solid var(--border-primary)', borderRadius: 7,
    background: 'var(--input-bg)', color: 'var(--text-primary)',
    outline: 'none', fontFamily: 'inherit',
  };

  const COLS = [
    { key: '구분',     label: '구분',     w: 70  },
    { key: '계약서명', label: '계약서명', w: 320 },
    { key: '체결일',   label: '체결일',   w: 110 },
    { key: '종료일',   label: '종료일',   w: 110 },
    { key: '자동갱신', label: '자동 갱신', w: 90 },
    { key: '담당자',   label: '담당자',   w: 90  },
    { key: '파일',     label: '파일',     w: 70  },
    { key: '상세',     label: '상세',     w: 70  },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* 페이지 헤더 */}
      <div style={{
        background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0,
      }}>
        <div style={{
          padding: '13px 18px 11px', fontSize: 13, fontWeight: 700,
          color: 'var(--brand-primary)', borderBottom: '2px solid var(--brand-primary)',
          whiteSpace: 'nowrap',
        }}>
          계약서
        </div>
      </div>

      {/* 필터 툴바 */}
      <div style={{
        background: 'var(--surface-bg)',
        borderBottom: filterOpen ? 'none' : '1px solid var(--border-secondary)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
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

        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px',
          border: '1px solid var(--border-primary)', borderRadius: 10, background: 'var(--input-bg)',
        }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input type="text" placeholder="구분 / 계약서명 / 담당자 검색..."
            value={keyword} onChange={e => setKeyword(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12.5, color: 'var(--text-primary)', width: 220, fontFamily: 'inherit' }}
          />
          {keyword && (
            <button onClick={() => setKeyword('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 필터 패널 */}
      <div style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : '#f7f8fa',
        borderBottom: filterOpen ? '1px solid var(--border-secondary)' : 'none',
        overflow: 'hidden', maxHeight: filterOpen ? '120px' : '0px', opacity: filterOpen ? 1 : 0,
        transition: 'max-height 260ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease', flexShrink: 0,
      }}>
        <div style={{ padding: '14px 24px 16px', display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="구분" />
            <select value={fProcess} onChange={e => setFProcess(e.target.value)} style={{ ...selectStyle(!!fProcess, isDark), minWidth: 90 }}>
              <option value="">전체</option>
              {PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="담당자" />
            <select value={fManager} onChange={e => setFManager(e.target.value)} style={{ ...selectStyle(!!fManager, isDark), minWidth: 100 }}>
              <option value="">전체</option>
              {MANAGERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FilterLabel label="계약서명" />
            <input type="text" value={fName} onChange={e => setFName(e.target.value)} placeholder="입력..."
              style={{ ...inputBase, width: 180, border: `1px solid ${fName ? '#00B050' : 'var(--border-primary)'}`, background: fName ? (isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3') : 'var(--input-bg)', color: fName ? '#00B050' : 'var(--text-primary)' }}
            />
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'none', border: '1px solid var(--border-primary)', borderRadius: 7, fontSize: 12, color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit' }}>
              <RotateCcw size={11} /> 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 데이터 그리드 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '16px 24px 0' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: 'var(--surface-bg)', borderRadius: '14px 14px 0 0', border: '1px solid var(--border-primary)', borderBottom: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ height: '100%', overflowX: 'auto', overflowY: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: COLS.reduce((a, c) => a + c.w, 0), width: '100%' }}>
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
                  const rowBg = ri % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.015)' : '#fafbfc') : 'transparent';
                  const reg   = registrations[row.id];

                  return (
                    <tr key={row.id}
                      style={{ borderBottom: '1px solid var(--border-secondary)', transition: 'filter 80ms' }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.97)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                      {/* 구분 */}
                      <td style={{ ...baseTD, background: rowBg }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: tagBg(row.구분, isDark), color: tagColor(row.구분) }}>
                          {row.구분}
                        </span>
                      </td>

                      {/* 계약서명 */}
                      <td style={{ ...baseTD, background: rowBg, textAlign: 'left', color: 'var(--text-primary)', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <FileText size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.계약서명}</span>
                        </div>
                      </td>

                      <td style={{ ...baseTD, background: rowBg }}>{row.체결일}</td>
                      <td style={{ ...baseTD, background: rowBg }}>{row.종료일}</td>

                      {/* 자동갱신 */}
                      <td style={{ ...baseTD, background: rowBg }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: isDark ? 'rgba(0,176,80,0.12)' : '#edfaf3', color: '#00B050' }}>
                          {row.자동갱신}
                        </span>
                      </td>

                      <td style={{ ...baseTD, background: rowBg, color: 'var(--text-primary)', fontWeight: 500 }}>{row.담당자}</td>

                      {/* 파일 업로드 버튼 — 등록 완료 시 초록 체크 */}
                      <td style={{ ...baseTD, background: rowBg }}>
                        <button title={reg ? '재등록' : '파일 업로드'} onClick={() => setUploadRow(row)}
                          style={{
                            background: reg ? (isDark ? 'rgba(0,176,80,0.15)' : '#edfaf3') : 'none',
                            border: `1px solid ${reg ? 'rgba(0,176,80,0.4)' : 'transparent'}`,
                            cursor: 'pointer', padding: 5, borderRadius: 6,
                            display: 'inline-flex', alignItems: 'center',
                            color: reg ? '#00B050' : 'var(--text-tertiary)',
                            transition: 'background 120ms, color 120ms',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,176,80,0.10)'; e.currentTarget.style.color = '#00B050'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = reg ? (isDark ? 'rgba(0,176,80,0.15)' : '#edfaf3') : 'none'; e.currentTarget.style.color = reg ? '#00B050' : 'var(--text-tertiary)'; }}
                        >
                          {reg ? <CheckCircle2 size={15} strokeWidth={2.2} /> : <Upload size={15} strokeWidth={2} />}
                        </button>
                      </td>

                      {/* 상세 버튼 — 등록된 경우에만 활성 */}
                      <td style={{ ...baseTD, background: rowBg }}>
                        <button title={reg ? '상세 보기' : '등록 후 확인 가능'} onClick={() => reg && setDetailRow(row)}
                          style={{
                            background: 'none', border: 'none', cursor: reg ? 'pointer' : 'default', padding: 5,
                            borderRadius: 6, display: 'inline-flex', alignItems: 'center',
                            color: reg ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                            opacity: reg ? 1 : 0.35,
                            transition: 'background 120ms, color 120ms',
                          }}
                          onMouseEnter={e => { if (reg) { e.currentTarget.style.background = 'rgba(0,176,80,0.10)'; e.currentTarget.style.color = '#00B050'; } }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = reg ? 'var(--text-secondary)' : 'var(--text-tertiary)'; }}
                        >
                          <Search size={15} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {Array.from({ length: Math.max(0, 12 - rows.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ borderBottom: '1px solid var(--border-secondary)', height: 38 }}>
                    {COLS.map(c => <td key={c.key} style={{ ...baseTD, color: 'transparent' }}>—</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 하단 액션바 */}
      <div style={{
        margin: '0 24px 20px', padding: '10px 18px',
        background: 'var(--surface-bg)', border: '1px solid var(--border-primary)',
        borderTop: '1px solid var(--border-secondary)', borderRadius: '0 0 14px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
      }}>
        {[{ label: 'Download', icon: <Download size={13} /> }, { label: 'Upload', icon: <Upload size={13} /> }].map(btn => (
          <button key={btn.label} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'var(--surface-bg)', border: '1px solid var(--border-primary)',
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >{btn.icon}{btn.label}</button>
        ))}
        <div style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 2px' }} />
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: '#00B050', border: 'none', borderRadius: 10,
          fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Save size={13} /> Save
        </button>
      </div>

      {/* 계약서 등록 모달 */}
      {uploadRow && (
        <ContractUploadModal
          row={uploadRow}
          isDark={isDark}
          existing={registrations[uploadRow.id]}
          onRegister={reg => handleRegister(uploadRow.id, reg)}
          onClose={() => setUploadRow(null)}
        />
      )}

      {/* 계약서 상세 모달 */}
      {detailRow && registrations[detailRow.id] && (
        <ContractDetailModal
          row={detailRow}
          isDark={isDark}
          reg={registrations[detailRow.id]}
          onEdit={() => setUploadRow(detailRow)}
          onClose={() => setDetailRow(null)}
        />
      )}
    </div>
  );
}
