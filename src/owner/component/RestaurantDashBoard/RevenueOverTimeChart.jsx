import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";
import { formatMonthLabel, formatHourLabel, formatINR, formatDateLabel  } from "../../../shared/util/analyticsFormatters";


const RevenueOverTimeChart = ({ data, granularity, loading }) => {
  const chartData = useMemo(() => {
    if (!data) return [];

    if (granularity === "hourly") {
      return (data.hourlyOrders || []).map((h) => ({
        label: formatHourLabel(h.hour),
        revenue: h.revenue || 0,
      }));
    }

    if (granularity === "monthly") {
      return (data.monthlyOrders || []).map((m) => ({
        label: formatMonthLabel(m.year, m.month),
        revenue: m.revenue || 0,
      }));
    }

    return (data.dailyOrders || []).map((d) => ({
      label: formatDateLabel(d.date),
      revenue: d.revenue || 0,
    }));
  }, [data, granularity]);

  const isEmpty = chartData.every((d) => d.revenue === 0);

  return (
    <ChartCard
      title="Revenue Over Time"
      description="Revenue generated during the selected period."
      loading={loading}
      isEmpty={chartData.length === 0 || isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }}
            formatter={(value) => [formatINR(value), "Revenue"]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#059669"
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: "#059669" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default RevenueOverTimeChart;
