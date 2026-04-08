import { useState } from 'react';
import {
  Plus, Download, Upload, ArrowRight, RefreshCw,
  Settings, X, Edit, Trash2, Search, Check,
} from 'lucide-react';
import { PageTitle, PreviewBox, PropsTable, CodeBlock, Divider, SubSection, TokenBadge } from './ds-primitives';

// ─── Reusable button styles ───────────────────────────────────────────────────
const btnBase = 'inline-flex items-center justify-center gap-sm transition-all font-medium rounded-corner-full';
const variants = {
  primary: 'bg-brand-primary text-on-brand hover:bg-brand-hover',
  neutral: 'bg-surface-bg text-text-primary border border-border-primary hover:bg-bg-hover',
  subtle: 'text-text-primary hover:bg-bg-hover',
};
const sizes = {
  medium: 'px-xl py-sm text-label',
  small: 'px-lg py-xs text-label-sm',
};

function Btn({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  iconStart,
  iconEnd,
  children,
}: {
  variant?: 'primary' | 'neutral' | 'subtle';
  size?: 'medium' | 'small';
  disabled?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      className={`${btnBase} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {iconStart && <span>{iconStart}</span>}
      {children}
      {iconEnd && <span>{iconEnd}</span>}
    </button>
  );
}

function IconBtn({
  variant = 'subtle',
  size = 'medium',
  icon,
}: {
  variant?: 'primary' | 'neutral' | 'subtle';
  size?: 'medium' | 'small';
  icon: React.ReactNode;
}) {
  const dim = size === 'medium' ? 'w-10 h-10' : 'w-8 h-8';
  return (
    <button className={`${dim} flex items-center justify-center rounded-corner-full transition-colors ${variants[variant]}`}>
      {icon}
    </button>
  );
}

export function DsButtons() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="COMPONENTS"
        title="Button"
        description="모든 인터랙티브 액션에 사용합니다. Button, IconButton, ButtonGroup, FavoriteButton 네 가지 컴포넌트가 있으며 항상 @figma/astraui에서 가져옵니다. Raw <button> 엘리먼트를 직접 사용하지 않습니다."
      />

      {/* Variants */}
      <SubSection title="Variants" description="한 섹션에 primary는 하나만 — neutral이 대부분의 보조 액션에 기본">
        <PreviewBox>
          <div className="flex flex-col gap-xl w-full">
            {/* Medium */}
            <div className="flex flex-col gap-md">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>MEDIUM (DEFAULT)</div>
              <div className="flex flex-wrap items-center gap-md">
                <Btn variant="primary">Primary</Btn>
                <Btn variant="neutral">Neutral</Btn>
                <Btn variant="subtle">Subtle</Btn>
                <Btn variant="primary" disabled>Disabled</Btn>
              </div>
            </div>
            {/* Small */}
            <div className="flex flex-col gap-md">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>SMALL</div>
              <div className="flex flex-wrap items-center gap-md">
                <Btn variant="primary" size="small">Primary</Btn>
                <Btn variant="neutral" size="small">Neutral</Btn>
                <Btn variant="subtle" size="small">Subtle</Btn>
                <Btn variant="neutral" size="small" disabled>Disabled</Btn>
              </div>
            </div>
          </div>
        </PreviewBox>

        <div className="grid grid-cols-3 gap-lg">
          {[
            { variant: 'primary', when: '~30% of buttons', use: 'Main CTA — one per visible section', cls: 'bg-brand-primary text-on-brand' },
            { variant: 'neutral', when: '~50% of buttons', use: '★ Default — supporting actions alongside primary', cls: 'bg-surface-bg border border-border-primary' },
            { variant: 'subtle', when: '~20% of buttons', use: 'Low-emphasis, text-like buttons', cls: 'transparent' },
          ].map((v) => (
            <div key={v.variant} className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg flex flex-col gap-sm">
              <TokenBadge token={`variant="${v.variant}"`} />
              <div className="text-video-title text-text-tertiary">{v.when}</div>
              <div className="text-video-title text-text-secondary">{v.use}</div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="WITH ICONS" />

      <SubSection title="With Icons" description="iconStart / iconEnd prop 사용 — leftIcon, rightIcon은 존재하지 않습니다. 아이콘은 항상 size={16}">
        <PreviewBox>
          <Btn variant="primary" iconStart={<Plus size={16} />}>Add Order</Btn>
          <Btn variant="neutral" iconStart={<Search size={16} />}>Search</Btn>
          <Btn variant="neutral" iconStart={<Download size={16} />}>Download</Btn>
          <Btn variant="neutral" iconStart={<Upload size={16} />}>Upload</Btn>
          <Btn variant="subtle" iconEnd={<ArrowRight size={16} />}>Next Step</Btn>
          <Btn variant="subtle" iconStart={<RefreshCw size={16} />}>Refresh</Btn>
        </PreviewBox>
      </SubSection>

      <Divider label="ICON BUTTON" />

      <SubSection title="IconButton" description="아이콘 전용 원형 버튼 — 텍스트 레이블 없이 아이콘만 표시. 항상 Tooltip과 함께 사용">
        <PreviewBox>
          <div className="flex flex-col gap-xl w-full">
            <div className="flex flex-col gap-md">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>MEDIUM (40×40)</div>
              <div className="flex items-center gap-md">
                <IconBtn variant="primary" icon={<Plus size={16} />} />
                <IconBtn variant="neutral" icon={<Settings size={16} />} />
                <IconBtn variant="subtle" icon={<X size={16} />} />
                <IconBtn variant="subtle" icon={<Edit size={16} />} />
                <IconBtn variant="subtle" icon={<Trash2 size={16} />} />
              </div>
            </div>
            <div className="flex flex-col gap-md">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>SMALL (32×32)</div>
              <div className="flex items-center gap-md">
                <IconBtn variant="primary" size="small" icon={<Plus size={14} />} />
                <IconBtn variant="neutral" size="small" icon={<Settings size={14} />} />
                <IconBtn variant="subtle" size="small" icon={<X size={14} />} />
              </div>
            </div>
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="BUTTON GROUP" />

      <SubSection title="ButtonGroup" description="관련 액션을 그룹으로 묶는 레이아웃 — 취소는 왼쪽(neutral), 저장은 오른쪽(primary)">
        <PreviewBox>
          <div className="flex flex-col gap-lg w-full">
            {/* align: end */}
            <div className="flex flex-col gap-sm">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>ALIGN: END (Form footer)</div>
              <div className="flex justify-end gap-md">
                <Btn variant="neutral">취소</Btn>
                <Btn variant="primary">저장</Btn>
              </div>
            </div>
            {/* align: start */}
            <div className="flex flex-col gap-sm">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>ALIGN: START (Toolbar actions)</div>
              <div className="flex gap-md">
                <Btn variant="primary" iconStart={<Search size={16} />}>Search</Btn>
                <Btn variant="neutral" iconStart={<Download size={16} />}>Export</Btn>
                <Btn variant="neutral" iconStart={<Upload size={16} />}>Import</Btn>
              </div>
            </div>
            {/* CELLTRION pattern */}
            <div className="flex flex-col gap-sm">
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0b8', fontWeight: 600 }}>CELLTRION PAGE FOOTER</div>
              <div className="flex justify-center gap-md">
                <Btn variant="primary" size="small">Search</Btn>
                <Btn variant="neutral" size="small">Data Field</Btn>
                <Btn variant="neutral" size="small">Download</Btn>
                <Btn variant="neutral" size="small">Upload</Btn>
                <Btn variant="primary" size="small">Save</Btn>
              </div>
            </div>
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="LOADING STATE" />

      <SubSection title="Loading / Async State" description="비동기 작업 중 버튼 상태 처리 패턴">
        <PreviewBox>
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
            disabled={loading}
            className={`inline-flex items-center gap-sm px-xl py-sm text-label rounded-corner-full transition-all ${
              loading ? 'bg-brand-primary/70 text-on-brand cursor-wait' : 'bg-brand-primary text-on-brand hover:bg-brand-hover'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Check size={16} />
                저장 (클릭해 보세요)
              </>
            )}
          </button>
        </PreviewBox>
      </SubSection>

      <Divider label="PROPS" />

      <PropsTable
        props={[
          { name: 'variant', type: "'primary' | 'neutral' | 'subtle'", default: "'primary'", desc: '버튼 시각적 스타일. secondary, ghost, destructive 등은 존재하지 않습니다.' },
          { name: 'size', type: "'medium' | 'small'", default: "'medium'", desc: '버튼 크기. medium은 40px 높이, small은 32px.' },
          { name: 'iconStart', type: 'ReactNode', desc: '왼쪽 아이콘. size={16} 사용.' },
          { name: 'iconEnd', type: 'ReactNode', desc: '오른쪽 아이콘. size={16} 사용.' },
          { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성화 상태.' },
          { name: 'className', type: 'string', desc: '추가 CSS 클래스.' },
        ]}
      />

      <Divider label="CODE" />

      <CodeBlock code={`import { Button, IconButton, ButtonGroup } from '@figma/astraui'
import { Plus, Download, Settings } from 'lucide-react'

// Primary CTA
<Button variant="primary">Save Changes</Button>

// Neutral supporting action
<Button variant="neutral">Cancel</Button>

// With icons (size={16} on icons)
<Button variant="primary" iconStart={<Plus size={16} />}>Add Item</Button>
<Button variant="subtle" iconEnd={<Download size={16} />}>Export</Button>

// Small size
<Button variant="neutral" size="small">Change Photo</Button>

// IconButton (icon-only, circular)
<IconButton icon={<Settings size={16} />} variant="subtle" />
<IconButton icon={<Plus size={16} />} variant="primary" size="small" />

// ButtonGroup
<ButtonGroup align="end">
  <Button variant="neutral">Cancel</Button>
  <Button variant="primary">Save</Button>
</ButtonGroup>`} />

      <Divider label="RULES" />

      <div className="grid grid-cols-2 gap-lg">
        {[
          { ok: true, text: 'variant="primary" | "neutral" | "subtle" 만 사용' },
          { ok: true, text: '한 섹션에 Primary 버튼은 하나만' },
          { ok: true, text: 'iconStart / iconEnd로 아이콘 전달' },
          { ok: true, text: '그룹에서 Cancel 왼쪽, Save 오른쪽' },
          { ok: false, text: 'variant="secondary" / "ghost" / "destructive" 사용' },
          { ok: false, text: 'Raw <button> 엘리먼트 직접 사용' },
          { ok: false, text: 'leftIcon / icon prop 사용 (존재하지 않음)' },
          { ok: false, text: '같은 그룹에서 medium + small 혼용' },
        ].map((rule) => (
          <div
            key={rule.text}
            className="flex items-start gap-3 p-4 rounded-corner-md border"
            style={{
              background: rule.ok ? '#F6FBF8' : '#FFF5F5',
              borderColor: rule.ok ? '#c8ecd8' : '#FECDD3',
            }}
          >
            <span style={{ color: rule.ok ? '#00B050' : '#e11d48', fontSize: '16px', lineHeight: 1.2, flexShrink: 0 }}>
              {rule.ok ? '✓' : '✕'}
            </span>
            <span className="text-label-sm" style={{ color: rule.ok ? '#166534' : '#9f1239' }}>{rule.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}