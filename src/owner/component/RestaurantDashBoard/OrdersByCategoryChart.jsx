import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";

const OrdersByCategoryChart = ({ data, loading }) => {
  const chartData = useMemo(() => {
    const categories = data?.categoryOrders || [];
    return [...categories]
      .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
      .map((c) => ({
        category: c.category,
        orders: c.orderCount || 0,
      }));
  }, [data]);

  const isEmpty = chartData.length === 0;
  const height = Math.min(400, Math.max(220, chartData.length * 42));

  return (
    <ChartCard
      title="Orders by Category"
      description="Which food categories generate the most orders."
      loading={loading}
      isEmpty={isEmpty}
      height={height}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="category"
            width={110}
            tick={{ fontSize: 12, fill: "#374151" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }} />
          <Bar dataKey="orders" name="Orders" fill="#7c3aed" radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default OrdersByCategoryChart;
