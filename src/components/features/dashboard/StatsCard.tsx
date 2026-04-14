import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  index?: number;
  trend?: {
    label: string;
    tone?: 'up' | 'down' | 'neutral';
  };
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  index = 0,
  trend,
}: StatsCardProps) {
  const tone = trend?.tone || 'neutral';
  const trendClasses =
    tone === 'up'
      ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
      : tone === 'down'
        ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
        : 'bg-[#1A1A1A] text-[#AAAAAA] border-[#2A2A2A]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="
        group relative h-32 bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6
        hover:border-[#3A3A3A] transition-all duration-200 overflow-hidden
      "
    >
      <div className="absolute inset-y-0 left-0 w-[3px] bg-[#E8003D] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-[#555555] font-medium">{label}</div>
          <div className="mt-2 text-5xl font-black text-white tracking-tight">
            {value}
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-[#E8003D]" />
        </div>
      </div>

      {trend ? (
        <div className="mt-3">
          <span className={`inline-flex items-center h-6 px-2.5 rounded-md text-[11px] font-semibold border ${trendClasses}`}>
            {trend.label}
          </span>
        </div>
      ) : null}
    </motion.div>
  );
}
