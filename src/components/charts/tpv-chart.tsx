"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tpvData = [
  { month: "Jan", tpv: 420000, financed: 210000 },
  { month: "Feb", tpv: 380000, financed: 190000 },
  { month: "Mar", tpv: 520000, financed: 275000 },
  { month: "Apr", tpv: 610000, financed: 320000 },
  { month: "May", tpv: 700000, financed: 395000 },
  { month: "Jun", tpv: 780000, financed: 450000 },
];

export function TpvChart() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tpvData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tpv" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
          <Bar
            dataKey="financed"
            fill="hsl(var(--chart-3))"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
