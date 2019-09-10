export interface IStressPeriodData {
    [stressPeriod: number]: [number, number, number, number];
}

export interface IFlopyModflowMfevt {
    nevtop: number;
    ipakcb: number;
    surf: number;
    evtr: number | IStressPeriodData | [number, number, number, number, number];
    exdp: number;
    ievt: number;
    extension: 'evt';
    unitnumber: number | null;
    filenames: string | string[] | null;
}
