import { useState } from 'react';
import { Search, ChevronDown, Check, Eye, EyeOff } from 'lucide-react';
import { PageTitle, PreviewBox, PropsTable, CodeBlock, Divider, SubSection, TokenBadge } from './ds-primitives';

// ─── Shared Input styles ──────────────────────────────────────────────────────
const inputBase = 'w-full px-lg py-sm bg-input-bg border border-border-primary rounded-corner-md text-input text-text-primary focus:outline-none focus:border-border-selected focus:ring-1 focus:ring-brand-primary transition-colors';

// ─── InputField ───────────────────────────────────────────────────────────────
function InputFieldDemo({
  label,
  description,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  disabled,
  error,
}: {
  label?: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-xs">
      {label && <label className="text-label-sm text-text-primary font-medium">{label}</label>}
      {description && <div className="text-video-title text-text-secondary">{description}</div>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-md text-text-secondary pointer-events-none">{prefix}</span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputBase} ${prefix ? 'pl-[38px]' : ''} ${suffix ? 'pr-[50px]' : ''} ${disabled ? 'bg-bg-faint text-text-tertiary cursor-not-allowed border-border-secondary' : ''} ${error ? 'border-danger focus:ring-danger' : ''}`}
        />
        {suffix && (
          <span className="absolute right-md text-text-secondary text-video-title">{suffix}</span>
        )}
      </div>
      {error && <div className="text-video-title text-danger">{error}</div>}
    </div>
  );
}

export function DsForms() {
  const [inputVal, setInputVal] = useState('CT-P13 120mg');
  const [searchVal, setSearchVal] = useState('');
  const [selectVal, setSelectVal] = useState('us');
  const [checks, setChecks] = useState({ pfs: true, vial: false, a12g: true });
  const [radio, setRadio] = useState('charge');
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [pwShow, setPwShow] = useState(false);
  const [textarea, setTextarea] = useState('');

  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="COMPONENTS"
        title="Form Controls"
        description="InputField, TextareaField, SelectField, SearchComponent, Checkbox, RadioGroup, SwitchField — 항상 @figma/astraui 컴포넌트를 사용합니다. Raw HTML <input>, <select>, <textarea>를 직접 사용하지 않습니다."
      />

      {/* InputField */}
      <SubSection title="InputField" description="단일행 텍스트 입력 — label, description, prefix, suffix, error 상태 지원">
        <PreviewBox center={false}>
          <div className="grid grid-cols-2 gap-xl w-full">
            <InputFieldDemo
              label="Product Name"
              description="제품 코드 또는 이름을 입력하세요"
              value={inputVal}
              onChange={setInputVal}
              placeholder="예: CT-P13 120mg"
            />
            <InputFieldDemo
              label="Search"
              value={searchVal}
              onChange={setSearchVal}
              placeholder="Search..."
              prefix={<Search size={16} />}
            />
            <InputFieldDemo
              label="수량 (Qty)"
              value="100"
              onChange={() => {}}
              suffix="EA"
            />
            <InputFieldDemo
              label="Disabled Field"
              value="Read-only value"
              onChange={() => {}}
              disabled
            />
            <InputFieldDemo
              label="Error State"
              value="invalid@value"
              onChange={() => {}}
              error="유효하지 않은 형식입니다"
            />
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm text-text-primary font-medium">Password</label>
              <div className="relative flex items-center">
                <input
                  type={pwShow ? 'text' : 'password'}
                  defaultValue="password123"
                  className={`${inputBase} pr-[42px]`}
                />
                <button
                  onClick={() => setPwShow(!pwShow)}
                  className="absolute right-md text-text-secondary hover:text-text-primary"
                >
                  {pwShow ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </PreviewBox>

        <PropsTable
          props={[
            { name: 'value', type: 'string', required: true, desc: '입력 값.' },
            { name: 'onChange', type: '(value: string) => void', required: true, desc: '변경 핸들러 — 네이티브 이벤트가 아닌 간소화된 시그니처.' },
            { name: 'label', type: 'string', desc: '필드 레이블 텍스트.' },
            { name: 'description', type: 'string', desc: '레이블 아래 도움말 텍스트.' },
            { name: 'placeholder', type: 'string', default: "'I am a placeholder...'", desc: '플레이스홀더 텍스트.' },
            { name: 'prefix', type: 'ReactNode', desc: '입력 왼쪽 아이콘/텍스트. size={16} 사용.' },
            { name: 'suffix', type: 'ReactNode', desc: '입력 오른쪽 아이콘/텍스트.' },
            { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성화 상태.' },
          ]}
        />
      </SubSection>

      <Divider label="SELECT FIELD" />

      {/* SelectField */}
      <SubSection title="SelectField" description="드롭다운 선택 — options는 { value, label }[] 배열로 전달">
        <PreviewBox center={false}>
          <div className="grid grid-cols-2 gap-xl w-full">
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm text-text-primary font-medium">국가 구분</label>
              <div className="relative">
                <select
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  className={`${inputBase} appearance-none pr-[38px]`}
                >
                  {[
                    { value: 'us', label: 'US' },
                    { value: 'eu', label: 'EU' },
                    { value: 'au', label: 'AU' },
                    { value: 'ca', label: 'CA' },
                    { value: 'tw', label: 'TW' },
                  ].map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="absolute right-md top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm text-text-primary font-medium">제형 구분</label>
              <div className="relative">
                <select className={`${inputBase} appearance-none pr-[38px]`} defaultValue="">
                  <option value="" disabled>Select an option</option>
                  {['PFS', 'VIAL', 'A12-G'].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <span className="absolute right-md top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                  <ChevronDown size={16} />
                </span>
              </div>
              <div className="text-video-title text-text-secondary">state="empty" — 플레이스홀더 표시</div>
            </div>
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="TEXTAREA" />

      <SubSection title="TextareaField" description="여러 줄 텍스트 입력 — rows prop으로 높이 조정">
        <PreviewBox center={false}>
          <div className="w-full max-w-lg">
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm text-text-primary font-medium">비고</label>
              <div className="text-video-title text-text-secondary">Deviation 사유나 특이사항을 입력하세요</div>
              <textarea
                value={textarea}
                onChange={(e) => setTextarea(e.target.value)}
                rows={4}
                placeholder="내용을 입력하세요..."
                className="w-full px-lg py-sm bg-input-bg border border-border-primary rounded-corner-md text-input text-text-primary focus:outline-none focus:border-border-selected focus:ring-1 focus:ring-brand-primary transition-colors resize-y"
              />
              <div className="text-video-title text-text-tertiary text-right">{textarea.length} / 500</div>
            </div>
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="CHECKBOX" />

      {/* Checkbox */}
      <SubSection title="Checkbox" description="Boolean 선택 — 폼 필드에서 on/off 상태. 체크박스 그룹에 사용">
        <PreviewBox center={false}>
          <div className="grid grid-cols-2 gap-2xl w-full">
            <div className="flex flex-col gap-md">
              <div className="text-label-sm text-text-primary font-medium">Product 선택</div>
              {[
                { key: 'pfs' as const, label: 'PFS', desc: '사전충전형 주사기' },
                { key: 'vial' as const, label: 'VIAL', desc: '바이알 타입' },
                { key: 'a12g' as const, label: 'A12-G', desc: '어토펜 타입' },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-start gap-md cursor-pointer group"
                  onClick={() => setChecks((p) => ({ ...p, [opt.key]: !p[opt.key] }))}
                >
                  <div
                    className={`w-4 h-4 flex-shrink-0 rounded-corner-sm border flex items-center justify-center transition-colors mt-xs ${checks[opt.key] ? 'bg-brand-primary border-brand-primary' : 'bg-input-bg border-border-primary group-hover:border-border-selected'}`}
                  >
                    {checks[opt.key] && <Check size={10} className="text-on-brand" strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="text-label-sm text-text-primary">{opt.label}</div>
                    <div className="text-video-title text-text-secondary">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-md">
              <div className="text-label-sm text-text-primary font-medium">Indeterminate 상태</div>
              <label className="flex items-center gap-md cursor-pointer">
                <div className="w-4 h-4 rounded-corner-sm border border-brand-primary bg-brand-primary flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-white" />
                </div>
                <span className="text-label-sm text-text-primary">전체 선택 (일부 선택됨)</span>
              </label>
              <label className="flex items-center gap-md cursor-not-allowed">
                <div className="w-4 h-4 rounded-corner-sm border border-border-secondary bg-bg-faint flex items-center justify-center">
                  <Check size={10} className="text-text-tertiary" strokeWidth={3} />
                </div>
                <span className="text-label-sm text-text-tertiary">비활성화 (체크됨)</span>
              </label>
              <label className="flex items-center gap-md cursor-not-allowed">
                <div className="w-4 h-4 rounded-corner-sm border border-border-secondary bg-bg-faint" />
                <span className="text-label-sm text-text-tertiary">비활성화 (미체크)</span>
              </label>
            </div>
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="RADIO GROUP" />

      {/* RadioGroup */}
      <SubSection title="RadioGroup" description="상호 배타적 선택 — 2개 이상의 선택지 중 하나">
        <PreviewBox center={false}>
          <div className="grid grid-cols-2 gap-2xl w-full">
            <div className="flex flex-col gap-md">
              <div className="text-label-sm text-text-primary font-medium">공정 구분</div>
              {[
                { value: 'charge', label: 'Charge' },
                { value: 'assembly', label: 'Assembly' },
                { value: 'lp', label: 'L&P' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-md cursor-pointer" onClick={() => setRadio(opt.value)}>
                  <div className={`w-4 h-4 rounded-corner-full border flex items-center justify-center transition-colors flex-shrink-0 ${radio === opt.value ? 'border-brand-primary' : 'border-border-primary bg-input-bg'}`}>
                    {radio === opt.value && <div className="w-2 h-2 rounded-corner-full bg-brand-primary" />}
                  </div>
                  <span className="text-label-sm text-text-primary">{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-md">
              <div className="text-label-sm text-text-primary font-medium">Horizontal layout</div>
              <div className="flex items-center gap-xl">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="flex items-center gap-sm cursor-pointer">
                    <div className="w-4 h-4 rounded-corner-full border border-border-primary bg-input-bg flex items-center justify-center" />
                    <span className="text-label-sm text-text-primary">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="SWITCH" />

      {/* SwitchField */}
      <SubSection title="SwitchField" description="On/Off 설정 토글 — 레이블이 있는 Boolean 설정값">
        <PreviewBox center={false}>
          <div className="grid grid-cols-2 gap-xl w-full">
            {[
              { label: '알림 받기', desc: '새 알림을 이메일로 받습니다', val: sw1, set: setSw1 },
              { label: 'Deviation 자동 보고', desc: 'Deviation 발생 시 자동으로 보고됩니다', val: sw2, set: setSw2 },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between p-lg bg-bg-faint rounded-corner-md">
                <div>
                  <div className="text-label-sm text-text-primary font-medium">{s.label}</div>
                  <div className="text-video-title text-text-secondary mt-xs">{s.desc}</div>
                </div>
                <button
                  onClick={() => s.set(!s.val)}
                  className="relative inline-flex w-10 h-6 rounded-corner-full transition-colors flex-shrink-0 ml-lg"
                  style={{ background: s.val ? '#00B050' : '#d1d5db' }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-corner-full shadow-sm transition-transform"
                    style={{ transform: s.val ? 'translateX(16px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between p-lg bg-bg-faint rounded-corner-md opacity-50">
              <div>
                <div className="text-label-sm text-text-tertiary font-medium">비활성화된 설정</div>
                <div className="text-video-title text-text-tertiary mt-xs">이 설정은 수정할 수 없습니다</div>
              </div>
              <div className="relative inline-flex w-10 h-6 rounded-corner-full flex-shrink-0 ml-lg cursor-not-allowed" style={{ background: '#d1d5db' }}>
                <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-corner-full shadow-sm" />
              </div>
            </div>
          </div>
        </PreviewBox>
      </SubSection>

      <Divider label="CODE" />

      <CodeBlock code={`import { InputField, TextareaField, SelectField, Checkbox, RadioGroup, SwitchField } from '@figma/astraui'
import { Search } from 'lucide-react'

// InputField
<InputField
  label="Product Name"
  description="제품 코드 또는 이름 입력"
  value={value}
  onChange={(val) => setValue(val)}  // (value: string) => void
/>

// With prefix icon
<InputField prefix={<Search size={16} />} placeholder="Search..." value={q} onChange={setQ} />

// SelectField — options as { value, label }[]
<SelectField
  label="국가 구분"
  options={[{ value: 'us', label: 'US' }, { value: 'eu', label: 'EU' }]}
  value={country}
  onChange={(val) => setCountry(val)}
/>

// Checkbox
<Checkbox label="PFS" description="사전충전형 주사기" checked={checked} onChange={setChecked} />

// SwitchField
<SwitchField label="알림 받기" checked={enabled} onChange={setEnabled} />`} />

      <Divider label="RULES" />

      <div className="grid grid-cols-2 gap-md">
        {[
          { ok: true, text: 'InputField, SelectField 등 @figma/astraui 컴포넌트 사용' },
          { ok: true, text: 'onChange: (value: string) => void 시그니처 사용' },
          { ok: true, text: 'prefix에 size={16} 아이콘 전달' },
          { ok: true, text: 'SelectField의 options는 { value, label }[] 배열' },
          { ok: false, text: 'Raw <input>, <select>, <textarea> 직접 사용' },
          { ok: false, text: 'onChange에 네이티브 이벤트 핸들러 사용' },
          { ok: false, text: 'leftIcon / icon prop 사용 (존재하지 않음)' },
          { ok: false, text: '폼 필드를 bg-surface-bg 카드 외부에 배치' },
        ].map((rule) => (
          <div
            key={rule.text}
            className="flex items-start gap-md p-lg rounded-corner-md"
            style={{
              background: rule.ok ? '#F6FBF8' : '#FFF5F5',
              border: `1px solid ${rule.ok ? '#c8ecd8' : '#FECDD3'}`,
            }}
          >
            <span style={{ color: rule.ok ? '#00B050' : '#e11d48', flexShrink: 0 }}>
              {rule.ok ? '✓' : '✕'}
            </span>
            <span className="text-video-title" style={{ color: rule.ok ? '#166534' : '#9f1239' }}>{rule.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
