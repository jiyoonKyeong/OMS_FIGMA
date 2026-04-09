import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Truck,
  BarChart3,
  FileText,
  Clock,
  Layers,
  Sun,
  Moon,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Brain,
  Package,
  List,
  AlignLeft,
  TrendingUp,
  FlaskConical,
  Container,
  ScrollText,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  sub?: SubItem[];
}

interface SubItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavGroup {
  group?: string;
  items: NavItem[];
}

const nav: NavGroup[] = [
  {
    items: [
      {
        label: "Order Mgmt.",
        path: "/",
        icon: <LayoutDashboard size={18} />,
      },
    ],
  },
  {
    group: "계획 / 공급",
    items: [
      {
        label: "계획 정보",
        path: "/plan",
        icon: <CalendarDays size={18} />,
        sub: [
          {
            label: "충전/AI FCST",
            path: "/plan/ai-fcst",
            icon: <Brain size={15} />,
          },
          {
            label: "조립/포장 FCST",
            path: "/plan/assembly-fcst",
            icon: <Package size={15} />,
          },
          {
            label: "조립/포장 요약 FCST",
            path: "/plan/assembly-summary",
            icon: <AlignLeft size={15} />,
          },
          {
            label: "L&P FCST",
            path: "/plan/lp-fcst",
            icon: <ScrollText size={15} />,
          },
          {
            label: "L&P 요약 FCST",
            path: "/plan/lp-summary",
            icon: <AlignLeft size={15} />,
          },
          {
            label: "PO 관리",
            path: "/plan/po",
            icon: <FileText size={15} />,
          },
        ],
      },
      {
        label: "공급 정보",
        path: "/supply",
        icon: <Truck size={18} />,
        sub: [
          {
            label: "충전/AI 공급계획",
            path: "/supply/ai",
            icon: <FlaskConical size={15} />,
          },
          {
            label: "조립/포장 공급계획",
            path: "/supply/assembly",
            icon: <Container size={15} />,
          },
          {
            label: "L&P 공급계획",
            path: "/supply/lp",
            icon: <Package size={15} />,
          },
        ],
      },
    ],
  },
  {
    group: "보고서",
    items: [
      {
        label: "레포트",
        path: "/report",
        icon: <BarChart3 size={18} />,
        sub: [
          {
            label: "FCST 대비 공급 레포트",
            path: "/report/supply",
            icon: <TrendingUp size={15} />,
          },
          {
            label: "충전/AI Status",
            path: "/report/ai",
            icon: <FlaskConical size={15} />,
          },
          {
            label: "조립/포장 Status",
            path: "/report/assembly",
            icon: <Container size={15} />,
          },
          {
            label: "DS Status",
            path: "/report/ds",
            icon: <BarChart3 size={15} />,
          },
        ],
      },
      {
        label: "계약서",
        path: "/contract",
        icon: <FileText size={18} />,
      },
      {
        label: "DS 일정협의",
        path: "/schedule",
        icon: <Clock size={18} />,
      },
    ],
  },
  {
    group: "시스템",
    items: [
      {
        label: "디자인 시스템",
        path: "/design-system",
        icon: <Layers size={18} />,
      },
    ],
  },
];

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const location = useLocation();
  const hasSub = !!item.sub?.length;

  // auto-open if any sub route is active
  const subActive =
    item.sub?.some((s) => location.pathname === s.path) ??
    false;
  const [open, setOpen] = useState(subActive);

  const isActive =
    location.pathname === item.path || (hasSub && subActive);

  const handleClick = (e: React.MouseEvent) => {
    if (hasSub) {
      e.preventDefault();
      if (!collapsed) setOpen((v) => !v);
    }
  };

  return (
    <div>
      <Link
        to={item.path}
        className={`nav-item ${isActive ? "nav-item--active" : ""} ${collapsed ? "nav-item--collapsed" : ""}`}
        title={collapsed ? item.label : undefined}
        style={{
          justifyContent: collapsed ? "center" : undefined,
        }}
        onClick={handleClick}
      >
        <span className="nav-icon">{item.icon}</span>
        {!collapsed && (
          <span className="nav-label">{item.label}</span>
        )}
        {!collapsed && hasSub && (
          <ChevronDown
            size={13}
            className="nav-sub-arrow"
            style={{
              transform: open
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: "transform 200ms ease",
              opacity: 0.5,
            }}
          />
        )}
        {!collapsed && !hasSub && isActive && (
          <ChevronRight size={14} className="nav-chevron" />
        )}
      </Link>

      {/* Sub-menu */}
      {hasSub && !collapsed && (
        <div
          className="sub-menu"
          style={{
            maxHeight: open
              ? `${(item.sub?.length ?? 0) * 44}px`
              : "0px",
            opacity: open ? 1 : 0,
          }}
        >
          {item.sub!.map((sub) => {
            const subIsActive = location.pathname === sub.path;
            return (
              <Link
                key={sub.path}
                to={sub.path}
                className={`sub-item ${subIsActive ? "sub-item--active" : ""}`}
              >
                <span className="sub-item-track" />
                <span className="sub-icon">{sub.icon}</span>
                <span className="sub-label">{sub.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { isDark, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="sidebar-shell"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo + Collapse toggle */}
      <div
        className="sidebar-logo"
        style={{
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "20px 0" : "20px 14px 18px 20px",
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div className="logo-mark" aria-hidden="true">
              <span className="logo-dot" />
              <span className="logo-dot logo-dot--fade" />
            </div>
            <span className="logo-text">CELLTRION Pharm</span>
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
          title={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
        >
          {collapsed ? (
            <PanelLeftOpen size={15} />
          ) : (
            <PanelLeftClose size={15} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav
        className="sidebar-nav"
        style={{ padding: collapsed ? "12px 8px" : "12px" }}
      >
        {nav.map((section, si) => (
          <div key={si} className="nav-section">
            {section.group && !collapsed && (
              <p className="nav-group-label">{section.group}</p>
            )}
            {section.group && collapsed && (
              <div className="nav-divider" />
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="sidebar-footer"
        style={{
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          gap: collapsed ? 8 : 10,
          padding: collapsed ? "14px 8px" : "14px 12px",
        }}
      >
        <div
          className="sidebar-user"
          style={{
            justifyContent: collapsed ? "center" : undefined,
          }}
          title={
            collapsed ? "김민준 · Supply Chain" : undefined
          }
        >
          <div className="user-avatar">KM</div>
          {!collapsed && (
            <div className="user-info">
              <p className="user-name">김민준</p>
              <p className="user-role">Supply Chain</p>
            </div>
          )}
        </div>
        <button
          onClick={toggle}
          aria-label="테마 전환"
          className="theme-toggle"
          title={isDark ? "라이트 모드" : "다크 모드"}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      <style>{`
        .sidebar-shell {
          min-height: 100vh;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border-color);
          position: relative;
          z-index: 20;
          transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--sidebar-border-color);
          flex-shrink: 0;
          min-height: 60px;
          transition: padding 220ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .logo-mark {
          display: flex;
          gap: 3px;
          flex-shrink: 0;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--brand-primary);
        }

        .logo-dot--fade { opacity: 0.4; }

        .logo-text {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .collapse-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid var(--border-primary);
          background: transparent;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 120ms ease, color 120ms ease;
        }

        .collapse-btn:hover {
          background: var(--nav-hover-bg);
          color: var(--brand-primary);
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
          overflow-x: hidden;
          transition: padding 220ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-bottom: 4px;
        }

        .nav-divider {
          height: 1px;
          background: var(--sidebar-border-color);
          margin: 6px 4px;
        }

        .nav-group-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          padding: 10px 10px 4px;
          white-space: nowrap;
          overflow: hidden;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          text-decoration: none;
          transition: background 120ms ease, color 120ms ease;
          color: var(--text-secondary);
          position: relative;
          white-space: nowrap;
          overflow: hidden;
        }

        .nav-item--collapsed {
          padding: 9px;
          gap: 0;
          justify-content: center;
        }

        .nav-item:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .nav-item--active {
          background: var(--nav-active-bg);
          color: var(--brand-primary);
        }

        .nav-item--active .nav-icon { color: var(--brand-primary); }

        .nav-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .nav-label {
          font-size: 13.5px;
          font-weight: 500;
          flex: 1;
        }

        .nav-chevron, .nav-sub-arrow {
          flex-shrink: 0;
        }

        /* ── Sub-menu ── */
        .sub-menu {
          overflow: hidden;
          transition: max-height 240ms cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 200ms ease;
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding-left: 14px;
          margin-top: 1px;
        }

        .sub-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px 7px 10px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-tertiary);
          position: relative;
          transition: background 120ms, color 120ms;
          white-space: nowrap;
          overflow: hidden;
        }

        .sub-item:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .sub-item--active {
          color: var(--brand-primary);
          background: var(--nav-active-bg);
        }

        .sub-item-track {
          position: absolute;
          left: -2px;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 14px;
          border-radius: 2px;
          background: var(--border-secondary);
        }

        .sub-item--active .sub-item-track {
          background: var(--brand-primary);
        }

        .sub-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          opacity: 0.7;
        }

        .sub-item--active .sub-icon { opacity: 1; }

        .sub-label { flex: 1; }

        /* ── Footer ── */
        .sidebar-footer {
          border-top: 1px solid var(--sidebar-border-color);
          display: flex;
          transition: padding 220ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-hover));
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-info { min-width: 0; overflow: hidden; }

        .user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 11px;
          color: var(--text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .theme-toggle {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid var(--border-primary);
          background: transparent;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 120ms ease, color 120ms ease;
        }

        .theme-toggle:hover {
          background: var(--nav-hover-bg);
          color: var(--brand-primary);
        }
      `}</style>
    </aside>
  );
}