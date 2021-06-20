export enum ERandomDistribution {
  UNIFORM = 'uniform',
  TRIANGLE = 'triangle',
  NORM = 'norm',
  LOGNORM = 'lognorm',
  LOG10_UNIFORM = 'log10_uniform',
  LOG10_NORM = 'log10_norm'
}

export const randomDistributions: ERandomDistribution[] = [
  ERandomDistribution.UNIFORM,
  ERandomDistribution.TRIANGLE,
  ERandomDistribution.NORM,
  ERandomDistribution.LOGNORM,
  ERandomDistribution.LOG10_UNIFORM,
  ERandomDistribution.LOG10_NORM
]
