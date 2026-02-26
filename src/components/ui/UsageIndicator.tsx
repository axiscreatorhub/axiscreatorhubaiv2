import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface UsageIndicatorProps {
  label: string;
  current: number;
  limit: number;
  color?: string;
  className?: string;
}

export default function UsageIndicator({ label, current, limit, color = 'bg-[#8B5CF6]', className }: UsageIndicatorProps) {
  const percentage = Math.min(100, (current / limit) * 100);
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-gray-400 uppercase tracking-wider">{label}</span>
        <span className={cn(
          "px-2 py-0.5 rounded-full bg-white/5 border border-white/5",
          isAtLimit ? "text-red-400 border-red-500/30" : isNearLimit ? "text-yellow-400 border-yellow-500/30" : "text-gray-400"
        )}>
          {current} / {limit}
        </span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full relative overflow-hidden",
            isAtLimit ? "bg-red-500" : color
          )}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
