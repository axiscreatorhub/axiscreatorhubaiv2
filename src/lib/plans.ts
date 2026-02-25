export const PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    limits: {
      hooks: 5,
      assets: 2,
      video: 0,
      storage: 100, // MB
    },
    features: [
      'Limited generations',
      'Watermarked exports',
      'Basic templates',
      'Community support'
    ]
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 29,
    limits: {
      hooks: 50,
      assets: 20,
      video: 5,
      storage: 1024, // MB
    },
    features: [
      'HD exports',
      'More generations',
      'AI Avatars',
      'Premium templates',
      'Priority support'
    ]
  },
  CREATOR_PRO: {
    id: 'CREATOR_PRO',
    name: 'Creator Pro',
    price: 99,
    limits: {
      hooks: 500,
      assets: 100,
      video: 50,
      storage: 10240, // MB
    },
    features: [
      'Monetization tools',
      'Custom AI Persona',
      'Advanced Scheduling',
      'Brand Kit',
      'Dedicated success manager'
    ]
  }
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlan(id: string) {
  return PLANS[id as PlanId] || PLANS.FREE;
}
