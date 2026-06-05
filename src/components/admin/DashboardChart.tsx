"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", revenue: 4200 },
  { day: "Tue", revenue: 6800 },
  { day: "Wed", revenue: 5100 },
  { day: "Thu", revenue: 9200 },
  { day: "Fri", revenue: 11500 },
  { day: "Sat", revenue: 15800 },
  { day: "Sun", revenue: 13200 },
];

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b76e79" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#b76e79" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d3" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
          contentStyle={{ borderRadius: 12, border: "1px solid #f0e6d3", fontSize: 12 }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#b76e79" strokeWidth={2} fill="url(#revenueGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
