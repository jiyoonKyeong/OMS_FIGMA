import { PageTitle, Divider, CodeBlock, TokenBadge, SubSection } from './ds-primitives';

const TYPE_SCALE = [
  {
    cls: 'text-title',
    label: 'text-title',
    size: '24px',
    weight: '600 SemiBold',
    lh: '1.4',
    usage: 'Page title, major heading',
    sample: 'CELLTRION PHARMA Dashboard',
  },
  {
    cls: 'text-heading',
    label: 'text-heading',
    size: '20px',
    weight: '500 Medium',
    lh: '1.4',
    usage: 'Section heading',
    sample: 'Batch Progress Schedule',
  },
  {
    cls: 'text-label',
    label: 'text-label',
    size: '16px',
    weight: '500 Medium',
    lh: '1.4',
    usage: 'Card title, form label, button text',
    sample: 'Inventory Aging Report',
  },
  {
    cls: 'text-label-sm',
    label: 'text-label-sm',
    size: '14px',
    weight: '500 Medium',
    lh: '1.4',
    usage: 'Description, helper text, secondary labels',
    sample: 'Deviation occurred in P/O No. 202601001',
  },
  {
    cls: 'text-input',
    label: 'text-input',
    size: '16px',
    weight: '400 Regular',
    lh: '1.4',
    usage: 'Input field value text',
    sample: 'CT-P13 120mg',
  },
  {
    cls: 'text-input-sm',
    label: 'text-input-sm',
    size: '14px',
    weight: '500 Medium',
    lh: '1.4',
    usage: 'Small input, compact fields, DurationBadge',
    sample: 'Jan/22/2026',
  },
  {
    cls: 'text-video-title',
    label: 'text-video-title',
    size: '12px',
    weight: '400 Regular',
    lh: 'normal',
    usage: 'Metadata, timestamps, fine print',
    sample: 'Updated 2 hours ago · 4S00068840',
  },
];

const WEIGHTS = [
  { tw: 'font-book', value: '450', usage: 'Occasional — between regular and medium' },
  { tw: 'font-medium', value: '500', usage: '★ Default for labels and UI text' },
  { tw: 'font-semibold', value: '600', usage: 'Titles, headings, strong emphasis' },
];

export function DsTypography() {
  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="FOUNDATIONS"
        title="Typography"
        description="Instrument Sans 단일 폰트 패밀리로 구성된 타입 스케일입니다. 항상 컴포짓 클래스(text-title, text-label 등)를 사용하세요. Tailwind 기본 클래스(text-sm, text-lg)는 사용하지 않습니다."
      />

      {/* Type Scale */}
      <SubSection title="Type Scale" description="크기, 굵기, 행간이 번들된 컴포짓 클래스 — 개별 font-size 설정 금지">
        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
          {/* Header */}
          <div
            className="grid px-xl py-sm border-b border-border-secondary"
            style={{ gridTemplateColumns: '160px 1fr 120px 80px 80px', background: '#F0F0F6' }}
          >
            {['Class', 'Sample', 'Usage', 'Size', 'Weight'].map((h) => (
              <span key={h} style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#717182', fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {TYPE_SCALE.map((t, i) => (
            <div
              key={t.cls}
              className="grid items-center px-xl py-lg"
              style={{
                gridTemplateColumns: '160px 1fr 120px 80px 80px',
                borderBottom: i < TYPE_SCALE.length - 1 ? '1px solid #f0f0f6' : 'none',
              }}
            >
              <div>
                <TokenBadge token={t.label} />
              </div>
              <div className={`${t.cls} text-text-primary pr-lg`} style={{ maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.sample}
              </div>
              <div className="text-video-title text-text-secondary">{t.usage}</div>
              <div className="text-video-title text-text-tertiary">{t.size}</div>
              <div className="text-video-title text-text-tertiary">{t.weight.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="FONT WEIGHT" />

      {/* Font weights */}
      <SubSection title="Font Weights" description="이 세 가지 굵기만 사용합니다 — 300, 700, 800, 900은 사용 금지">
        <div className="flex gap-lg">
          {WEIGHTS.map((w) => (
            <div key={w.tw} className="flex-1 bg-surface-bg rounded-corner-lg border border-border-secondary p-xl">
              <div
                className="text-title text-text-primary mb-lg"
                style={{ fontWeight: w.value === '450' ? 450 : w.value === '500' ? 500 : 600 }}
              >
                Ag
              </div>
              <div className="flex flex-col gap-xs">
                <TokenBadge token={w.tw} />
                <div className="text-label-sm text-text-primary font-medium">{w.value}</div>
                <div className="text-video-title text-text-secondary">{w.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="PATTERNS" />

      {/* Common patterns */}
      <SubSection title="Common Patterns" description="자주 쓰이는 타이포그래피 조합">
        <div className="grid grid-cols-2 gap-lg">
          {/* Page header */}
          <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl">
            <div className="text-video-title text-text-tertiary mb-md" style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600 }}>PAGE HEADER</div>
            <div className="p-lg bg-bg-faint rounded-corner-md mb-lg">
              <h1 className="text-title text-text-primary font-semibold">Order Management</h1>
              <p className="text-label-sm text-text-secondary mt-xs">FCST 기반 주문 현황을 관리합니다</p>
            </div>
            <CodeBlock code={`<h1 className="text-title text-text-primary font-semibold">
  Order Management
</h1>
<p className="text-label-sm text-text-secondary mt-xs">
  FCST 기반 주문 현황을 관리합니다
</p>`} />
          </div>

          {/* Card heading */}
          <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl">
            <div className="text-video-title text-text-tertiary mb-md" style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600 }}>CARD SECTION HEADING</div>
            <div className="p-lg bg-bg-faint rounded-corner-md mb-lg">
              <h2 className="text-label text-text-primary font-semibold mb-lg">Batch Progress Schedule</h2>
              <div className="text-label-sm text-text-secondary">배치 현황 데이터가 표시됩니다.</div>
            </div>
            <CodeBlock code={`<h2 className="text-label text-text-primary font-semibold mb-lg">
  Batch Progress Schedule
</h2>`} />
          </div>

          {/* Table row */}
          <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl">
            <div className="text-video-title text-text-tertiary mb-md" style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600 }}>TABLE HEADER / CELL</div>
            <div className="p-lg bg-bg-faint rounded-corner-md mb-lg overflow-hidden">
              <div className="text-label-sm text-text-primary font-medium mb-sm">Product Name</div>
              <div className="text-label-sm text-text-primary">CT-P13 120mg</div>
              <div className="text-video-title text-text-secondary mt-xs">Jan/22/2026 · 4S00068840</div>
            </div>
            <CodeBlock code={`// Table header
"text-label-sm text-text-primary font-medium"
// Table cell value
"text-label-sm text-text-primary"
// Metadata / subtext
"text-video-title text-text-secondary"`} />
          </div>

          {/* Form label */}
          <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl">
            <div className="text-video-title text-text-tertiary mb-md" style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600 }}>FORM LABEL + INPUT</div>
            <div className="p-lg bg-bg-faint rounded-corner-md mb-lg">
              <label className="text-label-sm text-text-primary font-medium block mb-sm">FCST 월</label>
              <div className="text-input text-text-secondary">2025.11 Y</div>
              <div className="text-video-title text-text-tertiary mt-xs">필수 항목입니다</div>
            </div>
            <CodeBlock code={`<label className="text-label-sm text-text-primary font-medium">
  FCST 월
</label>
// Input value: "text-input text-text-primary"
// Helper text: "text-video-title text-text-secondary"`} />
          </div>
        </div>
      </SubSection>

      <Divider label="RULES" />

      <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl">
        <div className="grid grid-cols-2 gap-lg">
          {[
            { type: '✅ 올바른 사용', items: ['text-title, text-label 등 컴포짓 클래스 사용', '텍스트 색상은 text-text-primary / secondary / tertiary로', 'font-medium, font-semibold만 사용'] },
            { type: '❌ 피해야 할 것', items: ['text-sm, text-lg 등 Tailwind 기본 사이즈', 'text-2xl, leading-8 등 개별 속성 조합', '300, 700, 800, 900 폰트 굵기'] },
          ].map((rule) => (
            <div key={rule.type}>
              <div className="text-label-sm text-text-primary font-semibold mb-md">{rule.type}</div>
              <div className="flex flex-col gap-sm">
                {rule.items.map((item) => (
                  <div key={item} className="text-video-title text-text-secondary flex items-start gap-sm">
                    <span className="mt-xs flex-shrink-0">•</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
