import { useState } from 'react';
import { Link2, ChevronDown, ChevronUp, Search, Download, Filter } from 'lucide-react';
import { PageTitle, Divider, SubSection, CodeBlock, TokenBadge } from './ds-primitives';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusCell({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    'In Progress': { bg: '#EBF5FF', color: '#1D6FA4', border: '#90CAEF' },
    'Closed':      { bg: '#F0F0F6', color: '#717182', border: '#E0E0EA' },
    'Finished':    { bg: '#EDFAF1', color: '#1A7F3C', border: '#86DFAA' },
    'Deviation':   { bg: '#FFF4ED', color: '#C05621', border: '#FBD38D' },
    'New':         { bg: '#F3F0FF', color: '#5250F3', border: '#C4B5FD' },
  };
  const s = styles[status] || styles['Closed'];
  return (
    <span
      className="inline-flex items-center px-sm py-xs rounded-corner-sm text-video-title font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: '11px' }}
    >
      {status}
    </span>
  );
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const batchData = [
  { process: 'Charge', product: 'CT-P39 150mg', batch: '5LAP22', po: '4S00068840', start: 'Jan/22', end: 'Jan/25', status: 'In Progress' },
  { process: 'Charge', product: '유글리마 40mg', batch: '5LAP22T1', po: '4S00067172', start: 'Jan/21', end: 'Jan/22', status: 'In Progress' },
  { process: 'Assembly', product: '유글리마 40mg', batch: '5M5P24T1', po: '4S00067188', start: 'Jan/18', end: 'Jan/21', status: 'Deviation' },
  { process: 'Assembly', product: 'CT-P39 150mg S/Up', batch: '5B4P14T1', po: '4S00068625', start: 'Jan/09', end: 'Jan/18', status: 'In Progress' },
  { process: 'Assembly', product: '필아마 120mg 28G', batch: '5LJP03', po: '4S00067858', start: 'Jan/09', end: 'Jan/09', status: 'Finished' },
  { process: 'L&P', product: 'CT-P39 150mg', batch: '5B4P1ST3', po: '4S00068841', start: 'Jan/03', end: 'Jan/03', status: 'Finished' },
];

const deviationData = [
  { no: '19', process: 'Charge', product: 'CT-P39 150mg', batch: '5LAP22', po: '4S00068840', date: 'Jan/22/2026', status: 'In Progress' },
  { no: '18', process: 'Charge', product: '유글리마 40mg', batch: '5LAP22T1', po: '4S00067172', date: 'Jan/21/2026', status: 'Closed' },
  { no: '17', process: 'Assembly', product: '유글리마 40mg', batch: '5B4P14T1', po: '4S00068625', date: 'Jan/09/2026', status: 'Closed' },
  { no: '16', process: 'Assembly', product: '필아마 120mg 28G', batch: '5LJP03', po: '4S00067858', date: 'Jan/09/2026', status: 'Closed' },
];

export function DsDataTable() {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const toggleSort = (field: string) => {
    if (sortField === field) setDir();
    else { setSortField(field); setSortDir('asc'); }
  };
  const setDir = () => setSortDir((d) => d === 'asc' ? 'desc' : 'asc');

  const toggleRow = (i: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };
  const allSelected = selectedRows.size === batchData.length;
  const toggleAll = () => setSelectedRows(allSelected ? new Set() : new Set(batchData.map((_, i) => i)));

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-text-tertiary" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-brand-primary" />
      : <ChevronDown size={12} className="text-brand-primary" />;
  };

  const thCls = 'px-md py-sm text-left whitespace-nowrap border-r border-border-secondary last:border-0';
  const tdCls = 'px-md py-sm border-r border-border-secondary last:border-0';

  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="PATTERNS"
        title="Data Table"
        description="CELLTRION 대시보드의 핵심 패턴입니다. 헤더 카드, 스티키 thead, 상태 배지, 정렬, 행 선택, 페이지네이션, 액션 컬럼으로 구성됩니다."
      />

      {/* Full Featured Table */}
      <SubSection
        title="Full-Featured Table"
        description="정렬, 행 선택, 페이지네이션, 액션 컬럼이 포함된 완전한 테이블 패턴"
      >
        <div className="bg-surface-bg rounded-corner-lg border border-border-primary overflow-hidden">
          {/* Table header card */}
          <div className="flex items-center justify-between px-lg py-sm border-b border-border-primary bg-bg-faint">
            <div className="flex items-center gap-md">
              <h3 className="text-label text-text-primary font-semibold">Batch Progress Schedule</h3>
              <span
                className="text-video-title px-sm py-xs rounded-corner-full font-medium"
                style={{ background: '#e8f8ef', color: '#00B050', fontSize: '10px' }}
              >
                {batchData.length} rows
              </span>
            </div>
            <div className="flex items-center gap-md">
              <button className="flex items-center gap-xs px-md py-xs bg-surface-bg border border-border-primary rounded-corner-full text-label-sm text-text-secondary hover:bg-bg-hover transition-colors">
                <Filter size={13} />
                Filter
              </button>
              <button className="flex items-center gap-xs px-md py-xs bg-surface-bg border border-border-primary rounded-corner-full text-label-sm text-text-secondary hover:bg-bg-hover transition-colors">
                <Download size={13} />
                Export
              </button>
              <button className="px-lg py-xs bg-brand-primary text-on-brand text-label-sm rounded-corner-full hover:bg-brand-hover transition-colors">
                + 등록
              </button>
            </div>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto">
            <table className="w-full text-label-sm">
              <thead className="sticky top-0 bg-surface-bg border-b border-border-primary">
                <tr>
                  {/* Checkbox column */}
                  <th className="px-md py-sm w-10 border-r border-border-secondary">
                    <div
                      className={`w-4 h-4 rounded-corner-sm border flex items-center justify-center cursor-pointer transition-colors ${allSelected ? 'bg-brand-primary border-brand-primary' : 'bg-input-bg border-border-primary'}`}
                      onClick={toggleAll}
                    >
                      {allSelected && <span className="text-white text-xs" style={{ fontSize: '9px', lineHeight: 1 }}>✓</span>}
                    </div>
                  </th>
                  {[
                    { key: 'process', label: 'Process' },
                    { key: 'product', label: 'Product Name' },
                    { key: 'batch', label: 'Batch No.' },
                    { key: 'po', label: 'P/O No' },
                    { key: 'start', label: 'Start' },
                    { key: 'end', label: 'End' },
                    { key: 'status', label: 'Status' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className={`${thCls} font-medium text-text-primary cursor-pointer select-none`}
                      onClick={() => toggleSort(col.key)}
                    >
                      <div className="flex items-center gap-xs">
                        {col.label}
                        <SortIcon field={col.key} />
                      </div>
                    </th>
                  ))}
                  <th className="px-md py-sm text-center text-text-secondary w-10">
                    <Link2 size={13} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {batchData.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border-secondary transition-colors cursor-pointer ${selectedRows.has(i) ? 'bg-brand-tertiary' : 'hover:bg-bg-faint'}`}
                    onClick={() => toggleRow(i)}
                  >
                    <td className="px-md py-sm border-r border-border-secondary">
                      <div className={`w-4 h-4 rounded-corner-sm border flex items-center justify-center ${selectedRows.has(i) ? 'bg-brand-primary border-brand-primary' : 'bg-input-bg border-border-primary'}`}>
                        {selectedRows.has(i) && <span className="text-white" style={{ fontSize: '9px', lineHeight: 1 }}>✓</span>}
                      </div>
                    </td>
                    <td className={tdCls}>{row.process}</td>
                    <td className={tdCls} style={{ minWidth: '140px' }}>{row.product}</td>
                    <td className={`${tdCls} font-mono text-text-secondary`} style={{ fontSize: '12px' }}>{row.batch}</td>
                    <td className={`${tdCls} font-mono text-text-secondary`} style={{ fontSize: '12px' }}>{row.po}</td>
                    <td className={tdCls}>{row.start}</td>
                    <td className={tdCls}>{row.end}</td>
                    <td className={`${tdCls} text-center`} style={{ minWidth: '110px' }}>
                      <StatusCell status={row.status} />
                    </td>
                    <td className="px-md py-sm text-center">
                      <button className="text-text-tertiary hover:text-brand-primary transition-colors">
                        <Link2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-lg py-sm border-t border-border-primary bg-bg-faint">
            <div className="text-video-title text-text-secondary">
              {selectedRows.size > 0 ? `${selectedRows.size}개 선택됨` : `총 ${batchData.length}개`}
            </div>
            <div className="flex items-center gap-xs">
              <button className="px-xs py-xs text-label-sm text-text-secondary hover:text-text-primary">{'‹'}</button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[28px] px-xs py-xs text-label-sm rounded-corner-sm transition-colors ${page === p ? 'bg-brand-primary text-on-brand font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'}`}
                >
                  {p}
                </button>
              ))}
              <button className="px-xs py-xs text-label-sm text-text-secondary hover:text-text-primary">{'›'}</button>
            </div>
          </div>
        </div>
      </SubSection>

      <Divider label="SIMPLE TABLE" />

      {/* Simple Table */}
      <SubSection title="Simple Table" description="헤더와 페이지네이션만 있는 기본 테이블">
        <div className="bg-surface-bg rounded-corner-lg border border-border-primary overflow-hidden">
          <div className="flex items-center justify-between px-lg py-sm border-b border-border-primary bg-bg-faint">
            <h3 className="text-label text-text-primary font-semibold">Deviation List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-label-sm">
              <thead className="sticky top-0 bg-surface-bg border-b border-border-primary">
                <tr>
                  {['No', 'Process', 'Product Name', 'Batch No.', 'P/O No', 'Date', 'Status', ''].map((h, i) => (
                    <th key={i} className={`${thCls} font-medium text-text-primary`}>
                      {h || <Link2 size={13} className="inline-block text-text-secondary" />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deviationData.map((row, i) => (
                  <tr key={i} className="border-b border-border-secondary hover:bg-bg-faint transition-colors">
                    <td className={`${tdCls} text-center`}>{row.no}</td>
                    <td className={tdCls}>{row.process}</td>
                    <td className={tdCls} style={{ minWidth: '130px' }}>{row.product}</td>
                    <td className={`${tdCls} font-mono text-text-secondary`} style={{ fontSize: '12px' }}>{row.batch}</td>
                    <td className={`${tdCls} font-mono text-text-secondary`} style={{ fontSize: '12px' }}>{row.po}</td>
                    <td className={tdCls}>{row.date}</td>
                    <td className={`${tdCls} text-center`}><StatusCell status={row.status} /></td>
                    <td className="px-md py-sm text-center">
                      <button className="text-text-tertiary hover:text-brand-primary transition-colors"><Link2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center gap-xs px-lg py-sm border-t border-border-primary bg-bg-faint">
            <button className="px-xs py-xs text-label-sm text-text-secondary">{'‹'}</button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button key={p} className={`min-w-[24px] px-xs py-xs text-label-sm ${p === 1 ? 'text-brand-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>{p}</button>
            ))}
            <button className="px-xs py-xs text-label-sm text-text-secondary">{'›'}</button>
          </div>
        </div>
      </SubSection>

      <Divider label="TOKEN REFERENCE" />

      <SubSection title="Token Reference" description="테이블 구성 요소별 토큰 사용">
        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
          {[
            { element: '테이블 카드 컨테이너', tokens: ['bg-surface-bg', 'rounded-corner-md', 'border border-border-primary'] },
            { element: '헤더/푸터 배경', tokens: ['bg-bg-faint'] },
            { element: '컬럼 헤더 텍스트', tokens: ['text-label-sm', 'text-text-primary', 'font-medium'] },
            { element: '셀 데이터 텍스트', tokens: ['text-label-sm', 'text-text-primary'] },
            { element: '행 구분선', tokens: ['border-b border-border-secondary'] },
            { element: '행 호버 상태', tokens: ['hover:bg-bg-faint'] },
            { element: '선택된 행', tokens: ['bg-brand-tertiary'] },
            { element: '컬럼 구분선', tokens: ['border-r border-border-secondary'] },
            { element: '페이지네이션 활성 페이지', tokens: ['bg-brand-primary', 'text-on-brand'] },
          ].map((row, i, arr) => (
            <div
              key={row.element}
              className="flex items-center gap-xl px-xl py-md"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #f0f0f6' : 'none' }}
            >
              <div className="text-label-sm text-text-primary" style={{ minWidth: '200px' }}>{row.element}</div>
              <div className="flex flex-wrap gap-xs">
                {row.tokens.map((t) => <TokenBadge key={t} token={t} />)}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="CODE" />

      <CodeBlock code={`// Table card shell
<div className="bg-surface-bg rounded-corner-md border border-border-primary overflow-hidden">
  {/* Header */}
  <div className="flex items-center justify-between px-lg py-sm border-b border-border-primary bg-bg-faint">
    <h3 className="text-label text-text-primary font-semibold">{title}</h3>
    {actionButton}
  </div>

  {/* Scrollable table */}
  <div className="overflow-auto max-h-[300px]">
    <table className="w-full">
      <thead className="sticky top-0 bg-surface-bg border-b border-border-primary">
        <tr>
          <th className="px-md py-sm text-left text-label-sm text-text-primary font-medium">Column</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border-secondary hover:bg-bg-faint transition-colors">
            <td className="px-md py-sm text-label-sm text-text-primary">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-center gap-xs px-lg py-sm border-t border-border-primary bg-bg-faint">
    <button>‹</button>
    {pages.map((p) => <button key={p} className={p === current ? 'bg-brand-primary text-on-brand rounded-corner-sm' : 'text-text-secondary'}>{p}</button>)}
    <button>›</button>
  </div>
</div>`} />
    </div>
  );
}
