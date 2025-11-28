import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import type PieChartData from "@/types";

interface CategoryPieChartProps {
  data: PieChartData[];
  currencySymbol: string;
}

export default function CategoryPieChart({
  data,
  currencySymbol,
}: CategoryPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">
            No monthly data available
          </p>
          <p className="text-gray-400 text-sm">
            Add transactions to see trends
          </p>
        </div>
      </div>
    );
  }

  const COLORS = [
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#6366f1",
  ];

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={renderCustomLabel}
            labelLine={false}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              `${currencySymbol}${value.toLocaleString()}`
            }
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "8px 12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 pt-6 border-t border-gray-100">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: entry.color || COLORS[index % COLORS.length],
              }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.name}
            </span>
            <span className="text-sm text-gray-500">
              {currencySymbol}
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
