import {
  Bell, Settings, ChevronDown, Filter, X, Package,
  ClipboardList, BarChart3, AlertTriangle, TrendingUp, TrendingDown,
} from 'lucide-react';
import { PageTitle, Divider, SubSection, CodeBlock, TokenBadge } from './ds-primitives';

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, change, up, icon, iconBg, iconColor,
}: {
  label: string; value: string; change: string; up: boolean;
  icon: React.ReactNode; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-corner-md flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <div
          className="flex items-center gap-xs text-video-title font-medium"
          style={{ color: up ? '#1A7F3C' : '#9F1239' }}
        >
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <div>
        <div className="text-heading text-text-primary font-semibold">{value}</div>
        <div className="text-video-title text-text-secondary mt-xs">{label}</div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ModalDemo() {
  return (
    <div
      className="rounded-corner-lg overflow-hidden border border-border-primary"
      style={{ width: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      <div className="flex items-center justify-between px-xl py-lg border-b border-border-primary bg-surface-bg">
        <div className="text-label text-text-primary font-semibold">Deviation 보고</div>
        <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-corner-md hover:bg-bg-hover">
          <X size={16} />
        </button>
      </div>
      <div className="p-xl flex flex-col gap-lg bg-surface-bg">
        {[
          { label: 'P/O No.', value: '4S00068840' },
          { label: 'Deviation 유형', value: 'Charge', select: true },
        ].map((f) => (
          <div key={f.label} className="flex flex-col gap-xs">
            <label className="text-label-sm text-text-secondary font-medium">{f.label}</label>
            <div className="relative">
              <input
                readOnly
                defaultValue={f.value}
                className="w-full px-md py-sm bg-input-bg border border-border-primary rounded-corner-md text-input text-text-primary"
              />
              {f.select && (
                <span className="absolute right-md top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                  <ChevronDown size={14} />
                </span>
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-xs">
          <label className="text-label-sm text-text-secondary font-medium">비고</label>
          <textarea
            rows={3}
            readOnly
            placeholder="내용을 입력하세요..."
            className="w-full px-md py-sm bg-input-bg border border-border-primary rounded-corner-md text-input text-text-primary resize-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-md px-xl py-lg border-t border-border-primary bg-surface-bg">
        <button className="inline-flex items-center px-xl py-sm bg-surface-bg text-text-primary text-label-sm border border-border-primary rounded-corner-full hover:bg-bg-hover">취소</button>
        <button className="inline-flex items-center px-xl py-sm bg-brand-primary text-on-brand text-label-sm rounded-corner-full hover:bg-brand-hover">저장</button>
      </div>
    </div>
  );
}

// ─── Toast demos ──────────────────────────────────────────────────────────────
const toastVariants = [
  { msg: 'Changes saved successfully', type: 'success', icon: '✓', bg: '#EDFAF1', color: '#1A7F3C', border: '#86DFAA' },
  { msg: 'Uploading batch data...', type: 'info', icon: '↑', bg: '#E8F8EF', color: '#00B050', border: '#C8ECD8' },
  { msg: 'Deviation detected in Lot 39488448', type: 'warning', icon: '!', bg: '#FFFBEB', color: '#92400E', border: '#FCD34D' },
  { msg: 'Connection failed — please retry', type: 'error', icon: '✕', bg: '#FFF1F2', color: '#9F1239', border: '#FDA4AF' },
];

export function DsPatterns() {
  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="PATTERNS"
        title="Page Patterns"
        description="CELLTRION 대시보드 페이지를 구성하는 주요 UI 패턴입니다. KPI 카드, 헤더 네비게이션, 필터 사이드바, 모달/다이얼로그, Toast 알림 등이 포함됩니다."
      />

      {/* KPI Cards */}
      <SubSection title="KPI Summary Cards" description="대시보드 상단 주요 지표 — 4개 카드 그리드 레이아웃">
        <div className="grid grid-cols-4 gap-lg">
          <KpiCard label="Total P/O Orders" value="1,247" change="+12.5%" up icon={<ClipboardList size={20} />} iconBg="#E8F8EF" iconColor="#00B050" />
          <KpiCard label="In Progress Batches" value="38" change="+3" up icon={<BarChart3 size={20} />} iconBg="#EBF5FF" iconColor="#1D6FA4" />
          <KpiCard label="Deviation Cases" value="7" change="-2" up={false} icon={<AlertTriangle size={20} />} iconBg="#FFF4ED" iconColor="#C05621" />
          <KpiCard label="Inventory (aDP)" value="145,938" change="-8.2%" up={false} icon={<Package size={20} />} iconBg="#EDFAF1" iconColor="#1A7F3C" />
        </div>

        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden mt-lg">
          {[
            { element: 'Card container', tokens: ['bg-surface-bg', 'rounded-corner-lg', 'border border-border-secondary', 'p-xl'] },
            { element: 'Icon container', tokens: ['w-10 h-10', 'rounded-corner-md', 'semantic bg/color'] },
            { element: 'Value text', tokens: ['text-heading', 'text-text-primary', 'font-semibold'] },
            { element: 'Label text', tokens: ['text-video-title', 'text-text-secondary'] },
            { element: 'Change indicator ▲', tokens: ['text-[#1A7F3C]', 'TrendingUp icon'] },
            { element: 'Change indicator ▼', tokens: ['text-[#9F1239]', 'TrendingDown icon'] },
          ].map((row, i, arr) => (
            <div key={row.element} className="flex items-center gap-xl px-xl py-md" style={{ borderBottom: i < arr.length - 1 ? '1px solid #f0f0f6' : 'none' }}>
              <div className="text-label-sm text-text-primary" style={{ minWidth: '180px' }}>{row.element}</div>
              <div className="flex flex-wrap gap-xs">
                {row.tokens.map((t) => <TokenBadge key={t} token={t} />)}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="HEADER NAVIGATION" />

      {/* Header Nav */}
      <SubSection title="Header Navigation" description="CELLTRION PHARMA 브랜드 헤더 — 로고, 네비게이션, 유저 메뉴">
        <div className="rounded-corner-lg overflow-hidden border border-border-secondary">
          <div className="bg-surface-bg border-b border-border-primary">
            <div className="flex items-center h-14 px-xl gap-2xl">
              <div className="flex items-center gap-xs">
                <div className="flex gap-xs">
                  <div className="w-6 h-6 rounded-corner-full" style={{ background: '#00B050' }} />
                  <div className="w-6 h-6 rounded-corner-full" style={{ background: '#00B050' }} />
                </div>
                <span className="text-label font-semibold text-text-primary ml-sm">CELLTRION PHARMA</span>
              </div>
              <nav className="flex items-center gap-md">
                {['Order Mgmt.', '계획 정보', '공급 정보', '레포트', '계약서'].map((item, i) => (
                  <span
                    key={item}
                    className={`text-label px-md py-xs cursor-pointer rounded-corner-md transition-colors ${i === 0 ? 'text-text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    {item}
                  </span>
                ))}
              </nav>
              <div className="ml-auto flex items-center gap-sm">
                <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-corner-md hover:bg-bg-hover">
                  <Bell size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-corner-md hover:bg-bg-hover">
                  <Settings size={16} />
                </button>
                <div className="w-8 h-8 rounded-corner-full bg-brand-primary text-on-brand flex items-center justify-center text-video-title font-semibold">
                  CP
                </div>
              </div>
            </div>
          </div>
          <div className="bg-bg-faint px-xl py-sm text-video-title text-text-tertiary text-center">
            ↑ Header preview — bg-surface-bg + border-b border-border-primary
          </div>
        </div>

        <CodeBlock code={`<header className="bg-surface-bg border-b border-border-primary">
  <div className="flex items-center h-14 px-xl gap-2xl">
    {/* Logo */}
    <div className="flex items-center gap-xs">
      <div className="flex gap-xs">
        <div className="w-6 h-6 rounded-corner-full bg-[#00B050]" />
        <div className="w-6 h-6 rounded-corner-full bg-[#00B050]" />
      </div>
      <span className="text-label font-semibold text-text-primary">CELLTRION PHARMA</span>
    </div>
    {/* Nav */}
    <nav className="flex items-center gap-lg">
      <Link className="text-label text-text-primary font-semibold">Active</Link>
      <Link className="text-label text-text-secondary hover:text-text-primary">Inactive</Link>
    </nav>
  </div>
</header>`} />
      </SubSection>

      <Divider label="FILTER SIDEBAR" />

      {/* Filter Sidebar */}
      <SubSection title="Filter Sidebar" description="주문 관리 페이지 필터 패널 — SelectField + InputField + 검색 버튼">
        <div className="flex gap-xl">
          <div
            className="bg-surface-bg border-r border-border-primary p-lg flex-shrink-0"
            style={{ width: '220px' }}
          >
            <div className="flex flex-col gap-lg">
              <div className="flex items-center justify-between">
                <div className="text-label-sm text-text-primary font-semibold flex items-center gap-xs">
                  <Filter size={14} />
                  Filters
                </div>
                <button className="text-video-title text-brand-primary hover:text-brand-hover">초기화</button>
              </div>
              {[
                { label: 'FCST 월', opts: ['2025.11 Y', '2025.12 Y'] },
                { label: 'Product', opts: ['CT-P13 120mg', 'CT-P39'] },
                { label: '제형 구분', opts: ['PFS', 'VIAL', 'A12-G'] },
                { label: '국가 구분', opts: ['US', 'EU', 'CA'] },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-xs">
                  <label className="text-video-title text-text-secondary font-medium">{f.label}</label>
                  <div className="relative">
                    <select className="w-full px-md py-xs bg-input-bg border border-border-primary rounded-corner-md text-video-title text-text-primary focus:outline-none appearance-none">
                      {f.opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <span className="absolute right-md top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                      <ChevronDown size={12} />
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-xs">
                <label className="text-video-title text-text-secondary font-medium">포장 방법</label>
                <div className="flex items-center gap-xs">
                  <input
                    type="text"
                    className="flex-1 px-md py-xs bg-input-bg border border-border-primary rounded-corner-md text-video-title text-text-primary focus:outline-none"
                  />
                  <button className="px-sm py-xs bg-surface-bg border border-border-primary rounded-corner-md text-label-sm text-text-secondary hover:bg-bg-hover">
                    🔍
                  </button>
                </div>
              </div>
              <button className="w-full px-lg py-sm bg-brand-primary text-on-brand text-label-sm rounded-corner-full hover:bg-brand-hover transition-colors">
                Search
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-sm">
            <div className="text-label-sm text-text-primary font-medium">Token usage</div>
            <div className="flex flex-col gap-xs">
              {[
                ['Sidebar bg', 'bg-surface-bg border-r border-border-primary'],
                ['Filter label', 'text-video-title text-text-secondary font-medium'],
                ['Select field', 'bg-input-bg border border-border-primary rounded-corner-md'],
                ['Search button', 'bg-brand-primary text-on-brand rounded-corner-full'],
              ].map(([el, t]) => (
                <div key={el} className="flex items-center gap-md p-md bg-bg-faint rounded-corner-md">
                  <span className="text-video-title text-text-secondary" style={{ minWidth: '120px' }}>{el}</span>
                  <TokenBadge token={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SubSection>

      <Divider label="MODAL / DIALOG" />

      {/* Modal */}
      <SubSection title="Modal / Dialog" description="집중 작업 다이얼로그 — surface-bg 카드 + modal-scrim 배경">
        <div className="flex gap-2xl items-start">
          <ModalDemo />
          <div className="flex flex-col gap-md">
            <div className="text-label-sm text-text-primary font-semibold">구조 & 토큰</div>
            <div className="flex flex-col gap-xs">
              {[
                ['Modal card', 'bg-surface-bg rounded-corner-lg'],
                ['Backdrop', 'bg-modal-scrim'],
                ['Header border', 'border-b border-border-primary'],
                ['Footer', 'border-t border-border-primary'],
                ['Cancel button', 'variant="neutral" — 왼쪽'],
                ['Save button', 'variant="primary" — 오른쪽'],
                ['Shadow', '0 8px 32px rgba(0,0,0,0.12)'],
              ].map(([el, t]) => (
                <div key={el} className="flex flex-col gap-xs p-md bg-bg-faint rounded-corner-md">
                  <div className="text-video-title text-text-secondary">{el}</div>
                  <TokenBadge token={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SubSection>

      <Divider label="TOAST / NOTIFICATION" />

      {/* Toast */}
      <SubSection title="Toast & Notification" description="비차단 알림 — 액션 확인, 업로드 진행 상황, 에러 표시">
        <div className="flex flex-col gap-md" style={{ maxWidth: '380px' }}>
          {toastVariants.map((t) => (
            <div
              key={t.type}
              className="flex items-center gap-md px-lg py-md rounded-corner-md border"
              style={{ background: t.bg, borderColor: t.border, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <span
                className="w-5 h-5 flex items-center justify-center rounded-corner-full flex-shrink-0 text-white font-bold"
                style={{ background: t.color, fontSize: '11px' }}
              >
                {t.icon}
              </span>
              <span className="text-label-sm flex-1 font-medium" style={{ color: t.color }}>{t.msg}</span>
              <button style={{ color: t.color, opacity: 0.6 }}><X size={14} /></button>
            </div>
          ))}
        </div>

        <CodeBlock code={`import { Toast } from '@figma/astraui'

// Upload progress
<Toast message="Uploading video..." progress={45} variant="default" showCancel onCancel={() => cancelUpload()} />

// Success
<Toast message="Changes saved" variant="success" progress={100} />

// Error
<Toast message="Upload failed" variant="error" showCancel={false} />`} />
      </SubSection>

      <Divider label="SURFACE LAYERING" />

      {/* Surface Layering */}
      <SubSection title="Surface Layering System" description="배경색 대비로 계층 구조를 표현합니다 — 테두리 없이 색상 대비만으로">
        <div
          className="relative rounded-corner-lg p-2xl overflow-hidden"
          style={{
            background: 'var(--brand-tertiary, #eaeaff)',
            minHeight: '180px',
          }}
        >
          <div className="text-video-title text-text-secondary mb-lg font-medium">
            bg-brand-tertiary — 페이지 캔버스 (항상 이 색상)
          </div>
          <div className="grid grid-cols-3 gap-lg">
            <div className="bg-surface-bg rounded-corner-lg p-lg">
              <div className="text-video-title text-text-secondary font-medium mb-md">bg-surface-bg — Card</div>
              <div className="bg-bg-faint rounded-corner-md p-md">
                <div className="text-video-title text-text-tertiary">bg-bg-faint — Recessed</div>
              </div>
            </div>
            <div className="bg-surface-bg rounded-corner-lg p-lg">
              <div className="text-video-title text-text-secondary font-medium mb-md">bg-surface-bg — Card</div>
              <div className="bg-bg-subtle rounded-corner-md p-md">
                <div className="text-video-title text-text-tertiary">bg-bg-subtle — Group</div>
              </div>
            </div>
            <div className="bg-surface-secondary-bg rounded-corner-lg p-lg border-r border-border-primary">
              <div className="text-video-title text-text-secondary font-medium">bg-surface-secondary-bg</div>
              <div className="text-video-title text-text-tertiary mt-xs">Secondary panel / nav</div>
            </div>
          </div>
        </div>
      </SubSection>
    </div>
  );
}
