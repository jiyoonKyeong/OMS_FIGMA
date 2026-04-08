import { useState } from 'react';
import {
  Bell, Search, Download, Upload, ChevronDown, ChevronRight, ChevronUp, ChevronLeft,
  Filter, Settings, Plus, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight,
  X, Check, AlertTriangle, Info, CircleAlert, CircleCheck,
  LayoutDashboard, LayoutGrid, Package, ClipboardList, BarChart3, FileText, FileSpreadsheet,
  Eye, EyeOff, Edit, Pencil, Trash2, RefreshCw, Calendar, CalendarDays,
  User, Users, Globe, Star, StarOff,
  Link, Link2, ExternalLink, Copy, Clipboard,
  TrendingUp, TrendingDown, Minus, MoreHorizontal, MoreVertical,
  Table, List, Layers,
  Home, LogOut, Lock, Unlock, Key,
  Mail, Phone, MapPin,
  Zap, Rocket, Target, Flag, Tag, Bookmark,
} from 'lucide-react';
import { PageTitle, Divider, SubSection, TokenBadge } from './ds-primitives';

// ─── Icon catalog ─────────────────────────────────────────────────────────────
const ICON_GROUPS = [
  {
    name: 'Navigation',
    icons: [
      { name: 'LayoutDashboard', el: <LayoutDashboard /> },
      { name: 'Home', el: <Home /> },
      { name: 'ChevronDown', el: <ChevronDown /> },
      { name: 'ChevronRight', el: <ChevronRight /> },
      { name: 'ChevronUp', el: <ChevronUp /> },
      { name: 'ChevronLeft', el: <ChevronLeft /> },
      { name: 'ArrowRight', el: <ArrowRight /> },
      { name: 'ArrowLeft', el: <ArrowLeft /> },
      { name: 'ArrowUp', el: <ArrowUp /> },
      { name: 'ArrowDown', el: <ArrowDown /> },
      { name: 'ArrowUpRight', el: <ArrowUpRight /> },
      { name: 'ExternalLink', el: <ExternalLink /> },
    ],
  },
  {
    name: 'Actions',
    icons: [
      { name: 'Plus', el: <Plus /> },
      { name: 'X', el: <X /> },
      { name: 'Check', el: <Check /> },
      { name: 'Edit', el: <Edit /> },
      { name: 'Pencil', el: <Pencil /> },
      { name: 'Trash2', el: <Trash2 /> },
      { name: 'Download', el: <Download /> },
      { name: 'Upload', el: <Upload /> },
      { name: 'RefreshCw', el: <RefreshCw /> },
      { name: 'Copy', el: <Copy /> },
      { name: 'Clipboard', el: <Clipboard /> },
      { name: 'Search', el: <Search /> },
      { name: 'Filter', el: <Filter /> },
      { name: 'Eye', el: <Eye /> },
      { name: 'EyeOff', el: <EyeOff /> },
    ],
  },
  {
    name: 'Status & Feedback',
    icons: [
      { name: 'AlertTriangle', el: <AlertTriangle /> },
      { name: 'Info', el: <Info /> },
      { name: 'CircleAlert', el: <CircleAlert /> },
      { name: 'CircleCheck', el: <CircleCheck /> },
      { name: 'Bell', el: <Bell /> },
      { name: 'TrendingUp', el: <TrendingUp /> },
      { name: 'TrendingDown', el: <TrendingDown /> },
      { name: 'Minus', el: <Minus /> },
      { name: 'Star', el: <Star /> },
      { name: 'StarOff', el: <StarOff /> },
      { name: 'Bookmark', el: <Bookmark /> },
      { name: 'Flag', el: <Flag /> },
      { name: 'Zap', el: <Zap /> },
      { name: 'Target', el: <Target /> },
    ],
  },
  {
    name: 'Data & Documents',
    icons: [
      { name: 'BarChart3', el: <BarChart3 /> },
      { name: 'Table', el: <Table /> },
      { name: 'Layers', el: <Layers /> },
      { name: 'FileText', el: <FileText /> },
      { name: 'FileSpreadsheet', el: <FileSpreadsheet /> },
      { name: 'ClipboardList', el: <ClipboardList /> },
      { name: 'LayoutGrid', el: <LayoutGrid /> },
      { name: 'List', el: <List /> },
      { name: 'Link', el: <Link /> },
      { name: 'Link2', el: <Link2 /> },
      { name: 'Tag', el: <Tag /> },
    ],
  },
  {
    name: 'Users & Settings',
    icons: [
      { name: 'User', el: <User /> },
      { name: 'Users', el: <Users /> },
      { name: 'Settings', el: <Settings /> },
      { name: 'Lock', el: <Lock /> },
      { name: 'Unlock', el: <Unlock /> },
      { name: 'Key', el: <Key /> },
      { name: 'LogOut', el: <LogOut /> },
      { name: 'Mail', el: <Mail /> },
      { name: 'Phone', el: <Phone /> },
      { name: 'MapPin', el: <MapPin /> },
      { name: 'Globe', el: <Globe /> },
      { name: 'Calendar', el: <Calendar /> },
      { name: 'CalendarDays', el: <CalendarDays /> },
      { name: 'Package', el: <Package /> },
      { name: 'Rocket', el: <Rocket /> },
      { name: 'MoreHorizontal', el: <MoreHorizontal /> },
      { name: 'MoreVertical', el: <MoreVertical /> },
    ],
  },
];

const SIZE_GUIDE = [
  { size: 12, label: '12', usage: 'Badge X 버튼, 초소형 인디케이터' },
  { size: 14, label: '14', usage: '소형 버튼, 테이블 액션 컬럼' },
  { size: 16, label: '16', usage: '★ 버튼 iconStart/iconEnd 기본' },
  { size: 20, label: '20', usage: '★ 독립 아이콘, KPI 카드' },
  { size: 24, label: '24', usage: 'SegmentedControl 세그먼트' },
  { size: 32, label: '32', usage: '빈 상태 일러스트레이션' },
];

export function DsIcons() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(`import { ${name} } from 'lucide-react'\n\n<${name} size={16} />`);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = ICON_GROUPS.map((g) => ({
    ...g,
    icons: g.icons.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((g) => g.icons.length > 0);

  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="ASSETS"
        title="Icon Library"
        description="모든 아이콘은 lucide-react에서 가져옵니다. 절대 inline SVG를 직접 만들거나 아이콘 이름을 추측하지 마세요. 아이콘을 클릭하면 임포트 코드가 복사됩니다."
      />

      {/* Search */}
      <div className="relative">
        <div className="absolute left-lg top-1/2 -translate-y-1/2 text-text-secondary">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="아이콘 이름으로 검색..."
          className="w-full pl-[42px] pr-lg py-sm bg-surface-bg border border-border-primary rounded-corner-lg text-input text-text-primary focus:outline-none focus:border-border-selected focus:ring-1 focus:ring-brand-primary"
        />
      </div>

      {/* Icon Grid */}
      {filtered.map((group) => (
        <SubSection key={group.name} title={group.name}>
          <div className="grid gap-xs" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
            {group.icons.map((icon) => {
              const isCopied = copied === icon.name;
              return (
                <button
                  key={icon.name}
                  onClick={() => handleCopy(icon.name)}
                  className="flex flex-col items-center gap-md p-lg rounded-corner-md border transition-all group text-left"
                  style={{
                    background: isCopied ? '#E8F8EF' : '#ffffff',
                    borderColor: isCopied ? '#C8ECD8' : '#f0f0f6',
                  }}
                  title={`Click to copy import for ${icon.name}`}
                >
                  <div
                    className="transition-colors"
                    style={{
                      color: isCopied ? '#00B050' : '#717182',
                    }}
                  >
                    {/* Render icon at size 20 */}
                    <span style={{ display: 'block', width: 20, height: 20 }}>
                      {/* Clone icon with size 20 */}
                      {icon.name in { LayoutDashboard: 1 } || true
                        ? <span className="[&>svg]:w-5 [&>svg]:h-5">{icon.el}</span>
                        : icon.el}
                    </span>
                  </div>
                  <div
                    className="text-center break-all leading-tight"
                    style={{
                      fontSize: '10px',
                      color: isCopied ? '#00B050' : '#717182',
                      fontWeight: isCopied ? 600 : 400,
                    }}
                  >
                    {isCopied ? 'Copied!' : icon.name}
                  </div>
                </button>
              );
            })}
          </div>
        </SubSection>
      ))}

      {search && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-md py-2xl text-text-tertiary">
          <Search size={32} />
          <div className="text-label-sm">'{search}'에 해당하는 아이콘을 찾을 수 없습니다</div>
        </div>
      )}

      <Divider label="SIZE GUIDE" />

      <SubSection title="Icon Sizing Guide" description="컨텍스트별 아이콘 크기 가이드 — size prop으로 제어">
        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
          <div className="grid px-xl py-sm border-b border-border-secondary" style={{ gridTemplateColumns: '80px 1fr 1fr', background: '#F0F0F6' }}>
            {['Size', 'Usage', 'Token'].map((h) => (
              <span key={h} style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#717182', fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {SIZE_GUIDE.map((s, i, arr) => (
            <div
              key={s.size}
              className="grid items-center px-xl py-md"
              style={{ gridTemplateColumns: '80px 1fr 1fr', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f6' : 'none' }}
            >
              <div className="flex items-center gap-md">
                <BarChart3 size={s.size} className="text-brand-primary flex-shrink-0" />
                <span className="text-label-sm text-text-primary font-medium">{s.label}px</span>
              </div>
              <div className="text-video-title text-text-secondary">{s.usage}</div>
              <TokenBadge token={`size={${s.size}}`} color="purple" />
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="COLOR" />

      <SubSection title="Icon Color" description="아이콘은 currentColor를 상속 — 텍스트 색상 클래스로 제어">
        <div className="grid grid-cols-3 gap-lg">
          {[
            { cls: 'text-text-primary', desc: 'Primary — 기본 아이콘', bg: '' },
            { cls: 'text-text-secondary', desc: 'Secondary — 보조 아이콘', bg: '' },
            { cls: 'text-brand-primary', desc: 'Brand — 활성/선택 상태', bg: '' },
            { cls: 'text-on-brand', desc: 'On Brand — 브랜드 배경 위', bg: 'bg-brand-primary p-sm rounded-corner-md' },
            { cls: 'text-danger', desc: 'Danger — 오류/삭제', bg: '' },
            { cls: 'text-[#1A7F3C]', desc: 'Success — 완료/성공', bg: '' },
          ].map((c) => (
            <div key={c.cls} className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg flex items-center gap-md">
              <div className={c.bg || 'p-sm'}>
                <AlertTriangle size={20} className={c.bg ? '' : c.cls} style={c.bg ? { color: 'white' } : {}} />
              </div>
              <div>
                <TokenBadge token={c.cls} color={c.cls.includes('brand') && !c.cls.includes('on') ? 'brand' : 'gray'} />
                <div className="text-video-title text-text-secondary mt-xs">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="RULES" />

      <div className="grid grid-cols-2 gap-md">
        {[
          { ok: true, text: 'lucide-react에서 임포트' },
          { ok: true, text: '버튼 아이콘은 size={16}' },
          { ok: true, text: '독립 아이콘은 size={20}' },
          { ok: true, text: '아이콘 이름 icon-discovery.md에서 확인 후 사용' },
          { ok: false, text: 'Inline SVG 직접 작성' },
          { ok: false, text: '아이콘 이름 추측 후 임포트 시도' },
          { ok: false, text: '@figma/astraui에서 아이콘 임포트' },
          { ok: false, text: '픽셀 단위로 아이콘 크기를 임의 지정 (3, 7, 11px 등)' },
        ].map((rule) => (
          <div
            key={rule.text}
            className="flex items-center gap-md p-lg rounded-corner-md"
            style={{
              background: rule.ok ? '#F6FBF8' : '#FFF5F5',
              border: `1px solid ${rule.ok ? '#c8ecd8' : '#FECDD3'}`,
            }}
          >
            <span style={{ color: rule.ok ? '#00B050' : '#e11d48', flexShrink: 0, fontSize: '14px' }}>
              {rule.ok ? '✓' : '✕'}
            </span>
            <span className="text-video-title" style={{ color: rule.ok ? '#166534' : '#9f1239' }}>{rule.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}