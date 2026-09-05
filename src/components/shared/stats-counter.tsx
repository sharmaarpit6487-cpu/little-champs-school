"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  color?: string;
}

export function StatsCounter({
  value,
  label,
  suffix = "",
  prefix = "",
  decimals = 0,
  color = "text-blue-600 dark:text-blue-400",
}: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <p className={`text-4xl md:text-5xl font-display font-bold ${color}`}>
        {prefix}
        {count.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-2 text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}
