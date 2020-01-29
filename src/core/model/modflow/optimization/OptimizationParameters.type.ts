export enum EOptimizationMethod {
    GA = 'GA',
    SIMPLEX = 'Simplex'
}

interface IIndexSignature {
    [index: string]: any;
}

export interface IOptimizationParameters extends IIndexSignature {
    method: EOptimizationMethod;
    ngen: number;
    ncls: number;
    popSize: number;
    mutpb: number;
    cxpb: number;
    eta: number;
    indpb: number;
    maxf: number;
    qbound: number;
    xtol: number;
    ftol: number;
    diversityFlg: boolean;
    reportFrequency: number;
    initialSolutionId: string | null;
}