'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: string;
  delay?: number;
}

export default function StatsCard({ title, value, icon: Icon, trend, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      className="card-hover p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#4A5568] font-medium text-sm">{title}</h3>
        <div className="p-2 rounded-full bg-[#C7A36A]/10 text-[#C7A36A]">
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-[#2C3E38]">{value}</h2>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
