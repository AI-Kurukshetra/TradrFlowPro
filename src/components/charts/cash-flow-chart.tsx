"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sampleData = [
  { month: "Jan", inflow: 210000, outflow: 150000 },
  { month: "Feb", inflow: 190000, outflow: 142000 },
  { month: "Mar", inflow: 240000, outflow: 168000 },
  { month: "Apr", inflow: 260000, outflow: 172000 },
  { month: "May", inflow: 300000, outflow: 190000 },
  { month: "Jun", inflow: 340000, outflow: 210000 },
];

export function CashFlowChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="inflow"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="outflow"
            stroke="hsl(var(--chart-5))"
            fill="hsl(var(--chart-5))"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
