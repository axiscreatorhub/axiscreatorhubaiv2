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

export default function UsageIndicator({ label, current, limit, color = 'bg-orange-500', className }: UsageIndicatorProps) {
  const percentage = Math.min(100, (current / limit) * 100);
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs font-medium text-gray-400">
        <span>{label}</span>
        <span className={cn(isAtLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-gray-400")}>
          {current} / {limit}
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", isAtLimit ? "bg-red-500" : color)}
        />
      </div>
    </div>
  );
}
