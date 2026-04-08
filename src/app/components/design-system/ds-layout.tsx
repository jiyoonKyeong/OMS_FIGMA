import { useState } from 'react';
import {
  Palette, Type, Ruler, SquareStack,
  MousePointerClick, Tag, FormInput, BarChart3,
  Table, LayoutTemplate, Grid3x3,
  ChevronDown, ChevronRight, ArrowLeft, Sun, Moon,
} from 'lucide-react';
import { DsColors } from './ds-colors';
import { DsTypography } from './ds-typography';
import { DsSpacing } from './ds-spacing';
import { DsButtons } from './ds-buttons';
import { DsBadges } from './ds-badges';
import { DsForms } from './ds-forms';
import { DsCharts } from './ds-charts';
import { DsDataTable } from './ds-table';
import { DsPatterns } from './ds-patterns';
import { DsIcons } from './ds-icons';
import { Link } from 'react-router';
import { useTheme } from '../../contexts/theme-context';

// ─── Nav tree config ──────────────────────────────────────────────────────────
type SectionId =
  | 'colors' | 'typography' | 'spacing'
  | 'buttons' | 'badges' | 'forms' | 'charts' | 'table'
  | 'patterns' | 'icons';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  tag?: string;
}
interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    group: 'Foundations',
    items: [
      { id: 'colors', label: 'Color Tokens', icon: <Palette size={14} /> },
      { id: 'typography', label: 'Typography', icon: <Type size={14} /> },
      { id: 'spacing', label: 'Spacing & Radius', icon: <Ruler size={14} /> },
    ],
  },
  {
    group: 'Components',
    items: [
      { id: 'buttons', label: 'Button', icon: <MousePointerClick size={14} />, tag: 'core' },
      { id: 'badges', label: 'Badge', icon: <Tag size={14} /> },
      { id: 'forms', label: 'Form Controls', icon: <FormInput size={14} /> },
      { id: 'charts', label: 'Charts', icon: <BarChart3 size={14} /> },
    ],
  },
  {
    group: 'Patterns',
    items: [
      { id: 'table', label: 'Data Table', icon: <Table size={14} /> },
      { id: 'patterns', label: 'Page Patterns', icon: <LayoutTemplate size={14} /> },
    ],
  },
  {
    group: 'Assets',
    items: [
      { id: 'icons', label: 'Icon Library', icon: <Grid3x3 size={14} />, tag: '28+' },
    ],
  },
];

const COMPONENTS: Record<SectionId, React.ComponentType> = {
  colors: DsColors,
  typography: DsTypography,
  spacing: DsSpacing,
  buttons: DsButtons,
  badges: DsBadges,
  forms: DsForms,
  charts: DsCharts,
  table: DsDataTable,
  patterns: DsPatterns,
  icons: DsIcons,
};

// ─── Main Layout ──────────────────────────────────────────────────────────────
export function DesignSystemLayout() {
  const [active, setActive] = useState<SectionId>('colors');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { isDark, toggle } = useTheme();

  const ActivePage = COMPONENTS[active];

  const toggleGroup = (group: string) => {
    setCollapsed((p) => ({ ...p, [group]: !p[group] }));
  };

  // Sidebar colours — always a deep/dark sidebar (design docs convention)
  const sidebarBg = isDark ? '#0a0a12' : '#0f0f1e';
  const sidebarBorder = isDark ? '#16162a' : '#1a1a2e';
  const sidebarGroupColor = '#3a3a5a';
  const sidebarMuted = '#3a3a5a';

  // Content topbar
  const topbarBg = isDark
    ? 'rgba(15,15,26,0.92)'
    : 'rgba(245,245,252,0.92)';

  return (
    <div className="flex h-screen overflow-hidden bg-bg-faint">
      {/* ── Sidebar ── */}
      <aside
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ width: '220px', background: sidebarBg, borderRight: `1px solid ${sidebarBorder}` }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ background: '#00B050' }} />
            <div className="w-4 h-4 rounded-full" style={{ background: '#00B050' }} />
          </div>
          <div>
            <div className="text-label-sm font-semibold" style={{ color: '#ffffff' }}>CELLTRION</div>
            <div style={{ color: '#3a3a5a', fontSize: '9px', letterSpacing: '0.1em', marginTop: '1px' }}>DESIGN SYSTEM</div>
          </div>
        </div>

        {/* Back + Theme toggle */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 transition-colors"
            style={{ color: sidebarMuted, fontSize: '11px' }}
          >
            <ArrowLeft size={11} />
            Dashboard
          </Link>
          <button
            onClick={toggle}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors"
            style={{ background: '#1a1a2c', color: '#5a5a8a' }}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 pb-5 pt-1 flex-1">
          {NAV.map((group) => (
            <div key={group.group} className="mb-1">
              <button
                onClick={() => toggleGroup(group.group)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors"
                style={{ color: sidebarGroupColor }}
              >
                <span style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600 }}>
                  {group.group.toUpperCase()}
                </span>
                {collapsed[group.group]
                  ? <ChevronRight size={10} />
                  : <ChevronDown size={10} />
                }
              </button>

              {!collapsed[group.group] && (
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {group.items.map((item) => {
                    const isActive = active === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-md transition-all text-left"
                        style={{
                          background: isActive ? '#1a1a2c' : 'transparent',
                          borderLeft: isActive ? '2px solid #00B050' : '2px solid transparent',
                          color: isActive ? '#ffffff' : '#5a5a8a',
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span style={{ color: isActive ? '#00B050' : '#3a3a5a' }}>{item.icon}</span>
                          <span className="text-label-sm font-medium">{item.label}</span>
                        </div>
                        {item.tag && (
                          <span
                            style={{
                              fontSize: '9px',
                              background: isActive ? '#0d2e1a' : '#1a1a2c',
                              color: '#00B050',
                              padding: '2px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            {item.tag}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Version */}
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
          <div className="flex items-center justify-between">
            <span style={{ color: '#3a3a5a', fontSize: '10px' }}>@figma/astraui</span>
            <span style={{ background: '#0d2e1a', color: '#00B050', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>
              v1.0.0
            </span>
          </div>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto bg-bg-faint">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-3 border-b border-border-primary"
          style={{ background: topbarBg, backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-brand-primary">
              {NAV.flatMap((g) => g.items).find((i) => i.id === active)?.icon}
            </span>
            <span className="text-label-sm text-text-primary font-semibold">
              {NAV.flatMap((g) => g.items).find((i) => i.id === active)?.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00B050' }} />
            <span className="text-label-sm text-text-tertiary">Live Preview</span>
          </div>
        </div>

        <div className="p-8">
          <ActivePage />
        </div>
      </main>
    </div>
  );
}
