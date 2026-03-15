export type GrowthMetric = {
  week: number;
  awareness: number;
  acquisition: number;
  activation: number;
  retention: number;
  referral: number;
  revenue: number;
  conversions: {
    toAcquisition: number;
    toActivation: number;
    toRetention: number;
    toReferral: number;
    toRevenue: number;
  };
};

export const growthMetrics: GrowthMetric[] = [];
