export interface IFlopyModflowMfbcf {
    ipakcb: number;
    intercellt: number;
    laycon: number;
    trpy: number;
    hdry: number;
    iwdflg: number;
    wetfct: number;
    iwetit: number;
    ihdwet: number;
    tran: number;
    hy: number;
    vcont: number;
    sf1: number;
    sf2: number;
    wetdry: number;
    extension: string | null;
    unitnumber: number | null;
    filenames: string | string[] | null;
}
