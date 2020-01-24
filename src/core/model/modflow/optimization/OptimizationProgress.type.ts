export interface IOptimizationProgress {
    progressLog: string[];
    iteration: number;
    iterationTotal: number;
    simulation: number;
    simulationTotal: number;
    final: boolean;
}
