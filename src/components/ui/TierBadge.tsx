import React from 'react';
import { cn } from '../../lib/utils';
import { PLANS, PlanId } from '../../lib/plans';

interface TierBadgeProps {
  planId: string;
  className?: string;
}

export default function TierBadge({ planId, className }: TierBadgeProps) {
  const plan = PLANS[planId as PlanId] || PLANS.FREE;
  
  const styles = {
    FREE: 'bg-white/5 text-gray-400 border-white/10',
    PRO: 'bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 text-[#3B82F6] border-[#3B82F6]/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    CREATOR_PRO: 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 text-[#8B5CF6] border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]',
  };

  const styleClass = styles[plan.id as PlanId] || styles.FREE;

  return (
    <span className={cn(
      "px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-widest backdrop-blur-md transition-all duration-300 hover:scale-105",
      styleClass,
      className
    )}>
      {plan.name}
    </span>
  );
}
