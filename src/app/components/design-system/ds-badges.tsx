import { X } from 'lucide-react';
import { PageTitle, PreviewBox, PropsTable, CodeBlock, Divider, SubSection, TokenBadge } from './ds-primitives';

// ─── Badge variants config ────────────────────────────────────────────────────
const BADGE_VARIANTS = [
  { variant: 'default', label: 'Default', bg: '#F0F0F6', color: '#717182', border: '#E0E0EA' },
  { variant: 'success', label: 'Success', bg: '#EDFAF1', color: '#1A7F3C', border: '#86DFAA' },
  { variant: 'warning', label: 'Warning', bg: '#FFFBEB', color: '#92400E', border: '#FCD34D' },
  { variant: 'danger', label: 'Danger', bg: '#FFF1F2', color: '#9F1239', border: '#FDA4AF' },
  { variant: 'brand', label: 'Brand', bg: '#E8F8EF', color: '#00B050', border: '#C8ECD8' },
  { variant: 'secondary', label: 'Secondary', bg: '#F5F5FA', color: '#5a5a7a', border: '#E0E0EA' },
];

// CELLTRION-specific status badges
const STATUS_BADGES = [
  { status: 'In Progress', bg: '#EBF5FF', color: '#1D6FA4', border: '#90CAEF' },
  { status: 'Closed', bg: '#F0F0F6', color: '#717182', border: '#E0E0EA' },
  { status: 'Finished', bg: '#EDFAF1', color: '#1A7F3C', border: '#86DFAA' },
  { status: 'Deviation', bg: '#FFF4ED', color: '#C05621', border: '#FBD38D' },
  { status: 'New', bg: '#F3F0FF', color: '#5250F3', border: '#C4B5FD' },
  { status: 'Pending', bg: '#FFFBEB', color: '#92400E', border: '#FCD34D' },
  { status: 'Cancelled', bg: '#FFF1F2', color: '#9F1239', border: '#FDA4AF' },
];

function Badge({
  label,
  bg,
  color,
  border,
  size = 'md',
  removable = false,
}: {
  label: string;
  bg: string;
  color: string;
  border: string;
  size?: 'md' | 'sm';
  removable?: boolean;
}) {
  const padding = size === 'sm' ? 'px-sm py-xs' : 'px-md py-xs';
  const fontSize = size === 'sm' ? '11px' : '12px';
  return (
    <span
      className={`inline-flex items-center gap-xs rounded-corner-md font-medium ${padding}`}
      style={{ background: bg, color, border: `1px solid ${border}`, fontSize, lineHeight: 1.4 }}
    >
      {label}
      {removable && (
        <button
          className="hover:opacity-70 transition-opacity"
          style={{ color }}
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}

export function DsBadges() {
  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="COMPONENTS"
        title="Badge"
        description="상태 레이블, 카테고리 태그, 카운터에 사용합니다. Badge는 label prop으로 텍스트를 전달합니다 — children이 아닙니다. 8px 반경(rounded-corner-md)이 기본입니다."
      />

      {/* Semantic Variants */}
      <SubSection title="Semantic Variants" description="시맨틱 상태에 따른 6가지 기본 변형">
        <PreviewBox>
          <div className="flex flex-col gap-xl w-full">
            <div className="flex flex-col gap-md">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>STANDARD SIZE</div>
              <div className="flex flex-wrap items-center gap-md">
                {BADGE_VARIANTS.map((v) => (
                  <Badge key={v.variant} label={v.label} bg={v.bg} color={v.color} border={v.border} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-md">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>SMALL SIZE</div>
              <div className="flex flex-wrap items-center gap-md">
                {BADGE_VARIANTS.map((v) => (
                  <Badge key={v.variant} label={v.label} bg={v.bg} color={v.color} border={v.border} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </PreviewBox>

        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
          <div
            className="grid px-xl py-sm border-b border-border-secondary"
            style={{ gridTemplateColumns: '1fr 1fr 1fr', background: '#F0F0F6' }}
          >
            {['Variant', 'Use for', 'Token'].map((h) => (
              <span key={h} style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#717182', fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {[
            { v: 'default', use: 'Neutral status, general labels', note: 'bg-bg-faint border-border-secondary' },
            { v: 'success', use: 'Active, complete, approved', note: 'bg-[#EDFAF1] border-[#86DFAA]' },
            { v: 'warning', use: 'Attention needed, pending', note: 'bg-[#FFFBEB] border-[#FCD34D]' },
            { v: 'danger', use: 'Error, failed, blocked', note: 'bg-[#FFF1F2] border-[#FDA4AF]' },
            { v: 'brand', use: 'Featured, promoted, brand highlight', note: 'bg-brand-tertiary border-brand-secondary' },
            { v: 'secondary', use: 'Low-emphasis, muted labels', note: 'bg-surface-secondary-bg' },
          ].map((row, i, arr) => (
            <div
              key={row.v}
              className="grid items-center px-xl py-md"
              style={{ gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f6' : 'none' }}
            >
              <TokenBadge token={`variant="${row.v}"`} />
              <div className="text-video-title text-text-secondary">{row.use}</div>
              <code className="text-video-title" style={{ color: '#7C3AED', fontFamily: 'monospace', fontSize: '11px' }}>{row.note}</code>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="CELLTRION STATUS" />

      {/* CELLTRION Status Badges */}
      <SubSection title="CELLTRION Status Badges" description="Batch / Deviation / Order 상태에 특화된 배지 세트">
        <PreviewBox>
          <div className="flex flex-wrap items-center gap-md">
            {STATUS_BADGES.map((s) => (
              <Badge key={s.status} label={s.status} bg={s.bg} color={s.color} border={s.border} />
            ))}
          </div>
        </PreviewBox>

        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
          <div
            className="grid px-xl py-sm border-b border-border-secondary"
            style={{ gridTemplateColumns: '160px 1fr 1fr', background: '#F0F0F6' }}
          >
            {['Status', 'Context', 'Colors'].map((h) => (
              <span key={h} style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#717182', fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {[
            { status: 'In Progress', ctx: 'Batch 진행 중, 처리 중인 주문', colors: '#1D6FA4 / #EBF5FF' },
            { status: 'Closed', ctx: 'Deviation 종료, 완결된 케이스', colors: '#717182 / #F0F0F6' },
            { status: 'Finished', ctx: 'Batch 완료, 공정 완료', colors: '#1A7F3C / #EDFAF1' },
            { status: 'Deviation', ctx: 'Deviation 발생, 이탈 상태', colors: '#C05621 / #FFF4ED' },
            { status: 'New', ctx: '신규 알림, 미확인 항목', colors: '#5250F3 / #F3F0FF' },
            { status: 'Pending', ctx: '승인 대기, 처리 예정', colors: '#92400E / #FFFBEB' },
          ].map(({ status, ctx, colors }, i, arr) => {
            const badge = STATUS_BADGES.find((b) => b.status === status)!;
            return (
              <div
                key={status}
                className="grid items-center px-xl py-md"
                style={{ gridTemplateColumns: '160px 1fr 1fr', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f6' : 'none' }}
              >
                <Badge label={status} bg={badge.bg} color={badge.color} border={badge.border} />
                <div className="text-video-title text-text-secondary">{ctx}</div>
                <div className="text-video-title text-text-tertiary">{colors}</div>
              </div>
            );
          })}
        </div>
      </SubSection>

      <Divider label="REMOVABLE TAGS" />

      <SubSection title="Removable Filter Tags" description="필터 값 표시 + 제거 가능한 태그 패턴">
        <PreviewBox>
          <div className="flex flex-wrap items-center gap-md">
            {['CT-P13 120mg', 'PFS', 'US', '2026.01 Y', 'Charge'].map((tag) => (
              <Badge
                key={tag}
                label={tag}
                bg="#E8F8EF"
                color="#00B050"
                border="#C8ECD8"
                removable
              />
            ))}
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="PROPS" />

      <PropsTable
        props={[
          { name: 'label', required: true, type: 'string', desc: '배지 텍스트 — children이 아닌 prop으로 전달합니다.' },
          { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger' | 'brand' | 'secondary'", default: "'default'", desc: '시각적 변형.' },
          { name: 'removable', type: 'boolean', default: 'false', desc: 'X 버튼 표시 — 필터 태그에 사용.' },
          { name: 'onRemove', type: '() => void', desc: 'removable이 true일 때 X 클릭 핸들러.' },
          { name: 'className', type: 'string', desc: '추가 CSS 클래스.' },
        ]}
      />

      <Divider label="CODE" />

      <CodeBlock code={`import { Badge } from '@figma/astraui'

// ✅ Correct — label prop 사용
<Badge label="Active" variant="success" />
<Badge label="Draft" variant="default" />
<Badge label="Deviation" variant="warning" />
<Badge label="AI Enhanced" variant="brand" />

// Removable filter tag
<Badge label="CT-P13" variant="brand" removable onRemove={() => removeFilter()} />

// ❌ Wrong — children 사용
<Badge>Active</Badge>`} />
    </div>
  );
}
