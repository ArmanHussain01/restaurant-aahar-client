
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";
import { formatHourLabel } from "../../../shared/util/analyticsFormatters";

const OrdersByHourChart = ({ data, loading }) => {
  const hourlyOrders = data?.hourlyOrders || [];

  const chartData = useMemo(() => {
    const byHour = new Map(hourlyOrders.map((h) => [h.hour, h]));
    return Array.from({ length: 24 }, (_, hour) => {
      const entry = byHour.get(hour);
      return {
        hour,
        label: formatHourLabel(hour),
        orders: entry?.orderCount || 0,
      };
    });
  }, [hourlyOrders]);

  const maxOrders = Math.max(0, ...chartData.map((d) => d.orders));
  const isEmpty = maxOrders === 0;

  return (
    <ChartCard
      title="Orders by Hour"
      description="Identify the busiest ordering hours."
      loading={loading}
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
          <XAxis
            dataKey="label"
            interval={1}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }} />
          <Bar dataKey="orders" name="Orders" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.hour}
                fill={maxOrders > 0 && entry.orders === maxOrders ? "#d97706" : "#93c5fd"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default OrdersByHourChart;
