import prisma from '../db/prisma.ts';
import { getPlan, PLANS, PlanId } from '../config/plans.ts';

export const usageService = {
  async getUsage(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    const planId = (subscription?.plan || 'FREE') as PlanId;
    const plan = getPlan(planId);

    // Get usage for current billing period or just today/total depending on logic
    // For this MVP, let's track "total usage this month" or "daily usage"
    // The prompt implies limits like "50 hooks", usually per month.
    // Let's assume monthly limits for simplicity, resetting on 1st of month.
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const usage = await prisma.usageLedger.groupBy({
      by: ['feature'],
      where: {
        userId,
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        credits: true
      }
    });

    const usageMap: Record<string, number> = {};
    usage.forEach(u => {
      usageMap[u.feature] = u._sum.credits || 0;
    });

    return {
      plan: plan,
      usage: {
        hooks: usageMap['HOOK_GEN'] || 0,
        assets: usageMap['ASSET_GEN'] || 0,
        video: usageMap['VIDEO_GEN'] || 0,
      },
      limits: plan.limits
    };
  },

  async checkLimit(userId: string, feature: 'HOOK_GEN' | 'ASSET_GEN' | 'VIDEO_GEN', cost: number = 1) {
    const { usage, limits } = await this.getUsage(userId);
    
    let limit = 0;
    let current = 0;

    if (feature === 'HOOK_GEN') {
      limit = limits.hooks;
      current = usage.hooks;
    } else if (feature === 'ASSET_GEN') {
      limit = limits.assets;
      current = usage.assets;
    } else if (feature === 'VIDEO_GEN') {
      limit = limits.video;
      current = usage.video;
    }

    if (current + cost > limit) {
      throw new Error(`Limit reached for ${feature}. Upgrade your plan for more.`);
    }

    return true;
  },

  async trackUsage(userId: string, feature: 'HOOK_GEN' | 'ASSET_GEN' | 'VIDEO_GEN', credits: number = 1) {
    await prisma.usageLedger.create({
      data: {
        userId,
        feature,
        credits,
        day: new Date(), // This will be truncated to day in DB if we want, or just use createdAt
      }
    });
  }
};
