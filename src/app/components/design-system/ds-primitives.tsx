import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// ─── Clipboard hook ───────────────────────────────────────────────────────────
function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    });
  };
  return { copied, copy };
}

// ─── Preview Box — dot-grid background ───────────────────────────────────────
export function PreviewBox({
  children,
  className = '',
  center = true,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-corner-lg border border-border-secondary p-8 ${center ? 'flex flex-wrap items-center justify-center gap-4' : ''} ${className}`}
      style={{
        backgroundImage: dark
          ? 'radial-gradient(circle, #2a2a3a 1px, transparent 1px)'
          : 'radial-gradient(circle, #d0d0e0 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        backgroundColor: dark ? '#0f0f18' : 'var(--bg-faint, #F6F6FB)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Code Block ───────────────────────────────────────────────────────────────
export function CodeBlock({ code, language = 'tsx' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = code
    .replace(/(import|from|export|function|const|let|return|default|type|interface|true|false)/g,
      '<span style="color:#82AAFF">$1</span>')
    .replace(/(\"[^\"]*\"|\'[^\']*\')/g, '<span style="color:#98D87A">$1</span>')
    .replace(/(\/\/.*)/g, '<span style="color:#546E7A">$1</span>')
    .replace(/(&lt;[A-Z][a-zA-Z]*)/g, '<span style="color:#C792EA">$&</span>');

  return (
    <div className="relative rounded-corner-lg overflow-hidden border border-[#1e1e2e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d14] border-b border-[#1e1e2e]">
        <span style={{ color: '#546e7a', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 600 }}>
          {language.toUpperCase()}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-label-sm"
          style={{
            background: copied ? '#1a3a1a' : '#1e1e2e',
            color: copied ? '#98D87A' : '#546e7a',
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-[#0d0d14] px-5 py-4 overflow-x-auto">
        <pre
          className="font-mono leading-relaxed"
          style={{ color: '#e0e0f0', fontSize: '12px' }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────
export function PropsTable({
  props,
}: {
  props: { name: string; type: string; default?: string; required?: boolean; desc: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-corner-lg border border-border-secondary">
      <table className="w-full">
        <thead>
          <tr className="bg-bg-faint">
            <th className="px-4 py-2.5 text-left border-b border-border-secondary" style={{ width: '140px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-secondary, #717182)', fontWeight: 600 }}>PROP</span>
            </th>
            <th className="px-4 py-2.5 text-left border-b border-border-secondary" style={{ width: '160px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-secondary, #717182)', fontWeight: 600 }}>TYPE</span>
            </th>
            <th className="px-4 py-2.5 text-left border-b border-border-secondary" style={{ width: '100px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-secondary, #717182)', fontWeight: 600 }}>DEFAULT</span>
            </th>
            <th className="px-4 py-2.5 text-left border-b border-border-secondary">
              <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-secondary, #717182)', fontWeight: 600 }}>DESCRIPTION</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface-bg">
          {props.map((p, i) => (
            <tr key={p.name} className={i < props.length - 1 ? 'border-b border-border-secondary' : ''}>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <code className="text-label-sm text-brand-primary bg-brand-tertiary px-2 py-0.5 rounded-corner-sm font-medium">{p.name}</code>
                  {p.required && (
                    <span className="text-danger" style={{ fontSize: '10px' }}>*</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2.5">
                <code
                  className="text-label-sm px-2 py-0.5 rounded-corner-sm font-mono"
                  style={{ color: '#7C3AED', background: '#F5F3FF' }}
                >
                  {p.type}
                </code>
              </td>
              <td className="px-4 py-2.5 text-label-sm text-text-tertiary">
                {p.default ? (
                  <code className="bg-bg-faint px-2 py-0.5 rounded-corner-sm text-text-secondary">{p.default}</code>
                ) : '—'}
              </td>
              <td className="px-4 py-2.5 text-label-sm text-text-secondary">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Token Badge ──────────────────────────────────────────────────────────────
export function TokenBadge({ token, color = 'brand' }: { token: string; color?: 'brand' | 'purple' | 'gray' }) {
  const { copied, copy } = useCopy();
  const styles = {
    brand:  { background: '#e8f8ef', color: '#00B050' },
    purple: { background: '#F5F3FF', color: '#7C3AED' },
    gray:   { background: '#F0F0F6', color: '#717182' },
  }[color];
  return (
    <code
      onClick={() => copy(token)}
      title={`클릭하여 복사: ${token}`}
      className="text-label-sm px-2 py-0.5 rounded-corner-sm font-medium inline-flex items-center gap-1 cursor-pointer select-none transition-opacity"
      style={{
        ...styles,
        fontSize: '11px',
        opacity: copied ? 0.75 : 1,
        userSelect: 'none',
      }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} style={{ opacity: 0.5 }} />}
      {copied ? 'Copied!' : token}
    </code>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 pt-6">
      <span
        className="whitespace-nowrap"
        style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 600, color: '#a0a0b8' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-border-secondary" />
    </div>
  );
}

// ─── Page title block ─────────────────────────────────────────────────────────
export function PageTitle({
  title,
  description,
  tag,
}: {
  title: string;
  description: string;
  tag?: string;
}) {
  return (
    <div className="flex flex-col gap-2 pb-8 border-b border-border-secondary">
      {tag && (
        <div className="inline-flex w-fit">
          <span
            className="text-label-sm px-3 py-0.5 rounded-corner-full font-medium"
            style={{ background: '#e8f8ef', color: '#00B050', fontSize: '10px', letterSpacing: '0.08em' }}
          >
            {tag}
          </span>
        </div>
      )}
      <h1 className="text-title text-text-primary font-semibold">{title}</h1>
      <p className="text-label-sm text-text-secondary" style={{ maxWidth: '560px' }}>{description}</p>
    </div>
  );
}

// ─── Sub-section wrapper ──────────────────────────────────────────────────────
export function SubSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-label text-text-primary font-semibold">{title}</div>
        {description && <div className="text-label-sm text-text-secondary mt-1">{description}</div>}
      </div>
      {children}
    </div>
  );
}