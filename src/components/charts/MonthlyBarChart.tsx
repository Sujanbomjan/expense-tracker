import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type { MonthlyData } from "@/types";

interface MonthlyBarChartProps {
  data: MonthlyData[];
  currencySymbol: string;
}

const CustomTooltip = ({ active, payload, label, currencySymbol }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-xl p-4">
        <p className="font-semibold text-slate-800 mb-3 text-sm">
          {new Date(label + "-01").toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 mb-2 last:mb-0"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-slate-600">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: entry.color }}>
              {currencySymbol} {Number(entry.value).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-slate-200 mt-3 pt-3">
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs font-semibold text-slate-700">Net</span>
            <span
              className={`text-sm font-bold ${
                payload[0].value - payload[1].value >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {currencySymbol}{" "}
              {(payload[0].value - payload[1].value).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-md shadow-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-slate-700">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function MonthlyBarChart({
  data,
  currencySymbol,
}: MonthlyBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="font-medium">No monthly data available</p>
        <p className="text-xs mt-1">Add transactions to see trends</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        barGap={8}
      >
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e8f0"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tickFormatter={(value) =>
            new Date(value + "-01").toLocaleDateString("en-US", {
              month: "short",
            })
          }
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          tickFormatter={(val) =>
            `${currencySymbol}${(val / 1000).toFixed(0)}k`
          }
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
          width={60}
        />
        <Tooltip
          content={<CustomTooltip currencySymbol={currencySymbol} />}
          cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
        />
        <Legend content={<CustomLegend />} />
        <Bar
          dataKey="income"
          fill="url(#incomeGradient)"
          name="Income"
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
        />
        <Bar
          dataKey="expenses"
          fill="url(#expenseGradient)"
          name="Expenses"
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
