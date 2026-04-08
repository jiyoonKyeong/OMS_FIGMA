import { Link2, ChevronLeft, ChevronRight as ChevronRightIcon, MoreHorizontal } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: Record<string, any>[];
  showActions?: boolean;
  actionButton?: ReactNode;
  maxHeight?: string;
}

const STATUS_CONFIG: Record<string, { dot: string; label: string; bg: string; text: string }> = {
  'In Progress': { dot: '#3B82F6', label: 'In Progress', bg: 'rgba(59,130,246,0.1)', text: '#3B82F6' },
  'Finished':    { dot: '#00B050', label: 'Finished',    bg: 'rgba(0,176,80,0.1)',   text: '#00B050' },
  'Deviation':   { dot: '#F97316', label: 'Deviation',   bg: 'rgba(249,115,22,0.1)', text: '#F97316' },
  'Closed':      { dot: '#8B8FA8', label: 'Closed',      bg: 'rgba(139,143,168,0.1)',text: '#8B8FA8' },
};

function StatusBadge({ value }: { value: string }) {
  const cfg = STATUS_CONFIG[value];
  if (!cfg) return <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{value}</span>;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 20,
      fontSize: 11.5,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.text,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: cfg.dot, flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  );
}

export function DataTable({
  title, columns, data, showActions = true, actionButton, maxHeight,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="dt-shell">
      {/* Card header */}
      <div className="dt-header">
        <div className="dt-header-left">
          <span className="dt-title">{title}</span>
          <span className="dt-count">{data.length}</span>
        </div>
        <div className="dt-header-right">
          {actionButton}
          <button className="dt-more"><MoreHorizontal size={15} /></button>
        </div>
      </div>

      {/* Table area */}
      <div className={`dt-body`} style={{ maxHeight: maxHeight || '270px', overflowY: 'auto' }}>
        <table className="dt-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="dt-th"
                  style={{
                    width: col.width,
                    textAlign: col.align || 'left',
                  }}
                >
                  {col.label}
                </th>
              ))}
              {showActions && <th className="dt-th" style={{ width: 40, textAlign: 'center' }}></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className="dt-tr">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="dt-td"
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.key === 'status' && row[col.key] !== undefined ? (
                      <StatusBadge value={row[col.key]} />
                    ) : (
                      row[col.key] ?? ''
                    )}
                  </td>
                ))}
                {showActions && (
                  <td className="dt-td" style={{ textAlign: 'center' }}>
                    <button className="dt-link-btn"><Link2 size={13} /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="dt-footer">
        <span className="dt-page-info">
          총 <b>{data.length}</b>건
        </span>
        <div className="dt-pagination">
          <button
            className="dt-page-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`dt-page-num ${currentPage === p ? 'dt-page-num--active' : ''}`}
            >
              {p}
            </button>
          ))}
          <button
            className="dt-page-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon size={13} />
          </button>
        </div>
      </div>

      <style>{`
        .dt-shell {
          background: var(--surface-bg);
          border-radius: 16px;
          border: 1px solid var(--border-primary);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03);
        }

        .dt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px 14px;
          border-bottom: 1px solid var(--border-secondary);
        }

        .dt-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dt-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .dt-count {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          background: var(--nav-active-bg);
          color: var(--brand-primary);
        }

        .dt-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dt-more {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid var(--border-primary);
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          transition: background 150ms;
        }

        .dt-more:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .dt-body {
          flex: 1;
          overflow-y: auto;
        }

        .dt-table {
          width: 100%;
          border-collapse: collapse;
        }

        .dt-th {
          padding: 9px 14px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          background: var(--bg-faint);
          border-bottom: 1px solid var(--border-secondary);
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .dt-tr {
          border-bottom: 1px solid var(--border-secondary);
          transition: background 120ms;
        }

        .dt-tr:last-child {
          border-bottom: none;
        }

        .dt-tr:hover {
          background: var(--bg-faint);
        }

        .dt-td {
          padding: 11px 14px;
          font-size: 12.5px;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .dt-link-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          margin: 0 auto;
          transition: background 150ms, color 150ms;
        }

        .dt-link-btn:hover {
          background: var(--nav-active-bg);
          color: var(--brand-primary);
        }

        .dt-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          border-top: 1px solid var(--border-secondary);
          background: var(--bg-faint);
        }

        .dt-page-info {
          font-size: 11.5px;
          color: var(--text-tertiary);
        }

        .dt-page-info b {
          color: var(--text-primary);
        }

        .dt-pagination {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .dt-page-btn {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          transition: background 120ms;
        }

        .dt-page-btn:hover:not(:disabled) {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .dt-page-btn:disabled {
          opacity: 0.3;
          cursor: default;
        }

        .dt-page-num {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: none;
          font-size: 12px;
          font-weight: 500;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          transition: background 120ms, color 120ms;
        }

        .dt-page-num:hover {
          background: var(--nav-hover-bg);
          color: var(--text-primary);
        }

        .dt-page-num--active {
          background: var(--brand-primary) !important;
          color: #fff !important;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
