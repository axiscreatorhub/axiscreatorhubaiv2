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
    PRO: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    CREATOR_PRO: 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-300 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
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
