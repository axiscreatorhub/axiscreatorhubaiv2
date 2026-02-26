import React from 'react';
import { cn } from '../../lib/utils';
import { PLANS, PlanId } from '../../lib/plans';

interface TierBadgeProps {
  planId: string;
  className?: string;
}

export default function TierBadge({ planId, className }: TierBadgeProps) {
  const plan = PLANS[planId as PlanId] || PLANS.FREE;
  
  const colors = {
    FREE: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    PRO: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    CREATOR_PRO: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  };

  const colorClass = colors[plan.id as PlanId] || colors.FREE;

  return (
    <span className={cn(
      "px-2 py-0.5 text-xs font-bold rounded border uppercase tracking-wider",
      colorClass,
      className
    )}>
      {plan.name}
    </span>
  );
}
