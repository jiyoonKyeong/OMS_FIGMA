import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, defs, linearGradient, stop,
} from 'recharts';
import { useTheme } from '../contexts/theme-context';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Total',   aDP: 145938, fDP: 123122 },
  { name: '+7d',     aDP: 79231,  fDP: 60000  },
  { name: '+14d',    aDP: 54944,  fDP: 41182  },
  { name: '+21d',    aDP: 29831,  fDP: 18000  },
  { name: 'Over21d', aDP: 18343,  fDP: 11827  },
];

const ADP_COLOR = '#00B050';
const FDP_COLOR = '#6366F1';

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

function CustomTooltip({
  active, payload, label, isDark,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  isDark: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDark ? '#1e1e30' : '#ffffff',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', marginBottom: 6 }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: entry.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', fontWeight: 500 }}>
            {entry.name}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#ffffff' : '#000000', marginLeft: 'auto', paddingLeft: 12 }}>
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InventoryChart() {
  const { isDark } = useTheme();

  const gridColor  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const axisColor  = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const tickColor  = isDark ? 'rgba(255,255,255,0.4)'  : 'rgba(0,0,0,0.4)';

  return (
    <div style={{
      background: 'var(--surface-bg)',
      borderRadius: 16,
      border: '1px solid var(--border-primary)',
      padding: '20px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Inventory Aging
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3 }}>
            기준일: Jan/22/2025
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          borderRadius: 20,
          background: 'rgba(0,176,80,0.1)',
          color: '#00B050',
          fontSize: 12,
          fontWeight: 600,
        }}>
          <TrendingUp size={13} />
          <span>+38%</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { color: ADP_COLOR, label: 'aDP (Actual)' },
          { color: FDP_COLOR, label: 'fDP (Forecast)' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 10, height: 10, borderRadius: 3,
              background: l.color, flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="adpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={ADP_COLOR} stopOpacity={0.25} />
              <stop offset="95%" stopColor={ADP_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fdpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={FDP_COLOR} stopOpacity={0.2} />
              <stop offset="95%" stopColor={FDP_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: tickColor, fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          />
          <Tooltip
            content={<CustomTooltip isDark={isDark} />}
            cursor={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="aDP"
            name="aDP"
            stroke={ADP_COLOR}
            strokeWidth={2.5}
            fill="url(#adpGrad)"
            dot={{ fill: ADP_COLOR, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="fDP"
            name="fDP"
            stroke={FDP_COLOR}
            strokeWidth={2.5}
            strokeDasharray="5 3"
            fill="url(#fdpGrad)"
            dot={{ fill: FDP_COLOR, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        paddingTop: 12,
        borderTop: '1px solid var(--border-secondary)',
      }}>
        {[
          { label: 'Total', adp: '145,938', fdp: '123,122' },
          { label: '+7d',   adp: '79,231',  fdp: '60,000'  },
          { label: '+14d',  adp: '54,944',  fdp: '41,182'  },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--bg-faint)',
            borderRadius: 10,
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {s.label}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11.5, color: ADP_COLOR, fontWeight: 600 }}>{s.adp}</span>
              <span style={{ fontSize: 11.5, color: FDP_COLOR, fontWeight: 600 }}>{s.fdp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
