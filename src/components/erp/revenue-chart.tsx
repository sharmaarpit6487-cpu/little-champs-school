"use client";

import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DATA = [
  { month: "Apr", collected: 450000, pending: 50000 },
  { month: "May", collected: 480000, pending: 45000 },
  { month: "Jun", collected: 520000, pending: 40000 },
  { month: "Jul", collected: 490000, pending: 55000 },
  { month: "Aug", collected: 510000, pending: 35000 },
  { month: "Sep", collected: 530000, pending: 30000 },
  { month: "Oct", collected: 500000, pending: 48000 },
  { month: "Nov", collected: 540000, pending: 25000 },
  { month: "Dec", collected: 560000, pending: 20000 },
];

export function RevenueChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipText = isDark ? "#f1f5f9" : "#0f172a";

  return (
    <Card className="rounded-2xl border-0 shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg text-slate-800 dark:text-white">
          Revenue Overview
        </CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">Monthly fee collection trends</p>
      </CardHeader>
      <CardContent>
        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FB923C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} />
              <YAxis
                tick={{ fontSize: 12, fill: tickColor }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.1)",
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                }}
                labelStyle={{ color: tooltipText }}
              />
              <Area type="monotone" dataKey="collected" stroke="#2563EB" strokeWidth={2} fill="url(#colorCollected)" name="Collected" />
              <Area type="monotone" dataKey="pending" stroke="#FB923C" strokeWidth={2} fill="url(#colorPending)" name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
