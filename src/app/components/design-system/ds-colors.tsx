import { useState } from 'react';
import { Check } from 'lucide-react';
import { PageTitle, Divider, SubSection, TokenBadge } from './ds-primitives';

interface ColorSwatch {
  name: string;
  token: string;
  cls?: string;
  style?: React.CSSProperties;
  hex?: string;
  usage: string;
}

function Swatch({ name, token, cls, style, hex, usage }: ColorSwatch) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    const val = hex ?? token;
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="flex flex-col gap-sm">
      <div
        onClick={handleClick}
        title={`클릭하여 복사: ${hex ?? token}`}
        className={`w-full h-14 rounded-corner-md border border-border-secondary cursor-pointer relative overflow-hidden transition-opacity ${cls || ''}`}
        style={{ ...style, opacity: copied ? 0.8 : 1 }}
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              fontSize: 11, fontWeight: 600, borderRadius: 6, padding: '3px 8px',
            }}>
              <Check size={11} /> Copied!
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-xs">
        <div className="text-label-sm text-text-primary font-medium">{name}</div>
        <TokenBadge token={token} />
        {hex && <div className="text-video-title text-text-tertiary">{hex}</div>}
        <div className="text-video-title text-text-secondary">{usage}</div>
      </div>
    </div>
  );
}

function ColorGroup({ title, description, cols = 6, children }: {
  title: string;
  description?: string;
  cols?: number;
  children: React.ReactNode;
}) {
  return (
    <SubSection title={title} description={description}>
      <div className={`grid gap-lg`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {children}
      </div>
    </SubSection>
  );
}

export function DsColors() {
  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="FOUNDATIONS"
        title="Color Tokens"
        description="CSS 변수로 정의된 시맨틱 컬러 시스템입니다. 직접 hex 값을 사용하지 않고 항상 토큰 클래스를 사용하세요. 팀 디자인 시스템에 맞게 :root 변수만 수정하면 전체 UI가 업데이트됩니다."
      />

      {/* Brand */}
      <ColorGroup title="Brand" description="브랜드 아이덴티티 색상 — primary 는 버튼, 활성 상태, 소규모 액센트에만 사용">
        <Swatch name="brand-primary" token="bg-brand-primary" style={{ background: '#00B050' }} hex="#00B050" usage="Primary buttons, active states" />
        <Swatch name="brand-hover" token="bg-brand-hover" cls="bg-brand-hover" usage="Button hover state" />
        <Swatch name="brand-dark" token="bg-brand-dark" cls="bg-brand-dark" usage="Darkest brand shade" />
        <Swatch name="brand-secondary" token="bg-brand-secondary" cls="bg-brand-secondary" usage="AI chat bubbles, accents" />
        <Swatch name="brand-tertiary" token="bg-brand-tertiary" cls="bg-brand-tertiary" hex="#eaeaff" usage="★ Page canvas background" />
        <Swatch name="brand-muted" token="bg-brand-muted" cls="bg-brand-muted" usage="Muted accent fill" />
      </ColorGroup>

      <Divider label="SURFACE" />

      {/* Surface */}
      <ColorGroup title="Surface" description="레이어드 서피스 전략 — 색상 대비로 계층 구조를 표현합니다">
        <Swatch name="surface-bg" token="bg-surface-bg" style={{ background: '#ffffff' }} hex="#ffffff" usage="★ Cards, panels, sidebar" />
        <Swatch name="surface-secondary-bg" token="bg-surface-secondary-bg" cls="bg-surface-secondary-bg" usage="Secondary nav panel" />
        <Swatch name="surface-hover" token="bg-surface-hover" cls="bg-surface-hover" usage="Hover on regions" />
        <Swatch name="surface-dark" token="bg-surface-dark" style={{ background: '#22222c' }} hex="#22222c" usage="Tooltips, dark UI" />
        <Swatch name="bg-faint" token="bg-bg-faint" cls="bg-bg-faint" usage="Recessed areas within cards" />
        <Swatch name="bg-subtle" token="bg-bg-subtle" cls="bg-bg-subtle" usage="Subtle grouping" />
        <Swatch name="input-bg" token="bg-input-bg" cls="bg-input-bg" usage="Input field backgrounds" />
        <Swatch name="bg-hover" token="bg-bg-hover" cls="bg-bg-hover" usage="Hover on tinted areas" />
      </ColorGroup>

      <Divider label="TEXT" />

      {/* Text */}
      <ColorGroup title="Text" cols={4} description="텍스트 계층 — opacity 조절이 아닌 전용 토큰을 사용하세요">
        {[
          { name: 'text-primary', style: { color: 'rgba(0,0,0,0.85)' }, hex: 'rgba(0,0,0,0.85)', usage: 'Primary content to read' },
          { name: 'text-secondary', style: { color: '#717182' }, hex: '#717182', usage: 'Supporting info, descriptions' },
          { name: 'text-tertiary', style: { color: '#a0a0b0' }, hex: '#a0a0b0', usage: 'Decorative, placeholders' },
          { name: 'on-brand', style: { color: '#ffffff' }, hex: '#ffffff', usage: 'Text on brand-primary bg' },
        ].map((t) => (
          <div key={t.name} className="flex flex-col gap-sm">
            <div
              className="w-full h-14 rounded-corner-md border border-border-secondary bg-bg-faint flex items-center justify-center"
              style={t.name === 'on-brand' ? { background: '#00B050' } : {}}
            >
              <span style={{ ...t.style, fontSize: '28px', fontWeight: 700 }}>Aa</span>
            </div>
            <div className="flex flex-col gap-xs">
              <div className="text-label-sm text-text-primary font-medium">{t.name}</div>
              <TokenBadge token={`text-${t.name}`} />
              <div className="text-video-title text-text-tertiary">{t.hex}</div>
              <div className="text-video-title text-text-secondary">{t.usage}</div>
            </div>
          </div>
        ))}
      </ColorGroup>

      <Divider label="STATUS" />

      {/* Status */}
      <ColorGroup title="Status" cols={5} description="시맨틱 상태 색상 — 성공, 경고, 오류">
        <Swatch name="success" token="bg-success" cls="bg-success" usage="Active, complete, approved" />
        <Swatch name="warning" token="bg-warning" cls="bg-warning" usage="Attention needed, pending" />
        <Swatch name="danger" token="bg-danger" cls="bg-danger" usage="Error, failed, blocked" />
        <Swatch name="text-success" token="text-success" style={{ background: '#EDFAF1', border: '2px solid #86DFAA' }} usage="Success text color" />
        <Swatch name="text-danger" token="text-danger" style={{ background: '#FFF1F2', border: '2px solid #FDA4AF' }} usage="Danger text color" />
      </ColorGroup>

      <Divider label="BORDER" />

      {/* Border */}
      <ColorGroup title="Border" cols={3} description="인터랙티브 요소와 패널 경계에만 사용 — 레이아웃 구분엔 서피스 색상을 사용">
        <Swatch name="border-primary" token="border-border-primary" style={{ background: '#fff', border: '2px solid rgba(0,0,0,0.1)' }} usage="Inputs, buttons, clickable cards" />
        <Swatch name="border-secondary" token="border-border-secondary" style={{ background: '#fff', border: '2px dashed rgba(0,0,0,0.06)' }} usage="Subtle dividers, row separators" />
        <Swatch name="border-selected" token="border-border-selected" style={{ background: '#fff', border: '2px solid #00B050' }} usage="Focus / selected elements" />
      </ColorGroup>

      {/* Decision tree */}
      <Divider label="USAGE GUIDE" />
      <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
        <div className="px-5 py-3 border-b border-border-secondary bg-bg-faint">
          <div className="text-label text-text-primary font-semibold">배경색 결정 트리</div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-xl">
            {[
              { q: '페이지 캔버스', a: 'bg-brand-tertiary', note: '항상 브랜드 라벤더' },
              { q: '카드 / 패널', a: 'bg-surface-bg', note: '캔버스 위에 부유' },
              { q: '카드 내 들어간 영역', a: 'bg-bg-faint', note: '메타데이터, 그루핑' },
              { q: '입력 필드 배경', a: 'bg-input-bg', note: 'InputField 내부 자동 적용' },
              { q: 'Primary 버튼', a: 'bg-brand-primary text-on-brand', note: '소규모 액션에만' },
              { q: '상태 표시', a: 'bg-success / bg-warning / bg-danger', note: '시맨틱 색상' },
            ].map((item) => (
              <div key={item.q} className="flex flex-col gap-xs p-lg bg-bg-faint rounded-corner-md">
                <div className="text-label-sm text-text-secondary">{item.q}</div>
                <TokenBadge token={item.a} />
                <div className="text-video-title text-text-tertiary">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}