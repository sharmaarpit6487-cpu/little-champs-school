"use client";

import { motion } from "framer-motion";
import {
  Users,
  IndianRupee,
  AlertCircle,
  UserPlus,
} from "lucide-react";
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
export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  iconName,
  iconColor = "bg-gold/10 text-gold",
  delay = 0,
}: StatsCardProps) {
  const Icon = icons[iconName];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              {change && (
                <p
                  className={cn(
                    "text-xs mt-1",
                    changeType === "positive" && "text-green-600",
                    changeType === "negative" && "text-red-600",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </p>
              )}
            </div>
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconColor)}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
