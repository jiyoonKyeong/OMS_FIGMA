import { PageTitle, Divider, SubSection, TokenBadge, CodeBlock } from './ds-primitives';

const SPACING = [
  { token: 'space-xs', tw: 'xs', px: 4, dominant: false, usage: 'Tight inline gap, title→subtitle, metadata items' },
  { token: 'space-sm', tw: 'sm', px: 6, dominant: false, usage: 'Small gaps, badge padding, nav item spacing' },
  { token: 'space-md', tw: 'md', px: 8, dominant: false, usage: 'Component internal gaps, toolbar gaps' },
  { token: 'space-lg', tw: 'lg', px: 12, dominant: true, usage: '★ Fields inside cards, related groups, below heading' },
  { token: 'space-xl', tw: 'xl', px: 16, dominant: true, usage: '★ Card padding, between section cards' },
  { token: 'space-2xl', tw: '2xl', px: 24, dominant: false, usage: 'Page-level padding, major section separation' },
];

const RADIUS = [
  { token: 'corner-sm', cls: 'rounded-corner-sm', px: 4, usage: 'Small elements, badges, mini indicators' },
  { token: 'corner-md', cls: 'rounded-corner-md', px: 8, usage: 'Inputs, badges, toolbar items, ItemCard' },
  { token: 'corner-lg', cls: 'rounded-corner-lg', px: 16, dominant: true, usage: '★ Content cards, panels, modals, overlays' },
  { token: 'corner-full', cls: 'rounded-corner-full', px: 999, usage: 'Buttons (pill), avatars, toggles' },
];

export function DsSpacing() {
  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="FOUNDATIONS"
        title="Spacing & Radius"
        description="Base-4 스페이싱 시스템과 라운드 코너 토큰입니다. 절대 픽셀값을 직접 사용하지 않습니다. 모든 간격은 토큰 클래스로 표현하세요."
      />

      {/* Spacing Scale */}
      <SubSection title="Spacing Scale" description="간격은 선택사항이 아닙니다 — 카드와 필드가 붙어있다면 레이아웃이 잘못된 것입니다">
        <div className="flex flex-col gap-sm">
          {/* Header */}
          <div
            className="grid items-center px-xl py-sm rounded-corner-md"
            style={{ gridTemplateColumns: '140px 48px 200px 1fr', background: '#F0F0F6' }}
          >
            {['Token', 'px', 'Tailwind classes', 'Usage'].map((h) => (
              <span key={h} style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#717182', fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {SPACING.map((s) => (
            <div
              key={s.token}
              className="grid items-center px-xl py-lg rounded-corner-md"
              style={{
                gridTemplateColumns: '140px 48px 200px 1fr',
                background: s.dominant ? '#F6FBF8' : '#ffffff',
                border: s.dominant ? '1px solid #c8ecd8' : '1px solid #f0f0f6',
              }}
            >
              <div className="flex items-center gap-sm">
                <TokenBadge token={s.token} />
                {s.dominant && (
                  <span className="text-video-title px-xs rounded-corner-sm" style={{ background: '#e8f8ef', color: '#00B050', fontSize: '9px', padding: '1px 5px' }}>
                    ★
                  </span>
                )}
              </div>
              <div className="text-label-sm text-text-primary font-semibold">{s.px}</div>
              <div className="flex flex-wrap gap-xs">
                {[`gap-${s.tw}`, `p-${s.tw}`, `m-${s.tw}`].map((cls) => (
                  <code key={cls} className="text-video-title text-text-secondary bg-bg-faint px-xs py-xs rounded-corner-sm">{cls}</code>
                ))}
              </div>
              <div className="text-video-title text-text-secondary">{s.usage}</div>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Visual Spacing Demo */}
      <SubSection title="Visual Reference" description="스페이싱 크기 시각적 비교">
        <div
          className="rounded-corner-lg border border-border-secondary p-2xl flex items-end gap-2xl"
          style={{
            backgroundImage: 'radial-gradient(circle, #d8d8e8 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            backgroundColor: '#F6F6FB',
          }}
        >
          {SPACING.map((s) => (
            <div key={s.token} className="flex flex-col items-center gap-md">
              <div className="text-video-title text-text-primary font-semibold">{s.px}px</div>
              <div className="bg-brand-primary rounded-corner-sm" style={{ width: '24px', height: s.px * 2.5 }} />
              <div>
                <TokenBadge token={`-${s.tw}`} />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="BORDER RADIUS" />

      {/* Radius */}
      <SubSection title="Border Radius" description="rounded 스타일 — corner-lg(16px) 가 카드/패널의 기본, corner-full 이 버튼의 기본">
        <div className="grid grid-cols-4 gap-lg">
          {RADIUS.map((r) => (
            <div
              key={r.token}
              className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl flex flex-col gap-lg"
              style={r.dominant ? { border: '1px solid #c8ecd8', background: '#F6FBF8' } : {}}
            >
              <div className="flex justify-center py-md">
                <div
                  className={`w-20 h-20 ${r.cls}`}
                  style={{ background: r.dominant ? 'linear-gradient(135deg, #00B050, #00d060)' : '#e0e0ee' }}
                />
              </div>
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <TokenBadge token={r.token} />
                  {r.dominant && (
                    <span className="text-video-title px-xs rounded-corner-sm" style={{ background: '#e8f8ef', color: '#00B050', fontSize: '9px', padding: '1px 5px' }}>
                      ★
                    </span>
                  )}
                </div>
                <div className="text-label-sm text-text-primary font-semibold">{r.px === 999 ? '999px' : `${r.px}px`}</div>
                <div className="text-video-title text-text-secondary">{r.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="COMPONENT MAPPING" />

      <SubSection title="Component → Radius Mapping" description="컴포넌트별 적용 반경 참조표">
        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
          <div className="grid px-xl py-sm border-b border-border-secondary" style={{ gridTemplateColumns: '1fr 1fr 1fr', background: '#F0F0F6' }}>
            {['Component', 'Radius', 'Token'].map((h) => (
              <span key={h} style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#717182', fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {[
            { comp: 'Button', r: 'pill', token: 'rounded-corner-full' },
            { comp: 'InputField / SelectField', r: '8px', token: 'rounded-corner-md' },
            { comp: 'Content Card (surface-bg)', r: '16px', token: 'rounded-corner-lg' },
            { comp: 'Modal / Dialog', r: '16px', token: 'rounded-corner-lg' },
            { comp: 'Badge / Tag', r: '8px', token: 'rounded-corner-md' },
            { comp: 'Avatar (circle)', r: 'pill', token: 'rounded-corner-full' },
            { comp: 'Avatar (square)', r: '8px', token: 'rounded-corner-md' },
            { comp: 'Tooltip', r: '8px', token: 'rounded-corner-md' },
            { comp: 'Status Badge (CELLTRION)', r: '4px', token: 'rounded-corner-sm' },
          ].map((row, i, arr) => (
            <div
              key={row.comp}
              className="grid items-center px-xl py-md"
              style={{ gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f6' : 'none' }}
            >
              <div className="text-label-sm text-text-primary">{row.comp}</div>
              <div className="text-label-sm text-text-secondary">{row.r}</div>
              <TokenBadge token={row.token} />
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="CODE EXAMPLE" />

      <CodeBlock code={`{/* ✅ Correct — card uses corner-lg, input uses corner-md */}
<div className="bg-surface-bg rounded-corner-lg p-xl gap-lg flex flex-col">
  <InputField label="Product Name" />
  <SelectField options={options} value={val} onChange={setVal} />
  <ButtonGroup align="end">
    <Button variant="neutral">Cancel</Button>
    <Button variant="primary">Save</Button>  {/* rounded-corner-full via component */}
  </ButtonGroup>
</div>

{/* ❌ Wrong — arbitrary values */}
<div className="rounded-[12px] p-[18px]">
  <input className="rounded-[6px]" />
</div>`} />
    </div>
  );
}
