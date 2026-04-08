import { TrendingUp, TrendingDown, Activity, AlertTriangle, BellRing, CheckCircle2 } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  sub: string;
  trend: number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

const stats: Stat[] = [
  {
    label: '진행 중 배치',
    value: '24',
    sub: '이번 주 활성 배치',
    trend: 12,
    icon: <Activity size={20} />,
    gradient: 'linear-gradient(135deg,#00B050 0%,#00D876 100%)',
    iconBg: 'rgba(0,176,80,0.12)',
  },
  {
    label: '이탈 발생',
    value: '7',
    sub: '검토 필요',
    trend: -3,
    icon: <AlertTriangle size={20} />,
    gradient: 'linear-gradient(135deg,#F97316 0%,#FBBF24 100%)',
    iconBg: 'rgba(249,115,22,0.12)',
  },
  {
    label: '신규 알림',
    value: '19',
    sub: '오늘 접수',
    trend: 8,
    icon: <BellRing size={20} />,
    gradient: 'linear-gradient(135deg,#6366F1 0%,#818CF8 100%)',
    iconBg: 'rgba(99,102,241,0.12)',
  },
  {
    label: '완료율',
    value: '87%',
    sub: '목표 대비',
    trend: 5,
    icon: <CheckCircle2 size={20} />,
    gradient: 'linear-gradient(135deg,#0EA5E9 0%,#38BDF8 100%)',
    iconBg: 'rgba(14,165,233,0.12)',
  },
];

function StatCard({ stat }: { stat: Stat }) {
  const isPositive = stat.trend >= 0;
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon-wrap" style={{ background: stat.iconBg }}>
          <span style={{ background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stat.icon}
          </span>
        </div>
        <div className={`stat-trend ${isPositive ? 'stat-trend--up' : 'stat-trend--down'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? '+' : ''}{stat.trend}%</span>
        </div>
      </div>

      <div className="stat-body">
        <p className="stat-value">{stat.value}</p>
        <p className="stat-label">{stat.label}</p>
        <p className="stat-sub">{stat.sub}</p>
      </div>

      <div className="stat-bar">
        <div
          className="stat-bar-fill"
          style={{
            width: `${Math.min(Math.abs(stat.trend) * 5 + 40, 100)}%`,
            background: stat.gradient,
          }}
        />
      </div>

      <style>{`
        .stat-card {
          background: var(--surface-bg);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--border-primary);
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 8px 28px rgba(0,0,0,0.06);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 20px;
        }

        .stat-trend--up {
          color: #00B050;
          background: rgba(0,176,80,0.1);
        }

        .stat-trend--down {
          color: #F97316;
          background: rgba(249,115,22,0.1);
        }

        .stat-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-value {
          font-size: 30px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 6px;
        }

        .stat-sub {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .stat-bar {
          height: 3px;
          border-radius: 2px;
          background: var(--border-secondary);
          overflow: hidden;
        }

        .stat-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 600ms ease;
        }
      `}</style>
    </div>
  );
}

export function StatCards() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
    }}>
      {stats.map((s, i) => <StatCard key={i} stat={s} />)}
    </div>
  );
}
