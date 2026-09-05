"use client";

import { motion } from "framer-motion";
import { Users, IndianRupee, AlertCircle, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconName: "users" | "rupee" | "alert" | "userPlus";
  iconColor?: string;
  delay?: number;
}

const icons = {
  users: Users,
  rupee: IndianRupee,
  alert: AlertCircle,
  userPlus: UserPlus,
};

const defaultColors = {
  users: "from-brand-blue to-brand-sky",
  rupee: "from-brand-green to-emerald-400",
  alert: "from-red-500 to-orange-400",
  userPlus: "from-brand-orange to-brand-yellow",
};

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  iconName,
  iconColor,
  delay = 0,
}: StatsCardProps) {
  const Icon = icons[iconName];
  const gradient = iconColor || defaultColors[iconName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="rounded-2xl border-0 shadow-soft hover:shadow-card transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500">{title}</p>
              <p className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-white mt-1">
                {value}
              </p>
              {change && (
                <p
                  className={cn(
                    "text-xs font-semibold mt-2 inline-flex px-2 py-0.5 rounded-full",
                    changeType === "positive" && "bg-green-100 text-green-700",
                    changeType === "negative" && "bg-red-100 text-red-700",
                    changeType === "neutral" && "bg-slate-100 text-slate-500"
                  )}
                >
                  {change}
                </p>
              )}
            </div>
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", typeof gradient === "string" && gradient.startsWith("from-") ? gradient : "from-brand-blue to-brand-sky")}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
