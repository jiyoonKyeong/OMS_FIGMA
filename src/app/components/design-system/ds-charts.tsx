import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { PageTitle, Divider, SubSection, CodeBlock, TokenBadge } from './ds-primitives';

// ─── Sample data ──────────────────────────────────────────────────────────────
const monthlyTrend = [
  { month: 'Jan', current: 142000, previous: 120000 },
  { month: 'Feb', current: 158000, previous: 135000 },
  { month: 'Mar', current: 134000, previous: 145000 },
  { month: 'Apr', current: 189000, previous: 162000 },
  { month: 'May', current: 172000, previous: 155000 },
  { month: 'Jun', current: 198000, previous: 168000 },
];

const inventoryAging = [
  { name: 'Total', aDP: 145938, fDP: 123122 },
  { name: '+7 days', aDP: 79231, fDP: 60000 },
  { name: '+14 days', aDP: 54944, fDP: 41182 },
  { name: '+21 days', aDP: 29831, fDP: 20000 },
  { name: 'Over 21d', aDP: 18343, fDP: 11827 },
];

const batchStatus = [
  { name: 'In Progress', value: 38, color: '#1D6FA4' },
  { name: 'Finished', value: 52, color: '#1A7F3C' },
  { name: 'Deviation', value: 7, color: '#C05621' },
  { name: 'Pending', value: 15, color: '#92400E' },
];

const deviationTrend = [
  { week: 'W1', count: 3 },
  { week: 'W2', count: 5 },
  { week: 'W3', count: 2 },
  { week: 'W4', count: 8 },
  { week: 'W5', count: 4 },
  { week: 'W6', count: 7 },
  { week: 'W7', count: 3 },
];

// ─── Common chart styles ──────────────────────────────────────────────────────
const BRAND_GREEN = '#00B050';
const CHART_COLORS = {
  adp: '#E26D6D',
  fdp: '#F5C76A',
  prev: '#d1d5db',
  deviation: '#C05621',
};

const axisStyle = { fill: '#717182', fontSize: 11 };
const gridStyle = { stroke: '#f0f0f6', strokeDasharray: '3 3' };
const tooltipStyle = {
  borderRadius: '8px',
  border: '1px solid #e0e0ea',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

function ChartCard({
  title,
  subtitle,
  children,
  legend,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  legend?: { color: string; label: string }[];
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
      <div className="px-xl py-lg border-b border-border-secondary">
        <div className="text-label text-text-primary font-semibold">{title}</div>
        {subtitle && <div className="text-video-title text-text-secondary mt-xs">{subtitle}</div>}
      </div>
      <div className="p-xl">{children}</div>
      {legend && (
        <div className="px-xl pb-lg flex flex-wrap items-center gap-lg">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-xs">
              <div className="w-3 h-3 rounded-corner-sm" style={{ background: l.color }} />
              <span className="text-video-title text-text-secondary">{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DsCharts() {
  return (
    <div className="flex flex-col gap-2xl">
      <PageTitle
        tag="COMPONENTS"
        title="Charts"
        description="recharts 라이브러리 기반 차트 컴포넌트입니다. ResponsiveContainer로 감싸 유연한 크기를 지원합니다. 색상은 디자인 토큰에서 정의된 값을 사용합니다."
      />

      {/* Bar Chart */}
      <SubSection title="BarChart — Inventory Aging" description="재고 에이징 현황 — 기간별 aDP/fDP 비교">
        <ChartCard
          title="Inventory Aging"
          subtitle="Jan/22/2026 기준 재고 에이징 현황"
          legend={[
            { color: CHART_COLORS.adp, label: 'aDP (Actual)' },
            { color: CHART_COLORS.fdp, label: 'fDP (Forecast)' },
          ]}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={inventoryAging} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} {...gridStyle} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toLocaleString()} />
              <Bar dataKey="aDP" fill={CHART_COLORS.adp} radius={[4, 4, 0, 0]} name="aDP" />
              <Bar dataKey="fDP" fill={CHART_COLORS.fdp} radius={[4, 4, 0, 0]} name="fDP" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </SubSection>

      <Divider label="LINE CHART" />

      {/* Line Chart */}
      <SubSection title="LineChart — Trend Comparison" description="기간별 수량 트렌드 — 전년/당년 비교">
        <ChartCard
          title="Monthly Order Trend"
          subtitle="2026년 월별 주문량 추이"
          legend={[
            { color: BRAND_GREEN, label: 'Current Year' },
            { color: CHART_COLORS.prev, label: 'Previous Year' },
          ]}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toLocaleString()} />
              <Line
                type="monotone"
                dataKey="current"
                stroke={BRAND_GREEN}
                strokeWidth={2.5}
                dot={{ fill: BRAND_GREEN, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: BRAND_GREEN }}
                name="Current"
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke={CHART_COLORS.prev}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                name="Previous"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </SubSection>

      <Divider label="AREA CHART" />

      {/* Area Chart */}
      <SubSection title="AreaChart — Volume Gradient" description="면적 그라디언트로 볼륨 추이 표현">
        <div className="grid grid-cols-2 gap-lg">
          <ChartCard title="Order Volume" subtitle="면적 차트 (단일 계열)">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyTrend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_GREEN} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={BRAND_GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} {...gridStyle} />
                <XAxis dataKey="month" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toLocaleString()} />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke={BRAND_GREEN}
                  strokeWidth={2}
                  fill="url(#colorGreen)"
                  name="Current"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Deviation Line */}
          <ChartCard title="Deviation Count" subtitle="주별 Deviation 발생 건수">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deviationTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} {...gridStyle} />
                <XAxis dataKey="week" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill={CHART_COLORS.deviation} radius={[3, 3, 0, 0]} name="Deviations" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </SubSection>

      <Divider label="PIE / DONUT" />

      {/* Pie Chart */}
      <SubSection title="PieChart — Batch Status Distribution" description="배치 상태별 분포 — 도넛 차트">
        <ChartCard
          title="Batch Status Distribution"
          subtitle="전체 배치 상태 비율"
          legend={batchStatus.map((b) => ({ color: b.color, label: `${b.name} (${b.value})` }))}
        >
          <div className="flex items-center justify-center gap-2xl">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie
                  data={batchStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {batchStatus.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-md">
              {batchStatus.map((b) => {
                const total = batchStatus.reduce((acc, s) => acc + s.value, 0);
                const pct = ((b.value / total) * 100).toFixed(1);
                return (
                  <div key={b.name} className="flex items-center gap-md">
                    <div className="w-3 h-3 rounded-corner-sm flex-shrink-0" style={{ background: b.color }} />
                    <div>
                      <div className="text-label-sm text-text-primary font-medium">{b.name}</div>
                      <div className="text-video-title text-text-secondary">{b.value}건 · {pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>
      </SubSection>

      <Divider label="COLORS & TOKENS" />

      <SubSection title="Chart Color Reference" description="차트에 사용되는 색상 토큰">
        <div className="bg-surface-bg rounded-corner-lg border border-border-secondary overflow-hidden">
          <div className="grid px-xl py-sm border-b border-border-secondary" style={{ gridTemplateColumns: '48px 1fr 1fr 200px', background: '#F0F0F6' }}>
            {['', 'Name', 'Hex', 'Usage'].map((h) => (
              <span key={h} style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#717182', fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {[
            { color: BRAND_GREEN, name: 'Brand Primary', hex: '#00B050', usage: 'Current year line, primary data series' },
            { color: CHART_COLORS.adp, name: 'aDP Red', hex: '#E26D6D', usage: 'aDP 재고, 실적 시리즈' },
            { color: CHART_COLORS.fdp, name: 'fDP Yellow', hex: '#F5C76A', usage: 'fDP 재고, 예측 시리즈' },
            { color: CHART_COLORS.prev, name: 'Previous Gray', hex: '#d1d5db', usage: 'Previous year comparison (dashed)' },
            { color: CHART_COLORS.deviation, name: 'Deviation Orange', hex: '#C05621', usage: 'Deviation 발생 건수' },
            { color: '#1D6FA4', name: 'Progress Blue', hex: '#1D6FA4', usage: 'In Progress 상태' },
          ].map((c, i, arr) => (
            <div
              key={c.name}
              className="grid items-center px-xl py-md"
              style={{ gridTemplateColumns: '48px 1fr 1fr 200px', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f6' : 'none' }}
            >
              <div className="w-6 h-6 rounded-corner-sm" style={{ background: c.color }} />
              <div className="text-label-sm text-text-primary">{c.name}</div>
              <TokenBadge token={c.hex} color="gray" />
              <div className="text-video-title text-text-secondary">{c.usage}</div>
            </div>
          ))}
        </div>
      </SubSection>

      <Divider label="CODE" />

      <CodeBlock code={`import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// 1. Always wrap in ResponsiveContainer
<ResponsiveContainer width="100%" height={260}>
  <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f6" />
    <XAxis dataKey="name" tick={{ fill: '#717182', fontSize: 11 }} axisLine={false} tickLine={false} />
    <YAxis tick={{ fill: '#717182', fontSize: 11 }} axisLine={false} tickLine={false} />
    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0ea', fontSize: '12px' }} />
    <Bar dataKey="aDP" fill="#E26D6D" radius={[4, 4, 0, 0]} name="aDP" />
    <Bar dataKey="fDP" fill="#F5C76A" radius={[4, 4, 0, 0]} name="fDP" />
  </BarChart>
</ResponsiveContainer>

// 2. Area gradient pattern
<defs>
  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#00B050" stopOpacity={0.15} />
    <stop offset="95%" stopColor="#00B050" stopOpacity={0} />
  </linearGradient>
</defs>
<Area dataKey="value" stroke="#00B050" fill="url(#colorGreen)" />`} />
    </div>
  );
}
