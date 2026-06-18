"use client";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis
                className="text-xs"
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="collected"
                stroke="hsl(43, 74%, 49%)"
                fill="url(#colorCollected)"
                name="Collected"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="hsl(0, 84%, 60%)"
                fill="transparent"
                name="Pending"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
