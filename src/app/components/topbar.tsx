import { Bell, Search, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router';

/* ── Breadcrumb tree — mirrors sidebar nav exactly ────── */
interface BreadcrumbEntry { path: string; label: string; parent?: string }

const CRUMBS: BreadcrumbEntry[] = [
  { path: '/',                label: 'Dashboard' },
  { path: '/order-management',label: 'Order Management' },
  // 계획 정보
  { path: '/plan',                    label: '계획 정보' },
  { path: '/plan/ai-fcst',            label: '충전/AI FCST',        parent: '계획 정보' },
  { path: '/plan/assembly-fcst',      label: '조립/포장 FCST',      parent: '계획 정보' },
  { path: '/plan/assembly-summary',   label: '조립/포장 요약 FCST', parent: '계획 정보' },
  { path: '/plan/lp-fcst',            label: 'L&P FCST',            parent: '계획 정보' },
  { path: '/plan/lp-summary',         label: 'L&P 요약 FCST',       parent: '계획 정보' },
  { path: '/plan/po',                 label: 'PO 관리',              parent: '계획 정보' },
  // 공급 정보
  { path: '/supply',                  label: '공급 정보' },
  { path: '/supply/ai',               label: '충전/조립 공급계획',    parent: '공급 정보' },
  { path: '/supply/assembly',         label: '조립/포장 공급계획',  parent: '공급 정보' },
  { path: '/supply/lp',               label: 'L&P 공급계획',        parent: '공급 정보' },
  // 레포트
  { path: '/report',                  label: '레포트' },
  { path: '/report/supply',           label: 'FCST 대비 공급 레포트', parent: '레포트' },
  { path: '/report/ai',               label: '충전/AI Status',         parent: '레포트' },
  { path: '/report/assembly',         label: '조립/포장 Status',       parent: '레포트' },
  { path: '/report/ds',               label: '재고현황',                parent: '레포트' },
  // 단일
  { path: '/contract',                label: '계약서' },
  { path: '/schedule',                label: 'DS 일정협의' },
  { path: '/design-system',           label: '디자인 시스템' },
];

function buildCrumbs(pathname: string): { label: string; path?: string }[] {
  const entry = CRUMBS.find(c => c.path === pathname);
  if (!entry) return [{ label: 'Dashboard' }];
  if (entry.parent) {
    return [{ label: entry.parent }, { label: entry.label }];
  }
  return [{ label: entry.label }];
}

export function Topbar() {
  const location = useLocation();
  const crumbs = buildCrumbs(location.pathname);
  const today = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  }).format(new Date());

  return (
    <header className="topbar-shell">
      {/* Breadcrumb */}
      <div className="topbar-breadcrumb">
        <span className="breadcrumb-root">Order Mgmt</span>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ChevronRight size={13} className="breadcrumb-sep" />
            {i < crumbs.length - 1
              ? <span className="breadcrumb-mid">{c.label}</span>
              : <span className="breadcrumb-current">{c.label}</span>
            }
          </span>
        ))}
      </div>

      <div className="topbar-right">
        {/* Date */}
        <span className="topbar-date">{today}</span>

        {/* Search */}
        <div className="topbar-search">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="검색..."
            className="search-input"
          />
        </div>

        {/* Notifications */}
        <button className="topbar-btn" aria-label="알림">
          <Bell size={16} />
          <span className="notif-badge">3</span>
        </button>
      </div>

      <style>{`
        .topbar-shell {
          height: 60px;
          background: var(--topbar-bg);
          border-bottom: 1px solid var(--border-primary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(8px);
        }

        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .breadcrumb-root {
          font-size: 12.5px;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .breadcrumb-sep {
          color: var(--text-tertiary);
        }

        .breadcrumb-mid {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .breadcrumb-current {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topbar-date {
          font-size: 12px;
          color: var(--text-tertiary);
          font-weight: 400;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--input-bg);
          border: 1px solid var(--border-primary);
          border-radius: 10px;
          padding: 7px 12px;
          transition: border-color 150ms;
        }

        .topbar-search:focus-within {
          border-color: var(--brand-primary);
        }

        .search-icon {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 13px;
          color: var(--text-primary);
          width: 160px;
          font-family: inherit;
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .topbar-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border-primary);
          background: var(--input-bg);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: background 150ms, color 150ms;
        }

        .topbar-btn:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .notif-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </header>
  );
}