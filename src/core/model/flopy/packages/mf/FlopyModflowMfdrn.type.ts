export interface IStressPeriodData {
    [stressPeriod: number]: [number, number, number, number, number];
}

export interface IFlopyModflowMfdrn {
    ipakcb: number | null;
    stress_period_data: IStressPeriodData | [number, number, number, number, number, number] | null;
    dtype: null;
    extension: 'drn';
    options: string[] | null;
    unitnumber: number | null;
    filenames: string | string[] | null;
}
