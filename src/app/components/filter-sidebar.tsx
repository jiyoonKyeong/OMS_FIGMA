import { SlidersHorizontal } from 'lucide-react';

interface FilterItem {
  label: string;
  options: string[];
}

interface FilterSidebarProps {
  filters: FilterItem[];
}

export function FilterSidebar({ filters }: FilterSidebarProps) {
  return (
    <aside style={{
      width: 200,
      flexShrink: 0,
      background: 'var(--surface-bg)',
      borderRight: '1px solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <SlidersHorizontal size={14} style={{ color: 'var(--brand-primary)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          필터
        </span>
      </div>

      {/* Filter items */}
      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {filters.map((filter, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}>
              {filter.label}
            </label>
            <select style={{
              width: '100%',
              padding: '7px 10px',
              border: '1px solid var(--border-primary)',
              borderRadius: 9,
              fontSize: 12.5,
              fontWeight: 500,
              color: 'var(--text-primary)',
              background: 'var(--input-bg)',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'border-color 150ms',
            }}>
              {filter.options.map((option, oi) => (
                <option key={oi} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Text search filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}>
            포장 방법
          </label>
          <div style={{ display: 'flex', gap: 5 }}>
            <input
              type="text"
              style={{
                flex: 1,
                padding: '7px 10px',
                border: '1px solid var(--border-primary)',
                borderRadius: 9,
                fontSize: 12.5,
                color: 'var(--text-primary)',
                background: 'var(--input-bg)',
                outline: 'none',
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            />
            <button style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-primary)',
              borderRadius: 9,
              background: 'var(--input-bg)',
              cursor: 'pointer',
              fontSize: 13,
              flexShrink: 0,
            }}>
              🔍
            </button>
          </div>
        </div>

        {/* Result area */}
        <div style={{
          border: '1px solid var(--border-secondary)',
          borderRadius: 10,
          padding: '10px 12px',
          background: 'var(--bg-faint)',
          flex: 1,
          minHeight: 80,
        }}>
          <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
            2.선택 3개 FCST 매각 단가
          </p>
        </div>
      </div>
    </aside>
  );
}
