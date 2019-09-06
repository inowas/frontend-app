export interface IStressPeriodData {
    [stressPeriod: number]: [number, number, number, number, number];
}

export interface IFlopyModflowMfchd {
    stress_period_data: IStressPeriodData | [number, number, number, number, number, number] | null;
    dtype: null;
    options: null;
    extension: 'chd';
    unitnumber: number | null;
    filenames: string | string[] | null;
}
